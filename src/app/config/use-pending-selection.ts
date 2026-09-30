/**
 * 待导出清单的勾选状态：缺省全选；状态刷新后保留已有选择、新出现的轮次默认勾上、消失的去掉。
 * 轮内按调用勾选的规则见 pending-selection-model.ts。
 */

import { useEffect, useMemo, useState } from "react";
import type { DataRepoStatus, PendingRun } from "@/core/sync/data-repo-panel-types";
import {
  initialSelection,
  reconcileSelection,
  selectAll,
  selectionScope,
  toggleAttempt,
  toggleRun,
  type SelectionState,
} from "./pending-selection-model";
import type { ActionScope } from "./use-data-repo-actions";

export interface PendingSelection {
  runs: PendingRun[];
  state: SelectionState;
  /** 有清单时导出与演练只带勾选的轮次与子集；旧状态快照没有清单时为空对象，按全部处理 */
  scope: ActionScope;
  /** 进导出按钮文案的勾选轮数；没有清单时为 null */
  selectedCount: number | null;
  /** 未勾选的轮次，供"丢弃未勾选"使用 */
  unselectedIds: string[];
  toggleRun: (run: PendingRun) => void;
  toggleAttempt: (run: PendingRun, key: string) => void;
  setAll: (on: boolean) => void;
}

export function usePendingSelection(status: DataRepoStatus | null): PendingSelection {
  const runs = useMemo(() => status?.local.pendingRuns ?? [], [status]);
  const [state, setState] = useState<SelectionState>(() => initialSelection(runs));
  const [seen, setSeen] = useState<ReadonlySet<string>>(() => new Set(runs.map((run) => run.runId)));

  useEffect(() => {
    setState((prev) => reconcileSelection(prev, runs, seen));
    setSeen(new Set(runs.map((run) => run.runId)));
    // seen 只在这里随 runs 更新，不作为依赖，否则会与自身的 setSeen 互相触发
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runs]);

  const { runIds, attempts } = selectionScope(state, runs);
  const hasList = runs.length > 0;
  return {
    runs,
    state,
    scope: hasList ? { runIds, attempts } : {},
    selectedCount: hasList ? runIds.length : null,
    unselectedIds: runs.map((run) => run.runId).filter((id) => !runIds.includes(id)),
    toggleRun: (run) => setState((prev) => toggleRun(prev, run)),
    toggleAttempt: (run, key) => setState((prev) => toggleAttempt(prev, run, key)),
    setAll: (on) => setState(selectAll(runs, on)),
  };
}
