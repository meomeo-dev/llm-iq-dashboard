/**
 * 候选集轮换：同一周期沿用同一条；换周期洗牌抽取，一副牌取完之前不重复。
 * 测试在临时 PELICAN_DATA_DIR 下运行，不触及仓库的轮换状态。
 */

import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, test } from "node:test";
import { pickCandidate, type RotationConfig } from "@/core/variables";

const ENV_DATA_DIR = "PELICAN_DATA_DIR";
const DAILY: RotationConfig = { period: "day", timeZone: "UTC" };
const IDS = Array.from({ length: 10 }, (_, index) => `book-${String(index + 1).padStart(3, "0")}`);
const DAY_MS = 24 * 60 * 60 * 1000;
let dataDir: string;
let previousDataDir: string | undefined;

before(async () => {
  dataDir = await mkdtemp(join(tmpdir(), "llm-iq-candidates-"));
  previousDataDir = process.env[ENV_DATA_DIR];
  process.env[ENV_DATA_DIR] = dataDir;
});

after(async () => {
  if (previousDataDir === undefined) delete process.env[ENV_DATA_DIR];
  else process.env[ENV_DATA_DIR] = previousDataDir;
  await rm(dataDir, { recursive: true, force: true });
});

test("同一天的各轮抽到同一条", async () => {
  const morning = await pickCandidate("same-day", IDS, DAILY, new Date("2026-10-01T01:00:00Z"));
  const evening = await pickCandidate("same-day", IDS, DAILY, new Date("2026-10-01T23:00:00Z"));
  assert.equal(evening, morning);
});

test("连续十天恰好把十条各抽一遍", async () => {
  const start = Date.parse("2026-10-01T12:00:00Z");
  const picked: string[] = [];
  for (let day = 0; day < IDS.length; day += 1) {
    picked.push(await pickCandidate("ten-days", IDS, DAILY, new Date(start + day * DAY_MS)));
  }
  assert.deepEqual([...picked].sort(), IDS);
});

test("候选集为空时直接报错", async () => {
  await assert.rejects(pickCandidate("empty", [], DAILY, new Date()), /候选集为空/);
});
