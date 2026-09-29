/**
 * “跑一次”的可选范围：组合（cli · model · effort）与上游各一张清单，两者在发起时相乘。
 * 组合清单按矩阵去掉 profile 段去重；上游清单只含 profile 的公开字段与是否已填 key。
 */

import type { UnavailableCli } from "@/capabilities/callable-targets";
import { PROFILE_CLIS, type AppConfig, type ProfileConfig } from "@/core/config";
import { defaultLabel } from "@/core/config/targets";
import { credentialKey, type ProfileCredentialTable } from "@/core/profile-credentials";
import { buildTargetId, DEFAULT_PROFILE, type CliKind, type Target } from "@/core/types";

export interface RunTargetOption {
  id: string;
  label: string;
  cli: string;
  model: string;
  effort: string;
  defaultSelected: boolean;
}

export interface RunProfileOption {
  name: string;
  label: string;
  cli: CliKind;
  enabled: boolean;
  hasKey: boolean;
  /** 为空表示不限模型 */
  models: string[];
}

export function listProfileOptions(config: AppConfig, credentials: ProfileCredentialTable): RunProfileOption[] {
  return config.profiles.map((profile) => ({
    name: profile.name,
    label: profile.label ?? profile.name,
    cli: profile.cli,
    enabled: profile.enabled,
    hasKey: credentialKey(profile.cli, profile.name) in credentials,
    models: [...profile.models],
  }));
}

/**
 * 同组合的各上游目标合并为一项：显示名取登录态目标的，没有登录态目标时按默认规则生成；
 * 任一上游的目标启用即视为进入定时任务。
 */
export function dedupeCombos(targets: readonly Target[], profiles: readonly ProfileConfig[]): RunTargetOption[] {
  const combos = new Map<string, RunTargetOption>();
  for (const target of targets) {
    const id = buildTargetId(target.cli, target.model, target.effort);
    const isLogin = target.profile === undefined;
    const existing = combos.get(id);
    if (existing === undefined) {
      const fields = { cli: target.cli, profile: DEFAULT_PROFILE, model: target.model, effort: target.effort };
      combos.set(id, {
        id,
        label: isLogin ? target.label : defaultLabel(fields, profiles),
        cli: target.cli,
        model: target.model,
        effort: target.effort,
        defaultSelected: target.enabled,
      });
      continue;
    }
    if (isLogin) existing.label = target.label;
    existing.defaultSelected = existing.defaultSelected || target.enabled;
  }
  return [...combos.values()];
}

function usableProfileClis(profiles: readonly RunProfileOption[]): Set<CliKind> {
  return new Set(profiles.filter((profile) => profile.enabled && profile.hasKey).map((profile) => profile.cli));
}

/**
 * 登录态被预检拦下的 CLI，只要有可用的上游，其目标仍列出、改由上游调用；
 * 这些 CLI 从 `unavailable` 挪到 `loginUnavailable`，模态里登录态一项据此置灰。
 */
export function keepProfileCapable(
  config: AppConfig,
  callable: readonly Target[],
  unavailable: readonly UnavailableCli[],
  profiles: readonly RunProfileOption[],
): { callable: Target[]; unavailable: UnavailableCli[]; loginUnavailable: CliKind[] } {
  const usable = usableProfileClis(profiles);
  const rescued = unavailable
    .map((entry) => entry.cli)
    .filter((cli) => (PROFILE_CLIS as readonly string[]).includes(cli) && usable.has(cli));
  if (rescued.length === 0) return { callable: [...callable], unavailable: [...unavailable], loginUnavailable: [] };

  const rescuedSet = new Set<CliKind>(rescued);
  const listed = new Set(callable.map((target) => target.id));
  const restored = config.targets.filter((target) => rescuedSet.has(target.cli) && !listed.has(target.id));
  return {
    callable: config.targets.filter((target) => listed.has(target.id) || restored.includes(target)),
    unavailable: unavailable.filter((entry) => !rescuedSet.has(entry.cli)),
    loginUnavailable: rescued,
  };
}
