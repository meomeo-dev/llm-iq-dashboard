/**
 * 导出图里小格子右下角的评审结论圆标，与看板 FolderTile 的 .folder-marks 同形：
 * 三件以内逐件一个 14px 圆标，更多时按结论计数成药丸；图标路径与页面同源（verdict-icons.tsx）。
 */

import type { Verdict } from "@/core/judge/schema";
import { VERDICT_ICON_PATH } from "../icons/verdict-icons";
import { SLOT_COUNT_CAP, type SlotMarks } from "../timeline/effort-slots";
import type { Palette } from "./timeline-svg";

const BADGE = 14;
const ICON = 10;
const GAP = 2;
const INSET = 5;
const COUNT_FONT = 9;

function verdictColor(verdict: Verdict, palette: Palette): string {
  if (verdict === "online") return palette.ok;
  return verdict === "degraded" ? palette.err : palette.textFaint;
}

/** 图标按 256 的 viewBox 缩到 ICON 大小，左上角落在 (x, y) */
function iconSvg(verdict: Verdict, x: number, y: number, palette: Palette): string {
  return (
    `<g transform="translate(${x} ${y}) scale(${ICON / 256})">` +
    `<path d="${VERDICT_ICON_PATH[verdict]}" fill="${verdictColor(verdict, palette)}"/></g>`
  );
}

/** 小格子（左上角 x, y、边长 size）右下角的圆标行；没有结论时返回空串 */
export function verdictBadgesSvg(marks: SlotMarks, x: number, y: number, size: number, palette: Palette): string {
  const right = x + size - INSET;
  const top = y + size - INSET - BADGE;
  const ring = `fill="${palette.surface}" stroke="${palette.surfaceHi}" stroke-width="2"`;
  if (marks.kind === "summary") {
    const parts: string[] = [];
    let cursor = right;
    for (const item of [...marks.counts].reverse()) {
      const label = String(Math.min(item.count, SLOT_COUNT_CAP));
      const width = 3 + ICON + 1 + label.length * COUNT_FONT * 0.58 + 4;
      const left = cursor - width;
      parts.push(
        `<rect x="${left}" y="${top}" width="${round(width)}" height="${BADGE}" rx="7" ${ring}/>` +
          iconSvg(item.verdict, left + 3, top + 2, palette) +
          `<text x="${round(left + 3 + ICON + 1)}" y="${top + 10.5}" fill="${palette.text}" font-size="${COUNT_FONT}" font-weight="600">${label}</text>`,
      );
      cursor = left - GAP;
    }
    return parts.reverse().join("");
  }
  return marks.verdicts
    .map((verdict, index) => {
      const cx = right - BADGE / 2 - (marks.verdicts.length - 1 - index) * (BADGE + GAP);
      const cy = top + BADGE / 2;
      return `<circle cx="${round(cx)}" cy="${cy}" r="${BADGE / 2}" ${ring}/>` + iconSvg(verdict, cx - ICON / 2, cy - ICON / 2, palette);
    })
    .join("");
}

function round(value: number): number {
  return Math.round(value * 10) / 10;
}
