/**
 * 四大名著候选集的结构约束：每部十条、id 与回数一致、每条都是完整的 SVG 题面、
 * 不带变量且不可编辑。候选 id 写进运行记录，重名或格式漂移会让历史结果对不上号。
 */

import assert from "node:assert/strict";
import { test } from "node:test";
import { BUILTIN_PROMPTS } from "@/core/prompt";

const POOLS: Record<string, string> = {
  "shuihu-v1": "shuihu",
  "shuihu-anim-v1": "shuihu-anim",
  "xiyou-v1": "xiyou",
  "xiyou-anim-v1": "xiyou-anim",
  "sanguo-v1": "sanguo",
  "sanguo-anim-v1": "sanguo-anim",
  "honglou-v1": "honglou",
  "honglou-anim-v1": "honglou-anim",
};
const CANDIDATE_ID = /^([a-z]+(?:-anim)?)-(\d{3})$/;

for (const [promptId, book] of Object.entries(POOLS)) {
  test(`${promptId}：十条候选、结构完整`, () => {
    const spec = BUILTIN_PROMPTS.find((item) => item.id === promptId);
    assert.ok(spec !== undefined, `${promptId} 未登记`);
    assert.equal(spec.immutable, true);
    assert.deepEqual(spec.variables, []);
    assert.equal(spec.candidates.length, 10);
    assert.equal(new Set(spec.candidates.map((candidate) => candidate.id)).size, 10, "候选 id 重复");

    for (const candidate of spec.candidates) {
      const match = CANDIDATE_ID.exec(candidate.id);
      assert.ok(match !== null, `候选 id 格式不对：${candidate.id}`);
      assert.equal(match[1], book);
      assert.ok(candidate.label.startsWith(`第${Number(match[2])}回`), `标签与回数不一致：${candidate.id} ${candidate.label}`);
      assert.ok(candidate.text.includes("SVG"), `${candidate.id} 没有要求输出 SVG`);
      assert.ok(!candidate.text.includes("{{"), `${candidate.id} 含占位符`);
    }
  });
}
