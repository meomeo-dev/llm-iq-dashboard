#!/usr/bin/env tsx
/**
 * 手动执行一轮基准：`pnpm run:once`
 *
 * 与调度器共用同一套编排逻辑，差别只在 trigger 标记与退出行为。用于验证配置、
 * 补跑漏掉的时段，以及排查某个 CLI 的调用参数。
 */

import { loadConfig } from "../core/config";
import { configPath, runDir } from "../core/paths";
import { executeRun } from "../core/runner";

async function main(): Promise<void> {
  const path = configPath();
  const config = loadConfig(path);

  console.log(`配置：${path}`);
  console.log(`目标：${config.targets.map((t) => t.id).join(", ")}`);

  const record = await executeRun(config, {
    trigger: "manual",
    log: (message) => console.log(message),
  });

  const failed = record.attempts.filter((a) => a.status !== "ok");
  for (const attempt of failed) {
    console.error(`  ✗ ${attempt.targetId}: ${attempt.status} — ${attempt.error}`);
  }
  // 部分目标失败仍算一次有效观测，退出码保持 0；只有整轮抛错才是非零。
  console.log(`产物目录：${runDir(record.runId)}`);
}

main().catch((cause: unknown) => {
  console.error(cause instanceof Error ? cause.message : cause);
  process.exit(1);
});
