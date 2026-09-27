/**
 * 必测矩阵 #11：过期清理。删错目录是不可逆的数据丢失，所以只在临时 PELICAN_DATA_DIR 下测。
 */

import assert from "node:assert/strict";
import { mkdir, mkdtemp, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, test } from "node:test";
import { pruneExpiredRuns } from "@/core/retention";

const ENV_DATA_DIR = "PELICAN_DATA_DIR";
let dataDir: string;
let previousDataDir: string | undefined;

before(async () => {
  dataDir = await mkdtemp(join(tmpdir(), "llm-iq-retention-"));
  previousDataDir = process.env[ENV_DATA_DIR];
  process.env[ENV_DATA_DIR] = dataDir;
});

after(async () => {
  if (previousDataDir === undefined) delete process.env[ENV_DATA_DIR];
  else process.env[ENV_DATA_DIR] = previousDataDir;
  await rm(dataDir, { recursive: true, force: true });
});

test("只删保留期外的 runId 目录，期内与非 runId 目录不动", async () => {
  const runsDir = join(dataDir, "runs");
  const expired = "20260801T000000Z";
  const kept = "20260920T120000Z";
  const foreign = "manual-notes";
  for (const name of [expired, kept, foreign]) await mkdir(join(runsDir, name), { recursive: true });

  const logs: string[] = [];
  await pruneExpiredRuns(30, (message) => logs.push(message), new Date("2026-09-24T00:00:00Z"));

  assert.deepEqual((await readdir(runsDir)).sort(), [kept, foreign].sort());
  assert.equal(logs.length, 1);
});
