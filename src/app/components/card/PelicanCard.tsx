"use client";

import { profileLabel } from "@/core/profile-view";
import type { DashboardCard } from "@/core/types";
import { useLiveProgress } from "../live-state/live-store";
import { profileColor } from "../profile/profile-color";
import { useProfiles } from "../profile/profiles-context";
import { pendingJudgeState } from "../run-status/run-phase";
import { formatZonedDateTime } from "../timeline/zoned-time";
import { LazySvgFrame } from "./LazySvgFrame";
import {
  costTitle, formatBytes, formatCost, formatDuration, JUDGE_TEXT, judgeCostBrief, judgeCostLine, judgeTitle, PENDING_JUDGE_TEXT,
  rawSvgHref, STATUS_TEXT, viewHref,
} from "./card-format";

/**
 * 单次调用的结果卡片。表头、图框、页脚各自定高（见 cards.css），失败时用同尺寸
 * 图框说明原因，并排比较时高度差不会被误读为结果多寡。
 */
export function PelicanCard({ card, timeZone }: { card: DashboardCard; timeZone: string }) {
  // 抽出了 SVG 才有作品地址；源码在进入视口时再取（见 ACR-003）
  const art = rawSvgHref(card);
  const isRedacted = card.status === "ok" && card.svgFile === null;
  return (
    <article className="card">
      <CardHeader card={card} timeZone={timeZone} />

      {art !== null ? (
        <ArtFrame card={card} art={art} />
      ) : isRedacted ? (
        <RedactedFrame card={card} />
      ) : (
        <FailureFrame card={card} />
      )}

      <CardFooter card={card} isRedacted={isRedacted} />
    </article>
  );
}

/** 目标显示名与徽章内容重复，不单列一行，只放在表头的悬停提示里 */
function CardHeader({ card, timeZone }: { card: DashboardCard; timeZone: string }) {
  return (
    <header title={card.label}>
      {/* 执行时刻作主标题，用于区分结果来自哪一轮 */}
      <h2 className="timestamp" suppressHydrationWarning>
        {formatZonedDateTime(new Date(card.startedAt), timeZone)}
      </h2>
      <div className="badges">
        <span className="badge cli">{card.cli}</span>
        <span className="badge">{card.model}</span>
        <EffortBadge card={card} />
        {card.profile !== undefined && <ProfileBadge name={card.profile} />}
        <span className="badge prompt-id">{card.promptId}</span>
        {/* 变量取值上徽章：不知道本轮问的是什么动物就无法判读作品 */}
        {Object.entries(card.bindings).map(([name, value]) => (
          <span key={name} className="badge binding" title={`${name}: ${value}`}>
            {name}: {value}
          </span>
        ))}
      </div>
    </header>
  );
}

function CardFooter({ card, isRedacted }: { card: DashboardCard; isRedacted: boolean }) {
  const href = viewHref(card);
  return (
    <footer>
      <div className="footer-row">
        <span className={`status-text ${isRedacted ? "status-redacted" : `status-${card.status}`}`}>
          {isRedacted ? "已脱敏，未发布" : STATUS_TEXT[card.status]}
        </span>
        {/* 评审结论紧跟状态：成功与否、智商在线与否是一眼要看的两件事；旧记录与远程数据源没有 judge 字段，按无评审处理 */}
        {card.judge != null && <JudgeTag card={card} judge={card.judge} judgeCost={card.judgeCost ?? null} />}
        {href !== null && (
          <a className="card-open" href={href} target="_blank" rel="noopener" title="在新标签页单独查看大图">
            大图 ↗
          </a>
        )}
      </div>
      <div className="footer-row">
        <span>耗时 {formatDuration(card.durationMs)}</span>
        <span className="card-cost" title={costTitle(card)}>
          {card.profile !== undefined && "官价 "}
          {formatCost(card.cost)}
        </span>
        {card.svgBytes !== null && <span>{formatBytes(card.svgBytes)}</span>}
        <span>{card.trigger === "schedule" ? "定时" : "手动"}</span>
      </div>
      {/* 裁判成本与作品成本分开列：作品那格是生成 SVG 的钱，这一行是 AI 层评审的钱；最窄的卡片也放得下 */}
      {card.judgeCost != null && (
        <div className="footer-row judge-cost" title={judgeCostLine(card.judgeCost) ?? ""}>{judgeCostBrief(card.judgeCost)}</div>
      )}
    </footer>
  );
}

/** 评审标签（ACR-019）：标签 + 总分，悬停看逐条闸门与标准 */
function JudgeTag({ card, judge, judgeCost }: { card: DashboardCard; judge: NonNullable<DashboardCard["judge"]>; judgeCost: DashboardCard["judgeCost"] }) {
  // 待复核且还在本轮的 AI 评审队列里：显示排队 / 评审中 / 中断，出分后推送触发整页刷新换成结论
  const live = judge.total.verdict === "pending" ? pendingJudgeState(useLiveProgress(), card.runId, judge.subject.attemptKey, Date.now()) : null;
  if (live !== null) {
    return (
      <span className={`judge-tag judge-${live === "interrupted" ? "interrupted" : "judging"}`} title={PENDING_JUDGE_TEXT[live].title}>
        {PENDING_JUDGE_TEXT[live].label}
      </span>
    );
  }
  return (
    <span className={`judge-tag judge-${judge.total.verdict}`} title={judgeTitle(judge, judgeCost)}>
      {JUDGE_TEXT[judge.total.verdict]} {judge.total.score}
    </span>
  );
}

/** 上游徽章：色点与进度面板、时间线同色；登录态（无 profile）不出徽章 */
function ProfileBadge({ name }: { name: string }) {
  const { profiles } = useProfiles();
  const label = profileLabel(name, profiles);
  return (
    <span className="badge profile" title={`上游：${label}`}>
      <span className="profile-dot" style={{ background: profileColor(name) }} aria-hidden="true" />
      {label}
    </span>
  );
}

/**
 * 强度徽章，区分三种情形：
 * - 正常：按请求档位运行；
 * - 折叠：模型不支持所请求的档位，按更低档位运行；
 * - 不可调：模型不接受强度参数，配置中的 effort 仅作分组标签。
 */
function EffortBadge({ card }: { card: DashboardCard }) {
  if (!card.effortHonored) {
    return (
      <span
        className="badge folded"
        title="该模型不支持调节思考强度，配置中的 effort 仅用于分组"
      >
        强度不可调
      </span>
    );
  }

  const folded = card.appliedEffort !== card.effort;
  return (
    <span
      className={`badge${folded ? " folded" : ""}`}
      title={folded ? `请求 ${card.effort}，该模型仅支持到 ${card.appliedEffort}` : undefined}
    >
      effort: {folded ? `${card.effort} → ${card.appliedEffort}` : card.effort}
    </span>
  );
}

/** 作品框也是入口：点击在新标签页查看大图 */
function ArtFrame({ card, art }: { card: DashboardCard; art: string }) {
  const href = viewHref(card);
  const frame = <LazySvgFrame href={art} className="card-frame" />;
  if (href === null) return frame;
  return (
    <a className="card-frame-link" href={href} target="_blank" rel="noopener" title="单独查看大图">
      {frame}
    </a>
  );
}

/** 失败时占据与作品同尺寸的图框，卡片不缩水 */
function FailureFrame({ card }: { card: DashboardCard }) {
  const reason = card.error ?? STATUS_TEXT[card.status];
  return (
    <div className={`frame card-frame frame-failed failed-${card.status}`} title={reason}>
      <span className="failure-status">{STATUS_TEXT[card.status]}</span>
      <p>{reason}</p>
    </div>
  );
}

/** 作品脱敏未发布时显示说明框 */
function RedactedFrame({ card }: { card: DashboardCard }) {
  const reason = card.error ?? "已脱敏，未发布";
  return (
    <div className="frame card-frame frame-redacted" title={reason}>
      <span className="redacted-status">已脱敏，未发布</span>
      <p>{reason}</p>
    </div>
  );
}
