#!/usr/bin/env tsx
/**
 * 引导登录：`pnpm onboard [claude|codex|agy …]`
 *
 * 逐家检查配置用到的（或参数指定的）CLI，未登录的启动其自带登录流程并复查，最后打印
 * 与 `pnpm preflight` 相同的环境汇总。已登录的跳过，可重复运行。
 *
 * 各家均用订阅账号登录（非 API 计费），支持无浏览器环境（链接或设备码）。容器内的
 * 登录态写入挂载卷，重建容器后保留。
 */

import { spawn } from "node:child_process";
import { checkReadiness, type CliReadiness } from "../capabilities/readiness";
import { commandHint, runsInContainer } from "../core/command-hint";
import { loadConfig } from "../core/config";
import { configPath } from "../core/paths";
import { CLI_KINDS, type CliKind } from "../core/types";
import { reportEnvironment } from "./environment-report";

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

async function main(): Promise<void> {
  if (!process.stdin.isTTY) {
    fail(`登录需要交互终端，请在终端里运行 ${commandHint("pnpm onboard")}`);
  }
  const clis = pickClis(process.argv.slice(2));
  console.log(`将检查：${clis.join("、")}\n`);

  for (const cli of clis) await onboardCli(cli);

  console.log("\n—— 环境汇总 ——");
  const ok = await reportEnvironment();
  if (!ok) process.exit(1);
}

/** 参数指定的几家；未指定时取配置用到的，配置读不出来时三家都查 */
function pickClis(args: readonly string[]): CliKind[] {
  const known = new Set<string>(CLI_KINDS);
  const unknown = args.filter((arg) => !known.has(arg));
  if (unknown.length > 0) fail(`不认识的 CLI：${unknown.join("、")}（可选 ${CLI_KINDS.join(" / ")}）`);
  if (args.length > 0) return [...new Set(args)] as CliKind[];
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
  // 不用 `$ 命令` 格式，以免被误读为需要用户自己输入的命令
  const where = runsInContainer() ? "在容器内" : "";
  console.log(`\n▶ ${cli} 未登录，开始登录`);
  console.log(`  ${flow.guide}`);
  console.log(`  （正在${where}启动 ${[flow.command, ...flow.args].join(" ")}，无需另行输入命令）\n`);
  await runInteractive(flow);

  const after = await checkReadiness(cli);
  const retry = commandHint(`pnpm onboard ${cli}`);
  console.log(after.state === "ready" ? `✓ ${cli}：登录成功` : `✗ ${cli}：${describe(after)}；可再运行 ${retry}`);
}

/**
 * 把终端交给登录命令直到其退出。Ctrl+C 会发给整个前台进程组，本进程期间忽略 SIGINT，
 * 否则在 agy 里按 Ctrl+C 退出会连同引导一起结束。
 */
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

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

main().catch((cause: unknown) => fail(cause instanceof Error ? cause.message : String(cause)));
