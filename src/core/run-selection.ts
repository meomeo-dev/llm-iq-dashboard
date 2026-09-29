/**
 * 一轮执行的范围：从配置里的被测矩阵与题目库中挑出本轮要跑的目标与题目。
 *
 * 配置登记的是全部可选项；定时任务跑 enabled 的目标与 run.promptIds 的题目
 * （scheduledRound），“跑一次”跑人工勾选的子集（narrowConfig）。只收窄不放宽：
 * 目标与提示词（内置或自定义）必须已在配置中登记。
 *
 * 两种轮次都剔除已停用 profile 的目标：停用即表示该上游暂不接受调用。
 *
 * “跑一次”另可按上游展开（`RunSelection.profiles`）：此时 `targetIds` 只表示
 * `cli · model · effort` 组合，本轮目标 = 组合 × 上游。矩阵里已登记同 id 的目标沿用，
 * 没有的按组合合成，合成目标只存在于本轮、不写回配置。
 */

import type { AppConfig, ProfileConfig } from "./config";
import { PROFILE_CLIS } from "./config/profiles";
import { defaultLabel } from "./config/targets";
import { listPrompts } from "./prompt";
import { buildTargetId, DEFAULT_PROFILE, type Target } from "./types";

export interface RunSelection {
  targetIds: readonly string[];
  promptIds: readonly string[];
  candidateOverrides?: Readonly<Record<string, string>>;
  /**
   * 本轮要跑的上游；`default` 表示登录态。有值时 `targetIds` 视为组合（默认 profile 的
   * 目标 id）；缺省时 `targetIds` 就是要跑的目标 id，与引入上游之前相同。
   */
  profiles?: readonly string[];
}

/** 目标所属的 profile 是否可调用；默认 profile 总是可调用 */
function profileActive(config: AppConfig): (target: Target) => boolean {
  const disabled = new Set(config.profiles.filter((profile) => !profile.enabled).map((profile) => profile.name));
  return (target) => target.profile === undefined || !disabled.has(target.profile);
}

/** 定时任务的一轮：只含 enabled 的目标，剔除已停用 profile 的目标；题目即 run.promptIds */
export function scheduledRound(config: AppConfig): AppConfig {
  const active = profileActive(config);
  return { ...config, targets: config.targets.filter((target) => target.enabled && active(target)) };
}

/** 返回收窄后的配置；选择为空或含未知 id 时抛错，错误信息可直接给人看 */
export function narrowConfig(config: AppConfig, selection: RunSelection): AppConfig {
  const targetIds = unique(selection.targetIds);
  const promptIds = unique(selection.promptIds);
  if (targetIds.length === 0) throw new Error("至少选择一个目标");
  if (promptIds.length === 0) throw new Error("至少选择一道题目");

  const promptSpecs = listPrompts(config.customPrompts);
  const knownPrompts = new Set(promptSpecs.map((spec) => spec.id));
  const unknownPrompts = promptIds.filter((id) => !knownPrompts.has(id)).map((id) => `题目 ${id}`);
  const targets =
    selection.profiles === undefined
      ? pickTargets(config, targetIds, unknownPrompts)
      : expandProfiles(config, targetIds, unique(selection.profiles), unknownPrompts);
  validateCandidateOverrides(promptSpecs, selection.candidateOverrides);

  return { ...config, targets, run: { ...config.run, promptIds: [...promptIds] } };
}

/** 不带上游的选择：目标 id 逐个对应矩阵里的目标，保持配置顺序 */
function pickTargets(config: AppConfig, targetIds: readonly string[], unknownPrompts: string[]): Target[] {
  const knownTargets = new Set(config.targets.map((target) => target.id));
  const unknown = [...targetIds.filter((id) => !knownTargets.has(id)).map((id) => `目标 ${id}`), ...unknownPrompts];
  if (unknown.length > 0) throw new Error(`配置里没有：${unknown.join("、")}`);

  // 保持配置中的顺序，使分道与进度面板的排列与定时执行一致
  const picked = new Set(targetIds);
  const active = profileActive(config);
  const targets = config.targets.filter((target) => picked.has(target.id) && active(target));
  if (targets.length === 0) throw new Error("所选目标的上游 profile 均已停用");
  return targets;
}

/** 组合 id：去掉 profile 段的目标 id */
function comboId(target: Target): string {
  return buildTargetId(target.cli, target.model, target.effort);
}

/**
 * 带上游的选择：每个组合取矩阵里第一个同组合的目标作模板（不论它登记在哪个上游），
 * 再按上游逐个落成本轮目标。
 */
function expandProfiles(
  config: AppConfig,
  comboIds: readonly string[],
  profiles: readonly string[],
  unknownPrompts: string[],
): Target[] {
  const templates = new Map<string, Target>();
  for (const target of config.targets) {
    const id = comboId(target);
    if (!templates.has(id)) templates.set(id, target);
  }
  const unknown = [...comboIds.filter((id) => !templates.has(id)).map((id) => `目标 ${id}`), ...unknownPrompts];
  if (unknown.length > 0) throw new Error(`配置里没有：${unknown.join("、")}`);
  if (profiles.length === 0) throw new Error("至少选择一个上游");

  const byId = new Map(config.targets.map((target) => [target.id, target]));
  const picked = new Set(comboIds);
  const ordered = orderProfiles(config.profiles, profiles);
  const targets: Target[] = [];
  for (const [id, template] of templates) {
    if (!picked.has(id)) continue;
    for (const profile of profilesForCombo(template, ordered)) {
      targets.push(targetForProfile(config, template, profile, byId));
    }
  }
  return targets;
}

/**
 * 某组合本轮要跑的上游：支持上游的 CLI 按所选上游展开；不支持的只跑登录态一次，
 * 与是否勾选登录态无关——上游选择只作用于支持上游的 CLI（与看板的调用数口径一致）。
 */
function profilesForCombo(template: Target, ordered: readonly string[]): readonly string[] {
  const supportsProfiles = (PROFILE_CLIS as readonly string[]).includes(template.cli);
  return supportsProfiles ? ordered : [DEFAULT_PROFILE];
}

/** 登录态在前，其余按配置顺序 */
function orderProfiles(configured: readonly ProfileConfig[], picked: readonly string[]): string[] {
  const order = new Map(configured.map((profile, index) => [profile.name, index + 1]));
  return [...picked].sort((a, b) => (order.get(a) ?? 0) - (order.get(b) ?? 0));
}

/**
 * 某组合在某上游下的目标：矩阵里已登记的沿用，否则按模板合成。
 * 上游是否适用于该 CLI 由 profilesForCombo 先行决定。
 */
function targetForProfile(
  config: AppConfig,
  template: Target,
  profile: string,
  byId: ReadonlyMap<string, Target>,
): Target {
  const { cli, model, effort } = template;
  if (profile !== DEFAULT_PROFILE) assertProfileUsable(config, cli, model, profile);

  const id = buildTargetId(cli, model, effort, profile);
  const existing = byId.get(id);
  if (existing !== undefined) return existing;

  const { profile: _profile, ...base } = template;
  const label = defaultLabel({ cli, profile, model, effort }, config.profiles);
  return { ...base, id, label, ...(profile === DEFAULT_PROFILE ? {} : { profile }) };
}

function assertProfileUsable(config: AppConfig, cli: Target["cli"], model: string, name: string): void {
  const profile = config.profiles.find((item) => item.cli === cli && item.name === name);
  if (profile === undefined) throw new Error(`配置里没有 ${cli} 的上游 ${name}`);
  if (!profile.enabled) throw new Error(`上游 ${name} 已停用`);
  if (profile.models.length > 0 && !profile.models.includes(model)) {
    throw new Error(`上游 ${name} 的模型清单里没有 ${model}`);
  }
}

function validateCandidateOverrides(
  promptSpecs: ReturnType<typeof listPrompts>,
  overrides: RunSelection["candidateOverrides"],
): void {
  if (!overrides) return;
  const promptMap = new Map(promptSpecs.map((spec) => [spec.id, spec]));
  for (const [pId, cId] of Object.entries(overrides)) {
    if (!cId) continue;
    const spec = promptMap.get(pId);
    if (spec && !spec.candidates.some((c) => c.id === cId)) {
      throw new Error(`题目 ${pId} 没有候选 ${cId}`);
    }
  }
}

function unique(values: readonly string[]): string[] {
  return [...new Set(values)];
}
