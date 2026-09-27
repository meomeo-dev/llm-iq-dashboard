/**
 * CLI 就绪状态的缓存：data/readiness.json
 *
 * 一次检查约十秒（agy 列模型要联网），因此看板只读缓存，需要最新状态时显式发起检查。
 * 每轮预检、`pnpm preflight` 与 `pnpm onboard` 写入结果；各 CLI 分别记录检查时刻，
 * 按 CLI 合并写入。
 */

import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { dataRoot } from "../core/paths";
import type { CliKind } from "../core/types";
import { checkReadiness, type CliReadiness } from "./readiness";

const READINESS_FILE = "readiness.json";

export interface ReadinessRecord extends CliReadiness {
  checkedAt: string;
}

export type ReadinessSnapshot = Partial<Record<CliKind, ReadinessRecord>>;

export async function readReadiness(): Promise<ReadinessSnapshot> {
  try {
    return JSON.parse(await readFile(join(dataRoot(), READINESS_FILE), "utf8")) as ReadinessSnapshot;
  } catch {
    return {};
  }
}

/** 合并写入；写临时文件再原子替换，另一个进程随时可能来读 */
export async function recordReadiness(results: readonly CliReadiness[], now: Date = new Date()): Promise<void> {
  const snapshot = await readReadiness();
  for (const result of results) snapshot[result.cli] = { ...result, checkedAt: now.toISOString() };
  await mkdir(dataRoot(), { recursive: true });
  const target = join(dataRoot(), READINESS_FILE);
  const staging = `${target}.staging`;
  await writeFile(staging, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
  await rename(staging, target);
}

/** 并行检查并记下结果；记录失败只影响看板的展示，不影响调用方拿到结果 */
export async function checkAndRecord(clis: readonly CliKind[]): Promise<CliReadiness[]> {
  const results = await Promise.all(clis.map((cli) => checkReadiness(cli)));
  await recordReadiness(results).catch((cause: unknown) => {
    console.warn(`记录 CLI 就绪状态失败：${cause instanceof Error ? cause.message : cause}`);
  });
  return results;
}
