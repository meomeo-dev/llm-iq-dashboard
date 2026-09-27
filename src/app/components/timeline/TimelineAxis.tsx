"use client";

import { momentHealth } from "./moments";
import { AXIS_HEIGHT, AXIS_LINE_Y, HEAD_HEIGHT, hourLabelVisible, hourX, timeX, type Column } from "./track-layout";

const HOUR_LABELS = [0, 3, 6, 9, 12, 15, 18, 21, 24];

/** 现在在所选时区下的位置与钟点；只在查看今天时存在 */
export interface NowMark {
  fraction: number;
  clock: string;
}

/**
 * 轨道头部：24 小时轴 + 列头。轴上标记在准确时刻，列头在列中心，两者错开时以连线
 * 指回准确时刻。与下方矩阵共用滚动容器。
 */
export function TimelineAxis({ columns, width, now }: { columns: readonly Column[]; width: number; now: NowMark | null }) {
  const nowX = now === null ? null : timeX(now.fraction);
  const headY = AXIS_HEIGHT + HEAD_HEIGHT / 2;

  return (
    <div className="track-head" style={{ width }}>
      <svg className="track-head-lines" width={width} height={AXIS_HEIGHT + HEAD_HEIGHT} aria-hidden="true">
        <line className="axis-line" x1={hourX(0)} y1={AXIS_LINE_Y} x2={hourX(24)} y2={AXIS_LINE_Y} />
        {Array.from({ length: 25 }, (_, hour) => (
          <line
            key={hour}
            className={hour % 3 === 0 ? "axis-tick major" : "axis-tick"}
            x1={hourX(hour)}
            y1={AXIS_LINE_Y - (hour % 3 === 0 ? 8 : 4)}
            x2={hourX(hour)}
            y2={AXIS_LINE_Y}
          />
        ))}
        {columns.map(({ moment, exactX, x }) => (
          <line key={moment.runId} className="connector" x1={exactX} y1={AXIS_LINE_Y} x2={x} y2={headY - 9} />
        ))}
        {nowX !== null && <line className="now-line" x1={nowX} y1={12} x2={nowX} y2={AXIS_HEIGHT + HEAD_HEIGHT} />}
      </svg>
      {HOUR_LABELS.filter((hour) => hourLabelVisible(hour, nowX)).map((hour) => (
        <span key={hour} className="axis-hour" style={{ left: hourX(hour) }}>
          {String(hour).padStart(2, "0")}
        </span>
      ))}
      {columns.map(({ moment, exactX }) => (
        <span key={moment.runId} className={`axis-dot health-${momentHealth(moment)}`} style={{ left: exactX, top: AXIS_LINE_Y }} />
      ))}
      {columns.map(({ moment, x }) => (
        <span key={moment.runId} className="column-head" style={{ left: x }}>
          {moment.clock}
        </span>
      ))}
      {now !== null && nowX !== null && (
        <span className="now-label" style={{ left: nowX }}>
          现在 {now.clock}
        </span>
      )}
    </div>
  );
}
