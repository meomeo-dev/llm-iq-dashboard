"use client";

import { useEffect, useState } from "react";
import type { CallProgress, LaneProgress, ProgressView } from "@/core/progress";
import { orderProfileNames, profileLabel, type ProfileView } from "@/core/profile-view";
import { DEFAULT_PROFILE } from "@/core/types";
import { Menu } from "../menu/Menu";
import { profileColor } from "../profile/profile-color";
import { useProfiles } from "../profile/profiles-context";
import { StopRunButton } from "../run-control/StopRunButton";
import { formatZonedClock } from "../timeline/zoned-time";
import type { JudgeItemProgress, JudgingProgress } from "@/core/progress";
import {
  allCalls,
  countCalls,
  countJudging,
  elapsedMs,
  formatElapsed,
  isActivePhase,
  isTicking,
  phaseOf,
  promptTag,
  runClock,
  runElapsedMs,
  type RunPhase,
} from "./run-phase";
import { useRunProgress } from "./useRunProgress";

const PHASE_TEXT: Record<RunPhase, string> = {
  running: "执行中",
  stopping: "正在停止",
  interrupted: "已中断",
  finished: "已完成",
  cancelled: "已停止",
  judging: "评审中",
};

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
  const runs = useRunProgress();
  // 面板打开时每秒刷新执行中调用的时长；关闭时不重绘
  const now = useTicker(open);
  const primary = runs?.find((run) => {
    const phase = phaseOf(run, now);
    return isTicking(phase);
  }) ?? runs?.[0];

  return (
    <Menu label={<Pill run={primary} now={now} />} align="right" panelClassName="run-panel" open={open} onToggle={onToggle} onClose={onClose}>
      <div className="run-panel-head-bar">
        <span className="run-panel-title">执行进度与状态</span>
        <button type="button" className="run-panel-close-btn" onClick={onClose} aria-label="关闭">
          ✕
        </button>
      </div>
      <div className="run-panel-scroll">
        {runs === null && <p className="run-empty">正在读取执行进度…</p>}
        {runs?.length === 0 && <p className="run-empty">暂无运行</p>}
        {runs?.map((run) => <RunSection owner={owner} key={run.runId} run={run} now={now} timeZone={timeZone} />)}
      </div>
    </Menu>
  );
}

function Pill({ run, now }: { run: ProgressView | undefined; now: number }) {
  const phase = run === undefined ? "finished" : phaseOf(run, now);
  if (run !== undefined && phase === "judging" && run.judging) {
    const judging = countJudging(run.judging.items);
    return (
      <span className="run-pill">
        <span className="run-dot judging" aria-hidden="true" />
        评审中 {judging.done + judging.failed}/{judging.total}
      </span>
    );
  }
  if (run === undefined || !isActivePhase(phase)) {
    return (
      <span className="run-pill">
        <span className="run-dot idle" aria-hidden="true" />
        空闲
      </span>
    );
  }
  const counts = countCalls(allCalls(run));
  return (
    <span className="run-pill">
      <span className={`run-dot ${phase}`} aria-hidden="true" />
      {PHASE_TEXT[phase]} {counts.done}/{counts.total}
    </span>
  );
}

function RunSection({ run, now, timeZone, owner }: { run: ProgressView; now: number; timeZone: string; owner: boolean }) {
  const phase = phaseOf(run, now);
  // 停表后（中断、已完成、已停止）残留的「执行中」条目改显示已中断，计时停在最后一次更新
  const clock: Clock = { at: runClock(run, phase, now), ticking: isTicking(phase) };
  const counts = countCalls(allCalls(run));
  const trigger = run.trigger === "schedule" ? "定时" : "手动";
  return (
    <section className="run-section">
      <header className="run-head">
        <span className={`run-dot ${phase}`} aria-hidden="true" />
        <b>{PHASE_TEXT[phase]}</b>
        <span>
          {formatZonedClock(new Date(run.startedAt), timeZone)} 开始 · {trigger} · 用时{" "}
          {formatElapsed(runElapsedMs(run, phase, now))}
        </span>
        <span className="run-head-count">
          {counts.done}/{counts.total} · 成功 {counts.ok}
        </span>
      </header>
      <Bar ratio={counts.done / Math.max(1, counts.total)} />
      {owner && isActivePhase(phase) && (
        <div className="run-actions">
          <StopRunButton runId={run.runId} stopping={phase === "stopping"} />
        </div>
      )}
      {phase === "interrupted" && <p className="run-warn">执行进程已不在，本轮没有跑完；已完成的结果照常保留。</p>}
      {phase === "stopping" && <p className="run-warn">正在停止：不再发起排队中的调用，执行中的调用终止后本轮即结束。</p>}
      {phase === "cancelled" && (
        <p className="run-warn">本轮已手动停止，{counts.cancelled} 个调用未完成、不计入结果；停止前完成的结果照常保留。</p>
      )}
      {run.budgetStop != null && <p className="run-warn">{run.budgetStop}，其余调用未发起。</p>}
      {run.judging != null && <JudgingSection judging={run.judging} phase={phase} clock={clock} />}
      <p className="run-note">{run.lanes.length} 个模型分道，同时最多 {run.laneLimit} 道；道内按强度从低到高串行</p>
      <LaneGroups lanes={run.lanes} clock={clock} />
    </section>
  );
}

export interface LaneGroup {
  /** `default` 为登录态 */
  profile: string;
  lanes: LaneProgress[];
}

/** 分道按上游分组：登录态在前，其余按配置顺序；组内保持进度文件里的道序 */
export function groupLanes(lanes: readonly LaneProgress[], profiles: readonly ProfileView[]): LaneGroup[] {
  const upstream = (lane: LaneProgress): string => lane.profile ?? DEFAULT_PROFILE;
  return orderProfileNames(lanes.map(upstream), profiles).map((profile) => ({
    profile,
    lanes: lanes.filter((lane) => upstream(lane) === profile),
  }));
}

/** 只有登录态时不出现组标题，面板与引入上游之前相同 */
function LaneGroups({ lanes, clock }: { lanes: readonly LaneProgress[]; clock: Clock }) {
  const { profiles } = useProfiles();
  const groups = groupLanes(lanes, profiles);
  const grouped = groups.length > 1 || groups.some((group) => group.profile !== DEFAULT_PROFILE);
  return (
    <>
      {groups.map((group) => (
        <div key={group.profile} className="run-group">
          {grouped && (
            <div className="run-group-head">
              {group.profile !== DEFAULT_PROFILE && (
                <span className="profile-dot" style={{ background: profileColor(group.profile) }} aria-hidden="true" />
              )}
              {profileLabel(group.profile, profiles)}
            </div>
          )}
          {group.lanes.map((lane) => (
            <Lane key={`${lane.cli}/${group.profile}/${lane.model}`} lane={lane} clock={clock} />
          ))}
        </div>
      ))}
    </>
  );
}

function Lane({ lane, clock }: { lane: LaneProgress; clock: Clock }) {
  const counts = countCalls(lane.calls);
  return (
    <div className="run-lane">
      <div className="run-lane-head">
        <span>
          {lane.cli} · {lane.model}
        </span>
        <span className="run-lane-count">
          {counts.done}/{counts.total}
        </span>
      </div>
      <div className="run-calls">
        {lane.calls.map((call) => (
          <Call key={`${call.targetId}/${call.promptId}`} call={call} clock={clock} />
        ))}
      </div>
    </div>
  );
}

/** 条目计时用的时钟：at 为计时终点，ticking 为假时进度文件里的「执行中」实为已中断 */
interface Clock {
  at: number;
  ticking: boolean;
}

function Call({ call, clock }: { call: CallProgress; clock: Clock }) {
  const elapsed = elapsedMs(call, clock.at);
  const stranded = call.state === "running" && !clock.ticking;
  // 不复用卡片的 status-* 类（会给整段文字染色），这里只给左边框着色
  const tone = stranded ? "interrupted" : call.state === "done" ? `done-${call.status ?? "error"}` : call.state;
  return (
    <span className={`run-call ${tone}`} title={`${call.targetId} @${call.promptId}`}>
      <span className="run-call-name">
        {call.effort} · {promptTag(call.promptId)}
      </span>
      <span className="run-call-time">
        {call.state === "queued" && "排队"}
        {stranded && "已中断"}
        {call.state === "running" && !stranded && `${formatElapsed(elapsed)} / ${formatElapsed(call.timeoutMs)}`}
        {call.state === "done" && formatElapsed(elapsed)}
        {call.state === "cancelled" && "已取消"}
      </span>
      {call.state === "running" && !stranded && <Bar ratio={elapsed / call.timeoutMs} />}
    </span>
  );
}

/** AI 层评审队列（ACR-020）：逐件列出排队 / 评审中 / 结论；进程中途消失时提示未评完 */
function JudgingSection({ judging, phase, clock }: { judging: JudgingProgress; phase: RunPhase; clock: Clock }) {
  const counts = countJudging(judging.items);
  const interrupted = judging.finishedAt === null && phase !== "judging";
  return (
    <div className="run-judging">
      <div className="run-lane-head">
        <span>AI 层评审 · 每件先盲描述再按 C5–C9 打分</span>
        <span className="run-lane-count">
          {counts.done + counts.failed}/{counts.total}
        </span>
      </div>
      {interrupted && <p className="run-warn">评审进程已不在，没评完的作品待执行器下次启动时续评。</p>}
      <div className="run-calls">
        {judging.items.map((item) => <JudgeItem key={item.attemptKey} item={item} clock={clock} />)}
      </div>
    </div>
  );
}

const VERDICT_TEXT: Record<string, string> = { online: "智商在线", degraded: "降智", pending: "待复核" };

function JudgeItem({ item, clock }: { item: JudgeItemProgress; clock: Clock }) {
  const elapsed = item.durationMs ?? (item.startedAt === null ? 0 : Math.max(0, clock.at - Date.parse(item.startedAt)));
  const stranded = item.state === "running" && !clock.ticking;
  const tone = stranded ? "interrupted" : item.state === "done" ? `done-${item.verdict === "online" ? "ok" : "error"}` : item.state === "failed" ? "done-error" : item.state;
  return (
    <span className={`run-call ${tone}`} title={item.note ?? item.attemptKey}>
      <span className="run-call-name">{item.targetId.split("__").slice(2).join(" · ")} · {promptTag(item.promptId)}</span>
      <span className="run-call-time">
        {item.state === "queued" && "排队"}
        {stranded && "已中断"}
        {item.state === "running" && !stranded && `评审中 ${formatElapsed(elapsed)}`}
        {item.state === "done" && `${VERDICT_TEXT[item.verdict ?? ""] ?? item.verdict} ${item.score} · ${formatElapsed(elapsed)}`}
        {item.state === "failed" && "未评"}
      </span>
      {item.state === "failed" && item.note !== null && <span className="run-call-note">{item.note}</span>}
    </span>
  );
}

function Bar({ ratio }: { ratio: number }) {
  const percent = Math.min(100, Math.max(0, ratio * 100));
  return (
    <span className="run-bar" aria-hidden="true">
      <span className="run-bar-fill" style={{ width: `${percent}%` }} />
    </span>
  );
}

/** 启用时每秒更新一次“现在”；停用时停在最后一次的值 */
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
