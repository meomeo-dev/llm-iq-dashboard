"use client";

import type { ReactNode, RefObject } from "react";
import type { PromptStandard } from "@/core/prompt";
import { useI18n } from "@/i18n";
import type { Moment } from "../timeline/moments";
import type { Row } from "../timeline/rows";
import { formatDayLabel } from "../timeline/zoned-time";

interface ModelModalHeaderProps {
  row: Row;
  moment: Moment;
  standard?: PromptStandard | null;
  cardsCount: number;
  okCount: number;
  /** 这一格出现的上游数（含登录态）；多于 1 时副标题按上游计数 */
  upstreamCount?: number;
  /** 头部动作区里测评标准按钮之前的附加控件（如导出菜单） */
  actions?: ReactNode;
  showStandard: boolean;
  onToggleStandard: () => void;
  closeRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
}

export function ModelModalHeader({
  row,
  moment,
  standard,
  cardsCount,
  okCount,
  upstreamCount = 1,
  actions,
  showStandard,
  onToggleStandard,
  closeRef,
  onClose,
}: ModelModalHeaderProps) {
  const { locale, t } = useI18n();
  const isEn = locale === "en";
  const countLabel =
    upstreamCount > 1
      ? isEn ? `${upstreamCount} profiles` : `${upstreamCount} 个上游`
      : isEn ? `${cardsCount} efforts` : `${cardsCount} 个强度`;
  const standardBtnTitle = showStandard
    ? isEn ? "Hide objective reference standard and criteria" : "收起客观参考标准与判定依据"
    : isEn ? "Show objective reference standard and criteria" : "查看客观参考标准与判定依据";

  return (
    <header className="modal-head">
      <div className="modal-heading">
        <h2 id="model-modal-title" className="modal-title">{row.cli} · {row.model}</h2>
        <p className="modal-sub">
          {isEn
            ? `${formatDayLabel(moment.dayKey, locale)} ${moment.clock} round · ${row.promptId}`
            : `${formatDayLabel(moment.dayKey)} ${moment.clock} 这一轮 · ${row.promptId}`}
          {standard && (
            <button
              type="button"
              className="modal-standard-pill"
              onClick={onToggleStandard}
              title={isEn ? "Click to toggle benchmark criteria" : "点击展开/收起测评标准"}
            >
              <span className="pill-dot" aria-hidden="true" />
              {standard.coreKey}
            </button>
          )}
          {" "}· {countLabel} · {isEn ? `OK ${okCount}` : `成功 ${okCount}`}
        </p>
      </div>
      <div className="modal-head-actions">
        {actions}
        {standard && (
          <button
            type="button"
            className={`modal-standard-btn ${showStandard ? "active" : ""}`}
            onClick={onToggleStandard}
            title={standardBtnTitle}
          >
            <span className="btn-icon" aria-hidden="true">📐</span>
            <span className="btn-text">{isEn ? "Criteria" : "测评标准"}</span>
            <span className="btn-chevron" aria-hidden="true">{showStandard ? "▴" : "▾"}</span>
          </button>
        )}
        <button type="button" className="modal-close" aria-label={t.common.actions.close} ref={closeRef} onClick={onClose}>
          ×
        </button>
      </div>
    </header>
  );
}
