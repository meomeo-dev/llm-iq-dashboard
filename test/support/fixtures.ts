/**
 * 逐字节比对标记样本：UPDATE_FIXTURES=1 时把实际输出写回样本文件，供有意改动结构后一次性刷新；
 * 平时严格相等。
 */

import assert from "node:assert/strict";
import fs from "node:fs";

export function expectFixture(actual: string, filePath: string): void {
  if (process.env.UPDATE_FIXTURES === "1") {
    fs.writeFileSync(filePath, actual);
    return;
  }
  assert.equal(actual, fs.readFileSync(filePath, "utf-8"));
}
