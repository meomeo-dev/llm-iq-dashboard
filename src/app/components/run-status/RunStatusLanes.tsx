"use client";

import type { CallProgress, JudgeItemProgress, JudgingProgress, LaneProgress } from "@/core/progress";
import { orderProfileNames, profileLabel, type ProfileView } from "@/core/profile-view";
import { DEFAULT_PROFILE } from "@/core/types";
import type { Locale } from "@/i18n";
import { judgeText } from "../card/card-format";
import { profileColor } from "../profile/profile-color";
import { useProfiles } from "../profile/profiles-context";
import {
  countCalls,
  countJudging,
  elapsedMs,
  formatElapsed,
  localizeJudgeItemNote,
  promptTag,
  type RunPhase,
} from "./run-phase";

/** 条目计时用的时钟：at 为计时终点，ticking 为假时进度文件里的「执行中」实为已中断 */
export interface Clock {
  at: number;
  ticking: boolean;
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
export function LaneGroups({
  lanes,
  clock,
  locale,
}: {
  lanes: readonly LaneProgress[];
  clock: Clock;
  locale: Locale;
}) {
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
              {profileLabel(group.profile, profiles, locale)}
            </div>
          )}
          {group.lanes.map((lane) => (
            <Lane key={`${lane.cli}/${group.profile}/${lane.model}`} lane={lane} clock={clock} locale={locale} />
          ))}
        </div>
      ))}
    </>
  );
}

function Lane({ lane, clock, locale }: { lane: LaneProgress; clock: Clock; locale: Locale }) {
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
          <Call key={`${call.targetId}/${call.promptId}`} call={call} clock={clock} locale={locale} />
        ))}
      </div>
    </div>
  );
}

function Call({ call, clock, locale }: { call: CallProgress; clock: Clock; locale: Locale }) {
  const isEn = locale === "en";
  const elapsed = elapsedMs(call, clock.at);
  const stranded = call.state === "running" && !clock.ticking;
  const tone = stranded ? "interrupted" : call.state === "done" ? `done-${call.status ?? "error"}` : call.state;
  return (
    <span className={`run-call ${tone}`} title={`${call.targetId} @${call.promptId}`}>
      <span className="run-call-name">
        {call.effort} · {promptTag(call.promptId)}
      </span>
      <span className="run-call-time">
        {call.state === "queued" && (isEn ? "Queued" : "排队")}
        {stranded && (isEn ? "Interrupted" : "已中断")}
        {call.state === "running" && !stranded && `${formatElapsed(elapsed)} / ${formatElapsed(call.timeoutMs)}`}
        {call.state === "done" && formatElapsed(elapsed)}
        {call.state === "cancelled" && (isEn ? "Cancelled" : "已取消")}
      </span>
      {call.state === "running" && !stranded && <Bar ratio={elapsed / call.timeoutMs} />}
    </span>
  );
}

/** AI 层评审队列（ACR-020）：逐件列出排队 / 评审中 / 结论；进程中途消失时提示未评完 */
export function JudgingSection({
  judging,
  phase,
  clock,
  locale,
}: {
  judging: JudgingProgress;
  phase: RunPhase;
  clock: Clock;
  locale: Locale;
}) {
  const isEn = locale === "en";
  const counts = countJudging(judging.items);
  const interrupted = judging.finishedAt === null && phase !== "judging";
  return (
    <div className="run-judging">
      <div className="run-lane-head">
        <span>
          {isEn
            ? "AI Judge · Blind description followed by C5–C9 scoring"
            : "AI 层评审 · 每件先盲描述再按 C5–C9 打分"}
        </span>
        <span className="run-lane-count">
          {counts.running > 0 && (isEn ? `${counts.running} judging · ` : `${counts.running} 件评审中 · `)}
          {counts.done + counts.failed}/{counts.total}
        </span>
      </div>
      {interrupted && (
        <p className="run-warn">
          {isEn
            ? "Judge process exited early; remaining items will resume on next runner start."
            : "评审进程已不在，没评完的作品待执行器下次启动时续评。"}
        </p>
      )}
      <div className="run-calls">
        {judging.items.map((item) => (
          <JudgeItem key={item.attemptKey} item={item} clock={clock} locale={locale} />
        ))}
      </div>
    </div>
  );
}

function JudgeItem({ item, clock, locale }: { item: JudgeItemProgress; clock: Clock; locale: Locale }) {
  const isEn = locale === "en";
  const elapsed = item.durationMs ?? (item.startedAt === null ? 0 : Math.max(0, clock.at - Date.parse(item.startedAt)));
  const stranded = item.state === "running" && !clock.ticking;
  const tone = stranded
    ? "interrupted"
    : item.state === "done"
      ? `done-${item.verdict === "online" ? "ok" : "error"}`
      : item.state === "failed"
        ? "done-error"
        : item.state;
  const verdictLabel =
    item.verdict === "online" || item.verdict === "degraded" || item.verdict === "pending"
      ? judgeText(item.verdict, locale)
      : (item.verdict ?? "");
  const note = localizeJudgeItemNote(item.note, locale);
  return (
    <span className={`run-call ${tone}`} title={note ?? item.attemptKey}>
      <span className="run-call-name">
        {item.targetId.split("__").slice(2).join(" · ")} · {promptTag(item.promptId)}
      </span>
      <span className="run-call-time">
        {item.state === "queued" && (isEn ? "Queued" : "排队")}
        {stranded && (isEn ? "Interrupted" : "已中断")}
        {item.state === "running" && !stranded && (isEn ? `Judging ${formatElapsed(elapsed)}` : `评审中 ${formatElapsed(elapsed)}`)}
        {item.state === "done" && `${verdictLabel} ${item.score} · ${formatElapsed(elapsed)}`}
        {item.state === "failed" && (isEn ? "Skipped" : "未评")}
      </span>
      {item.state === "failed" && note !== null && <span className="run-call-note">{note}</span>}
    </span>
  );
}

export function Bar({ ratio }: { ratio: number }) {
  const percent = Math.min(100, Math.max(0, ratio * 100));
  return (
    <span className="run-bar" aria-hidden="true">
      <span className="run-bar-fill" style={{ width: `${percent}%` }} />
    </span>
  );
}
