/**
 * 代码长度门禁测试：覆盖函数计数、匿名回调并入外层、CSS 行数、glob 排除、豁免生效与豁免过期。
 */

import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";
import yaml from "yaml";
import { checkCodeLength } from "../../scripts/code-length/checker";
import { runLengthCheck } from "../../scripts/check-code-length";
import type { CodeLengthPolicy } from "../../scripts/code-length/types";

describe("代码长度门禁 check-code-length", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), "llm-iq-length-test-"));
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  function createPolicy(overrides?: Partial<CodeLengthPolicy>): CodeLengthPolicy {
    return {
      thresholds: {
        files: { ts: 500, tsx: 300, css: 300 },
        functions: { ts: 50, tsx: 80 },
      },
      include: ["src/**/*.{ts,tsx,css}"],
      exclude: ["src/core/prompts/**", "test/fixtures/**"],
      allowlist: [],
      ...overrides,
    };
  }

  it("1. 函数计数：超过 50 行的命名业务函数被判定超标", async () => {
    const srcDir = join(tempDir, "src");
    await mkdir(srcDir, { recursive: true });

    // 构造一个 55 行的命名函数
    const fnLines = [
      "export function bigCalculation(): number {",
      ...Array.from({ length: 53 }, (_, i) => `  const x${i} = ${i};`),
      "  return 42;",
      "}",
    ];
    await writeFile(join(srcDir, "math.ts"), fnLines.join("\n"));

    const policy = createPolicy();
    const report = checkCodeLength({ cwd: tempDir, policy });

    assert.equal(report.success, false);
    assert.equal(report.unexemptedViolations.length, 1);
    assert.equal(report.unexemptedViolations[0]?.type, "function");
    assert.equal(report.unexemptedViolations[0]?.symbol, "bigCalculation");
    assert.equal(report.unexemptedViolations[0]?.lines, 56);
  });

  it("2. 匿名回调并入外层：匿名 map / filter 回调不独立统计，行数计入外层函数", async () => {
    const srcDir = join(tempDir, "src");
    await mkdir(srcDir, { recursive: true });

    // 外层函数 25 行，内含一个 10 行的匿名回调，总函数仅 1 个且行数为 25
    const code = [
      "export function processItems(items: number[]): number[] {",
      "  return items.map((item) => {",
      "    const step1 = item * 2;",
      "    const step2 = step1 + 3;",
      "    const step3 = step2 * 4;",
      "    const step4 = step3 - 1;",
      "    return step4;",
      "  });",
      "}",
    ];
    await writeFile(join(srcDir, "items.ts"), code.join("\n"));

    const policy = createPolicy();
    const report = checkCodeLength({ cwd: tempDir, policy });

    assert.equal(report.success, true);
    assert.equal(report.violations.length, 0);
  });

  it("3. CSS 行数：超出 300 行的 CSS 样式文件被捕获", async () => {
    const srcDir = join(tempDir, "src");
    await mkdir(srcDir, { recursive: true });

    const cssContent = Array.from({ length: 320 }, (_, i) => `.rule-${i} { color: red; }`).join(
      "\n",
    );
    await writeFile(join(srcDir, "style.css"), cssContent);

    const policy = createPolicy();
    const report = checkCodeLength({ cwd: tempDir, policy });

    assert.equal(report.success, false);
    assert.equal(report.unexemptedViolations.length, 1);
    assert.equal(report.unexemptedViolations[0]?.type, "file");
    assert.equal(report.unexemptedViolations[0]?.file, "src/style.css");
    assert.equal(report.unexemptedViolations[0]?.lines, 320);
    assert.equal(report.unexemptedViolations[0]?.standardLimit, 300);
  });

  it("4. glob 排除：exclude 排除目录下的超长文件不计入违规", async () => {
    const promptDir = join(tempDir, "src", "core", "prompts");
    await mkdir(promptDir, { recursive: true });

    // 在排除目录下放置 600 行的超标文件
    const promptContent = Array.from({ length: 600 }, (_, i) => `// line ${i}`).join("\n");
    await writeFile(join(promptDir, "dataset.ts"), promptContent);

    const policy = createPolicy({
      exclude: ["src/core/prompts/**"],
    });
    const report = checkCodeLength({ cwd: tempDir, policy });

    assert.equal(report.success, true);
    assert.equal(report.totalFiles, 0);
  });

  it("5. 豁免生效：在 allowlist 中且未超出豁免额度时不失败", async () => {
    const srcDir = join(tempDir, "src");
    await mkdir(srcDir, { recursive: true });

    const fnLines = [
      "export function legacyWorker(): void {",
      ...Array.from({ length: 60 }, (_, i) => `  console.log(${i});`),
      "}",
    ];
    await writeFile(join(srcDir, "legacy.ts"), fnLines.join("\n"));

    const policy = createPolicy({
      allowlist: [
        {
          path: "src/legacy.ts",
          symbol: "legacyWorker",
          limit: 70,
          reason: "待下一轮重构",
        },
      ],
    });

    const report = checkCodeLength({ cwd: tempDir, policy });
    assert.equal(report.success, true);
    assert.equal(report.unexemptedViolations.length, 0);
    assert.equal(report.exemptedViolations.length, 1);
    assert.equal(report.exemptedViolations[0]?.exempted, true);
    assert.equal(report.exemptedViolations[0]?.reason, "待下一轮重构");
  });

  it("6. 豁免过期：被豁免对象已达标时检测出过期项但不判定失败", async () => {
    const srcDir = join(tempDir, "src");
    await mkdir(srcDir, { recursive: true });

    // 只有 10 行，完全符合标准硬上限 50 行
    const fnLines = [
      "export function cleanedUp(): void {",
      "  console.log('done');",
      "}",
    ];
    await writeFile(join(srcDir, "clean.ts"), fnLines.join("\n"));

    const policy = createPolicy({
      allowlist: [
        {
          path: "src/clean.ts",
          symbol: "cleanedUp",
          limit: 80,
          reason: "历史遗留豁免",
        },
      ],
    });

    const report = checkCodeLength({ cwd: tempDir, policy });
    // 门禁检查依然成功（不因过期而报错）
    assert.equal(report.success, true);
    assert.equal(report.expiredAllowlist.length, 1);
    assert.equal(report.expiredAllowlist[0]?.path, "src/clean.ts");
    assert.equal(report.expiredAllowlist[0]?.symbol, "cleanedUp");
    assert.equal(report.expiredAllowlist[0]?.actual, 3);
  });

  it("CLI 集成：runLengthCheck 支持 --json 输出", async () => {
    const srcDir = join(tempDir, "src");
    const cfgDir = join(tempDir, "config");
    await mkdir(srcDir, { recursive: true });
    await mkdir(cfgDir, { recursive: true });

    await writeFile(join(srcDir, "ok.ts"), "export const a = 1;\n");
    const policy = createPolicy();
    await writeFile(join(cfgDir, "policy.yaml"), yaml.stringify(policy));

    const outputs: string[] = [];
    const report = runLengthCheck(
      ["--config", "config/policy.yaml", "--cwd", tempDir, "--json"],
      (msg) => outputs.push(msg),
    );

    assert.equal(report.success, true);
    const parsed = JSON.parse(outputs.join("\n"));
    assert.equal(parsed.success, true);
    assert.equal(parsed.totalFiles, 1);
  });
});
