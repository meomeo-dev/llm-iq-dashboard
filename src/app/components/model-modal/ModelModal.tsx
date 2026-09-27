"use client";

import { useEffect, useRef, useState } from "react";
import type { PromptStandard } from "@/core/prompt";
import { PelicanCard } from "../card/PelicanCard";
import { ReferenceSourceDisplay } from "../ReferenceSourceDisplay";
import { folderCell } from "../timeline/effort-slots";
import type { Moment } from "../timeline/moments";
import type { Row } from "../timeline/rows";
import { formatDayLabel } from "../timeline/zoned-time";

interface ModelModalProps {
  moment: Moment;
  row: Row;
  /** 当天出现的档位，按高低排；卡片按这个顺序排开 */
  efforts: readonly string[];
  timeZone: string;
  standard?: PromptStandard | null;
  onClose: () => void;
}

/**
 * 一个格子的完整结果：该模型在这一轮各强度的卡片并排排开。
 * 窗口定高，卡片在窗内滚动。
 */
export function ModelModal({ moment, row, efforts, timeZone, standard, onClose }: ModelModalProps) {
  const [showStandard, setShowStandard] = useState(false);
  const closeButton = useModalBehavior(onClose);
  const cards = folderCell(moment, row, [], efforts)?.cards ?? [];
  const okCount = cards.filter((card) => card.status === "ok").length;

  return (
    <div className="modal-backdrop" onPointerDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="model-modal-title">
        <header className="modal-head">
          <div className="modal-heading">
            <h2 id="model-modal-title" className="modal-title">
              {row.cli} · {row.model}
            </h2>
            <p className="modal-sub">
              {formatDayLabel(moment.dayKey)} {moment.clock} 这一轮 · {row.promptId}
              {standard && (
                <button
                  type="button"
                  className="modal-standard-pill"
                  onClick={() => setShowStandard((prev) => !prev)}
                  title="点击展开/收起测评标准"
                >
                  <span className="pill-dot" aria-hidden="true" />
                  {standard.coreKey}
                </button>
              )}
              {" "}· {cards.length} 个强度 · 成功 {okCount}
            </p>
          </div>
          <div className="modal-head-actions">
            {standard && (
              <button
                type="button"
                className={`modal-standard-btn ${showStandard ? "active" : ""}`}
                onClick={() => setShowStandard((prev) => !prev)}
                title={showStandard ? "收起客观参考标准与判定依据" : "查看客观参考标准与判定依据"}
              >
                <span className="btn-icon" aria-hidden="true">📐</span>
                <span className="btn-text">测评标准</span>
                <span className="btn-chevron" aria-hidden="true">{showStandard ? "▴" : "▾"}</span>
              </button>
            )}
            <button type="button" className="modal-close" aria-label="关闭" ref={closeButton} onClick={onClose}>
              ×
            </button>
          </div>
        </header>
        {showStandard && standard && (
          <section className="modal-standard-panel" aria-label="客观参考标准与判定依据">
            <div className="modal-standard-grid">
              <div className="modal-standard-col">
                <div className="standard-heading">
                  <span className="standard-tag gt">Ground Truth</span>
                  <h4>客观黄金标准</h4>
                </div>
                <p className="standard-desc">{standard.groundTruth}</p>
              </div>
              <div className="modal-standard-col">
                <div className="standard-heading">
                  <span className="standard-tag eval">Evaluation</span>
                  <h4>判断与鉴别标准</h4>
                </div>
                <p className="standard-desc">{standard.evaluationCriteria}</p>
              </div>
            </div>
            {standard.referenceSource && (
              <div className="modal-standard-source">
                <span className="source-label">出处参考：</span>
                <ReferenceSourceDisplay source={standard.referenceSource} className="source-link" />
              </div>
            )}
          </section>
        )}
        <div className="modal-body">
          {cards.length === 0 ? (
            <p className="modal-empty">这一格的结果已被筛选隐藏</p>
          ) : (
            <div className="card-grid">
              {cards.map((card) => (
                <PelicanCard key={`${card.targetId}/${card.promptId}`} card={card} timeZone={timeZone} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

/** 模态窗行为：Esc 关闭、打开期间锁定页面滚动、焦点先落在关闭按钮，关闭后还给打开者 */
function useModalBehavior(onClose: () => void) {
  const closeButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      opener?.focus();
    };
  }, [onClose]);
  return closeButton;
}
