/**
 * 看板页面下发的上游 profile 公开视图：只含比较结果时要看的字段。
 * 接口地址、查询参数与 key 状态一律不进这里——公开视角也会拿到这份数据。
 */

import { DEFAULT_PROFILE, type CliKind } from "./types";
import { profileDisplayName, type ProfileConfig } from "./config/profiles";

export interface ProfileView {
  name: string;
  /** 显示名；配置没填时即 name */
  label: string;
  cli: CliKind;
  upstreamType: string;
  group: string | null;
  website: string | null;
  /** 官价乘以它即折算成本；只用于显示，不参与计价 */
  multiplier: number;
  enabled: boolean;
}

/** 允许下发的字段白名单；测试据此守住不泄露 */
export const PROFILE_VIEW_FIELDS: readonly (keyof ProfileView)[] = [
  "name", "label", "cli", "upstreamType", "group", "website", "multiplier", "enabled",
];

export function toProfileView(profile: ProfileConfig): ProfileView {
  return {
    name: profile.name,
    label: profileDisplayName(profile),
    cli: profile.cli,
    upstreamType: profile.upstreamType,
    group: profile.group,
    website: profile.website,
    multiplier: profile.pricing.multiplier,
    enabled: profile.enabled,
  };
}

export function toProfileViews(profiles: readonly ProfileConfig[]): ProfileView[] {
  return profiles.map(toProfileView);
}

/** 登录态在前，其余按配置顺序；配置里已不存在的排最后、按名字 */
export function orderProfileNames(names: Iterable<string>, profiles: readonly ProfileView[]): string[] {
  const rank = (name: string): number => {
    if (name === DEFAULT_PROFILE) return -1;
    const index = profiles.findIndex((profile) => profile.name === name);
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  };
  return [...new Set(names)].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));
}

/** 上游的显示名：登录态、配置里的显示名，或已删除时退回标识 */
export function profileLabel(name: string, profiles: readonly ProfileView[]): string {
  if (name === DEFAULT_PROFILE) return "登录态";
  return profiles.find((profile) => profile.name === name)?.label ?? name;
}
