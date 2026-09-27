/**
 * 数据与配置路径的唯一来源；调度器与 Next.js 服务是独立进程，须解析到同一目录。
 */

import { join, resolve } from "node:path";

/** 覆盖数据根目录；多机部署或把产物放到外部卷时使用 */
const ENV_DATA_DIR = "PELICAN_DATA_DIR";

export function dataRoot(): string {
  const override = process.env[ENV_DATA_DIR];
  if (override !== undefined && override.trim() !== "") return resolve(override);
  return join(process.cwd(), "data");
}

/** 每次调度一个子目录：data/runs/<runId>/ */
export function runsRoot(): string {
  return join(dataRoot(), "runs");
}

export function runDir(runId: string): string {
  return join(runsRoot(), runId);
}

/**
 * CLI 的空工作目录，每次调用一个且独立于 runs/。
 * 在仓库内运行会把 CLAUDE.md / AGENTS.md 带进上下文，污染基准。
 */
export function scratchDir(runId: string, targetId: string): string {
  return join(dataRoot(), "scratch", runId, targetId);
}

export function configPath(): string {
  const override = process.env.PELICAN_CONFIG;
  if (override !== undefined && override.trim() !== "") return resolve(override);
  return join(process.cwd(), "config", "pelican.config.yaml");
}
