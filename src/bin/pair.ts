#!/usr/bin/env tsx
/**
 * 所有者配对：`pnpm pair [--name 名称]` / `pnpm pelican pair [open|list|revoke <id>|revoke-all]`
 *
 * 同时兼容位置子命令（`open` / `list` / `revoke <id>` / `revoke-all`）与传统选项
 * （`--list` / `--revoke <id>` / `--revoke-all` / `--name <name>`）。
 */

import { pathToFileURL } from "node:url";
import { listDevices, revokeAllDevices, revokeDevice } from "../core/auth/devices";
import { openPairingWindow, PAIRING_TTL_MS } from "../core/auth/pairing";
import { dataRoot } from "../core/paths";
import {
  consumeFlagValue,
  expandEqualsTokens,
  extractGlobalPathFlags,
  formatCliError,
  hasHelpFlag,
  requireNonEmptyTrimmed,
  stripPnpmSeparators,
} from "./cli-args";

const VALID_PAIR_FLAGS: readonly string[] = [
  "--name",
  "--list",
  "--revoke",
  "--revoke-all",
  "--config",
  "-c",
  "--data-dir",
  "--help",
  "-h",
];

export type PairAction =
  | { kind: "open"; name?: string }
  | { kind: "list" }
  | { kind: "revoke"; id: string }
  | { kind: "revoke-all" };

export function formatPairHelp(): string {
  return [
    "用法: pnpm pair [open|list|revoke <id>|revoke-all] [options]",
    "别名: pnpm pelican pair [subcommand] [options]",
    "",
    "子命令与等价选项:",
    "  open [--name <name>]       打开 10 分钟一次性配对窗口（默认动作）",
    "  list / --list              列出当前已配对的设备",
    "  revoke <id> / --revoke <id> 吊销指定 id 的配对设备",
    "  revoke-all / --revoke-all  吊销全部已配对设备",
    "  -c, --config <path>        覆盖配置文件路径",
    "  --data-dir <path>          覆盖数据目录路径",
    "  -h, --help                 显示此帮助信息并退出",
  ].join("\n");
}

function assignPairMode(
  current: "open" | "list" | "revoke" | "revoke-all" | null,
  next: "open" | "list" | "revoke" | "revoke-all",
): "open" | "list" | "revoke" | "revoke-all" {
  if (current !== null && current !== next) {
    throw new Error(`参数错误：动作 ${current} 与 ${next} 互斥，不能同时指定`);
  }
  return next;
}

export function parsePairArgs(argv: readonly string[]): PairAction {
  const tokens = expandEqualsTokens(stripPnpmSeparators(extractGlobalPathFlags(argv)));
  let explicitMode: "open" | "list" | "revoke" | "revoke-all" | null = null;
  let name: string | undefined;
  let revokeId: string | undefined;

  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i]!;
    if (token === "--list" || (i === 0 && token === "list")) {
      explicitMode = assignPairMode(explicitMode, "list");
    } else if (token === "--revoke-all" || (i === 0 && token === "revoke-all")) {
      explicitMode = assignPairMode(explicitMode, "revoke-all");
    } else if (token === "--revoke" || (i === 0 && token === "revoke")) {
      explicitMode = assignPairMode(explicitMode, "revoke");
      const next = tokens[i + 1];
      if (!next || next.startsWith("-")) {
        throw new Error("--revoke 需要设备 id，见 pnpm pair --list");
      }
      revokeId = requireNonEmptyTrimmed("--revoke", next);
      i += 1;
    } else if (i === 0 && token === "open") {
      explicitMode = assignPairMode(explicitMode, "open");
    } else if (token === "--name") {
      name = requireNonEmptyTrimmed("--name", consumeFlagValue(tokens, i, "--name"));
      i += 1;
    } else {
      throw new Error(formatCliError(token, VALID_PAIR_FLAGS, "pnpm pair -- --help"));
    }
  }

  const mode = explicitMode ?? "open";
  if (name !== undefined && mode !== "open") {
    throw new Error(`参数错误：--name 仅适用于 open 配对动作，不能与 ${mode} 同时使用`);
  }
  if (mode === "list") return { kind: "list" };
  if (mode === "revoke-all") return { kind: "revoke-all" };
  if (mode === "revoke") return { kind: "revoke", id: revokeId! };
  return { kind: "open", name };
}

async function printDevices(writeLine: (line: string) => void): Promise<void> {
  const devices = await listDevices();
  if (devices.length === 0) {
    writeLine("没有已配对的设备");
    return;
  }
  for (const device of devices) {
    writeLine(`${device.id}  ${device.name}  签发 ${device.issuedAt}  最近 ${device.lastSeenAt}`);
  }
}

function defaultName(): string {
  return `设备 ${new Date().toISOString().slice(0, 16).replace("T", " ")}`;
}

export async function runPairCli(
  argv: readonly string[] = process.argv.slice(2),
  writeLine: (line: string) => void = console.log,
): Promise<void> {
  if (hasHelpFlag(stripPnpmSeparators(argv))) {
    writeLine(formatPairHelp());
    return;
  }
  const action = parsePairArgs(argv);
  if (action.kind === "list") return printDevices(writeLine);
  if (action.kind === "revoke-all") {
    const count = await revokeAllDevices();
    writeLine(`已吊销 ${count} 台设备`);
    return;
  }
  if (action.kind === "revoke") {
    writeLine((await revokeDevice(action.id)) ? `已吊销设备 ${action.id}` : `没有 id 为 ${action.id} 的设备`);
    return;
  }

  const name = action.name ?? defaultName();
  const code = await openPairingWindow(name);
  writeLine(`配对码（${Math.round(PAIRING_TTL_MS / 60000)} 分钟内有效，只能用一次）：`);
  writeLine("");
  writeLine(`    ${code}`);
  writeLine("");
  writeLine(`在浏览器打开看板的 /pair 页输入；设备名：${name}。数据目录：${dataRoot()}`);
}

const isMainModule =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
  runPairCli(process.argv.slice(2)).catch((cause: unknown) => {
    console.error(cause instanceof Error ? cause.message : cause);
    process.exit(1);
  });
}
