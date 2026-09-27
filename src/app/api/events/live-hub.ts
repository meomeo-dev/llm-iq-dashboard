/**
 * 看板实时状态的推送中枢（进程内单例）。
 *
 * 执行进度与自动任务状态由看板进程或调度器进程写入 data/。用 chokidar 监听这些文件，
 * 去抖后重算快照，内容有变化才经 better-sse 频道广播给所有看板页面。
 *
 * 文件事件覆盖不到的两种变化由服务端计时器补上：
 * - 执行进程被杀掉后不再写文件：有未结束轮次时每 5 秒复核 pid 是否存活；
 * - “下一次触发”到点即过期：在该时刻重算自动任务状态。
 *
 * 没有页面连接时停掉监听与计时器；挂在 globalThis 上，避免开发模式热重载叠出多份监听。
 */

import { createChannel, type Channel } from "better-sse";
import { watch, type FSWatcher } from "chokidar";
import { basename, dirname, join, relative, sep } from "node:path";
import { describeAutoRun, type AutoRunView } from "@/core/auto-run";
import { configPath, dataRoot, runsRoot } from "@/core/paths";
import { listProgressViews, type ProgressView } from "@/core/progress";
import { listRunIds } from "@/core/store";

export const PROGRESS_EVENT = "progress";
export const AUTO_RUN_EVENT = "auto-run";

/** 一次写入往往连着几个文件事件（临时文件 + 原子替换），合并成一次重算 */
const DEBOUNCE_MS = 150;
const LIVENESS_CHECK_MS = 5_000;
/** 启动时只监听最新的几个轮次目录；更早的轮次已结束，不会再变 */
const WATCHED_RECENT_RUNS = 3;
/** data/ 顶层里与看板状态有关的文件 */
const TOP_LEVEL_FILES = new Set(["auto-run.json", "scheduler.json"]);
const PROGRESS_FILE = "progress.json";

export interface LiveSnapshot {
  progress: ProgressView[];
  /** 配置读不出来时为 null：看板照常显示进度，开关显示读取失败 */
  autoRun: AutoRunView | null;
}

interface LiveHub {
  channel: Channel;
  latest: LiveSnapshot | null;
  watcher: FSWatcher | null;
  debounceTimer: ReturnType<typeof setTimeout> | undefined;
  livenessTimer: ReturnType<typeof setInterval> | undefined;
  nextRunTimer: ReturnType<typeof setTimeout> | undefined;
}

const HUB_KEY = Symbol.for("pelican.liveHub");

interface HubHolder {
  [HUB_KEY]?: LiveHub;
}

/** 取单例；首次调用时建频道，并在最后一个页面断开时停掉监听 */
export function liveHub(): LiveHub {
  const holder = globalThis as HubHolder;
  const existing = holder[HUB_KEY];
  if (existing !== undefined) return existing;

  const hub: LiveHub = {
    channel: createChannel(),
    latest: null,
    watcher: null,
    debounceTimer: undefined,
    livenessTimer: undefined,
    nextRunTimer: undefined,
  };
  hub.channel.on("session-deregistered", () => {
    if (hub.channel.sessionCount === 0) stopWatching(hub);
  });
  holder[HUB_KEY] = hub;
  return hub;
}

/** 确保监听在跑、快照是新的；返回当前快照供新连接先推一份全量 */
export async function readyHub(hub: LiveHub): Promise<LiveSnapshot> {
  if (hub.watcher === null) await startWatching(hub);
  if (hub.latest === null) hub.latest = await computeSnapshot();
  return hub.latest;
}

async function startWatching(hub: LiveHub): Promise<void> {
  const recent = (await listRunIds()).slice(0, WATCHED_RECENT_RUNS);
  // runId 字典序即时间序，早于 oldestWatched 的轮次目录不监听
  const oldestWatched = recent[recent.length - 1] ?? "";
  hub.watcher = watch([dataRoot(), configPath()], {
    ignoreInitial: true,
    depth: 2,
    ignored: (path) => isIgnored(path, oldestWatched),
  });
  hub.watcher.on("all", () => scheduleRefresh(hub));
  hub.watcher.on("error", (cause) => console.error(`看板状态监听出错：${describe(cause)}`));
  hub.livenessTimer = setInterval(() => {
    if (hub.latest?.progress.some((run) => run.finishedAt === null && run.alive) === true) scheduleRefresh(hub);
  }, LIVENESS_CHECK_MS);
  hub.latest = await computeSnapshot();
  armNextRunTimer(hub);
}

function stopWatching(hub: LiveHub): void {
  void hub.watcher?.close();
  hub.watcher = null;
  hub.latest = null;
  clearTimeout(hub.debounceTimer);
  clearInterval(hub.livenessTimer);
  clearTimeout(hub.nextRunTimer);
}

/**
 * 只放行影响看板状态的路径：data/ 根目录、顶层两个运行态文件、runs/ 目录、
 * 较新的轮次目录及其 progress.json、配置文件；卡片 svg / txt 等高频写入忽略。
 */
function isIgnored(path: string, oldestWatched: string): boolean {
  if (path === dataRoot() || path === configPath() || path === runsRoot()) return false;
  const parent = dirname(path);
  if (parent === dataRoot()) return !TOP_LEVEL_FILES.has(basename(path)) && path !== runsRoot();
  const underRuns = relative(runsRoot(), path);
  if (underRuns.startsWith("..")) return true;
  const [runId, file] = underRuns.split(sep);
  if (runId === undefined || runId < oldestWatched) return true;
  return file !== undefined && file !== PROGRESS_FILE;
}

function scheduleRefresh(hub: LiveHub): void {
  clearTimeout(hub.debounceTimer);
  hub.debounceTimer = setTimeout(() => void refresh(hub), DEBOUNCE_MS);
}

/** 重算快照，只广播内容有变化的事件类型 */
async function refresh(hub: LiveHub): Promise<void> {
  const previous = hub.latest;
  const next = await computeSnapshot();
  hub.latest = next;
  if (JSON.stringify(previous?.progress) !== JSON.stringify(next.progress)) {
    hub.channel.broadcast(next.progress, PROGRESS_EVENT);
  }
  if (JSON.stringify(previous?.autoRun) !== JSON.stringify(next.autoRun)) {
    hub.channel.broadcast(next.autoRun, AUTO_RUN_EVENT);
    armNextRunTimer(hub);
  }
}

/** 在下一次 cron 触发点之后重算，刷新“下次触发”时刻 */
function armNextRunTimer(hub: LiveHub): void {
  clearTimeout(hub.nextRunTimer);
  const nextRunAt = hub.latest?.autoRun?.nextRunAt;
  if (nextRunAt === null || nextRunAt === undefined) return;
  const delay = Math.max(0, Date.parse(nextRunAt) - Date.now()) + 1_000;
  hub.nextRunTimer = setTimeout(() => scheduleRefresh(hub), delay);
}

async function computeSnapshot(): Promise<LiveSnapshot> {
  const progress = await listProgressViews();
  try {
    return { progress, autoRun: await describeAutoRun() };
  } catch (cause) {
    console.error(`读取自动任务状态失败：${describe(cause)}`);
    return { progress, autoRun: null };
  }
}

function describe(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause);
}

/** 供测试与排查：data/ 下某个相对路径是否会被监听 */
export function isWatchedPath(relativePath: string, oldestWatched: string): boolean {
  return !isIgnored(join(dataRoot(), relativePath), oldestWatched);
}
