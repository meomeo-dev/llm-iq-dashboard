/**
 * 雷军骑自行车测试题（leijun-v1）测试：
 * 验证提示词登记、结构完整性、输入图片 URL / Markdown 嵌入及本地素材存在性。
 */

import assert from "node:assert/strict";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { BUILTIN_PROMPTS, LEIJUN_PROMPT, resolvePrompt } from "@/core/prompt";

test("leijun-v1：登记在内置提示词中且不可变", () => {
  assert.equal(LEIJUN_PROMPT.id, "leijun-v1");
  assert.equal(LEIJUN_PROMPT.label, "雷军骑自行车（Lei Jun on Bicycle）");
  assert.equal(LEIJUN_PROMPT.immutable, true);
  assert.equal(LEIJUN_PROMPT.verified, true);
  assert.deepEqual(LEIJUN_PROMPT.variables, []);
  assert.deepEqual(LEIJUN_PROMPT.candidates, []);

  const registered = BUILTIN_PROMPTS.find((p) => p.id === "leijun-v1");
  assert.ok(registered !== undefined, "leijun-v1 未在 BUILTIN_PROMPTS 中登记");
  assert.equal(registered, LEIJUN_PROMPT);

  const resolved = resolvePrompt("leijun-v1");
  assert.equal(resolved.id, "leijun-v1");
});

test("leijun-v1：提示词包含输入图片与关键要素要求", () => {
  const imageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLDs8B3MO0pHXY583y51i9lQs0mvoKTcn5SiELphxvfw&s";
  assert.ok(LEIJUN_PROMPT.template.includes(imageUrl), "提示词未包含输入的图片 URL");
  assert.ok(LEIJUN_PROMPT.template.includes(`![雷军骑自行车](${imageUrl})`), "提示词未包含 Markdown 格式的输入图片");
  assert.ok(LEIJUN_PROMPT.template.includes("雷军"), "提示词未提及雷军");
  assert.ok(LEIJUN_PROMPT.template.includes("自行车"), "提示词未提及自行车");
  assert.ok(LEIJUN_PROMPT.template.includes("SVG"), "提示词未要求生成 SVG");
  assert.ok(LEIJUN_PROMPT.template.includes("早上好"), "提示词未包含标志性的早上好要素");
  assert.ok(!LEIJUN_PROMPT.template.includes("{{"), "提示词含有未解析的变量模板占位符");
});

test("leijun-v1：本地参考图片文件存在且有效", () => {
  const localImagePath = join(process.cwd(), "public/images/leijun-bicycle.jpg");
  assert.ok(existsSync(localImagePath), `本地图片文件不存在: ${localImagePath}`);
  const stats = statSync(localImagePath);
  assert.ok(stats.size > 1000, `本地图片文件过小 (${stats.size} 字节)`);
});
