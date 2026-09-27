/**
 * 文件匹配与 Glob 规则处理模块。
 */

import { readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

/** 把 glob 模式转换为 RegExp */
export function globToRegExp(glob: string): RegExp {
  let s = glob.replace(/\\/g, "/");
  s = s.replace(/[.+^$|[\]\\]/g, "\\$&");
  s = s.replace(/\{([^}]+)\}/g, (_, group: string) => {
    const parts = group.split(",").map((p) => p.trim());
    return `(?:${parts.join("|")})`;
  });
  s = s
    .replace(/\*\*\//g, "___GLOBSTAR_SLASH___")
    .replace(/\*\*/g, "___GLOBSTAR___")
    .replace(/\*/g, "[^/]*")
    .replace(/___GLOBSTAR_SLASH___/g, "(?:.*/)?")
    .replace(/___GLOBSTAR___/g, ".*");
  return new RegExp(`^${s}$`);
}

/** 检查相对路径是否匹配给定的 Glob 列表中的任意一项 */
export function matchesAnyGlob(
  relPath: string,
  patterns: readonly string[],
): boolean {
  const normalized = relPath.replace(/\\/g, "/").replace(/^\.\//, "");
  for (const pattern of patterns) {
    if (globToRegExp(pattern).test(normalized)) {
      return true;
    }
  }
  return false;
}

/** 递归扫描目录下所有文件 */
function walkDir(dir: string, baseDir: string): string[] {
  const result: string[] = [];
  let entries: string[] = [];
  try {
    entries = readdirSync(dir);
  } catch {
    return [];
  }

  for (const entry of entries) {
    if (entry.startsWith(".git") || entry === "node_modules") continue;
    const fullPath = join(dir, entry);
    let isDir = false;
    try {
      isDir = statSync(fullPath).isDirectory();
    } catch {
      continue;
    }

    if (isDir) {
      result.push(...walkDir(fullPath, baseDir));
    } else {
      const rel = relative(baseDir, fullPath).replace(/\\/g, "/");
      result.push(rel);
    }
  }
  return result;
}

/** 查找符合 include 且不被 exclude 排除的所有目标文件 */
export function findTargetFiles(
  cwd: string,
  include: readonly string[],
  exclude: readonly string[],
): string[] {
  const allFiles = walkDir(cwd, cwd);
  return allFiles.filter((relPath) => {
    const isIncluded = matchesAnyGlob(relPath, include);
    if (!isIncluded) return false;
    const isExcluded = matchesAnyGlob(relPath, exclude);
    return !isExcluded;
  });
}
