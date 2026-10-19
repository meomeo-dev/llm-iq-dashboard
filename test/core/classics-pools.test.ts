/**
 * 四大名著候选集的结构约束：候选数与登记一致、id 与回数一致、回数递增不重复、静态与动态两套
 * 覆盖同一批回目、每条都是完整的 SVG 题面、不带变量且不可编辑。候选 id 写进运行记录，重名或
 * 格式漂移会让历史结果对不上号。带本回评判标准的候选，出处须指向该回。
 */

import assert from "node:assert/strict";
import { test } from "node:test";
import { BUILTIN_PROMPTS } from "@/core/prompt";

/** 套题 → [候选 id 前缀, 候选数] */
const POOLS: Record<string, readonly [string, number]> = {
  "shuihu-v1": ["shuihu", 10],
  "shuihu-anim-v1": ["shuihu-anim", 10],
  "xiyou-v1": ["xiyou", 100],
  "xiyou-anim-v1": ["xiyou-anim", 100],
  "sanguo-v1": ["sanguo", 31],
  "sanguo-anim-v1": ["sanguo-anim", 31],
  "honglou-v1": ["honglou", 10],
  "honglou-anim-v1": ["honglou-anim", 10],
};
const CANDIDATE_ID = /^([a-z]+(?:-anim)?)-(\d{3})$/;

function chapterNumbers(promptId: string): number[] {
  const spec = BUILTIN_PROMPTS.find((item) => item.id === promptId);
  assert.ok(spec !== undefined, `${promptId} 未登记`);
  return spec.candidates.map((candidate) => Number(CANDIDATE_ID.exec(candidate.id)?.[2]));
}

for (const [promptId, [book, count]] of Object.entries(POOLS)) {
  test(`${promptId}：${count} 条候选、结构完整`, () => {
    const spec = BUILTIN_PROMPTS.find((item) => item.id === promptId);
    assert.ok(spec !== undefined, `${promptId} 未登记`);
    assert.equal(spec.immutable, true);
    assert.deepEqual(spec.variables, []);
    assert.equal(spec.candidates.length, count);
    assert.equal(new Set(spec.candidates.map((candidate) => candidate.id)).size, count, "候选 id 重复");

    let previousChapter = 0;
    for (const candidate of spec.candidates) {
      const match = CANDIDATE_ID.exec(candidate.id);
      assert.ok(match !== null, `候选 id 格式不对：${candidate.id}`);
      assert.equal(match[1], book);
      const chapter = Number(match[2]);
      assert.ok(chapter > previousChapter, `回数没有递增：${candidate.id}`);
      previousChapter = chapter;
      assert.ok(candidate.label.startsWith(`第${chapter}回`), `标签与回数不一致：${candidate.id} ${candidate.label}`);
      assert.ok(candidate.text.includes("SVG"), `${candidate.id} 没有要求输出 SVG`);
      assert.ok(!candidate.text.includes("{{"), `${candidate.id} 含占位符`);
      if (candidate.standard) {
        assert.ok(
          candidate.standard.referenceSource?.includes(`第${match[2]}回`),
          `${candidate.id} 的出处没有指向第 ${chapter} 回`,
        );
      }
    }
  });
}

for (const book of ["shuihu", "xiyou", "sanguo", "honglou"]) {
  test(`${book}：静态与动态两套覆盖同一批回目`, () => {
    assert.deepEqual(chapterNumbers(`${book}-anim-v1`), chapterNumbers(`${book}-v1`));
  });
}
