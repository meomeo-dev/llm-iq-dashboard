/**
 * 数据仓已有产物与本次导出内容的一致性校验。
 */

import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import type { ReadyExportResult } from "./export-run";

/** 比较目标目录下所有 SVG 文件内容是否完全一致 */
async function compareSvgFiles(
  targetDir: string,
  exported: ReadyExportResult,
): Promise<boolean> {
  const entries = await readdir(targetDir);
  const existingSvgs = new Set(entries.filter((name) => name.endsWith(".svg")));
  const newSvgs = new Set(exported.svgFiles.map((s) => s.filename));

  if (existingSvgs.size !== newSvgs.size) return false;
  for (const name of newSvgs) {
    if (!existingSvgs.has(name)) return false;
    const existingSvgContent = await readFile(join(targetDir, name), "utf8");
    const newSvgItem = exported.svgFiles.find((s) => s.filename === name);
    if (existingSvgContent !== newSvgItem?.content) return false;
  }
  return true;
}

/** 比较目标目录已有产物是否与本次导出完全一致（幂等判定） */
export async function isContentIdentical(
  targetDir: string,
  exported: ReadyExportResult,
): Promise<boolean> {
  const targetRunJson = join(targetDir, "run.json");
  if (!existsSync(targetRunJson)) return false;

  try {
    const existingJson = await readFile(targetRunJson, "utf8");
    if (existingJson.trim() !== exported.jsonText.trim()) {
      return false;
    }
    return await compareSvgFiles(targetDir, exported);
  } catch {
    return false;
  }
}
