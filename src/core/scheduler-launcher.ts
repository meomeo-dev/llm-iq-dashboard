/**
 * 从看板进程拉起常驻调度器。
 *
 * 调度器以脱离的子进程运行（detached + unref），不随看板重启或热重载退出；
 * 日志追加写到 data/scheduler.log。
 */

import { spawn } from "node:child_process";
import { mkdirSync, openSync } from "node:fs";
import { join } from "node:path";
import { readAutoRunSwitch, readLiveScheduler } from "./auto-run";
import { dataRoot } from "./paths";
import { externalRunner } from "./runner-link";
import { isReadonly } from "./deploy-mode";

/** 调度器启动到登记 pid 需要一两秒，冷却期内不重复拉起 */
const LAUNCH_COOLDOWN_MS = 15_000;
const LAST_LAUNCH = Symbol.for("pelican.schedulerLaunchedAt");

interface LaunchHolder {
  [LAST_LAUNCH]?: number;
}

/** 返回新进程的 pid；冷却期内或只读模式下返回 null */
export function launchScheduler(now: number = Date.now()): number | null {
  if (isReadonly()) return null;
  // 挂在 globalThis 上，开发模式热重载会重置模块级变量
  const holder = globalThis as LaunchHolder;
  const last = holder[LAST_LAUNCH];
  if (last !== undefined && now - last < LAUNCH_COOLDOWN_MS) return null;

  mkdirSync(dataRoot(), { recursive: true });
  const logFd = openSync(join(dataRoot(), "scheduler.log"), "a");
  // 直接用 node 运行 tsx 入口，不依赖看板进程 PATH 中的 pnpm
  const tsxCli = join(process.cwd(), "node_modules", "tsx", "dist", "cli.mjs");
  const child = spawn(process.execPath, [tsxCli, join("src", "bin", "scheduler.ts")], {
    cwd: process.cwd(),
    env: process.env,
    detached: true,
    stdio: ["ignore", logFd, logFd],
  });
  child.unref();
  if (child.pid === undefined) throw new Error("调度器进程未能启动");
  holder[LAST_LAUNCH] = now;
  return child.pid;
}

/**
 * 自动任务开启且没有存活的调度器时拉起一个，返回新 pid；否则返回 null。
 * 不看配置里有没有节奏：调度器常驻并随配置热更新，之后补上节奏也能生效。
 * 拨开开关与看板启动时调用，后者用于补上机器或容器重启后缺失的调度器。
 */
export async function launchSchedulerIfNeeded(): Promise<number | null> {
  if (isReadonly()) return null;
  // 分容器部署：调度器在执行器容器里常驻，看板不拉起
  if (externalRunner()) return null;
  const { enabled } = await readAutoRunSwitch();
  if (!enabled) return null;
  if ((await readLiveScheduler()) !== null) return null;
  return launchScheduler();
}
