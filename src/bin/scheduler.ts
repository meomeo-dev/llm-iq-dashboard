#!/usr/bin/env tsx
/**
 * 常驻调度进程：`pnpm scheduler` / `pnpm pelican scheduler`
 *
 * 与 Next.js 服务进程分开运行，只通过 data/ 交换数据：重启看板不打断正在进行的基准，
 * 调度器崩溃也不影响看板。
 */

import { pathToFileURL } from "node:url";
import { readAutoRunSwitch, readLiveScheduler, recordSchedulerProcess } from "../core/auto-run";
import { loadConfig, type AppConfig } from "../core/config";
import { resumeInterruptedJudging } from "../core/judge/ai-round";
import { configPath } from "../core/paths";
import { recoverInterruptedRuns } from "../core/run/recover-interrupted";
import { scheduledRound } from "../core/run-selection";
import { startScheduler } from "../core/scheduler";
import {
  expandEqualsTokens,
  extractGlobalPathFlags,
  formatCliError,
  hasHelpFlag,
  stripPnpmSeparators,
} from "./cli-args";

const VALID_SCHEDULER_FLAGS: readonly string[] = [
  "--config",
  "-c",
  "--data-dir",
  "--help",
  "-h",
];

export function formatSchedulerHelp(): string {
  return [
    "用法: pnpm scheduler [-- <options>]",
    "别名: pnpm pelican scheduler [options]",
    "",
    "说明:",
    "  启动常驻定时调度器（按 cron 触发评测轮次并续评中断队列）。",
    "",
    "选项:",
    "  -c, --config <path>     覆盖配置文件路径（同 PELICAN_CONFIG）",
    "  --data-dir <path>       覆盖数据目录路径（同 PELICAN_DATA_DIR）",
    "  -h, --help              显示此帮助信息并退出",
  ].join("\n");
}

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

export async function runSchedulerCli(
  argv: readonly string[] = process.argv.slice(2),
  writeLine: (line: string) => void = console.log,
): Promise<void> {
  if (hasHelpFlag(stripPnpmSeparators(argv))) {
    writeLine(formatSchedulerHelp());
    return;
  }
  const tokens = expandEqualsTokens(stripPnpmSeparators(extractGlobalPathFlags(argv)));
  for (const token of tokens) {
    throw new Error(formatCliError(token, VALID_SCHEDULER_FLAGS, "pnpm scheduler -- --help"));
  }

  const path = configPath();
  const config = loadConfig(path);

  timestamped(`调度器启动，配置：${path}`);
  timestamped(`定时目标 ${scheduledRound(config).targets.length}/${config.targets.length}，并发：${config.run.concurrency}`);
  const existing = await readLiveScheduler();
  if (existing !== null && existing.pid !== process.pid) {
    timestamped(`已有调度器在运行（pid ${existing.pid}），本进程退出`);
    return;
  }
  await recordSchedulerProcess(process.pid);
  const recovered = await recoverInterruptedRuns(loadConfig(path), timestamped);
  void resumeJudging(recovered.judgingInterrupted, () => loadConfig(path), timestamped);
  const { enabled } = await readAutoRunSwitch();
  timestamped(`自动任务开关：${enabled ? "开" : "关（到点跳过，在看板上打开）"}`);

  const handle = startScheduler(() => loadConfig(path), timestamped);

  const shutdown = (signal: NodeJS.Signals) => {
    timestamped(`收到 ${signal}，停止调度`);
    handle.stop();
    process.exit(0);
  };
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

const isMainModule =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
  runSchedulerCli(process.argv.slice(2)).catch((cause: unknown) => {
    console.error(cause instanceof Error ? cause.message : cause);
    process.exit(1);
  });
}
