/**
 * 看板实时状态的浏览器端存储：整页只开一条 EventSource 连 `/api/events`，
 * 执行进度与自动任务状态都从这里读（服务端见 app/api/events）。
 *
 * - 前台有订阅者时保持连接，页面隐藏或没有订阅者时释放连接。
 *   回到前台后读取服务端快照，避免后台页面占满浏览器的 HTTP/1.1 连接。
 * - 网络中断由 EventSource 自动重连；服务端拒绝（非 200）时浏览器不重连，由这里
 *   定时重连。重连后服务端先推全量快照，无需补发。
 * - 断线期间保留上一次的状态，看板进程重启时界面不清空。
 */

"use client";

import { useSyncExternalStore } from "react";
import type { AutoRunView } from "@/core/auto-run";
import type { FingerprintJobView } from "@/core/model-fingerprint/job";
import type { ProgressView } from "@/core/progress";

const EVENTS_URL = "/api/events";
/** 与 app/api/events/live-hub.ts 的事件名一致 */
const PROGRESS_EVENT = "progress";
const AUTO_RUN_EVENT = "auto-run";
const FINGERPRINT_JOB_EVENT = "fingerprint-job";
const RECONNECT_MS = 2_000;

/** 自动任务状态；服务端读不出来（例如配置文件写坏）时是 error */
export type LiveAutoRun = AutoRunView | { error: string };

interface LiveState {
  /** 收到首份快照之前为 null */
  progress: ProgressView[] | null;
  autoRun: LiveAutoRun | null;
  /** 收到首份快照之前为 undefined；无活跃作业时为 null */
  fingerprintJob: FingerprintJobView | null | undefined;
}

const INITIAL: LiveState = { progress: null, autoRun: null, fingerprintJob: undefined };

let state: LiveState = INITIAL;
const listeners = new Set<() => void>();
let source: EventSource | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | undefined;

/** 最近几轮的执行进度（新的在前）；尚未连上时为 null */
export function useLiveProgress(): ProgressView[] | null {
  return useSyncExternalStore(subscribe, () => state.progress, () => INITIAL.progress);
}

/** 自动任务状态；尚未连上时为 null */
export function useLiveAutoRun(): LiveAutoRun | null {
  return useSyncExternalStore(subscribe, () => state.autoRun, () => INITIAL.autoRun);
}

/** 当前活跃的模型指纹作业；无活跃作业时为 null，尚未连上 SSE 时为 undefined */
export function useLiveFingerprintJob(): FingerprintJobView | null | undefined {
  return useSyncExternalStore(subscribe, () => state.fingerprintJob, () => INITIAL.fingerprintJob);
}

/** 切换开关后先用 PUT 响应更新本地状态，随后到达的推送照常覆盖 */
export function publishAutoRun(view: AutoRunView): void {
  update({ autoRun: view });
}

async function fetchAutoRunFast(): Promise<void> {
  try {
    const res = await fetch("/api/auto-run", { cache: "no-store" });
    if (res.ok) {
      const data = (await res.json()) as AutoRunView;
      if (state.autoRun === null || "error" in state.autoRun) {
        update({ autoRun: data });
      }
    }
  } catch {
    // 静默忽略网络波动
  }
}

function syncConnection(): void {
  if (document.visibilityState === "hidden" || listeners.size === 0) {
    disconnect();
  } else if (source === null) {
    connect();
    void fetchAutoRunFast();
  }
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  if (listeners.size === 1) {
    document.addEventListener("visibilitychange", syncConnection);
    syncConnection();
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      document.removeEventListener("visibilitychange", syncConnection);
      disconnect();
    }
  };
}

function connect(): void {
  clearTimeout(reconnectTimer);
  const next = new EventSource(EVENTS_URL);
  next.addEventListener(PROGRESS_EVENT, (event) => update({ progress: parse<ProgressView[]>(event) }));
  next.addEventListener(AUTO_RUN_EVENT, (event) => {
    const view = parse<AutoRunView | null>(event);
    if (view !== null) {
      update({ autoRun: view });
    } else if (state.autoRun === null || "error" in state.autoRun) {
      update({ autoRun: { error: "服务端读取自动任务状态失败" } });
    }
  });
  next.addEventListener(FINGERPRINT_JOB_EVENT, (event) => {
    update({ fingerprintJob: parse<FingerprintJobView | null>(event) });
  });
  next.onerror = () => {
    // CONNECTING 表示浏览器正在自动重连；只有 CLOSED 需要自己再连
    if (source !== next || next.readyState !== EventSource.CLOSED) return;
    source = null;
    reconnectTimer = setTimeout(syncConnection, RECONNECT_MS);
  };
  source = next;
}

function disconnect(): void {
  clearTimeout(reconnectTimer);
  source?.close();
  source = null;
}

function parse<T>(event: Event): T {
  return JSON.parse((event as MessageEvent<string>).data) as T;
}

/** 替换为新对象再通知：useSyncExternalStore 按引用变化决定是否重渲染 */
function update(patch: Partial<LiveState>): void {
  state = { ...state, ...patch };
  for (const listener of listeners) listener();
}
