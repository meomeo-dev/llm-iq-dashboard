"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import type { ProfileView } from "@/core/profile-view";
import type { PromptStandard } from "@/core/prompt";
import type { DashboardCard } from "@/core/types";
import { useLiveProgress, useLiveRunsRevision } from "../live-state/live-store";
import type { DashboardWindowSnapshot } from "./dashboard-window";
import { mergeLiveProgress } from "./merge-live-progress";

export interface DashboardSyncInput {
  readonly cards: readonly DashboardCard[];
  readonly runStarts: readonly string[];
  readonly promptLabels: Readonly<Record<string, string>>;
  readonly promptStandards: Readonly<Record<string, PromptStandard>>;
  readonly profiles: readonly ProfileView[];
  readonly initialDay?: string | null;
  readonly initialRunsRevision?: string;
  readonly pickedDayRef: RefObject<string | null>;
}

export interface DashboardSyncedData {
  readonly cards: DashboardCard[];
  readonly runStarts: string[];
  readonly promptLabels: Readonly<Record<string, string>>;
  readonly promptStandards: Readonly<Record<string, PromptStandard>>;
  readonly profiles: readonly ProfileView[];
}

interface SnapshotState {
  readonly cards: readonly DashboardCard[];
  readonly runStarts: readonly string[];
  readonly promptLabels: Readonly<Record<string, string>>;
  readonly promptStandards: Readonly<Record<string, PromptStandard>>;
  readonly profiles: readonly ProfileView[];
}

function toSnapshotState(input: Pick<DashboardSyncInput, keyof SnapshotState>): SnapshotState {
  return {
    cards: input.cards,
    runStarts: input.runStarts,
    promptLabels: input.promptLabels,
    promptStandards: input.promptStandards,
    profiles: input.profiles,
  };
}

function propSignature(input: DashboardSyncInput): string {
  const cardsSig = input.cards
    .map((c) => `${c.runId}:${c.targetId}:${c.promptId}:${c.status}:${c.runInProgress ? 1 : 0}:${c.judge?.total.verdict ?? ""}`)
    .join(",");
  return [
    input.initialDay ?? "",
    input.initialRunsRevision ?? "",
    input.runStarts.join(","),
    String(Object.keys(input.promptLabels).length),
    String(Object.keys(input.promptStandards).length),
    String(input.profiles.length),
    cardsSig,
  ].join("|");
}

/**
 * 在不整页刷新（不调用 router.refresh / 定时轮询）的前提下维护看板数据：
 * 1. 收到 SSE `runs-revision` 变更时仅向 `/api/dashboard` 拉取当前日期窗口的 JSON 并就地替换；
 * 2. 将 SSE 实时推送的执行中进度（progress.json）与已落盘卡片合并，使运行中格子实时呈现。
 */
export function useDashboardSync(input: DashboardSyncInput): DashboardSyncedData {
  const liveRunsRevision = useLiveRunsRevision();
  const liveProgress = useLiveProgress();

  const [snapshot, setSnapshot] = useState<SnapshotState>(() => toSnapshotState(input));
  const syncedRevisionRef = useRef<string | null>(input.initialRunsRevision ?? null);
  const propSig = propSignature(input);
  const prevPropSigRef = useRef(propSig);
  const requestSeqRef = useRef(0);

  useEffect(() => {
    if (prevPropSigRef.current === propSig) return;
    prevPropSigRef.current = propSig;
    setSnapshot(toSnapshotState(input));
    syncedRevisionRef.current = input.initialRunsRevision ?? null;
  }, [propSig, input]);

  useEffect(
    () => syncOnRevisionChange(liveRunsRevision, syncedRevisionRef, requestSeqRef, input.pickedDayRef, setSnapshot),
    [liveRunsRevision, input.pickedDayRef],
  );

  const merged = useMemo(
    () =>
      mergeLiveProgress({
        cards: snapshot.cards,
        runStarts: snapshot.runStarts,
        progress: liveProgress,
        promptLabels: snapshot.promptLabels,
      }),
    [snapshot.cards, snapshot.runStarts, liveProgress, snapshot.promptLabels],
  );

  return { ...snapshot, cards: merged.cards, runStarts: merged.runStarts };
}

function syncOnRevisionChange(
  liveRunsRevision: string | null,
  syncedRevisionRef: RefObject<string | null>,
  requestSeqRef: RefObject<number>,
  pickedDayRef: RefObject<string | null>,
  setSnapshot: (next: SnapshotState) => void,
): (() => void) | undefined {
  if (liveRunsRevision === null || liveRunsRevision === "remote") return;
  if (syncedRevisionRef.current === null) {
    syncedRevisionRef.current = liveRunsRevision;
    return;
  }
  if (liveRunsRevision === syncedRevisionRef.current) return;

  const seq = ++requestSeqRef.current;
  const controller = new AbortController();
  const day = pickedDayRef.current;
  const query = day !== null ? `?day=${encodeURIComponent(day)}` : "";

  void fetch(`/api/dashboard${query}`, { cache: "no-store", signal: controller.signal })
    .then((res) => (res.ok ? (res.json() as Promise<DashboardWindowSnapshot>) : null))
    .then((next) => {
      if (!next || controller.signal.aborted || seq !== requestSeqRef.current) return;
      syncedRevisionRef.current = next.runsRevision;
      setSnapshot(toSnapshotState(next));
    })
    .catch(() => {
      // 中止或瞬断忽略，待下次 SSE 修订变化或重连后同步
    });

  return () => controller.abort();
}
