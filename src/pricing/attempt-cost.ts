/**
 * 读取侧：为一次调用补齐用量并折算成本。
 *
 * 用量优先取 run.json 的 usage 字段；缺失时从原始输出（rawFile）解析，不回填
 * run.json。转录写完即不再变化，解析结果按文件在进程内缓存。
 */

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { runDir } from "../core/paths";
import type { Attempt } from "../core/types";
import { estimateCost } from "./catalog";
import { loadPriceCatalog } from "./catalog-files";
import type { CostEstimate, TokenUsage } from "./types";
import { usageFromTranscript } from "./usage";

const transcriptUsage = new Map<string, TokenUsage | null>();

async function usageOf(runId: string, attempt: Attempt): Promise<TokenUsage | null> {
  if (attempt.usage !== undefined) return attempt.usage;
  if (attempt.rawFile === null) return null;
  const key = `${runId}/${attempt.rawFile}`;
  const known = transcriptUsage.get(key);
  if (known !== undefined) return known;
  let usage: TokenUsage | null = null;
  try {
    const transcript = await readFile(join(runDir(runId), attempt.rawFile), "utf8");
    usage = usageFromTranscript(attempt.cli, transcript);
  } catch {
    // 转录可能已被保留期清理，按无用量处理
  }
  transcriptUsage.set(key, usage);
  return usage;
}

export async function usageAndCost(
  runId: string,
  attempt: Attempt,
): Promise<{ usage: TokenUsage | null; cost: CostEstimate }> {
  const usage = await usageOf(runId, attempt);
  return { usage, cost: estimateCost(loadPriceCatalog(), attempt, usage) };
}
