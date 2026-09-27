import { strict as assert } from "node:assert";
import { describe, test } from "node:test";
import { dayPartition, runDirPath } from "../../src/core/data-repo/contract";

describe("数据仓分区", () => {
  test("按 runId 的 UTC 日期分区", () => {
    assert.deepEqual(dayPartition("20260927T021708Z"), {
      date: "2026-09-27",
      path: "runs/2026/09/27",
    });
    assert.equal(runDirPath("20260927T021708Z"), "runs/2026/09/27/20260927T021708Z");
  });

  test("非 runId 形式不分区", () => {
    assert.equal(dayPartition("scratch"), null);
    assert.equal(dayPartition("2026-09-27T020000Z"), null);
    assert.equal(runDirPath("../etc"), null);
  });
});
