import { actionFetch } from "../action-fetch";
import type { RunOptionsView } from "@/app/api/run/route";

let cachedRunOptions: RunOptionsView | null = null;
let prefetchPromise: Promise<RunOptionsView | { error: string }> | null = null;

export function getCachedRunOptions(): RunOptionsView | null {
  return cachedRunOptions;
}

export function setCachedRunOptions(options: RunOptionsView | null): void {
  cachedRunOptions = options;
}

/**
 * 提前预拉取单次执行选项，抹平首次打开时的网络往返与 Next.js 路由编译延迟。
 */
export async function prefetchRunOptions(): Promise<RunOptionsView | { error: string }> {
  if (cachedRunOptions !== null) return cachedRunOptions;
  if (prefetchPromise !== null) return prefetchPromise;
  prefetchPromise = fetchOptions().then((next) => {
    if (!("error" in next)) {
      cachedRunOptions = next;
    }
    prefetchPromise = null;
    return next;
  });
  return prefetchPromise;
}

export async function fetchOptions(): Promise<RunOptionsView | { error: string }> {
  try {
    const response = await actionFetch("/api/run");
    const body = (await response.json()) as RunOptionsView & { error?: string };
    return response.ok ? body : { error: body.error ?? "读取可选范围失败" };
  } catch (cause) {
    return { error: cause instanceof Error ? cause.message : String(cause) };
  }
}

export async function postRun(
  targetIds: string[],
  promptIds: string[],
  candidateOverrides?: Record<string, string>,
  profiles?: readonly string[],
): Promise<{ runId: string; calls: number } | { error: string }> {
  try {
    const payload: {
      targetIds: string[];
      promptIds: string[];
      candidateOverrides?: Record<string, string>;
      profiles?: string[];
    } = { targetIds, promptIds };
    if (candidateOverrides && Object.keys(candidateOverrides).length > 0) {
      payload.candidateOverrides = candidateOverrides;
    }
    // 不涉及上游时不带该字段，请求与引入上游之前逐字相同
    if (profiles !== undefined) payload.profiles = [...profiles];
    const response = await actionFetch("/api/run", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = (await response.json()) as { runId?: string; calls?: number; error?: string };
    return response.ok ? { runId: body.runId ?? "", calls: body.calls ?? 0 } : { error: body.error ?? "发起失败" };
  } catch (cause) {
    return { error: cause instanceof Error ? cause.message : String(cause) };
  }
}
