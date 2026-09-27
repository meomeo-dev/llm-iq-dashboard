/**
 * 候选集轮换：同一周期沿用同一条；换周期洗牌抽取，一副牌取完之前不重复。
 * 只预览的抽取（手动轮次遇上每轮一换）不推进牌堆。
 * 测试在临时 PELICAN_DATA_DIR 下运行，不触及仓库的轮换状态。
 */

import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, test } from "node:test";
import { rotationLedgerFor } from "@/core/run-plan";
import { pickCandidate, type RotationConfig, type RotationDraw } from "@/core/variables";

const ENV_DATA_DIR = "PELICAN_DATA_DIR";
const DAILY: RotationConfig = { period: "day", timeZone: "UTC" };
const PER_RUN: RotationConfig = { period: "run", timeZone: "UTC" };
const IDS = Array.from({ length: 10 }, (_, index) => `book-${String(index + 1).padStart(3, "0")}`);
const DAY_MS = 24 * 60 * 60 * 1000;
let dataDir: string;
let previousDataDir: string | undefined;

function daily(now: Date): RotationDraw {
  return { rotation: DAILY, now, ledger: "advance" };
}

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
  const morning = await pickCandidate("same-day", IDS, daily(new Date("2026-10-01T01:00:00Z")));
  const evening = await pickCandidate("same-day", IDS, daily(new Date("2026-10-01T23:00:00Z")));
  assert.equal(evening, morning);
});

test("连续十天恰好把十条各抽一遍", async () => {
  const start = Date.parse("2026-10-01T12:00:00Z");
  const picked: string[] = [];
  for (let day = 0; day < IDS.length; day += 1) {
    picked.push(await pickCandidate("ten-days", IDS, daily(new Date(start + day * DAY_MS))));
  }
  assert.deepEqual([...picked].sort(), IDS);
});

test("候选集为空时直接报错", async () => {
  await assert.rejects(pickCandidate("empty", [], daily(new Date())), /候选集为空/);
});

test("每轮一换时，只预览的抽取不推进牌堆：下一次记账的抽取拿到同一条", async () => {
  const now = new Date("2026-10-02T00:00:00Z");
  const first = await pickCandidate("preview", IDS, { rotation: PER_RUN, now, ledger: "advance" });
  const peeked = await pickCandidate("preview", IDS, { rotation: PER_RUN, now, ledger: "preview" });
  const peekedAgain = await pickCandidate("preview", IDS, { rotation: PER_RUN, now, ledger: "preview" });
  const next = await pickCandidate("preview", IDS, { rotation: PER_RUN, now, ledger: "advance" });
  assert.equal(peekedAgain, peeked);
  assert.equal(next, peeked);
  assert.notEqual(next, first);
});

test("只有手动轮次遇上每轮一换时才只预览", () => {
  assert.equal(rotationLedgerFor("manual", PER_RUN), "preview");
  assert.equal(rotationLedgerFor("manual", DAILY), "advance");
  assert.equal(rotationLedgerFor("schedule", PER_RUN), "advance");
  assert.equal(rotationLedgerFor("schedule", DAILY), "advance");
});
