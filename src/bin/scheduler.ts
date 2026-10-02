#!/usr/bin/env tsx
/**
 * 常驻调度进程：`pnpm scheduler`
 *
 * 与 Next.js 服务进程分开运行，只通过 data/ 交换数据：重启看板不打断正在进行的基准，
 * 调度器崩溃也不影响看板。
 */

import { readAutoRunSwitch, readLiveScheduler, recordSchedulerProcess } from "../core/auto-run";
import { loadConfig, type AppConfig } from "../core/config";
import { configPath } from "../core/paths";
import { resumeInterruptedJudging } from "../core/judge/ai-round";
import { recoverInterruptedRuns } from "../core/run/recover-interrupted";
import { scheduledRound } from "../core/run-selection";
import { startScheduler } from "../core/scheduler";

function timestamped(message: string): void {
  console.log(`${new Date().toISOString()} ${message}`);
}

async function resumeJudging(runIds: readonly string[], readConfig: () => AppConfig, log: (line: string) => void): Promise<void> {
  for (const runId of runIds) {
    await resumeInterruptedJudging(readConfig(), runId, log).catch((cause: unknown) => {
      log(`[${runId}] 续评失败：${cause instanceof Error ? cause.message : String(cause)}`);
    });
  }
}

async function main(): Promise<void> {
  const path = configPath();
  const config = loadConfig(path);

  timestamped(`调度器启动，配置：${path}`);
  timestamped(`定时目标 ${scheduledRound(config).targets.length}/${config.targets.length}，并发：${config.run.concurrency}`);
  // 单例：两个调度器会在同一个整点各开一轮，同一模型的调用互相挤占配额
  const existing = await readLiveScheduler();
  if (existing !== null && existing.pid !== process.pid) {
    timestamped(`已有调度器在运行（pid ${existing.pid}），本进程退出`);
    return;
  }
  // 登记 pid，看板据此判断打开自动任务时是否需要拉起调度器
  await recordSchedulerProcess(process.pid);
  // 上一个进程退出前没跑完的轮次先收尾，已完成的作品照常导出
  const recovered = await recoverInterruptedRuns(loadConfig(path), timestamped);
  // 没评完的评审队列在后台续评，不耽误调度启动；裁判调用串行，与整点的新一轮互不影响
  void resumeJudging(recovered.judgingInterrupted, () => loadConfig(path), timestamped);
  const { enabled } = await readAutoRunSwitch();
  timestamped(`自动任务开关：${enabled ? "开" : "关（到点跳过，在看板上打开）"}`);

  // 每个触发点重读配置，看板上的改动无需重启调度器
  const handle = startScheduler(() => loadConfig(path), timestamped);

  // 收到终止信号即停止调度并退出；正在跑的一轮随之中断，已写入的产物保留。
  const shutdown = (signal: NodeJS.Signals) => {
    timestamped(`收到 ${signal}，停止调度`);
    handle.stop();
    process.exit(0);
  };
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

main().catch((cause: unknown) => {
  console.error(cause instanceof Error ? cause.message : cause);
  process.exit(1);
});
