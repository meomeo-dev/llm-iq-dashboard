"use client";

import type { DashboardCard } from "@/core/types";
import { rawSvgHref } from "../card/card-format";
import { LazySvgFrame } from "../card/LazySvgFrame";

/** 作品缩略图：成功的显示 SVG，失败的用条纹底加 ✕，尺寸由外层网格决定 */
export function Thumb({ card }: { card: DashboardCard }) {
  const title = `${card.label} · ${card.status === "ok" ? "成功" : (card.error ?? card.status)}`;
  const art = rawSvgHref(card);
  if (art === null) {
    return (
      <span className={`thumb thumb-failed failed-${card.status}`} title={title}>
        ✕
      </span>
    );
  }
  return (
    <span className="thumb" title={title}>
      <LazySvgFrame href={art} className="thumb-art" />
    </span>
  );
}
