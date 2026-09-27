"use client";

import type { DashboardCard } from "@/core/types";
import { formatZonedDateTime } from "../timeline/zoned-time";
import { LazySvgFrame } from "./LazySvgFrame";
import { costTitle, formatBytes, formatCost, formatDuration, rawSvgHref, STATUS_TEXT, viewHref } from "./card-format";

/**
 * 单次调用的结果卡片。表头、图框、页脚各自定高（见 cards.css），失败时用同尺寸
 * 图框说明原因，并排比较时高度差不会被误读为结果多寡。
 */
export function PelicanCard({ card, timeZone }: { card: DashboardCard; timeZone: string }) {
  const href = viewHref(card);
  // 抽出了 SVG 才有作品地址；源码在进入视口时再取（见 ACR-003）
  const art = rawSvgHref(card);
  return (
    <article className="card">
      <header>
        {/* 执行时刻作主标题，用于区分结果来自哪一轮 */}
        <h2 className="timestamp" suppressHydrationWarning>
          {formatZonedDateTime(new Date(card.startedAt), timeZone)}
        </h2>
        <p className="subject" title={card.label}>
          {card.label}
        </p>
        <div className="badges">
          <span className="badge cli">{card.cli}</span>
          <span className="badge">{card.model}</span>
          <EffortBadge card={card} />
          <span className="badge prompt-id">{card.promptId}</span>
          {/* 变量取值上徽章：不知道本轮问的是什么动物就无法判读作品 */}
          {Object.entries(card.bindings).map(([name, value]) => (
            <span key={name} className="badge binding" title={`${name}: ${value}`}>
              {name}: {value}
            </span>
          ))}
        </div>
      </header>

      {art !== null ? <ArtFrame card={card} art={art} /> : <FailureFrame card={card} />}

      {/* 两行定高：第一行结果与开销，第二行附属信息与入口 */}
      <footer>
        <div className="footer-row">
          <span className={`status-text status-${card.status}`}>{STATUS_TEXT[card.status]}</span>
          <span>耗时 {formatDuration(card.durationMs)}</span>
          <span className="card-cost" title={costTitle(card)}>
            {formatCost(card.cost)}
          </span>
        </div>
        <div className="footer-row">
          {card.svgBytes !== null && <span>{formatBytes(card.svgBytes)}</span>}
          <span>{card.trigger === "schedule" ? "定时" : "手动"}</span>
          {href !== null && (
            <a className="card-open" href={href} target="_blank" rel="noopener" title="在新标签页单独查看大图">
              大图 ↗
            </a>
          )}
        </div>
      </footer>
    </article>
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
