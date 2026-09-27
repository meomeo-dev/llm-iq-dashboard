/** 配对窗口：兑换成功即关窗，猜错到上限也关窗，过期作废 */

import assert from "node:assert/strict";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { before, describe, test } from "node:test";
import { normalizeCode, openPairingWindow, PAIRING_MAX_FAILURES, PAIRING_TTL_MS, redeemPairingCode } from "@/core/auth/pairing";

const NOW = new Date("2026-09-26T10:00:00Z");

before(async () => {
  process.env.PELICAN_DATA_DIR = await mkdtemp(join(tmpdir(), "pairing-"));
});

describe("redeemPairingCode", () => {
  test("正确的配对码兑换一次即关窗；分隔符与空格不影响", async () => {
    const code = await openPairingWindow("笔记本", NOW);
    assert.match(code, /^(\d{4}-){7}\d{4}$/);
    const spaced = code.replaceAll("-", " ");
    assert.deepEqual(await redeemPairingCode(spaced, NOW), { ok: true, deviceName: "笔记本" });
    assert.deepEqual(await redeemPairingCode(code, NOW), { ok: false, reason: "no-window" });
  });

  test("猜错累计到上限后窗口关闭，正确码也不再接受", async () => {
    const code = await openPairingWindow("手机", NOW);
    const wrong = normalizeCode(code) === "0".repeat(32) ? "1".repeat(32) : "0".repeat(32);
    for (let i = 1; i < PAIRING_MAX_FAILURES; i += 1) {
      assert.deepEqual(await redeemPairingCode(wrong, NOW), { ok: false, reason: "mismatch" });
    }
    assert.deepEqual(await redeemPairingCode(wrong, NOW), { ok: false, reason: "locked" });
    assert.deepEqual(await redeemPairingCode(code, NOW), { ok: false, reason: "no-window" });
  });

  test("过期的窗口作废", async () => {
    const code = await openPairingWindow("平板", NOW);
    const later = new Date(NOW.getTime() + PAIRING_TTL_MS);
    assert.deepEqual(await redeemPairingCode(code, later), { ok: false, reason: "expired" });
  });
});
