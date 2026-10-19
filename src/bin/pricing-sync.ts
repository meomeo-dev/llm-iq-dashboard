#!/usr/bin/env tsx
/**
 * 同步价格目录：`pnpm pricing:sync [--latest]` / `pnpm pelican pricing [sync] [options]`
 *
 * 缺省：按 config/pricing-catalog.lock.json 锁定的 Release 下载附件到
 * data/pricing/<tag>/ 并核对 sha256；本地已有且哈希一致的不重复下载。
 * --latest：改用最新 Release，并把新 tag 与哈希写回锁文件，价格更新以锁文件改动审阅。
 * --soft：失败只警告、以 0 退出；供 postinstall 使用，离线时安装照常完成。
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { commandHint } from "../core/command-hint";
import {
  assetDir, IDENTIFIERS_ASSET, lockPath, PRICES_ASSET, readLock, sha256, type CatalogLock,
} from "../pricing/catalog-files";
import {
  expandEqualsTokens,
  extractGlobalPathFlags,
  formatCliError,
  hasHelpFlag,
  stripPnpmSeparators,
} from "./cli-args";

const ASSETS = [PRICES_ASSET, IDENTIFIERS_ASSET];
const FETCH_TIMEOUT_MS = 30_000;

const VALID_PRICING_FLAGS: readonly string[] = [
  "--latest",
  "--soft",
  "--config",
  "-c",
  "--data-dir",
  "--help",
  "-h",
];

export function formatPricingSyncHelp(): string {
  return [
    "用法: pnpm pricing:sync [-- <options>]",
    "别名: pnpm pelican pricing [sync] [options]",
    "",
    "说明:",
    "  从上游 Release 下载并校验模型单价目录（data/pricing/<tag>/）。",
    "",
    "选项:",
    "  --latest                拉取最新 Release 并将新 tag 与 sha256 写回锁文件",
    "  --soft                  下载失败仅打印警告并以退出码 0 结束（供 postinstall 使用）",
    "  -c, --config <path>     覆盖配置文件路径",
    "  --data-dir <path>       覆盖数据目录路径（同 PELICAN_DATA_DIR）",
    "  -h, --help              显示此帮助信息并退出",
  ].join("\n");
}

export function parsePricingSyncArgs(argv: readonly string[]): { latest: boolean; soft: boolean } {
  const tokens = expandEqualsTokens(stripPnpmSeparators(extractGlobalPathFlags(argv)));
  let latest = false;
  let soft = false;

  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i]!;
    if (i === 0 && token === "sync") continue;
    if (token === "--latest") {
      latest = true;
    } else if (token === "--soft") {
      soft = true;
    } else {
      throw new Error(formatCliError(token, VALID_PRICING_FLAGS, "pnpm pricing:sync -- --help"));
    }
  }
  return { latest, soft };
}

async function latestTag(repo: string): Promise<string> {
  const response = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
    headers: { accept: "application/vnd.github+json" },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`查询 ${repo} 最新 Release 失败：HTTP ${response.status}`);
  const body = (await response.json()) as { tag_name?: unknown };
  if (typeof body.tag_name !== "string") throw new Error(`${repo} 的最新 Release 没有 tag`);
  return body.tag_name;
}

async function localDigest(path: string): Promise<string | null> {
  try {
    return sha256(await readFile(path));
  } catch {
    return null;
  }
}

async function download(repo: string, tag: string, asset: string, expected: string | null): Promise<string> {
  const target = join(assetDir(tag), asset);
  const present = await localDigest(target);
  if (expected !== null && present === expected) return present;
  const url = `https://github.com/${repo}/releases/download/${tag}/${asset}`;
  const response = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
  if (!response.ok) throw new Error(`下载 ${url} 失败：HTTP ${response.status}`);
  const content = Buffer.from(await response.arrayBuffer());
  const digest = sha256(content);
  if (expected !== null && digest !== expected) {
    throw new Error(`${asset} 的 sha256 为 ${digest}，锁文件要求 ${expected}；附件被替换过，拒绝使用`);
  }
  await writeFile(target, content);
  console.log(`已下载 ${tag}/${asset}（${content.length} 字节）`);
  return digest;
}

export async function runPricingSyncCli(
  argv: readonly string[] = process.argv.slice(2),
  writeLine: (line: string) => void = console.log,
): Promise<void> {
  if (hasHelpFlag(stripPnpmSeparators(argv))) {
    writeLine(formatPricingSyncHelp());
    return;
  }
  const { latest, soft } = parsePricingSyncArgs(argv);
  try {
    const lock = readLock();
    const tag = latest ? await latestTag(lock.repo) : lock.tag;
    await mkdir(assetDir(tag), { recursive: true });

    const assets: Record<string, string> = {};
    for (const asset of ASSETS) {
      const expected = tag === lock.tag ? (lock.assets[asset] ?? null) : null;
      assets[asset] = await download(lock.repo, tag, asset, expected);
    }
    if (tag !== lock.tag) {
      const updated: CatalogLock = { repo: lock.repo, tag, assets };
      await writeFile(lockPath(), `${JSON.stringify(updated, null, 2)}\n`);
      writeLine(`锁文件已更新：${lock.tag} → ${tag}`);
    }
    writeLine(`价格目录 ${tag} 已就绪：${assetDir(tag)}`);
  } catch (cause) {
    if (soft) {
      const message = cause instanceof Error ? cause.message : String(cause);
      writeLine(`⚠ 价格目录同步失败（${message}），成本将显示为“—”；稍后运行 ${commandHint("pnpm pricing:sync")}`);
      return;
    }
    throw cause;
  }
}

const isMainModule =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
  runPricingSyncCli(process.argv.slice(2)).catch((cause: unknown) => {
    const message = cause instanceof Error ? cause.message : String(cause);
    console.error(message);
    process.exit(1);
  });
}
