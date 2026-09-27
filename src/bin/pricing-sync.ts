#!/usr/bin/env tsx
/**
 * 同步价格目录：`pnpm pricing:sync [--latest]`
 *
 * 缺省：按 config/pricing-catalog.lock.json 锁定的 Release 下载附件到
 * data/pricing/<tag>/ 并核对 sha256；本地已有且哈希一致的不重复下载。
 * --latest：改用最新 Release，并把新 tag 与哈希写回锁文件，价格更新以锁文件改动审阅。
 * --soft：失败只警告、以 0 退出；供 postinstall 使用，离线时安装照常完成。
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { commandHint } from "../core/command-hint";
import {
  assetDir, IDENTIFIERS_ASSET, lockPath, PRICES_ASSET, readLock, sha256, type CatalogLock,
} from "../pricing/catalog-files";

const ASSETS = [PRICES_ASSET, IDENTIFIERS_ASSET];
/** 单个请求的超时，避免网络不通时挂住 pnpm install */
const FETCH_TIMEOUT_MS = 30_000;

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

/** 下载一个附件并返回其 sha256；expected 非空时哈希不符即报错，不写盘 */
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

async function main(): Promise<void> {
  const lock = readLock();
  const latest = process.argv.includes("--latest");
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
    console.log(`锁文件已更新：${lock.tag} → ${tag}`);
  }
  console.log(`价格目录 ${tag} 已就绪：${assetDir(tag)}`);
}

main().catch((cause: unknown) => {
  const message = cause instanceof Error ? cause.message : String(cause);
  if (process.argv.includes("--soft")) {
    console.warn(`⚠ 价格目录同步失败（${message}），成本将显示为“—”；稍后运行 ${commandHint("pnpm pricing:sync")}`);
    return;
  }
  console.error(message);
  process.exit(1);
});
