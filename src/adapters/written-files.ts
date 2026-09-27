/**
 * 读回模型写出的文件。路径来自模型事件，不可信：限制大小，读取失败视为无文件；
 * 内容是否为 SVG 由编排层判断。
 */

import { readFile, stat } from "node:fs/promises";
import type { WrittenFile } from "./types";

/** 正常作品在几十 KB 量级 */
const MAX_WRITTEN_FILE_BYTES = 2 * 1024 * 1024;

/**
 * @param modifiedSince 只接受此刻之后修改过的文件；模型常复用固定文件名，
 *   需排除更早调用留下的旧作。
 */
export async function readWrittenFile(
  path: string,
  modifiedSince?: Date,
): Promise<WrittenFile | null> {
  try {
    const info = await stat(path);
    if (info.size > MAX_WRITTEN_FILE_BYTES) return null;
    if (modifiedSince !== undefined && info.mtimeMs < modifiedSince.getTime()) return null;
    return { path, content: await readFile(path, "utf8") };
  } catch {
    return null;
  }
}

/** 命令行里会包住路径的标点：引号、括号、赋值与分隔符 */
const PATH_DELIMITERS = new Set(["'", '"', "(", ")", ";", ",", "=", "`", "<", ">", "|"]);

/**
 * 从命令文本里按出现顺序找出 `.svg` 绝对路径。用于模型以脚本生成 SVG 的情形：
 * 这类文件不出现在写文件事件里，但后续命令（如 rsvg-convert）会提到其路径。
 */
export function findSvgPaths(commandText: string): string[] {
  const spaced = [...commandText].map((ch) => (PATH_DELIMITERS.has(ch) ? " " : ch)).join("");
  return spaced
    .split(/\s+/)
    .filter((token) => token.startsWith("/") && token.toLowerCase().endsWith(".svg"));
}
