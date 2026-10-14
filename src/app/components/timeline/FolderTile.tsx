"use client";

import { useI18n, type Locale } from "@/i18n";
import { judgeText } from "../card/card-format";
import { VerdictIcon } from "../icons/verdict-icons";
import { Thumb } from "./Thumb";
import {
  OVERFLOW_SLOT,
  SLOT_CORNERS,
  SLOT_COUNT_CAP,
  slotCount,
  slotMarks,
  type FolderCell,
  type SlotMarks,
} from "./effort-slots";
import type { Row } from "./rows";

interface FolderTileProps {
  row: Row;
  cell: FolderCell;
  slots: readonly string[];
  x: number;
  onOpen: () => void;
}

/**
 * 一个模型在一轮里的全部强度，排成 2×2 小图。每角对应固定档位（见 effort-slots.ts），
 * 未运行的角留空而不前移补位，保证同一角在所有格子里表示同一档位。
 */
export function FolderTile({ row, cell, slots, x, onOpen }: FolderTileProps) {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const okCount = cell.cards.filter((card) => card.status === "ok").length;
  const summary = cell.cards
    .map((card) => `${card.effort}${isEn ? ": " : "："}${card.status}`)
    .join(isEn ? ", " : "，");
  const ariaLabel = isEn
    ? `${row.cli} ${row.model}, ${summary}. Click to inspect all efforts`
    : `${row.cli} ${row.model}，${summary}。点击查看全部强度`;
  const titleText = isEn
    ? `${row.cli} · ${row.model} · ${okCount}/${cell.cards.length} succeeded`
    : `${row.cli} · ${row.model} · ${okCount}/${cell.cards.length} 成功`;

  return (
    <button
      type="button"
      className="folder"
      style={{ left: x }}
      aria-label={ariaLabel}
      title={titleText}
      onClick={onOpen}
    >
      {slots.map((slot, index) => {
        if (slot === OVERFLOW_SLOT) {
          return (
            <span key={slot} className="folder-slot folder-more">
              {cell.overflow > 0 ? `+${cell.overflow}` : ""}
            </span>
          );
        }
        const card = cell.slotCards[index] ?? null;
        if (card === null) {
          return (
            <span
              key={slot}
              className="folder-slot folder-empty"
              title={isEn ? `${slot}: not run` : `${slot}：未运行`}
            />
          );
        }
        const count = slotCount(cell, slot);
        const marks = slotMarks(cell, slot);
        return (
          <span key={slot} className="folder-slot">
            <Thumb card={card} />
            <span className={`folder-status status-dot status-${card.status}`} />
            {count > 1 && (
              <span className="folder-count" title={isEn ? `${count} profiles` : `${count} 个上游`}>
                ×{count}
              </span>
            )}
            <SlotMarkRow marks={marks} locale={locale} />
          </span>
        );
      })}
    </button>
  );
}

/** 作品右下角的评审结论圆标：三件以内逐件列、与弹窗里的上游列同序；更多时按结论计数，为 0 的不出 */
function SlotMarkRow({ marks, locale }: { marks: SlotMarks; locale: Locale }) {
  const isEn = locale === "en";
  const sep = isEn ? ", " : "、";
  const prefix = isEn ? "Judge: " : "评审：";
  if (marks.kind === "summary") {
    const summary = marks.counts.map((item) => `${judgeText(item.verdict, locale)} ${item.count}`).join(sep);
    return (
      <span className="folder-marks" title={`${prefix}${summary}`}>
        {marks.counts.map((item) => (
          <span key={item.verdict} className="verdict-badge verdict-count">
            <VerdictIcon verdict={item.verdict} label={judgeText(item.verdict, locale)} />
            {Math.min(item.count, SLOT_COUNT_CAP)}
          </span>
        ))}
      </span>
    );
  }
  if (marks.verdicts.length === 0) return null;
  return (
    <span className="folder-marks" title={`${prefix}${marks.verdicts.map((v) => judgeText(v, locale)).join(sep)}`}>
      {marks.verdicts.map((verdict, index) => (
        <span key={index} className="verdict-badge">
          <VerdictIcon verdict={verdict} label={judgeText(verdict, locale)} />
        </span>
      ))}
    </span>
  );
}

/** 格子四角的档位图例，如 “↖ low ↗ high ↙ max” */
export function SlotLegend({ slots }: { slots: readonly string[] }) {
  const { locale } = useI18n();
  const isEn = locale === "en";
  if (slots.length === 0) return null;
  return (
    <span className="slot-legend" aria-label={isEn ? "Reasoning efforts by tile corner" : "格子四角对应的思考强度"}>
      {isEn ? "Corners" : "格内位置"}
      {slots.map((slot, index) => (
        <span key={slot} className="slot-legend-item">
          <span className="slot-legend-corner" aria-hidden="true">
            {SLOT_CORNERS[index]}
          </span>
          {slot === OVERFLOW_SLOT ? (isEn ? "other" : "其余档位") : slot}
        </span>
      ))}
    </span>
  );
}

/** 格子右上角状态点的图例 */
export function StatusLegend() {
  const { locale } = useI18n();
  const isEn = locale === "en";
  return (
    <span className="status-legend" aria-label={isEn ? "Status legend" : "状态点图例"}>
      <span className="legend-item">
        <span className="status-dot status-ok" />
        {isEn ? "OK" : "成功"}
      </span>
      <span className="legend-item">
        <span className="status-dot status-no-svg" />
        {isEn ? "No SVG" : "无 SVG"}
      </span>
      <span className="legend-item">
        <span className="status-dot status-error" />
        {isEn ? "Failed" : "失败"}
      </span>
      <span className="legend-item">
        <VerdictIcon verdict="online" label={judgeText("online", locale)} />
        {judgeText("online", locale)}
      </span>
      <span className="legend-item">
        <VerdictIcon verdict="degraded" label={judgeText("degraded", locale)} />
        {judgeText("degraded", locale)}
      </span>
    </span>
  );
}
