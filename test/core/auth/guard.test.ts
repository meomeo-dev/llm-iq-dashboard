/** 路由守卫：cookie 解析、来源 IP、写操作头与限流 */

import assert from "node:assert/strict";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { before, describe, test } from "node:test";
import { ACTION_HEADER, clientIp, isSecureRequest, readCookie, requireOwner, requireOwnerAction } from "@/core/auth/guard";
import { createRateLimiter } from "@/core/auth/rate-limit";
import { issueSession, SESSION_COOKIE } from "@/core/auth/session";

before(async () => {
  process.env.PELICAN_DATA_DIR = await mkdtemp(join(tmpdir(), "guard-"));
});

const request = (headers: Record<string, string>, url = "http://127.0.0.1:3000/api/run"): Request =>
  new Request(url, { method: "POST", headers });

describe("requireOwner / requireOwnerAction", () => {
  test("没有 cookie 为 401；有 cookie 没有操作头为 403；两者齐全放行", async () => {
    const { cookie, device } = await issueSession("笔记本");
    assert.equal((await requireOwner(request({}))).ok, false);
    const noHeader = await requireOwnerAction(request({ cookie: `${SESSION_COOKIE}=${cookie}` }), "run");
    assert.deepEqual(noHeader.ok ? null : noHeader.status, 403);
    const full = await requireOwnerAction(request({ cookie: `${SESSION_COOKIE}=${cookie}`, [ACTION_HEADER]: "1" }), "run");
    assert.equal(full.ok && full.owner.deviceId, device.id);
  });
});

describe("请求头解析", () => {
  test("readCookie 从多段 cookie 里取指定项", () => {
    const headers = new Headers({ cookie: `a=1; ${SESSION_COOKIE}=dev.tok%3D; b=2` });
    assert.equal(readCookie(headers, SESSION_COOKIE), "dev.tok=");
    assert.equal(readCookie(headers, "missing"), null);
  });

  test("clientIp 取 X-Forwarded-For 第一段；isSecureRequest 认代理声明的 https", () => {
    assert.equal(clientIp(request({ "x-forwarded-for": "203.0.113.5, 10.0.0.1" })), "203.0.113.5");
    assert.equal(clientIp(request({})), null);
    assert.equal(isSecureRequest(request({ "x-forwarded-proto": "https" })), true);
    assert.equal(isSecureRequest(request({})), false);
    assert.equal(isSecureRequest(request({}, "https://example.test/api/run")), true);
  });
});

describe("createRateLimiter", () => {
  test("窗口内超过上限拒绝，窗口滑过后恢复", () => {
    const limiter = createRateLimiter(2, 1000);
    const t0 = new Date("2026-09-26T10:00:00Z");
    assert.equal(limiter.take("ip", t0), true);
    assert.equal(limiter.take("ip", t0), true);
    assert.equal(limiter.take("ip", t0), false);
    assert.equal(limiter.take("other", t0), true);
    assert.equal(limiter.take("ip", new Date(t0.getTime() + 1001)), true);
  });
});
