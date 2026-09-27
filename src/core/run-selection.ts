/**
 * 单次执行的选择：从生效配置中挑出本次要跑的目标（范围）与提示词（题目）。
 *
 * 只收窄不放宽：目标与提示词（内置或自定义）必须已在配置中登记。
 */

import type { AppConfig } from "./config";
import { listPrompts } from "./prompt";

export interface RunSelection {
  targetIds: readonly string[];
  promptIds: readonly string[];
  candidateOverrides?: Readonly<Record<string, string>>;
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
  return {
    ...config,
    targets: config.targets.filter((target) => pickedTargets.has(target.id)),
    run: { ...config.run, promptIds: [...promptIds] },
  };
}

function unique(values: readonly string[]): string[] {
  return [...new Set(values)];
}
