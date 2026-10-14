"use client";

import { profileLabel } from "@/core/profile-view";
import type { DashboardCard } from "@/core/types";
import { useI18n, type Locale } from "@/i18n";
import { useLiveProgress } from "../live-state/live-store";
import { profileColor } from "../profile/profile-color";
import { useProfiles } from "../profile/profiles-context";
import { pendingJudgeState } from "../run-status/run-phase";
import { formatZonedDateTime } from "../timeline/zoned-time";
import { LazySvgFrame } from "./LazySvgFrame";
import {
  costTitle,
  formatBindingBadge,
  formatBytes,
  formatCost,
  formatDuration,
  judgeCostBrief,
  judgeCostLine,
  judgeText,
  judgeTitle,
  localizeCardError,
  pendingJudgeText,
  rawSvgHref,
  statusText,
  viewHref,
} from "./card-format";

/**
 * 单次调用的结果卡片。表头、图框、页脚各自定高（见 cards.css），失败时用同尺寸
 * 图框说明原因，并排比较时高度差不会被误读为结果多寡。
 */
export function PelicanCard({ card, timeZone }: { card: DashboardCard; timeZone: string }) {
  const { locale } = useI18n();
  const art = rawSvgHref(card);
  const isRedacted = card.status === "ok" && card.svgFile === null;
  return (
    <article className="card">
      <CardHeader card={card} timeZone={timeZone} locale={locale} />

      {art !== null ? (
        <ArtFrame card={card} art={art} locale={locale} />
      ) : isRedacted ? (
        <RedactedFrame card={card} locale={locale} />
      ) : (
        <FailureFrame card={card} locale={locale} />
      )}

      <CardFooter card={card} isRedacted={isRedacted} locale={locale} />
    </article>
  );
}

/** 目标显示名与徽章内容重复，不单列一行，只放在表头的悬停提示里 */
function CardHeader({ card, timeZone, locale }: { card: DashboardCard; timeZone: string; locale: Locale }) {
  return (
    <header title={card.label}>
      <h2 className="timestamp" suppressHydrationWarning>
        {formatZonedDateTime(new Date(card.startedAt), timeZone)}
      </h2>
      <div className="badges">
        <span className="badge cli">{card.cli}</span>
        <span className="badge">{card.model}</span>
        <EffortBadge card={card} locale={locale} />
        {card.profile !== undefined && <ProfileBadge name={card.profile} locale={locale} />}
        <span className="badge prompt-id">{card.promptId}</span>
        {Object.entries(card.bindings).map(([name, value]) => {
          const badgeText = formatBindingBadge(name, value, locale);
          return (
            <span key={name} className="badge binding" title={badgeText}>
              {badgeText}
            </span>
          );
        })}
      </div>
    </header>
  );
}

function CardFooter({
  card,
  isRedacted,
  locale,
}: {
  card: DashboardCard;
  isRedacted: boolean;
  locale: Locale;
}) {
  const href = viewHref(card);
  const isEn = locale === "en";
  const redactedLabel = isEn ? "Redacted (Unpublished)" : "已脱敏，未发布";
  return (
    <footer>
      <div className="footer-row">
        <span className={`status-text ${isRedacted ? "status-redacted" : `status-${card.status}`}`}>
          {isRedacted ? redactedLabel : statusText(card.status, locale)}
        </span>
        {card.judge != null && (
          <JudgeTag card={card} judge={card.judge} judgeCost={card.judgeCost ?? null} locale={locale} />
        )}
        {href !== null && (
          <a
            className="card-open"
            href={href}
            target="_blank"
            rel="noopener"
            title={isEn ? "Open full artwork in new tab" : "在新标签页单独查看大图"}
          >
            {isEn ? "Full ↗" : "大图 ↗"}
          </a>
        )}
      </div>
      <div className="footer-row">
        <span>{isEn ? `Time ${formatDuration(card.durationMs)}` : `耗时 ${formatDuration(card.durationMs)}`}</span>
        <span className="card-cost" title={costTitle(card, locale)}>
          {card.profile !== undefined && (isEn ? "List " : "官价 ")}
          {formatCost(card.cost)}
        </span>
        {card.svgBytes !== null && <span>{formatBytes(card.svgBytes)}</span>}
        <span>{card.trigger === "schedule" ? (isEn ? "Sched" : "定时") : isEn ? "Manual" : "手动"}</span>
      </div>
      {card.judgeCost != null && (
        <div className="footer-row judge-cost" title={judgeCostLine(card.judgeCost, locale) ?? ""}>
          {judgeCostBrief(card.judgeCost, locale)}
        </div>
      )}
    </footer>
  );
}

/** 评审标签（ACR-019）：标签 + 总分，悬停看逐条闸门与标准 */
function JudgeTag({
  card,
  judge,
  judgeCost,
  locale,
}: {
  card: DashboardCard;
  judge: NonNullable<DashboardCard["judge"]>;
  judgeCost: DashboardCard["judgeCost"];
  locale: Locale;
}) {
  const live =
    judge.total.verdict === "pending"
      ? pendingJudgeState(useLiveProgress(), card.runId, judge.subject.attemptKey, Date.now())
      : null;
  if (live !== null) {
    const info = pendingJudgeText(live, locale);
    return (
      <span className={`judge-tag judge-${live === "interrupted" ? "interrupted" : "judging"}`} title={info.title}>
        {info.label}
      </span>
    );
  }
  return (
    <span className={`judge-tag judge-${judge.total.verdict}`} title={judgeTitle(judge, judgeCost, locale)}>
      {judgeText(judge.total.verdict, locale)} {judge.total.score}
    </span>
  );
}

/** 上游徽章：色点与进度面板、时间线同色；登录态（无 profile）不出徽章 */
function ProfileBadge({ name, locale }: { name: string; locale: Locale }) {
  const { profiles } = useProfiles();
  const label = profileLabel(name, profiles, locale);
  return (
    <span className="badge profile" title={locale === "en" ? `Profile: ${label}` : `上游：${label}`}>
      <span className="profile-dot" style={{ background: profileColor(name) }} aria-hidden="true" />
      {label}
    </span>
  );
}

function EffortBadge({ card, locale }: { card: DashboardCard; locale: Locale }) {
  const isEn = locale === "en";
  if (!card.effortHonored) {
    return (
      <span
        className="badge folded"
        title={
          isEn
            ? "Reasoning effort is not adjustable for this model; configured effort is used for grouping only"
            : "该模型不支持调节思考强度，配置中的 effort 仅用于分组"
        }
      >
        {isEn ? "Fixed effort" : "强度不可调"}
      </span>
    );
  }

  const folded = card.appliedEffort !== card.effort;
  return (
    <span
      className={`badge${folded ? " folded" : ""}`}
      title={
        folded
          ? isEn
            ? `Requested ${card.effort}, model supports up to ${card.appliedEffort}`
            : `请求 ${card.effort}，该模型仅支持到 ${card.appliedEffort}`
          : undefined
      }
    >
      effort: {folded ? `${card.effort} → ${card.appliedEffort}` : card.effort}
    </span>
  );
}

function ArtFrame({ card, art, locale }: { card: DashboardCard; art: string; locale: Locale }) {
  const href = viewHref(card);
  const frame = <LazySvgFrame href={art} className="card-frame" />;
  if (href === null) return frame;
  return (
    <a
      className="card-frame-link"
      href={href}
      target="_blank"
      rel="noopener"
      title={locale === "en" ? "Open full artwork view" : "单独查看大图"}
    >
      {frame}
    </a>
  );
}

function FailureFrame({ card, locale }: { card: DashboardCard; locale: Locale }) {
  const statusLabel = statusText(card.status, locale);
  const reason = localizeCardError(card.error, card.status, locale) ?? statusLabel;
  return (
    <div className={`frame card-frame frame-failed failed-${card.status}`} title={reason}>
      <span className="failure-status">{statusLabel}</span>
      <p>{reason}</p>
    </div>
  );
}

function RedactedFrame({ card, locale }: { card: DashboardCard; locale: Locale }) {
  const fallback = locale === "en" ? "Redacted (Unpublished)" : "已脱敏，未发布";
  const reason = localizeCardError(card.error, card.status, locale) ?? fallback;
  return (
    <div className="frame card-frame frame-redacted" title={reason}>
      <span className="redacted-status">{fallback}</span>
      <p>{reason}</p>
    </div>
  );
}
