#!/usr/bin/env tsx
/**
 * 引导登录：`pnpm onboard [claude|codex|agy …]` / `pnpm pelican onboard [--cli <cli>]`
 *
 * 逐家检查配置用到的（或参数指定的）CLI，未登录的启动其自带登录流程并复查，最后打印
 * 与 `pnpm preflight` 相同的环境汇总。已登录的跳过，可重复运行。
 */

import { spawn } from "node:child_process";
import { pathToFileURL } from "node:url";
import { checkReadiness, type CliReadiness } from "../capabilities/readiness";
import { commandHint, runsInContainer } from "../core/command-hint";
import { loadConfig } from "../core/config";
import { configPath } from "../core/paths";
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

const VALID_ONBOARD_FLAGS: readonly string[] = [
  "--cli",
  "--clis",
  "--config",
  "-c",
  "--data-dir",
  "--help",
  "-h",
];

interface LoginFlow {
  command: string;
  args: string[];
  /** 启动登录前给人看的操作说明 */
  guide: string;
}

const LOGIN_FLOWS: Readonly<Record<CliKind, LoginFlow>> = {
  claude: {
    command: "claude",
    args: ["auth", "login", "--claudeai"],
    guide: "用 Claude 订阅账号登录。浏览器打不开时，复制终端里的链接到任意设备打开，授权后把授权码粘贴回来。",
  },
  codex: {
    command: "codex",
    args: ["login", "--device-auth"],
    guide: "用 ChatGPT 账号登录。在任意设备的浏览器打开终端里的链接，输入显示的设备码完成授权。",
  },
  agy: {
    command: "agy",
    args: [],
    guide:
      "进入 agy 后按提示登录 Google 账号（打不开浏览器时会给出链接，授权后粘贴回授权码）。" +
      "出现对话输入框即已登录，输入 /exit 或按两次 Ctrl+C 退出，回到这里继续。",
  },
};

export function formatOnboardHelp(): string {
  return [
    "用法: pnpm onboard [claude|codex|agy ...] [--cli <cli>]",
    "别名: pnpm pelican onboard [options]",
    "",
    "说明:",
    "  检查各家 CLI 登录状态，对未登录的 CLI 交互式启动其官方登录流程，完成后输出环境自查汇总。",
    "",
    "选项:",
    `  --cli <${CLI_KINDS.join("|")}>        指定要引导登录的 CLI（等价于直接传位置参数）`,
    "  -c, --config <path>     覆盖配置文件路径（同 PELICAN_CONFIG）",
    "  --data-dir <path>       覆盖数据目录路径（同 PELICAN_DATA_DIR）",
    "  -h, --help              显示此帮助信息并退出",
  ].join("\n");
}

function validateCliToken(item: string): CliKind {
  if ((CLI_KINDS as readonly string[]).includes(item)) {
    return item as CliKind;
  }
  const hint = suggestClosestMatch(item, CLI_KINDS, 2);
  throw new Error(
    `不认识的 CLI：${item}${hint ? `（您是否想输入 ${hint}？）` : ""}（可选 ${CLI_KINDS.join(" / ")}）`,
  );
}

/** 参数指定的几家；未指定时取配置用到的，配置读不出来时三家都查 */
export function pickOnboardClis(argv: readonly string[]): CliKind[] {
  const tokens = expandEqualsTokens(stripPnpmSeparators(extractGlobalPathFlags(argv)));
  let selected: string[] = [];

  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i]!;
    if (canonicalizeFlag(token) === "--cli") {
      const raw = consumeFlagValue(tokens, i, token);
      selected = normalizeMultiValueFlag(selected, raw, token);
      i += 1;
      continue;
    }
    if (token.startsWith("-")) {
      throw new Error(formatCliError(token, VALID_ONBOARD_FLAGS, "pnpm onboard -- --help"));
    }
    selected = normalizeMultiValueFlag(selected, token, "--cli");
  }

  if (selected.length > 0) {
    return selected.map(validateCliToken);
  }
  try {
    return [...new Set(loadConfig(configPath()).targets.map((target) => target.cli))];
  } catch {
    return [...CLI_KINDS];
  }
}

async function onboardCli(cli: CliKind): Promise<void> {
  const before = await checkReadiness(cli);
  if (before.state === "ready") return console.log(`✓ ${cli}：已登录，跳过`);
  if (before.state === "missing") return console.log(`✗ ${cli}：${before.detail}`);

  const flow = LOGIN_FLOWS[cli];
  const where = runsInContainer() ? "在容器内" : "";
  console.log(`\n▶ ${cli} 未登录，开始登录`);
  console.log(`  ${flow.guide}`);
  console.log(`  （正在${where}启动 ${[flow.command, ...flow.args].join(" ")}，无需另行输入命令）\n`);
  await runInteractive(flow);

  const after = await checkReadiness(cli);
  const retry = commandHint(`pnpm onboard ${cli}`);
  console.log(after.state === "ready" ? `✓ ${cli}：登录成功` : `✗ ${cli}：${describe(after)}；可再运行 ${retry}`);
}

function runInteractive(flow: LoginFlow): Promise<void> {
  const ignoreInterrupt = (): void => {};
  process.on("SIGINT", ignoreInterrupt);
  return new Promise<void>((resolve) => {
    const child = spawn(flow.command, flow.args, { stdio: "inherit" });
    child.on("error", (cause) => {
      console.error(`无法启动 ${flow.command}：${cause.message}`);
      resolve();
    });
    child.on("exit", () => resolve());
  }).finally(() => process.off("SIGINT", ignoreInterrupt));
}

function describe(readiness: CliReadiness): string {
  return readiness.detail ?? readiness.state;
}

export async function runOnboardCli(
  argv: readonly string[] = process.argv.slice(2),
  writeLine: (line: string) => void = console.log,
): Promise<void> {
  if (hasHelpFlag(stripPnpmSeparators(argv))) {
    writeLine(formatOnboardHelp());
    return;
  }
  const clis = pickOnboardClis(argv);
  if (!process.stdin.isTTY) {
    throw new Error(`登录需要交互终端，请在终端里运行 ${commandHint("pnpm onboard")}`);
  }
  writeLine(`将检查：${clis.join("、")}\n`);
  for (const cli of clis) await onboardCli(cli);

  writeLine("\n—— 环境汇总 ——");
  const ok = await reportEnvironment({ clis });
  if (!ok) process.exitCode = 1;
}

const isMainModule =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
  runOnboardCli(process.argv.slice(2)).catch((cause: unknown) => {
    console.error(cause instanceof Error ? cause.message : String(cause));
    process.exit(1);
  });
}
