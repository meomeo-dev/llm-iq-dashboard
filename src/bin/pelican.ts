#!/usr/bin/env tsx
/**
 * 鹈鹕基准与模型指纹统一 CLI 总入口：`pnpm pelican <command> [options]`
 *
 * 将基准运行（`run`）、模型指纹（`fingerprint`/`fp`）、
 * 数据仓同步（`sync`）、环境自查（`preflight`）、登录引导（`onboard`）、
 * 设备配对（`pair`）、单价目录（`pricing`）、题库校验（`prompts`）、
 * 常驻调度（`scheduler`）与分容器执行器（`runner`）整合在同一棵命令树下，
 * 同时兼容历史冒号别名（如 `run:once`、`fingerprint:fill`）。
 */

import { pathToFileURL } from "node:url";
import {
  extractGlobalPathFlags,
  hasHelpFlag,
  stripPnpmSeparators,
  suggestClosestMatch,
} from "./cli-args";
import {
  formatFingerprintHelp,
  runModelFingerprintCli,
  type FingerprintCliDeps,
} from "./model-fingerprint";
import { formatOnboardHelp, runOnboardCli } from "./onboard";
import { formatPairHelp, runPairCli } from "./pair";
import { formatPreflightHelp, runPreflightCli } from "./preflight";
import { formatPricingSyncHelp, runPricingSyncCli } from "./pricing-sync";
import { formatRunOnceHelp, runPelicanOnceCli, type RunOnceCliDeps } from "./run-once";
import { formatRunnerHelp, runRunnerCli } from "./runner";
import { formatSchedulerHelp, runSchedulerCli } from "./scheduler";
import { formatSyncHelp, runSyncCli } from "./sync-data";
import { formatValidatePromptsHelp, runValidatePromptsCli } from "./validate-prompts";

export type PelicanSubcommand =
  | "run"
  | "fingerprint"
  | "sync"
  | "preflight"
  | "onboard"
  | "pair"
  | "pricing"
  | "prompts"
  | "scheduler"
  | "runner"
  | "help";

const CANONICAL_SUBCOMMANDS: readonly PelicanSubcommand[] = [
  "run",
  "fingerprint",
  "sync",
  "preflight",
  "onboard",
  "pair",
  "pricing",
  "prompts",
  "scheduler",
  "runner",
  "help",
];

const SUBCOMMAND_ALIASES: Readonly<Record<string, { cmd: PelicanSubcommand; prepend?: string }>> = {
  run: { cmd: "run" },
  "run:once": { cmd: "run" },
  fingerprint: { cmd: "fingerprint" },
  fp: { cmd: "fingerprint" },
  "fingerprint:status": { cmd: "fingerprint", prepend: "status" },
  "fingerprint:fill": { cmd: "fingerprint", prepend: "fill" },
  "fingerprint:check": { cmd: "fingerprint", prepend: "check" },
  "fingerprint:self-test": { cmd: "fingerprint", prepend: "self-test" },
  "fingerprint:export": { cmd: "fingerprint", prepend: "export" },
  "fingerprint:import": { cmd: "fingerprint", prepend: "import" },
  "fp:status": { cmd: "fingerprint", prepend: "status" },
  "fp:fill": { cmd: "fingerprint", prepend: "fill" },
  "fp:check": { cmd: "fingerprint", prepend: "check" },
  "fp:self-test": { cmd: "fingerprint", prepend: "self-test" },
  "fp:export": { cmd: "fingerprint", prepend: "export" },
  "fp:import": { cmd: "fingerprint", prepend: "import" },
  sync: { cmd: "sync" },
  "sync:data": { cmd: "sync" },
  preflight: { cmd: "preflight" },
  onboard: { cmd: "onboard" },
  pair: { cmd: "pair" },
  pricing: { cmd: "pricing" },
  "pricing:sync": { cmd: "pricing" },
  prompts: { cmd: "prompts" },
  "validate:prompts": { cmd: "prompts" },
  scheduler: { cmd: "scheduler" },
  runner: { cmd: "runner" },
  help: { cmd: "help" },
};

export interface PelicanCliDeps {
  runOnceDeps?: RunOnceCliDeps;
  fingerprintDeps?: FingerprintCliDeps;
  writeLine?: (line: string) => void;
  writeError?: (line: string) => void;
}

const PELICAN_TOP_HELP_LINES: readonly string[] = [
  "用法: pnpm pelican <command> [options]",
  "",
  "核心评测与模型指纹命令:",
  "  run [options]                  手动执行一轮鹈鹕 SVG 基准评测（别名: run:once）",
  "  fingerprint | fp <subcommand>  模型指纹采集、核验与基准管理（status|fill|check|self-test|export|import）",
  "  sync [options]                 脱敏同步评测结果至公开数据仓（别名: sync:data）",
  "",
  "环境、配置与常驻服务命令:",
  "  preflight [--cli <cli>]        检查 Node、配置、CLI 登录状态、价格目录与预计费用",
  "  onboard [cli...]               交互式引导未登录的 CLI 完成账号授权",
  "  pair [open|list|revoke|...]    管理看板所有者配对码与已授权设备",
  "  pricing [sync] [--latest]      下载并校验模型单价目录（别名: pricing:sync）",
  "  prompts [validate]             校验题库 PromptSchema 与黄金标准完整性（别名: validate:prompts）",
  "  scheduler                      启动常驻定时调度器进程",
  "  runner                         启动分容器执行器常驻进程",
  "  help [command]                 查看全局或指定子命令的帮助说明",
  "",
  "全局路径覆盖选项（所有子命令通用）:",
  "  -c, --config <path>            覆盖配置文件路径（同 PELICAN_CONFIG）",
  "  --data-dir <path>              覆盖数据目录路径（同 PELICAN_DATA_DIR）",
  "  -h, --help                     显示帮助信息并退出",
  "",
  "快速示例:",
  "  pnpm pelican run --cli agy --model gemini-3.8-flash --effort low --prompt classic-v1 --dry-run",
  "  pnpm pelican fp status --cli agy --model gemini-3.8-flash --effort low",
  "  pnpm pelican fp check --cli agy --model gemini-3.8-flash --probe uuid --yes",
];

export function formatPelicanHelp(subcommand?: string, nestedSubcommand?: string): string {
  const mapped = subcommand ? SUBCOMMAND_ALIASES[subcommand] : undefined;
  if (mapped && mapped.cmd !== "help") {
    switch (mapped.cmd) {
      case "run":
        return formatRunOnceHelp();
      case "fingerprint":
        return formatFingerprintHelp(mapped.prepend ?? nestedSubcommand);
      case "sync":
        return formatSyncHelp();
      case "preflight":
        return formatPreflightHelp();
      case "onboard":
        return formatOnboardHelp();
      case "pair":
        return formatPairHelp();
      case "pricing":
        return formatPricingSyncHelp();
      case "prompts":
        return formatValidatePromptsHelp();
      case "scheduler":
        return formatSchedulerHelp();
      case "runner":
        return formatRunnerHelp();
    }
  }
  return PELICAN_TOP_HELP_LINES.join("\n");
}

function resolvePelicanCommand(rawToken: string): { cmd: PelicanSubcommand; prepend?: string } {
  if (rawToken === "judge" || rawToken === "judge:backfill") {
    throw new Error("历史作品评审回填命令（judge:backfill）已停用");
  }
  if (rawToken === "fingerprint:rescore" || rawToken === "fp:rescore") {
    throw new Error("模型指纹历史核验重算回填命令（rescore）已停用");
  }
  const direct = SUBCOMMAND_ALIASES[rawToken];
  if (direct) return direct;
  const suggestion = suggestClosestMatch(rawToken, Object.keys(SUBCOMMAND_ALIASES), 2);
  const hint = suggestion ? `（您是否想输入 ${suggestion}？）` : "";
  throw new Error(
    `未知子命令：${rawToken}${hint}（可选：${CANONICAL_SUBCOMMANDS.join(" | ")}；运行 pnpm pelican --help 查看帮助）`,
  );
}

async function dispatchPelicanSubcommand(
  cmd: PelicanSubcommand,
  rest: readonly string[],
  deps: PelicanCliDeps,
  writeLine: (line: string) => void,
  writeError: (line: string) => void,
): Promise<void> {
  switch (cmd) {
    case "run":
      await runPelicanOnceCli(rest, { ...deps.runOnceDeps, writeLine, writeError });
      return;
    case "fingerprint":
      await runModelFingerprintCli(rest, { ...deps.fingerprintDeps, writeLine });
      return;
    case "sync": {
      const code = await runSyncCli(rest, writeLine, writeError);
      if (code !== 0) process.exitCode = code;
      return;
    }
    case "preflight": {
      const ok = await runPreflightCli(rest, writeLine);
      if (!ok) process.exitCode = 1;
      return;
    }
    case "onboard":
      await runOnboardCli(rest, writeLine);
      return;
    case "pair":
      await runPairCli(rest, writeLine);
      return;
    case "pricing":
      await runPricingSyncCli(rest, writeLine);
      return;
    case "prompts":
      await runValidatePromptsCli(rest, writeLine);
      return;
    case "scheduler":
      await runSchedulerCli(rest, writeLine);
      return;
    case "runner":
      await runRunnerCli(rest, writeLine);
      return;
    case "help":
      writeLine(formatPelicanHelp(rest[0], rest[1]));
      return;
  }
}

export async function runPelicanCli(
  argv: readonly string[] = process.argv.slice(2),
  deps: PelicanCliDeps = {},
): Promise<void> {
  const writeLine = deps.writeLine ?? ((line: string) => console.log(line));
  const writeError = deps.writeError ?? ((line: string) => console.error(line));
  const remaining = stripPnpmSeparators(extractGlobalPathFlags(argv));
  if (remaining.length === 0 || remaining[0] === "-h" || remaining[0] === "--help") {
    writeLine(formatPelicanHelp());
    return;
  }

  if (remaining[0] === "help") {
    writeLine(formatPelicanHelp(remaining[1], remaining[2]));
    return;
  }

  if (hasHelpFlag(remaining)) {
    const firstNonFlagIdx = remaining.findIndex((t) => !t.startsWith("-"));
    if (firstNonFlagIdx === -1) {
      writeLine(formatPelicanHelp());
      return;
    }
    const resolved = resolvePelicanCommand(remaining[firstNonFlagIdx]!);
    const tail = remaining.slice(firstNonFlagIdx + 1);
    const restForHelp = resolved.prepend ? [resolved.prepend, ...tail] : tail;
    await dispatchPelicanSubcommand(resolved.cmd, restForHelp, deps, writeLine, writeError);
    return;
  }

  const resolved = resolvePelicanCommand(remaining[0]!);
  const subArgs = resolved.prepend
    ? [resolved.prepend, ...remaining.slice(1)]
    : remaining.slice(1);
  await dispatchPelicanSubcommand(resolved.cmd, subArgs, deps, writeLine, writeError);
}

const isMainModule =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
  runPelicanCli(process.argv.slice(2)).catch((cause: unknown) => {
    console.error(cause instanceof Error ? cause.message : String(cause));
    process.exit(1);
  });
}
