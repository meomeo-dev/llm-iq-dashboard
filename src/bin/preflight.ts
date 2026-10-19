#!/usr/bin/env tsx
/**
 * 环境自查：`pnpm preflight [--cli <cli>]` / `pnpm pelican preflight [options]`
 *
 * 检查项见 environment-report.ts；配置用到的（或指定 --cli 的）项目有问题时以非零退出。
 */

import { pathToFileURL } from "node:url";
import { CLI_KINDS, type CliKind } from "../core/types";
import {
  canonicalizeFlag,
  consumeFlagValue,
  expandEqualsTokens,
  extractGlobalPathFlags,
  formatCliError,
  hasHelpFlag,
  normalizeMultiValueFlag,
  stripPnpmSeparators,
  suggestClosestMatch,
} from "./cli-args";
import { reportEnvironment } from "./environment-report";

const VALID_PREFLIGHT_FLAGS: readonly string[] = [
  "--cli",
  "--clis",
  "--config",
  "-c",
  "--data-dir",
  "--help",
  "-h",
];

export function formatPreflightHelp(): string {
  return [
    "用法: pnpm preflight [-- <options>]",
    "别名: pnpm pelican preflight [options]",
    "",
    "说明:",
    "  检查 Node 版本、生效配置、各家 CLI 安装与登录状态、价格目录及每轮预计费用。",
    "",
    "选项:",
    `  --cli <${CLI_KINDS.join("|")}>        仅探测指定的 CLI（可逗号分隔或重复传参）`,
    "  -c, --config <path>     覆盖配置文件路径（同 PELICAN_CONFIG）",
    "  --data-dir <path>       覆盖数据目录路径（同 PELICAN_DATA_DIR）",
    "  -h, --help              显示此帮助信息并退出",
  ].join("\n");
}

export function parsePreflightArgs(argv: readonly string[]): { clis?: CliKind[] } {
  const tokens = expandEqualsTokens(stripPnpmSeparators(extractGlobalPathFlags(argv)));
  let clis: CliKind[] | undefined;

  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i]!;
    if (canonicalizeFlag(token) === "--cli") {
      const raw = consumeFlagValue(tokens, i, token);
      const list = normalizeMultiValueFlag(clis, raw, token);
      for (const item of list) {
        if (!(CLI_KINDS as readonly string[]).includes(item)) {
          const hint = suggestClosestMatch(item, CLI_KINDS, 2);
          throw new Error(
            `无效的 --cli 取值：${item}${hint ? `（您是否想输入 ${hint}？）` : ""}（可选：${CLI_KINDS.join(", ")}）`,
          );
        }
      }
      clis = list as CliKind[];
      i += 1;
      continue;
    }
    throw new Error(formatCliError(token, VALID_PREFLIGHT_FLAGS, "pnpm preflight -- --help"));
  }

  return { clis };
}

export async function runPreflightCli(
  argv: readonly string[] = process.argv.slice(2),
  writeLine: (line: string) => void = console.log,
): Promise<boolean> {
  if (hasHelpFlag(stripPnpmSeparators(argv))) {
    writeLine(formatPreflightHelp());
    return true;
  }
  const parsed = parsePreflightArgs(argv);
  return reportEnvironment({ clis: parsed.clis });
}

const isMainModule =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
  runPreflightCli(process.argv.slice(2))
    .then((ok) => {
      if (!ok) process.exit(1);
    })
    .catch((cause: unknown) => {
      console.error(cause instanceof Error ? cause.message : cause);
      process.exit(1);
    });
}
