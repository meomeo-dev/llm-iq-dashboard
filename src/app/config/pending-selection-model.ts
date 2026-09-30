/**
 * 待导出清单的勾选状态（纯函数）：按轮次勾选，轮内可再去掉个别调用。
 *
 * 状态只记"勾了哪些轮"与"每轮去掉了哪些调用"：新出现的轮次默认整轮勾上，
 * 去掉的调用不随状态刷新丢失；一轮的调用全被去掉时视为这一轮未勾选。
 */

import type { PendingRun } from "@/core/sync/data-repo-panel-types";

export interface SelectionState {
  selected: ReadonlySet<string>;
  /** runId → 去掉的 attemptKey */
  excluded: ReadonlyMap<string, ReadonlySet<string>>;
}

export type RunPick = "all" | "some" | "none";

export function initialSelection(runs: readonly PendingRun[]): SelectionState {
  return { selected: new Set(runs.map((run) => run.runId)), excluded: new Map() };
}

/** 状态刷新后：保留已有选择，新出现的轮次勾上，消失的轮次去掉 */
export function reconcileSelection(
  state: SelectionState,
  runs: readonly PendingRun[],
  seen: ReadonlySet<string>,
): SelectionState {
  const ids = runs.map((run) => run.runId);
  const selected = new Set(ids.filter((id) => state.selected.has(id) || !seen.has(id)));
  const excluded = new Map([...state.excluded].filter(([runId]) => ids.includes(runId)));
  return { selected, excluded };
}

function keysOf(run: PendingRun): string[] {
  return (run.items ?? []).map((item) => item.key);
}

export function runPick(state: SelectionState, run: PendingRun): RunPick {
  if (!state.selected.has(run.runId)) return "none";
  const keys = keysOf(run);
  const dropped = state.excluded.get(run.runId);
  if (dropped === undefined || dropped.size === 0 || keys.length === 0) return "all";
  const kept = keys.filter((key) => !dropped.has(key)).length;
  if (kept === 0) return "none";
  return kept === keys.length ? "all" : "some";
}

export function isAttemptPicked(state: SelectionState, runId: string, key: string): boolean {
  return state.selected.has(runId) && !(state.excluded.get(runId)?.has(key) ?? false);
}

/** 勾选框点一下：未勾（含调用全被去掉）→ 整轮勾上；其余 → 整轮取消 */
export function toggleRun(state: SelectionState, run: PendingRun): SelectionState {
  const selected = new Set(state.selected);
  const excluded = new Map(state.excluded);
  excluded.delete(run.runId);
  if (runPick(state, run) === "none") selected.add(run.runId);
  else selected.delete(run.runId);
  return { selected, excluded };
}

/** 未勾的轮次里点某个调用：这一轮只勾上它 */
export function toggleAttempt(state: SelectionState, run: PendingRun, key: string): SelectionState {
  const selected = new Set(state.selected);
  const excluded = new Map(state.excluded);
  if (runPick(state, run) === "none") {
    selected.add(run.runId);
    excluded.set(run.runId, new Set(keysOf(run).filter((other) => other !== key)));
    return { selected, excluded };
  }
  const dropped = new Set(state.excluded.get(run.runId) ?? []);
  if (dropped.has(key)) dropped.delete(key);
  else dropped.add(key);
  excluded.set(run.runId, dropped);
  return { selected, excluded };
}

export function selectAll(runs: readonly PendingRun[], on: boolean): SelectionState {
  return on ? initialSelection(runs) : { selected: new Set(), excluded: new Map() };
}

/** 发请求用的范围：勾选的轮次，以及只勾了部分调用的轮次的子集 */
export function selectionScope(
  state: SelectionState,
  runs: readonly PendingRun[],
): { runIds: string[]; attempts: Record<string, string[]> } {
  const runIds: string[] = [];
  const attempts: Record<string, string[]> = {};
  for (const run of runs) {
    const pick = runPick(state, run);
    if (pick === "none") continue;
    runIds.push(run.runId);
    if (pick === "some") attempts[run.runId] = keysOf(run).filter((key) => isAttemptPicked(state, run.runId, key));
  }
  return { runIds, attempts };
}
