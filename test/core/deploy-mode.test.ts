/** 部署模式解析测试 */

import assert from "node:assert/strict";
import { afterEach, describe, test } from "node:test";
import {
  DEFAULT_DATA_REPO_URL,
  getDeployMode,
  isReadonly,
  isRemoteDataSource,
  _resetDeployModeWarningForTest,
} from "../../src/core/deploy-mode";

const originalEnv = { ...process.env };

function restoreEnv() {
  process.env = { ...originalEnv };
  _resetDeployModeWarningForTest();
}

describe("deploy-mode 部署模式解析", () => {
  afterEach(restoreEnv);

  test("缺省时为本地可写模式", () => {
    delete process.env.PELICAN_READONLY;
    delete process.env.PELICAN_DATA_SOURCE;
    delete process.env.PELICAN_DATA_REPO_URL;

    assert.equal(isReadonly(), false);
    assert.equal(isRemoteDataSource(), false);
    assert.deepEqual(getDeployMode(), {
      readonly: false,
      dataSource: "local",
      dataRepoUrl: DEFAULT_DATA_REPO_URL,
    });
  });

  test("PELICAN_READONLY=1 解析为强制只读部署", () => {
    process.env.PELICAN_READONLY = "1";
    delete process.env.PELICAN_DATA_SOURCE;

    assert.equal(isReadonly(), true);
    assert.equal(isRemoteDataSource(), false);
    assert.equal(getDeployMode().readonly, true);
    assert.equal(getDeployMode().dataSource, "local");
  });

  test("PELICAN_READONLY=true 同样解析为强制只读部署", () => {
    process.env.PELICAN_READONLY = "true";

    assert.equal(isReadonly(), true);
  });

  test("PELICAN_DATA_SOURCE=remote 隐含只读模式并给出警告", () => {
    delete process.env.PELICAN_READONLY;
    process.env.PELICAN_DATA_SOURCE = "remote";

    let warnCalled = 0;
    const origWarn = console.warn;
    console.warn = () => {
      warnCalled += 1;
    };
    try {
      const mode = getDeployMode();
      assert.equal(mode.readonly, true);
      assert.equal(mode.dataSource, "remote");
      assert.equal(isReadonly(), true);
      assert.equal(isRemoteDataSource(), true);
      assert.equal(warnCalled, 1);

      // 再次调用不重复报警
      getDeployMode();
      assert.equal(warnCalled, 1);
    } finally {
      console.warn = origWarn;
    }
  });

  test("PELICAN_DATA_SOURCE=remote 且 PELICAN_READONLY=1 时不发警告", () => {
    process.env.PELICAN_READONLY = "1";
    process.env.PELICAN_DATA_SOURCE = "remote";

    let warnCalled = 0;
    const origWarn = console.warn;
    console.warn = () => {
      warnCalled += 1;
    };
    try {
      const mode = getDeployMode();
      assert.equal(mode.readonly, true);
      assert.equal(mode.dataSource, "remote");
      assert.equal(warnCalled, 0);
    } finally {
      console.warn = origWarn;
    }
  });

  test("自定义 PELICAN_DATA_REPO_URL 正确读取", () => {
    process.env.PELICAN_DATA_REPO_URL = "https://custom-repo.example.com/data";

    assert.equal(
      getDeployMode().dataRepoUrl,
      "https://custom-repo.example.com/data",
    );
  });
});
