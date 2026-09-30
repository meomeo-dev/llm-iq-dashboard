/** judge 配置：缺省开启，只认布尔值 */

import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { parseJudge } from "@/core/config/loader";

describe("parseJudge", () => {
  test("不写即开启", () => {
    assert.deepEqual(parseJudge(undefined, []), { enabled: true });
  });

  test("enabled: false 关闭", () => {
    assert.deepEqual(parseJudge({ enabled: false }, []), { enabled: false });
  });

  test("非布尔值报错并回落为开启", () => {
    const errors: string[] = [];
    assert.deepEqual(parseJudge({ enabled: "yes" }, errors), { enabled: true });
    assert.equal(errors[0], "judge.enabled 必须是布尔值");
  });
});
