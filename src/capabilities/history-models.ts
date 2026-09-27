/**
 * 从历史运行记录中提取成功调用过的模型：成功过即说明标识、账号权限与 CLI 都认它。
 * claude 没有列举命令，这是它的主要模型来源。
 */

import { listRuns } from "../core/store";
import type { CliKind } from "../core/types";
import type { ProbedModel } from "./types";

/** 回溯的轮次上限 */
const LOOKBACK_RUNS = 120;

export async function historyModels(): Promise<Map<CliKind, ProbedModel[]>> {
  const grouped = new Map<CliKind, Map<string, ProbedModel>>();
  const runs = await listRuns(LOOKBACK_RUNS);

  for (const run of runs) {
    for (const attempt of run.attempts) {
      // 失败的调用可能正是因为模型名写错
      if (attempt.status !== "ok") continue;

      const bucket = grouped.get(attempt.cli) ?? new Map<string, ProbedModel>();
      if (!bucket.has(attempt.model)) {
        bucket.set(attempt.model, {
          id: attempt.model,
          displayName: attempt.model,
          efforts: null,
          description: null,
        });
      }
      grouped.set(attempt.cli, bucket);
    }
  }

  return new Map([...grouped].map(([cli, bucket]) => [cli, [...bucket.values()]]));
}
