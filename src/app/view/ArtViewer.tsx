"use client";

import type { PromptStandard } from "@/core/prompt";
import type { DashboardCard } from "@/core/types";
import { costTitle, formatBytes, formatCost, formatDuration, rawSvgHref, STATUS_TEXT } from "../components/card/card-format";
import { SvgFrame } from "../components/card/SvgFrame";
import { ReferenceSourceDisplay } from "../components/ReferenceSourceDisplay";
import { useStoredTimeZone } from "../components/timeline/use-stored-time-zone";
import { formatZonedDateTime } from "../components/timeline/zoned-time";

/**
 * 单件作品查看页：顶部元信息，下方白底画布按比例放大净化后的作品。
 * “原始 SVG”链接指向 /art 路由，由其 CSP 沙箱响应头隔离。
 * 底部提供抽屉：原提示词与该题目的客观黄金标准（Ground Truth）及判断规则。
 */
export function ArtViewer({
  card,
  svg,
  standard,
}: {
  card: DashboardCard;
  svg: string;
  standard?: PromptStandard | null;
}) {
  const [timeZone] = useStoredTimeZone();
  const raw = rawSvgHref(card);
  const effort = card.appliedEffort !== card.effort ? `${card.effort} → ${card.appliedEffort}` : card.effort;

  return (
    <div className="viewer">
      <header className="viewer-head">
        <div className="viewer-heading">
          <h1 className="viewer-title">{card.label}</h1>
          <p className="viewer-meta">
            <span suppressHydrationWarning>
              {timeZone === null ? card.startedAt : formatZonedDateTime(new Date(card.startedAt), timeZone)}
            </span>
            <span className={`status-text status-${card.status}`}>{STATUS_TEXT[card.status]}</span>
            <span>耗时 {formatDuration(card.durationMs)}</span>
            <span title={costTitle(card)}>API 等价 {formatCost(card.cost)}</span>
            {card.svgBytes !== null && <span>{formatBytes(card.svgBytes)}</span>}
            <span>effort: {effort}</span>
            <span>{card.promptId}</span>
          </p>
          <div className="badges">
            {Object.entries(card.bindings).map(([name, value]) => (
              <span key={name} className="badge binding" title={`${name}: ${value}`}>
                {name}: {value}
              </span>
            ))}
          </div>
        </div>
        {raw !== null && (
          <nav className="viewer-actions">
            <a href={raw} target="_blank" rel="noopener">
              原始 SVG ↗
            </a>
            <a href={raw} download={card.svgFile ?? undefined}>
              下载
            </a>
          </nav>
        )}
      </header>
      <main className="viewer-stage">
        <SvgFrame source={svg} className="viewer-frame" />
      </main>
      <footer className="viewer-foot">
        {card.promptText !== "" && (
          <details className="viewer-drawer viewer-prompt">
            <summary>
              <span className="drawer-icon" aria-hidden="true">💬</span>
              <span className="drawer-title">提示词</span>
            </summary>
            <div className="viewer-drawer-body">
              <p>{card.promptText}</p>
            </div>
          </details>
        )}
        {standard != null && (
          <details className="viewer-drawer viewer-standard">
            <summary>
              <span className="drawer-icon" aria-hidden="true">📐</span>
              <span className="drawer-title">客观参考标准与判定依据</span>
              <span className="drawer-core-pill">{standard.coreKey}</span>
            </summary>
            <div className="viewer-drawer-body standard-body">
              <div className="standard-grid">
                <div className="standard-col">
                  <div className="standard-heading">
                    <span className="standard-tag gt">Ground Truth</span>
                    <h4>客观黄金标准</h4>
                  </div>
                  <p className="standard-desc">{standard.groundTruth}</p>
                </div>
                <div className="standard-col">
                  <div className="standard-heading">
                    <span className="standard-tag eval">Evaluation</span>
                    <h4>判断与鉴别标准</h4>
                  </div>
                  <p className="standard-desc">{standard.evaluationCriteria}</p>
                </div>
              </div>
              {standard.referenceSource && (
                <div className="standard-source-row">
                  <span className="source-label">出处参考：</span>
                  <ReferenceSourceDisplay source={standard.referenceSource} className="source-link" />
                </div>
              )}
            </div>
          </details>
        )}
      </footer>
    </div>
  );
}
