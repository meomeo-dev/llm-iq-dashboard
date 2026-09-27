/** 健康检查 API 测试：/api/health 路由契约验证 */

import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { GET } from "@/app/api/health/route";
import { _resetDeployModeWarningForTest } from "@/core/deploy-mode";
import { _resetDataSourceInstancesForTest } from "@/core/data-source";

describe("GET /api/health 健康检查接口", () => {
  const origSource = process.env.PELICAN_DATA_SOURCE;
  const origReadonly = process.env.PELICAN_READONLY;
  const origRepoUrl = process.env.PELICAN_DATA_REPO_URL;

  function restoreEnv() {
    process.env.PELICAN_DATA_SOURCE = origSource;
    process.env.PELICAN_READONLY = origReadonly;
    process.env.PELICAN_DATA_REPO_URL = origRepoUrl;
    _resetDeployModeWarningForTest();
    _resetDataSourceInstancesForTest();
  }

  test("本地模式下返回 mode 信息且 dataRepo 为 null", async () => {
    try {
      delete process.env.PELICAN_DATA_SOURCE;
      delete process.env.PELICAN_READONLY;
      _resetDeployModeWarningForTest();
      _resetDataSourceInstancesForTest();

      const res = await GET();
      assert.equal(res.status, 200);
      const data = await res.json();

      assert.deepEqual(data.mode, { readonly: false, dataSource: "local" });
      assert.equal(data.dataRepo, null);
      assert.equal(typeof data.version, "string");
    } finally {
      restoreEnv();
    }
  });

  test("远程模式下若数据仓不可达，返回 HTTP 200 且 reachable 为 false 与中文原因", async () => {
    try {
      process.env.PELICAN_DATA_SOURCE = "remote";
      process.env.PELICAN_READONLY = "1";
      // 指向一个不可达的地址
      process.env.PELICAN_DATA_REPO_URL = "http://127.0.0.1:59999/unreachable";
      _resetDeployModeWarningForTest();
      _resetDataSourceInstancesForTest();

      const res = await GET();
      assert.equal(res.status, 200);
      const data = await res.json();

      assert.deepEqual(data.mode, { readonly: true, dataSource: "remote" });
      assert.ok(data.dataRepo !== null);
      assert.equal(data.dataRepo.reachable, false);
      assert.equal(data.dataRepo.schemaVersion, null);
      assert.equal(data.dataRepo.totalRuns, null);
      assert.equal(data.dataRepo.latestDay, null);
      assert.match(data.dataRepo.reason, /远程数据源不可达/);
      assert.equal(typeof data.version, "string");
    } finally {
      restoreEnv();
    }
  });
});
