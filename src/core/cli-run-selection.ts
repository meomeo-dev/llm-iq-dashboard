/**
 * CLI 专用的评测目标与题目解析器（src/core/cli-run-selection.ts）。
 *
 * 与 Web 端 `narrowConfig`（只收窄不放宽，保护 POST /api/run 与分容器 runner）严格隔离：
 * - 零过滤参数时回退 `scheduledRound(config)`；
 * - 支持仅传 `--model` 时按 4 层优先级自动反查 `cli`；
 * - 支持对未写入 `pelican.config.yaml` `targets` 的模型按 `buildTargetId` 动态合成内存中临时 `Target`。
 */

import { builtinModels } from "../capabilities/builtin-models";
import type { CapabilitySnapshot } from "../capabilities/types";
import { suggestClosestMatch } from "../bin/cli-args";
import type { AppConfig } from "./config";
import { PROFILE_CLIS } from "./config/profiles";
import { defaultLabel } from "./config/targets";
import { listPrompts } from "./prompt";
import { scheduledRound } from "./run-selection";
import {
  buildTargetId,
  CLI_KINDS,
  DEFAULT_PROFILE,
  type CliKind,
  type EffortLevel,
  type Target,
} from "./types";

export interface CliRunFilterOptions {
  clis?: readonly CliKind[];
  models?: readonly string[];
  efforts?: readonly EffortLevel[];
  profiles?: readonly string[];
  promptIds?: readonly string[];
  candidateOverrides?: Readonly<Record<string, string>>;
}

export interface ModelCliPair {
  cli: CliKind;
  model: string;
}

function uniqueItems<T>(items: readonly T[]): T[] {
  return [...new Set(items)];
}

function lookupLayerClis(
  model: string,
  config: AppConfig,
  catalog: CapabilitySnapshot | null,
  extraCandidates: readonly ModelCliPair[],
): CliKind[] {
  const layer1 = uniqueItems([
    ...config.targets.filter((t) => t.model === model).map((t) => t.cli),
    ...extraCandidates.filter((c) => c.model === model).map((c) => c.cli),
  ]);
  if (layer1.length > 0) return layer1;

  const layer2 = uniqueItems(
    (catalog?.clis ?? [])
      .filter((cap) => cap.models.some((m) => m.id === model))
      .map((cap) => cap.cli),
  );
  if (layer2.length > 0) return layer2;

  const layer3 = uniqueItems(
    CLI_KINDS.filter((cli) => (config.customModels[cli] ?? []).includes(model)),
  );
  if (layer3.length > 0) return layer3;

  return uniqueItems(
    CLI_KINDS.filter((cli) => builtinModels(cli).some((m) => m.id === model)),
  );
}

/**
 * 按 4 层优先级反查模型所属的 `cli`：
 * 1. `config.targets`（及可选 `extraCandidates`，如指纹 `references` / 本地样本集）
 * 2. `capabilities.json` 探测快照
 * 3. `config.customModels`
 * 4. `builtinModels(cli)`
 */
export function inferCliForModel(
  model: string,
  config: AppConfig,
  catalog: CapabilitySnapshot | null = null,
  extraCandidates: readonly ModelCliPair[] = [],
): CliKind {
  const trimmed = model.trim();
  const matches = lookupLayerClis(trimmed, config, catalog, extraCandidates);
  if (matches.length === 1) return matches[0]!;
  if (matches.length > 1) {
    throw new Error(
      `模型 "${trimmed}" 同时存在于多个 CLI（${matches.join(", ")}），请显式附加 --cli <${matches.join("|")}>`,
    );
  }
  throw new Error(
    `无法自动推导模型 "${trimmed}" 所属的 CLI，请显式指定 --cli <${CLI_KINDS.join("|")}>`,
  );
}

function validateUsableProfile(config: AppConfig, cli: CliKind, model: string, profileName: string): void {
  if (profileName === DEFAULT_PROFILE) return;
  if (!(PROFILE_CLIS as readonly string[]).includes(cli)) {
    throw new Error(`CLI "${cli}" 不支持自定义上游 profile（收到：${profileName}）`);
  }
  const found = config.profiles.find((p) => p.cli === cli && p.name === profileName);
  if (!found) throw new Error(`配置里没有 ${cli} 的上游 ${profileName}`);
  if (!found.enabled) throw new Error(`上游 ${profileName} 已停用`);
  if (found.models.length > 0 && !found.models.includes(model)) {
    throw new Error(`上游 ${profileName} 的模型清单里没有 ${model}`);
  }
}

function resolveOrSynthesizeTarget(
  config: AppConfig,
  cli: CliKind,
  model: string,
  effort: EffortLevel,
  profileName: string,
): Target {
  validateUsableProfile(config, cli, model, profileName);
  const id = buildTargetId(cli, model, effort, profileName);
  const existing = config.targets.find((t) => t.id === id);
  if (existing) return { ...existing, enabled: true };

  const timeoutMs =
    config.run.timeoutByEffort[effort] ??
    config.run.timeoutByCli[cli] ??
    config.run.defaultTimeoutMs;
  const label = defaultLabel({ cli, profile: profileName, model, effort }, config.profiles);
  return {
    id,
    cli,
    ...(profileName === DEFAULT_PROFILE ? {} : { profile: profileName }),
    model,
    effort,
    label,
    timeoutMs,
    extraArgs: [],
    enabled: true,
  };
}

function resolveConfiguredModelEfforts(config: AppConfig, cli: CliKind, model: string): EffortLevel[] {
  const disabledProfiles = new Set(config.profiles.filter((p) => !p.enabled).map((p) => p.name));
  const modelTargets = config.targets.filter(
    (t) =>
      t.cli === cli &&
      t.model === model &&
      (t.profile === undefined || !disabledProfiles.has(t.profile)),
  );
  const active = modelTargets.some((t) => t.enabled)
    ? modelTargets.filter((t) => t.enabled)
    : modelTargets;
  const efforts = uniqueItems(active.map((t) => t.effort));
  return efforts.length > 0 ? efforts : ["low"];
}

function buildTargetsForExplicitModels(
  config: AppConfig,
  options: CliRunFilterOptions,
  catalog: CapabilitySnapshot | null,
): Target[] {
  const models = uniqueItems((options.models ?? []).map((m) => m.trim()).filter(Boolean));
  const profiles = options.profiles?.length ? uniqueItems(options.profiles) : [DEFAULT_PROFILE];
  const targets: Target[] = [];
  const seenIds = new Set<string>();

  for (const model of models) {
    const clis = options.clis?.length
      ? uniqueItems(options.clis)
      : [inferCliForModel(model, config, catalog)];
    for (const cli of clis) {
      const efforts: EffortLevel[] = options.efforts?.length
        ? uniqueItems(options.efforts)
        : resolveConfiguredModelEfforts(config, cli, model);
      for (const effort of efforts) {
        for (const prof of profiles) {
          const target = resolveOrSynthesizeTarget(config, cli, model, effort, prof);
          if (!seenIds.has(target.id)) {
            seenIds.add(target.id);
            targets.push(target);
          }
        }
      }
    }
  }
  return targets;
}

function filterConfiguredTargets(config: AppConfig, options: CliRunFilterOptions): Target[] {
  const disabledProfiles = new Set(config.profiles.filter((p) => !p.enabled).map((p) => p.name));
  const pool = config.targets.filter(
    (t) => t.profile === undefined || !disabledProfiles.has(t.profile),
  );
  const matched = pool.filter((t) => {
    if (options.clis?.length && !options.clis.includes(t.cli)) return false;
    if (options.efforts?.length && !options.efforts.includes(t.effort)) return false;
    return true;
  });

  const baseTargets = matched.some((t) => t.enabled) ? matched.filter((t) => t.enabled) : matched;
  if (baseTargets.length === 0) {
    throw new Error("配置里没有匹配过滤条件的目标；若要临时测试新模型，请显式传入 --model <model>");
  }
  if (!options.profiles?.length) return baseTargets.map((t) => ({ ...t, enabled: true }));

  const profiles = uniqueItems(options.profiles);
  const hasCustomProfile = profiles.some((p) => p !== DEFAULT_PROFILE);
  const profileCapable = baseTargets.filter((t) =>
    (PROFILE_CLIS as readonly string[]).includes(t.cli),
  );
  const candidates =
    !options.clis?.length && hasCustomProfile && profileCapable.length > 0
      ? profileCapable
      : baseTargets;

  const expanded: Target[] = [];
  const seen = new Set<string>();
  for (const t of candidates) {
    for (const prof of profiles) {
      const item = resolveOrSynthesizeTarget(config, t.cli, t.model, t.effort, prof);
      if (!seen.has(item.id)) {
        seen.add(item.id);
        expanded.push(item);
      }
    }
  }
  return expanded;
}

function resolvePromptList(
  config: AppConfig,
  promptIds: readonly string[] | undefined,
  candidateOverrides: Readonly<Record<string, string>> | undefined,
): string[] {
  const specs = listPrompts(config.customPrompts);
  const specMap = new Map(specs.map((s) => [s.id, s]));
  const knownIds = specs.map((s) => s.id);
  const selected = promptIds?.length ? uniqueItems(promptIds) : [...config.run.promptIds];
  if (selected.length === 0) throw new Error("至少选择一道题目");

  for (const pid of selected) {
    if (!specMap.has(pid)) {
      const suggestion = suggestClosestMatch(pid, knownIds, 2);
      const hint = suggestion ? `（您是否想输入 ${suggestion}？）` : "";
      throw new Error(`未知题目 ID：${pid}${hint}（可用：${knownIds.join(", ")}）`);
    }
  }
  if (candidateOverrides) {
    for (const [pid, cid] of Object.entries(candidateOverrides)) {
      if (!cid) continue;
      const spec = specMap.get(pid);
      if (!spec) throw new Error(`候选覆盖引用了未知题目：${pid}`);
      if (!spec.candidates.some((c) => c.id === cid)) {
        throw new Error(`题目 ${pid} 没有候选 ${cid}`);
      }
    }
  }
  return selected;
}

/**
 * 解析 CLI 端 `pelican run` / `run:once` 的目标与题目范围。
 */
export function resolveCliRunConfig(
  config: AppConfig,
  options: CliRunFilterOptions = {},
  catalog: CapabilitySnapshot | null = null,
): AppConfig {
  const hasTargetFilter = Boolean(
    options.clis?.length ||
      options.models?.length ||
      options.efforts?.length ||
      options.profiles?.length,
  );
  const promptIds = resolvePromptList(config, options.promptIds, options.candidateOverrides);
  if (!hasTargetFilter) {
    const base = scheduledRound(config);
    return { ...base, run: { ...base.run, promptIds } };
  }

  const targets = options.models?.length
    ? buildTargetsForExplicitModels(config, options, catalog)
    : filterConfiguredTargets(config, options);
  return { ...config, targets, run: { ...config.run, promptIds } };
}
