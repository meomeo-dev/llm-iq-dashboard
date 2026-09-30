import React, { useEffect, useRef, useState } from "react";
import type { PendingAttempt, PendingRun } from "@/core/sync/data-repo-panel-types";
import { isAttemptPicked, runPick, type SelectionState } from "./pending-selection-model";

const STATUS_LABELS: Record<string, string> = { ok: "成功", "no-svg": "无 SVG", error: "失败", timeout: "超时" };

/** runId 形如 20260929T150913Z，显示为 2026-09-29 15:09 UTC */
export function formatRunIdTime(runId: string): string {
  const m = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})\d{2}Z$/.exec(runId);
  if (m === null) return runId;
  return `${m[1]}-${m[2]}-${m[3]} ${m[4]}:${m[5]} UTC`;
}

/** 看板上这一轮所在那天的时间线；runId 不合法时为 null */
export function dashboardDayHref(runId: string): string | null {
  const m = /^(\d{4})(\d{2})(\d{2})T/.exec(runId);
  return m === null ? null : `/?day=${m[1]}-${m[2]}-${m[3]}`;
}

export function artHref(runId: string, svgFile: string): string {
  return `/art/${encodeURIComponent(runId)}/${encodeURIComponent(svgFile)}`;
}

interface PendingRunRowProps {
  run: PendingRun;
  state: SelectionState;
  disabled: boolean;
  onToggleRun: (run: PendingRun) => void;
  onToggleAttempt: (run: PendingRun, key: string) => void;
  onDiscard: (runIds: string[]) => void;
}

/** 待导出的一轮：勾选、摘要与动作一行，展开后逐次调用预览并可单独勾选 */
export function PendingRunRow({ run, state, disabled, onToggleRun, onToggleAttempt, onDiscard }: PendingRunRowProps) {
  const [open, setOpen] = useState(false);
  const pick = runPick(state, run);
  const items = run.items ?? [];
  const dayHref = dashboardDayHref(run.runId);
  return (
    <li className={pick === "none" ? "unselected" : ""}>
      <div className="data-repo-pending-row">
        <label>
          <TriStateCheckbox pick={pick} disabled={disabled} onChange={() => onToggleRun(run)} />
          <span className="data-repo-pending-time">{formatRunIdTime(run.runId)}</span>
          <code className="data-repo-pending-id">{run.runId}</code>
          <span className="data-repo-pending-prompts">{run.promptIds.join("、") || "（无题目记录）"}</span>
          <span className="data-repo-pending-count">成功 {run.ok}/{run.attempts}</span>
          {run.profiles.length > 0 && (
            <span className="data-repo-pending-profiles">上游 {run.profiles.join("、")}</span>
          )}
        </label>
        <span className="data-repo-pending-actions">
          {items.length > 0 && (
            <button type="button" className="data-repo-link-button" onClick={() => setOpen(!open)}>
              {open ? "收起" : `预览 ${items.length} 次调用`}
            </button>
          )}
          {dayHref !== null && <a href={dayHref} target="_blank" rel="noreferrer">在看板查看</a>}
          <button type="button" className="data-repo-link-button" disabled={disabled} onClick={() => onDiscard([run.runId])}>
            丢弃
          </button>
        </span>
      </div>
      {open && (
        <ul className="data-repo-pending-attempts">
          {items.map((item) => (
            <AttemptTile
              key={item.key}
              runId={run.runId}
              item={item}
              picked={isAttemptPicked(state, run.runId, item.key)}
              disabled={disabled}
              onToggle={() => onToggleAttempt(run, item.key)}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

/** 整轮 / 部分 / 未勾选三态；部分勾选用原生 indeterminate 呈现 */
function TriStateCheckbox({ pick, disabled, onChange }: { pick: string; disabled: boolean; onChange: () => void }) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current !== null) ref.current.indeterminate = pick === "some";
  }, [pick]);
  return (
    <input
      ref={ref}
      type="checkbox"
      checked={pick !== "none"}
      aria-checked={pick === "some" ? "mixed" : pick === "all"}
      disabled={disabled}
      onChange={onChange}
    />
  );
}

interface AttemptTileProps {
  runId: string;
  item: PendingAttempt;
  picked: boolean;
  disabled: boolean;
  onToggle: () => void;
}

/** 一次调用：作品缩略图（没有作品时显示结果），模型、强度、上游与题目 */
function AttemptTile({ runId, item, picked, disabled, onToggle }: AttemptTileProps) {
  const art = item.svgFile === null ? null : artHref(runId, item.svgFile);
  return (
    <li className={picked ? "" : "unselected"}>
      <label>
        <input type="checkbox" checked={picked} disabled={disabled} onChange={onToggle} />
        <span className="data-repo-attempt-thumb">
          {art !== null ? <img src={art} alt="" loading="lazy" /> : (
            <span className={`data-repo-attempt-status ${item.status}`}>{STATUS_LABELS[item.status] ?? item.status}</span>
          )}
        </span>
        <span className="data-repo-attempt-caption">
          <b>{item.model} · {item.effort}</b>
          <span>{item.profile ?? "登录态"}</span>
          <span>{item.promptId}</span>
          <span className={`data-repo-attempt-result ${item.status}`}>{STATUS_LABELS[item.status] ?? item.status}</span>
        </span>
      </label>
      {art !== null && <a href={art} target="_blank" rel="noreferrer">大图</a>}
    </li>
  );
}
