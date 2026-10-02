/** 直出约束：配置解析、YAML 写回、附在提示词之后的拼接 */

import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, describe, test } from "node:test";
import { parseHarnessGuard } from "@/core/config/loader";
import { DEFAULT_HARNESS_GUARD_TEXT } from "@/core/config/types";
import { applyConfigPatch } from "@/core/config-writer";
import { composePromptText } from "@/core/run-attempt";

describe("parseHarnessGuard", () => {
  test("不写即关闭，原文为缺省英文", () => {
    assert.deepEqual(parseHarnessGuard(undefined, []), { enabled: false, text: DEFAULT_HARNESS_GUARD_TEXT });
  });

  test("开启且自定义原文：原样保留（去首尾空白）", () => {
    const errors: string[] = [];
    assert.deepEqual(parseHarnessGuard({ enabled: true, text: "  直接画，不要联网。 " }, errors), { enabled: true, text: "直接画，不要联网。" });
    assert.deepEqual(errors, []);
  });

  test("开启但原文为空：报错并回落缺省英文", () => {
    const errors: string[] = [];
    assert.deepEqual(parseHarnessGuard({ enabled: true, text: "   " }, errors), { enabled: true, text: DEFAULT_HARNESS_GUARD_TEXT });
    assert.match(errors[0] ?? "", /run\.harnessGuard 开启时 text 不能为空/);
  });

  test("enabled 非布尔：报错并按关闭处理", () => {
    const errors: string[] = [];
    assert.equal(parseHarnessGuard({ enabled: "yes" }, errors).enabled, false);
    assert.match(errors[0] ?? "", /run\.harnessGuard\.enabled/);
  });
});

describe("composePromptText", () => {
  test("未开启即题目原文，一个字符都不动", () => {
    assert.equal(composePromptText("Generate an SVG of a pelican riding a bicycle", null), "Generate an SVG of a pelican riding a bicycle");
  });

  test("开启时原文在前、约束另起一段在后", () => {
    assert.equal(composePromptText("Draw a pelican.\n", "Do not browse."), "Draw a pelican.\n\nDo not browse.");
  });
});

describe("YAML 写回", () => {
  let workdir: string;
  before(async () => {
    workdir = await mkdtemp(join(tmpdir(), "llm-iq-guard-"));
  });
  after(async () => {
    await rm(workdir, { recursive: true, force: true });
  });

  test("harnessGuard 按子键写入，再读回一致；关闭时也保留原文", async () => {
    const path = join(workdir, "pelican.config.yaml");
    await writeFile(path, "run:\n  promptIds: [classic-v1]\n  # 注释要保留\n  concurrency: 2\ntargets:\n  - { cli: claude, model: m-a, effort: low }\n", "utf8");
    const saved = await applyConfigPatch(path, { run: { harnessGuard: { enabled: true, text: "Draw it directly." } } });
    assert.deepEqual(saved.run.harnessGuard, { enabled: true, text: "Draw it directly." });
    const text = await readFile(path, "utf8");
    assert.match(text, /# 注释要保留/);
    assert.match(text, /harnessGuard:\n    enabled: true\n    text: Draw it directly\./);
    const off = await applyConfigPatch(path, { run: { harnessGuard: { enabled: false, text: "Draw it directly." } } });
    assert.deepEqual(off.run.harnessGuard, { enabled: false, text: "Draw it directly." });
  });
});
