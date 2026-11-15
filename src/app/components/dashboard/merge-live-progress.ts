import type { ProgressView } from "@/core/progress";
import type { DashboardCard } from "@/core/types";

interface MergeLiveProgressInput {
  readonly cards: readonly DashboardCard[];
  readonly runStarts: readonly string[];
  readonly progress: readonly ProgressView[] | null;
  readonly promptLabels: Readonly<Record<string, string>>;
}

export interface MergedLiveData {
  cards: DashboardCard[];
  runStarts: string[];
}

function callLookupKey(runId: string, targetId: string, promptId: string): string {
  return `${runId}\0${targetId}\0${promptId}`;
}

/**
 * 把 SSE 推送的执行中进度（progress.json）与已落盘卡片（run.json）合并，
 * 让正在执行 / 排队的调用在落盘前就以四宫格与占位卡片形态出现在时间线泳道里。
 * 指纹作业（jobKind）与已死/已结束轮次不生成实时占位。
 */
export function mergeLiveProgress({
  cards,
  runStarts,
  progress,
  promptLabels,
}: MergeLiveProgressInput): MergedLiveData {
  if (progress === null || progress.length === 0) {
    return { cards: [...cards], runStarts: [...runStarts] };
  }
  const activeRuns = progress.filter(
    (run) => run.jobKind === undefined && run.alive && run.finishedAt === null,
  );
  if (activeRuns.length === 0) {
    return { cards: [...cards], runStarts: [...runStarts] };
  }

  const nextStarts = [...runStarts];
  const seenStarts = new Set(runStarts);
  const existingKeys = new Set(cards.map((card) => callLookupKey(card.runId, card.targetId, card.promptId)));
  const syntheticCards: DashboardCard[] = [];

  for (const run of activeRuns) {
    if (!seenStarts.has(run.startedAt)) {
      seenStarts.add(run.startedAt);
      nextStarts.push(run.startedAt);
    }
    syntheticCards.push(...syntheticCardsForRun(run, existingKeys, promptLabels));
  }

  const mergedExisting = overlayActiveLiveStates(cards, activeRuns);
  if (syntheticCards.length === 0) {
    return { cards: mergedExisting, runStarts: nextStarts.sort((a, b) => b.localeCompare(a)) };
  }
  return {
    cards: [...syntheticCards, ...mergedExisting].sort((a, b) => b.startedAt.localeCompare(a.startedAt)),
    runStarts: nextStarts.sort((a, b) => b.localeCompare(a)),
  };
}

function overlayActiveLiveStates(
  cards: readonly DashboardCard[],
  activeRuns: readonly ProgressView[],
): DashboardCard[] {
  const activeCalls = new Map<string, { state: "queued" | "running"; activeSince: number }>();
  const activeRunIds = new Set<string>();
  for (const run of activeRuns) {
    activeRunIds.add(run.runId);
    for (const lane of run.lanes) {
      for (const call of lane.calls) {
        if (call.state === "queued" || call.state === "running") {
          const activeSince = Date.parse(call.startedAt ?? run.updatedAt);
          activeCalls.set(callLookupKey(run.runId, call.targetId, call.promptId), {
            state: call.state,
            activeSince,
          });
        }
      }
    }
  }
  return cards.map((card) => {
    const active = activeCalls.get(callLookupKey(card.runId, card.targetId, card.promptId));
    if (active !== undefined && card.status !== "ok" && Date.parse(card.finishedAt) < active.activeSince) {
      return { ...card, runInProgress: true, liveState: active.state };
    }
    if (activeRunIds.has(card.runId) && !card.runInProgress) return { ...card, runInProgress: true };
    return card;
  });
}

function syntheticCardsForRun(
  run: ProgressView,
  existingKeys: ReadonlySet<string>,
  promptLabels: Readonly<Record<string, string>>,
): DashboardCard[] {
  const result: DashboardCard[] = [];
  for (const lane of run.lanes) {
    for (const call of lane.calls) {
      if (call.state === "cancelled") continue;
      if (existingKeys.has(callLookupKey(run.runId, call.targetId, call.promptId))) continue;
      result.push(toSyntheticCard(run, lane, call, promptLabels));
    }
  }
  return result;
}

function toSyntheticCard(
  run: ProgressView,
  lane: ProgressView["lanes"][number],
  call: ProgressView["lanes"][number]["calls"][number],
  promptLabels: Readonly<Record<string, string>>,
): DashboardCard {
  const timestamp = call.startedAt ?? run.startedAt;
  return {
    runId: run.runId,
    runStartedAt: run.startedAt,
    trigger: run.trigger,
    runInProgress: true,
    targetId: call.targetId,
    cli: lane.cli,
    ...(lane.profile !== undefined ? { profile: lane.profile } : {}),
    model: lane.model,
    effort: call.effort,
    appliedEffort: call.effort,
    effortHonored: true,
    promptId: call.promptId,
    promptText: "",
    label: promptLabels[call.promptId] ?? call.promptId,
    bindings: {},
    status: "ok",
    svgFile: null,
    rawFile: null,
    svgBytes: null,
    error: null,
    durationMs: call.durationMs ?? 0,
    startedAt: timestamp,
    finishedAt: timestamp,
    usage: null,
    cost: {
      status: "unpriced",
      usd: null,
      modelId: null,
      channelId: null,
      serviceTier: "standard",
      catalogTag: null,
      lines: [],
      note: null,
    },
    judge: null,
    judgeCost: null,
    liveState: call.state === "queued" ? "queued" : "running",
  };
}
