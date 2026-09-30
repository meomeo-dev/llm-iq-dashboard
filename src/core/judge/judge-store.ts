/**
 * 评审记录的落盘与读取。文件与作品同目录：data/runs/<runId>/<attemptKey>.judge.json，
 * 写法与 run.json 相同（临时文件后原子替换），不改 run.json。
 */

import { readFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { runDir } from "../paths";
import { writeJsonAtomic } from "../store";
import type { Judgement } from "./schema";

const SVG_EXT = ".svg";
export const JUDGE_SUFFIX = ".judge.json";
/** 联系图文件名：<attemptKey>.sheet.png 或 <attemptKey>.sheet.<细节类别>.png，只许安全字符 */
const SHEET_FILE = /^[A-Za-z0-9._-]+\.sheet(\.[a-z-]+)?\.png$/;
const RUN_ID = /^[A-Za-z0-9_-]+$/;

/** run.json 里的 svgFile 去掉扩展名即 attemptKey */
export function attemptKeyOf(svgFile: string): string {
  const name = basename(svgFile);
  return name.endsWith(SVG_EXT) ? name.slice(0, -SVG_EXT.length) : name;
}

export function judgeFileName(attemptKey: string): string {
  return `${attemptKey}${JUDGE_SUFFIX}`;
}

export async function saveJudgement(judgement: Judgement): Promise<string> {
  const file = judgeFileName(judgement.subject.attemptKey);
  await writeJsonAtomic(judgement.subject.runId, file, judgement);
  return file;
}

/** 没有记录或记录不是当前 schema 版本时返回 null */
export async function loadJudgement(runId: string, attemptKey: string): Promise<Judgement | null> {
  try {
    const text = await readFile(join(runDir(runId), judgeFileName(attemptKey)), "utf8");
    const parsed = JSON.parse(text) as Partial<Judgement>;
    return parsed.schemaVersion === 1 ? (parsed as Judgement) : null;
  } catch {
    return null;
  }
}

/** 联系图 PNG；文件名不合规、不存在或已清理时返回 null */
export async function loadContactSheet(runId: string, file: string): Promise<Buffer | null> {
  if (!RUN_ID.test(runId) || !SHEET_FILE.test(file)) return null;
  try {
    return await readFile(join(runDir(runId), file));
  } catch {
    return null;
  }
}
