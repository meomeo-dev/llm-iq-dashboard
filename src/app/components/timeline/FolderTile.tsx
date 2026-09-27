"use client";

import { Thumb } from "./Thumb";
import { OVERFLOW_SLOT, SLOT_CORNERS, type FolderCell } from "./effort-slots";
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
  const okCount = cell.cards.filter((card) => card.status === "ok").length;
  const summary = cell.cards.map((card) => `${card.effort}：${card.status}`).join("，");
  return (
    <button
      type="button"
      className="folder"
      style={{ left: x }}
      aria-label={`${row.cli} ${row.model}，${summary}。点击查看全部强度`}
      title={`${row.cli} · ${row.model} · ${okCount}/${cell.cards.length} 成功`}
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
        if (card === null) return <span key={slot} className="folder-slot folder-empty" title={`${slot}：未运行`} />;
        return (
          <span key={slot} className="folder-slot">
            <Thumb card={card} />
            <span className={`folder-status status-dot status-${card.status}`} />
          </span>
        );
      })}
    </button>
  );
}

/** 格子四角的档位图例，如 “↖ low ↗ high ↙ max” */
export function SlotLegend({ slots }: { slots: readonly string[] }) {
  if (slots.length === 0) return null;
  return (
    <span className="slot-legend" aria-label="格子四角对应的思考强度">
      格内位置
      {slots.map((slot, index) => (
        <span key={slot} className="slot-legend-item">
          <span className="slot-legend-corner" aria-hidden="true">
            {SLOT_CORNERS[index]}
          </span>
          {slot === OVERFLOW_SLOT ? "其余档位" : slot}
        </span>
      ))}
    </span>
  );
}

/** 格子右上角状态点的图例 */
export function StatusLegend() {
  return (
    <span className="status-legend" aria-label="状态点图例">
      <span className="legend-item">
        <span className="status-dot status-ok" />
        成功
      </span>
      <span className="legend-item">
        <span className="status-dot status-no-svg" />
        无 SVG
      </span>
      <span className="legend-item">
        <span className="status-dot status-error" />
        失败
      </span>
    </span>
  );
}
