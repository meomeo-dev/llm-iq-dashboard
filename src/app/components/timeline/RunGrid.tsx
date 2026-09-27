"use client";

import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { FolderTile } from "./FolderTile";
import { TimelineAxis, type NowMark } from "./TimelineAxis";
import { folderCell, planSlots } from "./effort-slots";
import type { Moment } from "./moments";
import { listRows } from "./rows";
import { CELL_WIDTH, layoutColumns, timeX } from "./track-layout";

/** 打开的格子：哪一轮的哪一行 */
export interface OpenCell {
  runId: string;
  rowKey: string;
}

interface RunGridProps {
  /** 变化时（换天、换时区、点时钟）重新定位滚动位置 */
  scrollKey: string;
  now: NowMark | null;
  /** 当天的轮次，按时间从早到晚 */
  moments: readonly Moment[];
  /** 数据里出现过的强度档位，按档位高低；决定格子四个角的含义 */
  efforts: readonly string[];
  onOpen: (cell: OpenCell) => void;
  /** 没有可显示的轮次时的说明（可带跳转）；缺省为筛选后的说明 */
  emptyContent?: ReactNode;
}

/**
 * 结果矩阵：左侧固定行标签（CLI · 模型），右侧可横向滚动的时间轨道；轴、列头与各行
 * 格子共用同一条 x 轴，每格是该模型在该轮的全部强度。
 */
export function RunGrid({ scrollKey, now, moments, efforts, onOpen, emptyContent }: RunGridProps) {
  const cards = moments.flatMap((moment) => moment.cards);
  const showPrompt = new Set(cards.map((card) => card.promptId)).size > 1;
  const rows = listRows(cards);
  const slots = planSlots(efforts);
  const { columns, width } = useMemo(() => layoutColumns(moments, CELL_WIDTH), [moments]);
  // 今天定位到现在，其他日子定位到最后一轮
  const anchorX = now !== null ? timeX(now.fraction) : (columns[columns.length - 1]?.x ?? null);
  const scroller = useScrollAnchor(anchorX, scrollKey);

  return (
    <div className="matrix">
      <div className="matrix-labels">
        <div className="matrix-labels-spacer" />
        <div className="lane-head">
          模型
          <span className="lane-head-count">{rows.length} 个</span>
        </div>
        {rows.map((row) => (
          <div key={row.key} className="row-label" title={`${row.cli} · ${row.model} · ${row.promptId}`}>
            <span className="row-label-name">
              {row.cli} · {row.model}
            </span>
            {showPrompt && <span className="row-label-prompt">{row.promptId}</span>}
          </div>
        ))}
      </div>
      <div className="track" ref={scroller}>
        <TimelineAxis columns={columns} width={width} now={now} />
        <div style={{ width }}>
          <div className="lane-line" />
          {rows.map((row) => (
            <div key={row.key} className="row-track">
              {columns.map(({ moment, x }) => {
                const cell = folderCell(moment, row, slots, efforts);
                if (cell === null) return null;
                const open = (): void => onOpen({ runId: moment.runId, rowKey: row.key });
                return <FolderTile key={moment.runId} row={row} cell={cell} slots={slots} x={x} onOpen={open} />;
              })}
            </div>
          ))}
        </div>
      </div>
      {moments.length === 0 && <p className="matrix-empty">{emptyContent ?? "没有符合筛选的结果"}</p>}
    </div>
  );
}

/**
 * scrollKey 变化时把锚点滚到视野中央。只依赖 scrollKey，现在线走动或数据刷新
 * 不会打断用户的手动滚动。
 */
function useScrollAnchor(anchorX: number | null, scrollKey: string) {
  const scroller = useRef<HTMLDivElement>(null);
  const anchor = useRef(anchorX);
  anchor.current = anchorX;
  useEffect(() => {
    const element = scroller.current;
    if (element === null || anchor.current === null) return;
    element.scrollLeft = anchor.current - element.clientWidth / 2;
  }, [scrollKey]);
  return scroller;
}
