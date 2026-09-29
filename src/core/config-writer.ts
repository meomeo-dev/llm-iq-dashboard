/**
 * 配置写回。经 yaml Document API 在既有语法树上改值以保留注释；
 * 新内容先通过完整的 loadConfig 校验再落盘，避免调度器下次启动时崩溃。
 */

import { readFile, rename, writeFile, unlink } from "node:fs/promises";
import { parseDocument } from "yaml";
import { loadConfig, type AppConfig, type ProfileConfig } from "./config";
import { deleteKeyKeepingComment, reconcileSequence } from "./yaml-nodes";
import type { PromptSpec } from "./prompt";
import { DEFAULT_PROFILE, type CliKind, type EffortLevel, type Target } from "./types";
import type { RotationConfig } from "./variables";

/** 可写回的字段；未出现的键保持文件原样 */
export interface ConfigPatch {
  schedule?: Partial<{
    cron: string | null;
    intervalMinutes: number | null;
    timezone: string | null;
    runOnStart: boolean;
  }>;
  run?: Partial<{
    promptIds: string[];
    concurrency: number;
    defaultTimeoutMs: number;
    timeoutByCli: Partial<Record<CliKind, number>>;
    timeoutByEffort: Partial<Record<EffortLevel, number>>;
    rotation: RotationConfig;
  }>;
  /** 上游类型清单全表 */
  upstreamTypes?: string[];
  /** 非默认 profile 全表；提交里缺失的条目即删除 */
  profiles?: ProfileConfig[];
  targets?: Target[];
  prompts?: PromptSpec[];
  customModels?: Partial<Record<CliKind, string[]>>;
}

export async function applyConfigPatch(
  path: string,
  patch: ConfigPatch,
): Promise<AppConfig> {
  const original = await readFile(path, "utf8");
  const doc = parseDocument(original);

  applySchedule(doc, patch.schedule);
  applyRun(doc, patch.run);
  if (patch.upstreamTypes !== undefined) doc.setIn(["upstreamTypes"], patch.upstreamTypes);
  // profiles 先于 targets 写：校验时 targets[].profile 要能在 profiles 里找到
  if (patch.profiles !== undefined) {
    reconcileSequence(doc, ["profiles"], patch.profiles.map(serializeProfile), {
      identityOf: (item) => String(item.name),
      // 这些字段全由界面编辑，提交里缺失即删除
      managedKeys: ["label", "group", "website", "queryParams", "pricing", "enabled"],
    });
  }
  if (patch.targets !== undefined) {
    reconcileSequence(doc, ["targets"], patch.targets.map(serializeTarget), {
      // 精确身份含 profile 与强度：删掉一项时，同模型的其他条目不会认领它的节点、继承它的手写 timeoutMs
      identityOf: (item) => `${profileOf(item)}::${String(item.cli)}::${String(item.model)}::${String(item.effort)}`,
      // 只改了强度的一项仍复用原节点，保留其注释
      looseIdentityOf: (item) => `${profileOf(item)}::${String(item.cli)}::${String(item.model)}`,
      // enabled 与 profile 由界面管理：勾回定时任务时须删掉 enabled: false，改回默认 profile 时须删掉 profile
      managedKeys: ["enabled", "profile"],
    });
  }
  if (patch.prompts !== undefined) {
    reconcileSequence(doc, ["prompts"], patch.prompts.map(serializePrompt), {
      identityOf: (item) => String(item.id),
      // 这些字段全由界面编辑，提交里缺失即删除
      managedKeys: ["variables", "source"],
    });
  }
  if (patch.customModels !== undefined) doc.setIn(["customModels"], patch.customModels);

  return commit(path, doc.toString());
}

type YamlDoc = ReturnType<typeof parseDocument>;

function applySchedule(doc: YamlDoc, schedule: ConfigPatch["schedule"]): void {
  if (schedule === undefined) return;

  for (const [key, value] of Object.entries(schedule)) {
    if (value === undefined) continue;
    // null 表示删除键：cron 优先于 intervalMinutes，残留的 cron 会让切换无效
    if (value === null) deleteKeyKeepingComment(doc, ["schedule"], key);
    else doc.setIn(["schedule", key], value);
  }
}

function applyRun(doc: YamlDoc, run: ConfigPatch["run"]): void {
  if (run === undefined) return;

  for (const [key, value] of Object.entries(run)) {
    if (value === undefined || key === "rotation") continue;
    doc.setIn(["run", key], value);
  }
  // 逐个子键写：整体替换 rotation 节点会冲掉子键上的注释；YAML 里的键名是 timezone
  if (run.rotation !== undefined) {
    doc.setIn(["run", "rotation", "period"], run.rotation.period);
    doc.setIn(["run", "rotation", "timezone"], run.rotation.timeZone);
  }
  // 单数 promptId 优先于 promptIds，写入时须删除
  if (run.promptIds !== undefined) doc.deleteIn(["run", "promptId"]);
}

/** 序列化后的节点里没有 profile 键即默认 profile */
function profileOf(item: Record<string, unknown>): string {
  return typeof item.profile === "string" ? item.profile : DEFAULT_PROFILE;
}

/** 只写出有意义的字段，避免把内部默认值固化进用户的配置文件 */
function serializeTarget(target: Target): Record<string, unknown> {
  const node: Record<string, unknown> = {
    cli: target.cli,
    model: target.model,
    effort: target.effort,
    label: target.label,
  };
  // 默认 profile 不写出，文件与引入 profile 之前一样
  if (target.profile !== undefined && target.profile !== DEFAULT_PROFILE) node.profile = target.profile;
  if (target.extraArgs.length > 0) node.extraArgs = target.extraArgs;
  // 缺省即进入定时任务，只写出例外
  if (!target.enabled) node.enabled = false;
  return node;
}

/** 凭据不在配置里；倍率为 1 且没有手填单价时不写 pricing */
function serializeProfile(profile: ProfileConfig): Record<string, unknown> {
  const node: Record<string, unknown> = {
    name: profile.name,
    cli: profile.cli,
    upstreamType: profile.upstreamType,
  };
  if (profile.label !== null) node.label = profile.label;
  if (profile.group !== null) node.group = profile.group;
  if (profile.website !== null) node.website = profile.website;
  node.baseUrl = profile.baseUrl;
  if (Object.keys(profile.queryParams).length > 0) node.queryParams = profile.queryParams;
  if (profile.models.length > 0) node.models = [...profile.models];
  const hasOverrides = Object.keys(profile.pricing.overrides).length > 0;
  if (profile.pricing.multiplier !== 1 || hasOverrides) {
    node.pricing = { multiplier: profile.pricing.multiplier, overrides: profile.pricing.overrides };
  }
  // 缺省启用，只写出例外
  if (!profile.enabled) node.enabled = false;
  return node;
}

function serializePrompt(spec: PromptSpec): Record<string, unknown> {
  const node: Record<string, unknown> = {
    id: spec.id,
    label: spec.label,
    template: spec.template,
  };
  if (spec.variables.length > 0) {
    node.variables = spec.variables.map((variable) => ({
      name: variable.name,
      mode: variable.mode,
      values: [...variable.values],
    }));
  }
  if (spec.source !== null) node.source = spec.source;
  return node;
}

/**
 * 写到同目录临时文件并校验，通过后 rename 原子替换。
 * 必须同目录：跨文件系统的 rename 不是原子操作。
 */
async function commit(path: string, contents: string): Promise<AppConfig> {
  const staging = `${path}.staging`;
  await writeFile(staging, contents, "utf8");

  try {
    const validated = loadConfig(staging);
    await rename(staging, path);
    return validated;
  } catch (cause) {
    await unlink(staging).catch(() => {});
    const reason = cause instanceof Error ? cause.message : String(cause);
    throw new Error(`配置未通过校验，已保持原文件不变：\n${reason}`);
  }
}
