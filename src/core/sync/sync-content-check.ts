/**
 * 数据仓已有产物与本次导出内容的一致性校验。
 */

import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import type { PublicAttempt, PublicRunRecord } from "../data-repo/contract";
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

function stripAttemptJudge(attempt: PublicAttempt): Omit<PublicAttempt, "judge"> {
  const { judge: _judge, ...rest } = attempt;
  return rest;
}

/**
 * 判断目标目录已有产物与本次导出是否仅存在 AI 评审结论补齐差异（SVG 完全一致、其余字段完全一致，
 * 且旧记录中对应 attempt 为无 judge 或 verdict === "pending"）。
 */
export async function isJudgeOnlyUpgrade(
  targetDir: string,
  exported: ReadyExportResult,
): Promise<boolean> {
  const targetRunJson = join(targetDir, "run.json");
  if (!existsSync(targetRunJson)) return false;

  try {
    if (!(await compareSvgFiles(targetDir, exported))) return false;
    const existing = JSON.parse(await readFile(targetRunJson, "utf8")) as PublicRunRecord;
    const next = exported.publicRecord;
    const { attempts: prevAttempts, ...prevRest } = existing;
    const { attempts: nextAttempts, ...nextRest } = next;
    if (JSON.stringify(prevRest) !== JSON.stringify(nextRest)) return false;
    if (prevAttempts.length !== nextAttempts.length) return false;

    let upgraded = false;
    for (let i = 0; i < prevAttempts.length; i += 1) {
      const prevA = prevAttempts[i]!;
      const nextA = nextAttempts[i]!;
      if (JSON.stringify(stripAttemptJudge(prevA)) !== JSON.stringify(stripAttemptJudge(nextA))) {
        return false;
      }
      if (JSON.stringify(prevA.judge ?? null) !== JSON.stringify(nextA.judge ?? null)) {
        const wasPendingOrMissing = prevA.judge == null || prevA.judge.total.verdict === "pending";
        if (!wasPendingOrMissing || nextA.judge == null) return false;
        upgraded = true;
      }
    }
    return upgraded;
  } catch {
    return false;
  }
}
