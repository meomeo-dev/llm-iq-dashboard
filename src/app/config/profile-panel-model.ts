/**
 * 配置页 profile 段的纯函数：新建、改名、删除守卫、模型清单与上游类型清单的编辑。
 * 校验的权威在服务端（core/config/profiles.ts），这里只挡住会让草稿自相矛盾的操作。
 */

import type { CapabilitySnapshot, ModelOption } from "@/capabilities/types";
import type { ProfileConfig } from "@/core/config";
import { DEFAULT_PROFILE, type CliKind, type Target } from "@/core/types";

/** 与服务端 NAME_PATTERN 相同：小写字母与数字，连字符分隔 */
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function isKebabName(value: string): boolean {
  return KEBAB.test(value);
}

/** 新 profile 的占位名取第一个未被占用的 profile-N；baseUrl 与 models 留给用户填 */
export function createProfile(profiles: readonly ProfileConfig[], upstreamTypes: readonly string[]): ProfileConfig {
  const taken = new Set(profiles.map((profile) => profile.name));
  let serial = profiles.length + 1;
  while (taken.has(`profile-${serial}`)) serial += 1;
  return {
    name: `profile-${serial}`,
    cli: "codex",
    upstreamType: upstreamTypes[0] ?? "compatible",
    group: null,
    website: null,
    baseUrl: "",
    queryParams: {},
    models: [],
    pricing: { multiplier: 1, overrides: {} },
    enabled: true,
  };
}

/** 改名时把引用旧名的目标一起改掉，草稿里不出现悬空引用 */
export function renameProfile(
  profiles: readonly ProfileConfig[],
  targets: readonly Target[],
  index: number,
  nextName: string,
): { profiles: ProfileConfig[]; targets: Target[] } {
  const current = profiles[index];
  if (current === undefined) return { profiles: [...profiles], targets: [...targets] };
  return {
    profiles: profiles.map((profile, i) => (i === index ? { ...profile, name: nextName } : profile)),
    targets: targets.map((target) =>
      target.cli === current.cli && target.profile === current.name ? { ...target, profile: nextName } : target,
    ),
  };
}

/** 引用该 profile 的目标数；大于 0 时不允许删除，免得目标静默落回登录态 */
export function profileUsage(targets: readonly Target[], profile: ProfileConfig): number {
  return targets.filter((target) => target.cli === profile.cli && target.profile === profile.name).length;
}

/** 逗号、空白或换行分隔，去空去重，保持首次出现的顺序 */
export function parseModelList(text: string): string[] {
  const seen = new Set<string>();
  for (const item of text.split(/[\s,]+/)) {
    if (item !== "") seen.add(item);
  }
  return [...seen];
}

/** 添加上游类型：须是 kebab-case 且不重复；返回新清单或错误说明 */
export function addUpstreamType(types: readonly string[], raw: string): { next: string[] } | { error: string } {
  const value = raw.trim();
  if (!isKebabName(value)) return { error: "上游类型须是 kebab-case（小写字母、数字、连字符）" };
  if (types.includes(value)) return { error: `已存在：${value}` };
  return { next: [...types, value] };
}

/** 被 profile 使用中的上游类型不能删 */
export function upstreamTypeInUse(profiles: readonly ProfileConfig[], value: string): boolean {
  return profiles.some((profile) => profile.upstreamType === value);
}

/** 某 CLI 下可选的 profile：默认登录态在前，其余按登记顺序 */
export function profileChoices(profiles: readonly ProfileConfig[], cli: CliKind): ProfileConfig[] {
  return profiles.filter((profile) => profile.cli === cli);
}

/** 目标所在 profile 的模型下拉：默认 profile 用能力目录，非默认用该 profile 手填的清单 */
export function profileModelOptions(profile: ProfileConfig, current: string): ModelOption[] {
  const ids = profile.models.includes(current) || current === "" ? profile.models : [...profile.models, current];
  return ids.map((id) => ({
    id,
    displayName: id,
    cli: profile.cli,
    sources: ["custom"],
    efforts: null,
    description: null,
  }));
}

/** 切换目标的 profile 时，当前模型不在新清单里就换成新清单的第一个 */
export function modelAfterProfileChange(
  catalog: CapabilitySnapshot,
  profile: ProfileConfig | undefined,
  cli: CliKind,
  current: string,
): string {
  const ids = profile === undefined
    ? (catalog.clis.find((entry) => entry.cli === cli)?.models ?? []).map((option) => option.id)
    : profile.models;
  return ids.includes(current) ? current : (ids[0] ?? current);
}

/** 下拉的值：默认 profile 用保留名表示 */
export function profileSelectValue(target: Target): string {
  return target.profile ?? DEFAULT_PROFILE;
}
