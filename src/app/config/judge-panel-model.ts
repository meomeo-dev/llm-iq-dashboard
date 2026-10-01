/**
 * 配置页「作品评审」裁判清单的纯逻辑：调整顺序，以及按当前顺序推出每家作品由谁评。
 * 选择规则与 `src/core/judge/ai-judge.ts` 的 `pickJudges` 一致：按清单顺序取厂商与作品不同的裁判，
 * 第一个失败（未登录、超时、答不出）再换下一个。
 */

import type { JudgeModel } from "@/core/config/types";
import { CLI_KINDS, type CliKind } from "@/core/types";

/** 把第 index 个裁判移动 offset 位；越界时原样返回同一个数组 */
export function moveJudge(judges: readonly JudgeModel[], index: number, offset: number): JudgeModel[] {
  const target = index + offset;
  const outOfRange = index < 0 || index >= judges.length || target < 0 || target >= judges.length;
  if (outOfRange) return [...judges];
  const next = [...judges];
  const [moved] = next.splice(index, 1);
  next.splice(target, 0, moved!);
  return next;
}

export interface JudgeRoute {
  /** 被评作品的 CLI */
  subject: CliKind;
  /** 按尝试顺序排列的裁判；空表示这家的作品没有裁判可用 */
  judges: JudgeModel[];
}

/** 每家 CLI 的作品依次交给哪些裁判 */
export function judgeRoutes(judges: readonly JudgeModel[]): JudgeRoute[] {
  return CLI_KINDS.map((subject) => ({ subject, judges: judges.filter((judge) => judge.cli !== subject) }));
}

export function judgeLabel(judge: JudgeModel): string {
  return `${judge.cli} · ${judge.model || "未填模型"} · ${judge.effort}`;
}
