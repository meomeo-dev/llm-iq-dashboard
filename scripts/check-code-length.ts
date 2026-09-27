#!/usr/bin/env tsx
/**
 * 代码长度门禁检查脚本（check-code-length.ts）。
 *
 * 选项：
 *   --config <path>  指定策略文件路径（默认 config/code-length-policy.yaml）
 *   --json           以 JSON 格式输出机器可读结果
 *   --cwd <path>     指定项目工作目录（默认 process.cwd()）
 *
 * 退出码：
 *   0：所有文件与函数在限额内，或超出部分已在豁免清单内
 *   1：存在未豁免的超标文件或函数
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import yaml from "yaml";
import { checkCodeLength } from "./code-length/checker";
import { formatHumanReport, formatJsonReport } from "./code-length/reporter";
import type { CodeLengthPolicy, LengthCheckReport } from "./code-length/types";

interface ParsedCliOptions {
  configPath: string;
  json: boolean;
  cwd: string;
}

export function parseCliOptions(args: readonly string[]): ParsedCliOptions {
  let configPath = "config/code-length-policy.yaml";
  let json = false;
  let cwd = process.cwd();

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--config" && args[i + 1] !== undefined) {
      configPath = args[i + 1]!;
      i += 1;
    } else if (arg === "--json") {
      json = true;
    } else if (arg === "--cwd" && args[i + 1] !== undefined) {
      cwd = resolve(process.cwd(), args[i + 1]!);
      i += 1;
    }
  }

  return { configPath, json, cwd };
}

export function loadPolicy(policyPath: string): CodeLengthPolicy {
  const content = readFileSync(policyPath, "utf8");
  const parsed = yaml.parse(content) as Partial<CodeLengthPolicy>;

  return {
    thresholds: {
      files: parsed.thresholds?.files ?? { ts: 500, tsx: 300, css: 300 },
      functions: parsed.thresholds?.functions ?? { ts: 50, tsx: 80 },
    },
    include: parsed.include ?? ["src/**/*.{ts,tsx,css}", "scripts/**/*.{ts,tsx,css}"],
    exclude: parsed.exclude ?? ["src/core/prompts/**", "test/fixtures/**"],
    allowlist: parsed.allowlist ?? [],
  };
}

export function runLengthCheck(
  args: readonly string[] = process.argv.slice(2),
  out: (msg: string) => void = console.log,
): LengthCheckReport {
  const opts = parseCliOptions(args);
  const fullConfigPath = resolve(opts.cwd, opts.configPath);
  const policy = loadPolicy(fullConfigPath);

  const report = checkCodeLength({ cwd: opts.cwd, policy });
  if (opts.json) {
    out(formatJsonReport(report));
  } else {
    out(formatHumanReport(report));
  }

  return report;
}

if (process.argv[1]?.endsWith("check-code-length.ts")) {
  const report = runLengthCheck();
  process.exit(report.success ? 0 : 1);
}
