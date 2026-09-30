/**
 * 待导出轮次的勾选状态：缺省全选；状态刷新后保留已有选择、新出现的轮次默认勾上、消失的去掉。
 */

import { useEffect, useMemo, useState } from "react";
import type { DataRepoStatus, PendingRun } from "@/core/sync/data-repo-panel-types";

export interface PendingSelection {
  runs: PendingRun[];
  selected: ReadonlySet<string>;
  /** 勾选的 runId；全选时也原样给出，由调用方决定要不要随请求发 */
  selectedIds: string[];
  /** 有勾选清单时导出与演练只带勾选的轮次；旧状态快照没有清单时为 undefined，按全部处理 */
  runIds: string[] | undefined;
  /** 进导出按钮文案的勾选数；没有清单时为 null */
  selectedCount: number | null;
  toggle: (runId: string) => void;
  setAll: (on: boolean) => void;
}

export function usePendingSelection(status: DataRepoStatus | null): PendingSelection {
  const runs = useMemo(() => status?.local.pendingRuns ?? [], [status]);
  const [selected, setSelected] = useState<ReadonlySet<string>>(() => new Set(runs.map((run) => run.runId)));
  const [seen, setSeen] = useState<ReadonlySet<string>>(() => new Set(runs.map((run) => run.runId)));

  useEffect(() => {
    const ids = runs.map((run) => run.runId);
    setSelected((prev) => new Set(ids.filter((id) => prev.has(id) || !seen.has(id))));
    setSeen(new Set(ids));
    // seen 只在这里随 runs 更新，不作为依赖，否则会与自身的 setSeen 互相触发
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runs]);

  const selectedIds = runs.map((run) => run.runId).filter((id) => selected.has(id));
  const hasList = runs.length > 0;
  return {
    runs,
    selected,
    selectedIds,
    runIds: hasList ? selectedIds : undefined,
    selectedCount: hasList ? selectedIds.length : null,
    toggle: (runId) =>
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(runId)) next.delete(runId);
        else next.add(runId);
        return next;
      }),
    setAll: (on) => setSelected(on ? new Set(runs.map((run) => run.runId)) : new Set()),
  };
}
