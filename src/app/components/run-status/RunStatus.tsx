"use client";

import { useEffect, useState } from "react";
import type { ProgressView } from "@/core/progress";
import { useI18n, type Locale } from "@/i18n";
import { Menu } from "../menu/Menu";
import { StopRunButton } from "../run-control/StopRunButton";
import { formatZonedClock } from "../timeline/zoned-time";
import {
  allCalls,
  countCalls,
  countJudging,
  formatElapsed,
  isActivePhase,
  isTicking,
  localizeBudgetStop,
  phaseOf,
  runClock,
  runElapsedMs,
  type RunPhase,
} from "./run-phase";
import { Bar, groupLanes, JudgingSection, LaneGroups, type Clock, type LaneGroup } from "./RunStatusLanes";
import { useRunProgress } from "./useRunProgress";

export { groupLanes, type LaneGroup };

const PHASE_TEXT: Record<RunPhase, string> = {
  running: "执行中",
  stopping: "正在停止",
  interrupted: "已中断",
  finished: "已完成",
  cancelled: "已停止",
  judging: "评审中",
};

const PHASE_TEXT_EN: Record<RunPhase, string> = {
  running: "Running",
  stopping: "Stopping",
  interrupted: "Interrupted",
  finished: "Finished",
  cancelled: "Cancelled",
  judging: "Judging",
};

function phaseText(phase: RunPhase, locale: Locale): string {
  return locale === "en" ? PHASE_TEXT_EN[phase] : PHASE_TEXT[phase];
}

interface RunStatusProps {
  timeZone: string;
  /** 所有者才显示停止按钮 */
  owner: boolean;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
}

/**
 * 工具栏上的执行状态：胶囊显示当前轮次的完成数，展开后按模型分道列出每次调用
 * 排队 / 执行中 / 已完成的状态、已用时长与超时上限。
 */
export function RunStatus({ timeZone, owner, open, onToggle, onClose }: RunStatusProps) {
  const { locale, t } = useI18n();
  const isEn = locale === "en";
  const runs = useRunProgress();
  const now = useTicker(open);
  const primary =
    runs?.find((run) => {
      const phase = phaseOf(run, now);
      return isTicking(phase);
    }) ?? runs?.[0];

  return (
    <Menu
      label={<Pill run={primary} now={now} locale={locale} />}
      align="right"
      panelClassName="run-panel"
      open={open}
      onToggle={onToggle}
      onClose={onClose}
    >
      <div className="run-panel-head-bar">
        <span className="run-panel-title">{isEn ? "Execution Progress & Status" : "执行进度与状态"}</span>
        <button
          type="button"
          className="run-panel-close-btn"
          onClick={onClose}
          aria-label={t.common.actions.close}
        >
          ✕
        </button>
      </div>
      <div className="run-panel-scroll">
        {runs === null && (
          <p className="run-empty">{isEn ? "Loading execution progress…" : "正在读取执行进度…"}</p>
        )}
        {runs?.length === 0 && <p className="run-empty">{isEn ? "No active or recent runs" : "暂无运行"}</p>}
        {runs?.map((run) => (
          <RunSection
            owner={owner}
            key={run.runId}
            run={run}
            now={now}
            timeZone={timeZone}
            locale={locale}
          />
        ))}
      </div>
    </Menu>
  );
}

function Pill({ run, now, locale }: { run: ProgressView | undefined; now: number; locale: Locale }) {
  const isEn = locale === "en";
  const phase = run === undefined ? "finished" : phaseOf(run, now);
  if (run !== undefined && phase === "judging" && run.judging) {
    const judging = countJudging(run.judging.items);
    return (
      <span className="run-pill">
        <span className="run-dot judging" aria-hidden="true" />
        {isEn ? "Judging" : "评审中"} {judging.done + judging.failed}/{judging.total}
      </span>
    );
  }
  if (run === undefined || !isActivePhase(phase)) {
    return (
      <span className="run-pill">
        <span className="run-dot idle" aria-hidden="true" />
        {isEn ? "Idle" : "空闲"}
      </span>
    );
  }
  const counts = countCalls(allCalls(run));
  return (
    <span className="run-pill">
      <span className={`run-dot ${phase}`} aria-hidden="true" />
      {phaseText(phase, locale)} {counts.done}/{counts.total}
    </span>
  );
}

function RunSection({
  run,
  now,
  timeZone,
  owner,
  locale,
}: {
  run: ProgressView;
  now: number;
  timeZone: string;
  owner: boolean;
  locale: Locale;
}) {
  const isEn = locale === "en";
  const phase = phaseOf(run, now);
  const clock: Clock = { at: runClock(run, phase, now), ticking: isTicking(phase) };
  const counts = countCalls(allCalls(run));
  const trigger = run.trigger === "schedule" ? (isEn ? "Scheduled" : "定时") : isEn ? "Manual" : "手动";
  return (
    <section className="run-section">
      <header className="run-head">
        <span className={`run-dot ${phase}`} aria-hidden="true" />
        <b>{phaseText(phase, locale)}</b>
        <span>
          {isEn
            ? `Started ${formatZonedClock(new Date(run.startedAt), timeZone)} · ${trigger} · Elapsed ${formatElapsed(runElapsedMs(run, phase, now))}`
            : `${formatZonedClock(new Date(run.startedAt), timeZone)} 开始 · ${trigger} · 用时 ${formatElapsed(runElapsedMs(run, phase, now))}`}
        </span>
        <span className="run-head-count">
          {counts.done}/{counts.total} · {isEn ? `OK ${counts.ok}` : `成功 ${counts.ok}`}
        </span>
      </header>
      <Bar ratio={counts.done / Math.max(1, counts.total)} />
      {owner && isActivePhase(phase) && (
        <div className="run-actions">
          <StopRunButton runId={run.runId} stopping={phase === "stopping"} />
        </div>
      )}
      {phase === "interrupted" && (
        <p className="run-warn">
          {isEn
            ? "Runner process is no longer active; completed results are preserved."
            : "执行进程已不在，本轮没有跑完；已完成的结果照常保留。"}
        </p>
      )}
      {phase === "stopping" && (
        <p className="run-warn">
          {isEn
            ? "Stopping: queued calls are skipped and the round ends once active calls terminate."
            : "正在停止：不再发起排队中的调用，执行中的调用终止后本轮即结束。"}
        </p>
      )}
      {phase === "cancelled" && (
        <p className="run-warn">
          {isEn
            ? `Stopped manually; ${counts.cancelled} calls were cancelled and completed results are preserved.`
            : `本轮已手动停止，${counts.cancelled} 个调用未完成、不计入结果；停止前完成的结果照常保留。`}
        </p>
      )}
      {run.budgetStop != null && (
        <p className="run-warn">
          {isEn ? `${localizeBudgetStop(run.budgetStop, locale)}; remaining calls were not started.` : `${run.budgetStop}，其余调用未发起。`}
        </p>
      )}
      {run.judging != null && <JudgingSection judging={run.judging} phase={phase} clock={clock} locale={locale} />}
      <p className="run-note">
        {isEn
          ? `${run.lanes.length} model lanes (up to ${run.laneLimit} concurrent); efforts run sequentially from low to max per lane`
          : `${run.lanes.length} 个模型分道，同时最多 ${run.laneLimit} 道；道内按强度从低到高串行`}
      </p>
      <LaneGroups lanes={run.lanes} clock={clock} locale={locale} />
    </section>
  );
}

function useTicker(enabled: boolean): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!enabled) return;
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [enabled]);
  return now;
}
