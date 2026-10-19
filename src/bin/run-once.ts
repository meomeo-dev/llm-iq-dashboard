#!/usr/bin/env tsx
/**
 * 手动执行一轮基准：`pnpm run:once [options]` / `pnpm pelican run [options]`
 *
 * 支持通过 `--cli`、`--model`、`--effort`、`--profile`、`--prompt`、`--candidate`
 * 临时指定或合成评测目标（免改 YAML 配置），支持 `--dry-run` 预演计划与预计成本，
 * 并在零参数调用时保持与定时任务相同的 `scheduledRound(config)` 默认非交互行为。
 */

import { pathToFileURL } from "node:url";
import { readCachedCatalog } from "../capabilities/catalog";
import type { CapabilitySnapshot } from "../capabilities/types";
import { describeActiveWorkConflict, findActiveWork, type ActiveWorkItem } from "../core/active-work";
import { forecastRound, usd, type CostHistory } from "../core/budget";
import { resolveCliRunConfig } from "../core/cli-run-selection";
import { loadConfig, type AppConfig } from "../core/config";
import { loadCostHistory } from "../core/cost-history";
import { configPath, runDir } from "../core/paths";
import { resolvePrompt } from "../core/prompt";
import { executeRun, type ExecuteOptions } from "../core/runner";
import { CLI_KINDS, EFFORT_LEVELS, type CliKind, type EffortLevel, type RunRecord } from "../core/types";
import { usageAndCost } from "../pricing/attempt-cost";
import {
  canonicalizeFlag,
  consumeFlagValue,
  expandEqualsTokens,
  extractGlobalPathFlags,
  formatCliError,
  hasHelpFlag,
  normalizeMultiValueFlag,
  resolveModelAndDeclared,
  stripPnpmSeparators,
  suggestClosestMatch,
} from "./cli-args";

const VALID_RUN_ONCE_FLAGS: readonly string[] = [
  "--cli",
  "--clis",
  "--model",
  "--models",
  "--declared",
  "--effort",
  "--efforts",
  "--profile",
  "--profiles",
  "--prompt",
  "--prompts",
  "--candidate",
  "--candidates",
  "--target",
  "--targets",
  "--dry-run",
  "--yes",
  "-y",
  "--config",
  "-c",
  "--data-dir",
  "--help",
  "-h",
];

export interface ParsedRunOnceArgs {
  clis?: CliKind[];
  models?: string[];
  efforts?: EffortLevel[];
  profiles?: string[];
  promptIds?: string[];
  candidates?: string[];
  targetIds?: string[];
  dryRun: boolean;
  yes: boolean;
}

export interface RunOnceCliDeps {
  loadConfig?: () => Promise<AppConfig> | AppConfig;
  loadCapabilityCatalog?: () => Promise<CapabilitySnapshot | null>;
  loadCostHistory?: () => Promise<CostHistory>;
  findActiveWork?: () => Promise<ActiveWorkItem | null>;
  executeRun?: (config: AppConfig, options?: ExecuteOptions) => Promise<RunRecord>;
  writeLine?: (line: string) => void;
  writeError?: (line: string) => void;
}

function parseCliKinds(existing: readonly CliKind[] | undefined, raw: string): CliKind[] {
  const tokens = normalizeMultiValueFlag(existing, raw, "--cli");
  for (const item of tokens) {
    if (!(CLI_KINDS as readonly string[]).includes(item)) {
      const hint = suggestClosestMatch(item, CLI_KINDS, 2);
      throw new Error(
        `无效的 --cli 取值：${item}${hint ? `（您是否想输入 ${hint}？）` : ""}（可选：${CLI_KINDS.join(", ")}）`,
      );
    }
  }
  return tokens as CliKind[];
}

function parseEffortLevels(existing: readonly EffortLevel[] | undefined, raw: string): EffortLevel[] {
  const tokens = normalizeMultiValueFlag(existing, raw, "--effort");
  for (const item of tokens) {
    if (!(EFFORT_LEVELS as readonly string[]).includes(item)) {
      const hint = suggestClosestMatch(item, EFFORT_LEVELS, 2);
      throw new Error(
        `无效的 --effort 取值：${item}${hint ? `（您是否想输入 ${hint}？）` : ""}（可选：${EFFORT_LEVELS.join(", ")}）`,
      );
    }
  }
  return tokens as EffortLevel[];
}

interface RawRunOnceAccumulator {
  modelList?: string[];
  declaredList?: string[];
}

function applyRunOnceValueFlag(
  parsed: ParsedRunOnceArgs,
  acc: RawRunOnceAccumulator,
  rawFlag: string,
  value: string,
): void {
  const canonical = canonicalizeFlag(rawFlag);
  switch (canonical) {
    case "--cli":
      parsed.clis = parseCliKinds(parsed.clis, value);
      break;
    case "--model":
    case "--declared":
      if (rawFlag === "--declared") {
        acc.declaredList = normalizeMultiValueFlag(acc.declaredList, value, "--declared");
      } else {
        acc.modelList = normalizeMultiValueFlag(acc.modelList, value, rawFlag);
      }
      break;
    case "--effort":
      parsed.efforts = parseEffortLevels(parsed.efforts, value);
      break;
    case "--profile":
      parsed.profiles = normalizeMultiValueFlag(parsed.profiles, value, rawFlag);
      break;
    case "--prompt":
      parsed.promptIds = normalizeMultiValueFlag(parsed.promptIds, value, rawFlag);
      break;
    case "--candidate":
      parsed.candidates = normalizeMultiValueFlag(parsed.candidates, value, rawFlag);
      break;
    case "--target":
      parsed.targetIds = normalizeMultiValueFlag(parsed.targetIds, value, rawFlag);
      break;
    default:
      throw new Error(formatCliError(rawFlag, VALID_RUN_ONCE_FLAGS, "pnpm run:once -- --help"));
  }
}

export function parseRunOnceArgs(argv: readonly string[]): ParsedRunOnceArgs {
  const tokens = expandEqualsTokens(stripPnpmSeparators(extractGlobalPathFlags(argv)));
  const parsed: ParsedRunOnceArgs = { dryRun: false, yes: false };
  const acc: RawRunOnceAccumulator = {};

  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i]!;
    if (token === "--dry-run") {
      parsed.dryRun = true;
      continue;
    }
    if (canonicalizeFlag(token) === "--yes") {
      parsed.yes = true;
      continue;
    }
    if (!token.startsWith("--")) {
      throw new Error(formatCliError(token, VALID_RUN_ONCE_FLAGS, "pnpm run:once -- --help"));
    }
    const value = consumeFlagValue(tokens, i, token);
    applyRunOnceValueFlag(parsed, acc, token, value);
    i += 1;
  }

  const resolvedModels = resolveModelAndDeclared(acc.modelList, acc.declaredList);
  if (resolvedModels?.length) {
    parsed.models = resolvedModels;
  }
  return parsed;
}

function buildCandidateOverrides(
  candidates: readonly string[] | undefined,
  promptIds: readonly string[],
  customPrompts: AppConfig["customPrompts"] = [],
): Record<string, string> | undefined {
  if (!candidates || candidates.length === 0) return undefined;
  const overrides: Record<string, string> = {};
  for (const item of candidates) {
    const sepIdx = item.search(/[:=]/);
    if (sepIdx > 0) {
      const pid = item.slice(0, sepIdx).trim();
      const cid = item.slice(sepIdx + 1).trim();
      overrides[pid] = cid;
      continue;
    }
    if (promptIds.length === 1) {
      overrides[promptIds[0]!] = item;
      continue;
    }
    const matchingPrompt = promptIds.find((pid) => {
      try {
        return resolvePrompt(pid, customPrompts).candidates.some((c) => c.id === item);
      } catch {
        return false;
      }
    });
    if (!matchingPrompt) {
      throw new Error(
        `候选 ${item} 未指明所属题目且在当前所选题目（${promptIds.join(", ")}）中未找到匹配项；请使用 --candidate <promptId>:<candidateId> 格式`,
      );
    }
    overrides[matchingPrompt] = item;
  }
  return overrides;
}

export function formatRunOnceHelp(): string {
  return [
    "用法: pnpm run:once [-- <options>]",
    "别名: pnpm pelican run [options]",
    "",
    "说明:",
    "  手动执行一轮鹈鹕 SVG 基准评测。不带目标/题目过滤参数时，默认执行配置文件中",
    "  enabled=true 的目标 × run.promptIds；显式传入 --cli / --model 时支持免改 YAML 临时直跑。",
    "",
    "目标与题目过滤选项:",
    `  --cli <${CLI_KINDS.join("|")}>        过滤或指定 CLI（仅传 --model 时可自动反查）`,
    "  --model <model,...>     指定模型 ID（支持未在 targets 登记的模型；别名: --models, --declared）",
    `  --effort <level,...>    指定思考强度（${EFFORT_LEVELS.join("|")}；临时合成目标默认 low）`,
    "  --profile <name,...>    指定上游渠道 Profile（缺省为 default）",
    "  --target <id,...>       按已配置的 targetId 精确过滤（别名: --targets）",
    "  --prompt <id,...>       指定评测题目 ID（别名: --prompts）",
    "  --candidate <id,...>    锁定套题候选（支持 <candidateId>、<promptId>:<candidateId> 或 <promptId>=<candidateId>）",
    "",
    "动作与全局选项:",
    "  --dry-run               仅预演解析后的目标、题目与预计费用，不发起真实 CLI 调用",
    "  -y, --yes               兼容自动化脚本确认参数（run:once 默认免交互直接运行）",
    "  -c, --config <path>     覆盖配置文件路径（同 PELICAN_CONFIG）",
    "  --data-dir <path>       覆盖数据目录路径（同 PELICAN_DATA_DIR）",
    "  -h, --help              显示此帮助信息并退出",
    "",
    "示例:",
    "  pnpm pelican run --cli agy --model gemini-3.8-flash --effort low --prompt classic-v1 --dry-run",
    "  pnpm run:once -- --cli agy --model gemini-3.8-flash --effort low --prompt classic-v1",
  ].join("\n");
}

async function printPostRunSummary(
  record: RunRecord,
  writeLine: (line: string) => void,
  writeError: (line: string) => void,
): Promise<void> {
  let totalUsd = 0;
  let hasPriced = false;
  for (const attempt of record.attempts) {
    const { usage, cost } = await usageAndCost(record.runId, attempt);
    if (cost.usd !== null) {
      totalUsd += cost.usd;
      hasPriced = true;
    }
    const dur = `${(attempt.durationMs / 1000).toFixed(1)}s`;
    const tok = usage
      ? ` tokens(in=${usage.tokens.input ?? 0},out=${usage.tokens.output ?? 0})`
      : "";
    const price = cost.usd !== null ? ` cost=${usd(cost.usd)}` : "";
    if (attempt.status === "ok") {
      writeLine(`  ✓ ${attempt.targetId} [${attempt.promptId}] (${dur}${tok}${price})`);
    } else {
      writeError(
        `  ✗ ${attempt.targetId} [${attempt.promptId}]: ${attempt.status} (${dur}${tok}${price}) — ${attempt.error}`,
      );
    }
  }
  const roundSec = ((record.durationMs ?? 0) / 1000).toFixed(1);
  const costSummary = hasPriced ? `，总费用 ${usd(totalUsd)}` : "";
  writeLine(`总耗时：${roundSec}s${costSummary}`);
  writeLine(`产物目录：${runDir(record.runId)}`);
}

function applyTargetIdFilter(config: AppConfig, targetIds: readonly string[] | undefined): AppConfig {
  if (!targetIds || targetIds.length === 0) return config;
  const targetMap = new Map(config.targets.map((t) => [t.id, t]));
  const selected = targetIds.map((id) => {
    const found = targetMap.get(id);
    if (!found) throw new Error(`配置里没有目标 ID：${id}`);
    if (found.profile && found.profile !== "default") {
      const prof = config.profiles.find((p) => p.cli === found.cli && p.name === found.profile);
      if (!prof) throw new Error(`配置里没有 ${found.cli} 的上游 ${found.profile}`);
      if (!prof.enabled) throw new Error(`上游 ${found.profile} 已停用`);
    }
    return { ...found, enabled: true };
  });
  return { ...config, targets: selected };
}

function enforceTargetIdsIntersection(config: AppConfig, targetIds: readonly string[] | undefined): AppConfig {
  if (!targetIds || targetIds.length === 0) return config;
  const allowed = new Set(targetIds);
  const narrowed = config.targets.filter((t) => allowed.has(t.id));
  if (narrowed.length === 0) {
    throw new Error(`没有同时满足 --target（${targetIds.join(", ")}）与其他过滤条件的目标`);
  }
  return { ...config, targets: narrowed };
}

function printPreRunSummary(
  path: string,
  config: AppConfig,
  history: CostHistory,
  writeLine: (line: string) => void,
): void {
  const forecast = forecastRound(
    config.targets.map((t) => t.id),
    config.run.promptIds.length,
    history.expected,
  );
  const unpricedNote = forecast.unpricedCalls > 0 ? `（另有 ${forecast.unpricedCalls} 次暂无价格参考）` : "";
  writeLine(`配置：${path}`);
  writeLine(`目标（${config.targets.length}）：${config.targets.map((t) => t.id).join(", ")}`);
  writeLine(`题目（${config.run.promptIds.length}）：${config.run.promptIds.join(", ")}`);
  writeLine(`预计调用：${forecast.calls} 次，预计费用 ≈ ${usd(forecast.usd)}${unpricedNote}`);
}

export async function runPelicanOnceCli(
  argv: readonly string[] = process.argv.slice(2),
  deps: RunOnceCliDeps = {},
): Promise<void> {
  const writeLine = deps.writeLine ?? ((line: string) => console.log(line));
  const writeError = deps.writeError ?? ((line: string) => console.error(line));
  if (hasHelpFlag(stripPnpmSeparators(argv))) {
    writeLine(formatRunOnceHelp());
    return;
  }

  const args = parseRunOnceArgs(argv);
  const path = configPath();
  const rawConfig = await (deps.loadConfig ? deps.loadConfig() : loadConfig(path));
  const baseConfig = applyTargetIdFilter(rawConfig, args.targetIds);
  const catalog = await (deps.loadCapabilityCatalog ? deps.loadCapabilityCatalog() : readCachedCatalog());

  const preResolvedPrompts = args.promptIds?.length ? args.promptIds : baseConfig.run.promptIds;
  const candidateOverrides = buildCandidateOverrides(args.candidates, preResolvedPrompts, baseConfig.customPrompts);
  const resolved = resolveCliRunConfig(baseConfig, { ...args, candidateOverrides }, catalog);
  const config = enforceTargetIdsIntersection(resolved, args.targetIds);

  const history = await (deps.loadCostHistory ? deps.loadCostHistory() : loadCostHistory());
  printPreRunSummary(path, config, history, writeLine);

  if (args.dryRun) {
    writeLine("[dry-run] 仅预演调用计划与预计费用，未发起模型调用。");
    return;
  }

  const active = await (deps.findActiveWork ? deps.findActiveWork() : findActiveWork());
  if (active !== null) throw new Error(describeActiveWorkConflict(active));

  const runExec = deps.executeRun ?? executeRun;
  const record = await runExec(config, { trigger: "manual", candidateOverrides, log: writeLine });
  await printPostRunSummary(record, writeLine, writeError);
}

const isMainModule =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
  runPelicanOnceCli(process.argv.slice(2)).catch((cause: unknown) => {
    console.error(cause instanceof Error ? cause.message : cause);
    process.exit(1);
  });
}
