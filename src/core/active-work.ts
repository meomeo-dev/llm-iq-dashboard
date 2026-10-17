/**
 * 全局作业双向互斥检测（active-work.ts）：
 * 组合鹈鹕基准轮次（含采样阶段与 AI 语义评审阶段 isJudging）与模型指纹后台作业（fill / check），
 * 供调度器、手动执行与指纹作业做跨进程互斥，同时不改变 progress.ts 中 findActiveRun() 的原有返回契约。
 */

import { findActiveFingerprintJob } from "./model-fingerprint/job";
import { listProgressViews } from "./progress";
import type { RunRecord } from "./types";

export interface ActiveWorkItem {
  readonly runId: string;
  readonly kind: "run" | "fingerprint";
  readonly trigger?: RunRecord["trigger"];
}

/**
 * 检查任一进程中是否有正在执行的鹈鹕轮次（含 AI 评审阶段）或模型指纹作业。
 */
export async function findActiveWork(): Promise<ActiveWorkItem | null> {
  const progressViews = await listProgressViews();
  const activeRun = progressViews.find((view) => view.alive && !view.jobKind);
  if (activeRun !== undefined) {
    return {
      runId: activeRun.runId,
      kind: "run",
      trigger: activeRun.trigger,
    };
  }
  const activeJob = await findActiveFingerprintJob();
  if (activeJob !== null) {
    return {
      runId: activeJob.jobId,
      kind: "fingerprint",
    };
  }
  return null;
}

/**
 * 生成 409 冲突提示：当阻断方为基准轮次时保持原有文案格式，确保前端 run-once-api.ts 正则兼容。
 */
export function describeActiveWorkConflict(active: ActiveWorkItem): string {
  if (active.kind === "run") {
    const trigger = active.trigger === "schedule" ? "定时" : "手动";
    return `已有一轮正在执行（${trigger} ${active.runId}）`;
  }
  return `模型指纹作业正在执行（${active.runId}）`;
}
