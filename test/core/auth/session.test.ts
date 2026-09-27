/** 设备会话：签发、校验、轮换宽限与过期 */

import assert from "node:assert/strict";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { before, describe, test } from "node:test";
import { listDevices, revokeDevice } from "@/core/auth/devices";
import { issueSession, parseCookie, verifySession } from "@/core/auth/session";

const NOW = new Date("2026-09-26T10:00:00Z");
const DAY_MS = 24 * 60 * 60 * 1000;
const at = (offsetMs: number): Date => new Date(NOW.getTime() + offsetMs);

before(async () => {
  process.env.PELICAN_DATA_DIR = await mkdtemp(join(tmpdir(), "session-"));
});

describe("issueSession / verifySession", () => {
  test("签发的 cookie 能通过校验；改动凭据或吊销后失败", async () => {
    const { cookie, device } = await issueSession("笔记本", NOW);
    const owner = await verifySession(cookie, at(1000));
    assert.equal(owner?.deviceId, device.id);
    assert.equal(owner?.deviceName, "笔记本");
    assert.equal(owner?.rotatedCookie, null);
    assert.equal(await verifySession(`${cookie}x`, at(1000)), null);
    assert.equal(await verifySession(null, at(1000)), null);
    assert.equal(await revokeDevice(device.id), true);
    assert.equal(await verifySession(cookie, at(2000)), null);
  });

  test("24 小时后换发新凭据；旧值 60 秒内仍可用，之后失效", async () => {
    const { cookie } = await issueSession("手机", NOW);
    const rotated = await verifySession(cookie, at(DAY_MS + 1));
    assert.ok(rotated?.rotatedCookie);
    assert.notEqual(rotated.rotatedCookie, cookie);
    assert.equal(parseCookie(rotated.rotatedCookie)?.deviceId, parseCookie(cookie)?.deviceId);
    assert.ok(await verifySession(cookie, at(DAY_MS + 30_000)));
    assert.equal(await verifySession(cookie, at(DAY_MS + 61_000)), null);
    assert.ok(await verifySession(rotated.rotatedCookie, at(DAY_MS + 61_000)));
  });

  test("30 天未使用即失效；签发 90 天后无论如何失效", async () => {
    const idle = await issueSession("平板", NOW);
    assert.equal(await verifySession(idle.cookie, at(31 * DAY_MS)), null);
    // 每次使用都跟上换发的新凭据，只有绝对期限能让它失效
    let current = (await issueSession("台式机", NOW)).cookie;
    for (let day = 20; day <= 80; day += 20) {
      const owner = await verifySession(current, at(day * DAY_MS));
      assert.ok(owner);
      current = owner.rotatedCookie ?? current;
    }
    assert.equal(await verifySession(current, at(91 * DAY_MS)), null);
  });

  test("设备表只存摘要，不含凭据明文", async () => {
    const { cookie } = await issueSession("审计", NOW);
    const token = parseCookie(cookie)?.token ?? "";
    const dump = JSON.stringify(await listDevices());
    assert.equal(dump.includes(token), false);
  });
});
