/** 只读部署模式下的鉴权守卫与配对拦截测试 */

import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, test } from "node:test";
import { ACTION_HEADER, requireOwner, requireOwnerAction } from "@/core/auth/guard";
import { SESSION_COOKIE, verifySession } from "@/core/auth/session";
import { loadServerKey, writeJsonFile } from "@/core/auth/store";
import { POST as pairPost } from "@/app/api/pair/route";

const originalEnv = { ...process.env };

describe("只读部署鉴权守卫", () => {
  beforeEach(() => {
    process.env.PELICAN_READONLY = "1";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  test("所有写接口经 requireOwnerAction 均返回 403（中文说明'只读部署'）", async () => {
    const reqWithoutHeader = new Request("http://127.0.0.1:3000/api/run", {
      method: "POST",
    });
    const resWithoutHeader = await requireOwnerAction(reqWithoutHeader, "run");
    assert.deepEqual(resWithoutHeader, {
      ok: false,
      status: 403,
      error: "只读部署",
    });

    // 即使带了伪造的 cookie 和操作头，在只读模式下一律拒绝
    const reqWithHeader = new Request("http://127.0.0.1:3000/api/config", {
      method: "PUT",
      headers: {
        cookie: `${SESSION_COOKIE}=fake_device.fake_token`,
        [ACTION_HEADER]: "1",
      },
    });
    const resWithHeader = await requireOwnerAction(reqWithHeader, "config");
    assert.deepEqual(resWithHeader, {
      ok: false,
      status: 403,
      error: "只读部署",
    });
  });

  test("所有者会话一律不被承认：verifySession 返回 null 且不触达密钥文件", async () => {
    const session = await verifySession("any_device.any_token");
    assert.equal(session, null);

    const guard = await requireOwner(new Request("http://127.0.0.1:3000/api/run"));
    assert.deepEqual(guard, {
      ok: false,
      status: 401,
      error: "需要所有者登录",
    });
  });

  test("配对 API (POST /api/pair) 返回 404", async () => {
    const req = new Request("http://127.0.0.1:3000/api/pair", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ code: "123456" }),
    });
    const res = await pairPost(req);
    assert.equal(res.status, 404);
    const body = (await res.json()) as { error?: string };
    assert.equal(body.error, "只读部署");
  });

  test("不得触达 server.key 生成或写入", async () => {
    await assert.rejects(
      async () => {
        await loadServerKey();
      },
      {
        message: /只读部署下不可生成或读取 server\.key/,
      },
    );

    await assert.rejects(
      async () => {
        await writeJsonFile("devices.json", {});
      },
      {
        message: /只读部署下不可写入数据/,
      },
    );
  });
});
