/**
 * 结果集导出的三条流水线：PNG / SVG 把作品嵌进合成图；GIF 用空白图框的合成图作静态层，逐帧画作品。
 * 作品源码只取一次、只净化一次，三种格式共用。
 */

import type { DashboardCard } from "@/core/types";
import { buildArtSources, downloadBlob, downloadPng, downloadSvg, readPalette, thumbnailsFrom } from "./export-image";
import { encodeResultSetGif, type GifProgress } from "./result-set-gif";
import { renderResultSetSvg, type ResultSetExport } from "./result-set-svg";

export type ResultSetFormat = "png" | "svg" | "gif";

export type ResultSetInput = Omit<ResultSetExport, "thumbnails" | "palette" | "artMode">;

export async function exportResultSet(
  format: ResultSetFormat,
  input: ResultSetInput,
  filename: string,
  onProgress: GifProgress,
): Promise<void> {
  const sources = await buildArtSources(input.cards as readonly DashboardCard[]);
  const thumbnails = thumbnailsFrom(sources);
  const palette = readPalette();
  if (format === "gif") {
    const rendered = renderResultSetSvg({ ...input, thumbnails, palette, artMode: "blank" });
    downloadBlob(await encodeResultSetGif(rendered, sources, onProgress), filename);
    return;
  }
  const rendered = renderResultSetSvg({ ...input, thumbnails, palette });
  if (format === "svg") downloadSvg(rendered, filename);
  else await downloadPng(rendered, filename);
}
