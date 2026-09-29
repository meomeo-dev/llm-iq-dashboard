/**
 * 一轮执行的范围：从配置里的被测矩阵与题目库中挑出本轮要跑的目标与题目。
 *
 * 配置登记的是全部可选项；定时任务跑 enabled 的目标与 run.promptIds 的题目
 * （scheduledRound），“跑一次”跑人工勾选的子集（narrowConfig）。只收窄不放宽：
 * 目标与提示词（内置或自定义）必须已在配置中登记。
 *
 * 两种轮次都剔除已停用 profile 的目标：停用即表示该上游暂不接受调用。
 */

import type { AppConfig } from "./config";
import type { Target } from "./types";
import { listPrompts } from "./prompt";

export interface RunSelection {
  targetIds: readonly string[];
  promptIds: readonly string[];
  candidateOverrides?: Readonly<Record<string, string>>;
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
  const knownTargets = new Set(config.targets.map((target) => target.id));
  const knownPrompts = new Set(promptSpecs.map((spec) => spec.id));
  const unknown = [
    ...targetIds.filter((id) => !knownTargets.has(id)).map((id) => `目标 ${id}`),
    ...promptIds.filter((id) => !knownPrompts.has(id)).map((id) => `题目 ${id}`),
  ];
  if (unknown.length > 0) throw new Error(`配置里没有：${unknown.join("、")}`);

  if (selection.candidateOverrides) {
    const promptMap = new Map(promptSpecs.map((spec) => [spec.id, spec]));
    for (const [pId, cId] of Object.entries(selection.candidateOverrides)) {
      if (!cId) continue;
      const spec = promptMap.get(pId);
      if (spec && !spec.candidates.some((c) => c.id === cId)) {
        throw new Error(`题目 ${pId} 没有候选 ${cId}`);
      }
    }
  }

  // 保持配置中的顺序，使分道与进度面板的排列与定时执行一致
  const pickedTargets = new Set(targetIds);
  const active = profileActive(config);
  const targets = config.targets.filter((target) => pickedTargets.has(target.id) && active(target));
  if (targets.length === 0) throw new Error("所选目标的上游 profile 均已停用");
  return { ...config, targets, run: { ...config.run, promptIds: [...promptIds] } };
}

function unique(values: readonly string[]): string[] {
  return [...new Set(values)];
}
