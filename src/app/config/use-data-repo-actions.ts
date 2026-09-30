/**
 * 数据仓面板操作状态管理 Hook。
 *
 * 职责：
 * 1. 初始化拉取与手动刷新 GET /api/data-repo 聚合状态；
 * 2. 触发 POST /api/data-repo/sync 动作；
 * 3. 动作期间锁定按钮（互斥锁 inFlightMode 与 ref 双重保障）；
 * 4. 动作完成后自动刷新状态并记录结果；
 * 5. 支持参数注入 fetchFn 以便于单元测试。
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  DataRepoStatus,
  SyncActionMode,
  SyncActionResult,
} from "@/core/sync/data-repo-panel-types";
import { actionFetch } from "../components/action-fetch";

export type FetchFn = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;

export interface UseDataRepoActionsOptions {
  fetchFn?: FetchFn;
  initialStatus?: DataRepoStatus | null;
  autoLoad?: boolean;
}

/** 动作的处理范围：勾选的轮次与其中勾选的调用子集；都缺省为全部 */
export interface ActionScope {
  runIds?: readonly string[];
  /** 只列部分勾选的轮次；整轮勾选的不列 */
  attempts?: Readonly<Record<string, readonly string[]>>;
}

export interface UseDataRepoActionsReturn {
  status: DataRepoStatus | null;
  loading: boolean;
  inFlightMode: SyncActionMode | null;
  actionResult: SyncActionResult | null;
  error: string | null;
  refresh: () => Promise<void>;
  executeAction: (
    mode: SyncActionMode,
    confirmation?: { aheadCommits: string[] },
    scope?: ActionScope,
  ) => Promise<SyncActionResult | null>;
  dismissResult: () => void;
  dismissError: () => void;
}

const defaultFetchFn: FetchFn = (input, init) => actionFetch(input as string, init);

/** 跟踪组件挂载状态的精简 Hook */
function useMountedRef(): { current: boolean } {
  const ref = useRef(true);
  useEffect(() => {
    ref.current = true;
    return () => {
      ref.current = false;
    };
  }, []);
  return ref;
}

/** 请求 GET /api/data-repo 状态并归约错误 */
export async function requestRepoStatus(fetchFn: FetchFn): Promise<{
  data: DataRepoStatus | null;
  error: string | null;
}> {
  try {
    const res = await fetchFn("/api/data-repo", { cache: "no-store" });
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      return { data: null, error: body.error ?? `请求失败 (${res.status})` };
    }
    return { data: (await res.json()) as DataRepoStatus, error: null };
  } catch (cause) {
    const error = cause instanceof Error ? cause.message : String(cause);
    return { data: null, error };
  }
}

/** 发起 POST /api/data-repo/sync 动作并归约响应；runIds 与 attempts 只在给了且非空时随请求体发出 */
export async function postRepoAction(
  fetchFn: FetchFn,
  mode: SyncActionMode,
  confirmation?: { aheadCommits: string[] },
  scope: ActionScope = {},
): Promise<{ result: SyncActionResult | null; error: string | null }> {
  try {
    const { runIds, attempts } = scope;
    const payload = {
      mode,
      confirmation,
      ...(runIds !== undefined && runIds.length > 0 ? { runIds } : {}),
      ...(attempts !== undefined && Object.keys(attempts).length > 0 ? { attempts } : {}),
    };
    const res = await fetchFn("/api/data-repo/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = (await res.json().catch(() => ({}))) as
      | SyncActionResult
      | { error?: string };
    if (!res.ok || !("ok" in body)) {
      const msg =
        ("error" in body ? body.error : null) ?? `操作失败 (${res.status})`;
      return { result: null, error: msg };
    }
    return { result: body as SyncActionResult, error: null };
  } catch (cause) {
    const error = cause instanceof Error ? cause.message : String(cause);
    return { result: null, error };
  }
}

/** 状态拉取与刷新的子 Hook */
function useRepoStatusLoader(
  fetchFn: FetchFn,
  mounted: { current: boolean },
  initialStatus?: DataRepoStatus | null,
  autoLoad?: boolean,
) {
  const [status, setStatus] = useState<DataRepoStatus | null>(
    initialStatus ?? null,
  );
  const [loading, setLoading] = useState(
    initialStatus === undefined && autoLoad !== false,
  );
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (): Promise<void> => {
    const res = await requestRepoStatus(fetchFn);
    if (!mounted.current) return;
    setLoading(false);
    if (res.error !== null) {
      setError(res.error);
      return;
    }
    setStatus(res.data);
    setError(null);
  }, [fetchFn, mounted]);

  useEffect(() => {
    if (autoLoad !== false) void refresh();
  }, [autoLoad, refresh]);

  return { status, setStatus, loading, error, setError, refresh };
}

/** 执行动作并维护正在执行状态的子 Hook */
function useRepoActionExecutor(
  fetchFn: FetchFn,
  mounted: { current: boolean },
  refresh: () => Promise<void>,
  setError: (e: string | null) => void,
  setActionResult: (r: SyncActionResult | null) => void,
) {
  const [inFlightMode, setInFlightMode] = useState<SyncActionMode | null>(null);
  const inFlightRef = useRef<SyncActionMode | null>(null);

  const executeAction = useCallback(
    async (
      mode: SyncActionMode,
      conf?: { aheadCommits: string[] },
      scope?: ActionScope,
    ): Promise<SyncActionResult | null> => {
      if (inFlightRef.current !== null) return null;
      inFlightRef.current = mode;
      setInFlightMode(mode);
      setError(null);
      const { result, error: actError } = await postRepoAction(fetchFn, mode, conf, scope);
      inFlightRef.current = null;
      if (!mounted.current) return null;
      setInFlightMode(null);
      if (actError !== null) {
        await refresh().catch(() => {});
        if (mounted.current) setError(actError);
        return null;
      }
      setActionResult(result);
      await refresh();
      return result;
    },
    [fetchFn, mounted, refresh, setError, setActionResult],
  );

  return { inFlightMode, executeAction };
}

export function useDataRepoActions(
  options: UseDataRepoActionsOptions = {},
): UseDataRepoActionsReturn {
  const fetchFn = options.fetchFn ?? defaultFetchFn;
  const mounted = useMountedRef();
  const { status, loading, error, setError, refresh } = useRepoStatusLoader(
    fetchFn,
    mounted,
    options.initialStatus,
    options.autoLoad,
  );
  const [actionResult, setActionResult] = useState<SyncActionResult | null>(
    options.initialStatus?.lastAction ?? null,
  );

  const { inFlightMode, executeAction } = useRepoActionExecutor(
    fetchFn,
    mounted,
    refresh,
    setError,
    setActionResult,
  );

  useEffect(() => {
    if (status?.lastAction) setActionResult(status.lastAction);
  }, [status?.lastAction]);

  return {
    status,
    loading,
    inFlightMode,
    actionResult,
    error,
    refresh,
    executeAction,
    dismissResult: useCallback(() => setActionResult(null), []),
    dismissError: useCallback(() => setError(null), []),
  };
}
