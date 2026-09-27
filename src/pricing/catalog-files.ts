/**
 * 价格目录作为依赖：锁文件固定 Release 版本，附件缓存在本地。
 *
 * 依赖单位是 meomeo-dev/llm-pricing-catalog 的一个 Release（tag 形如
 * data-<日期>-<提交>）。config/pricing-catalog.lock.json 记录 tag 与各附件 sha256
 * 并入库；附件由 `pnpm pricing:sync` 下载到 data/pricing/<tag>/，不入库。
 * 运行时只读本地缓存、不联网，保证成本可复现；更新价格用
 * `pnpm pricing:sync --latest` 并提交锁文件。
 */

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { dataRoot } from "../core/paths";
import { commandHint } from "../core/command-hint";
import { parseCsv } from "./csv";
import { FIRST_PARTY_CHANNELS, type IdentifierRow, type PriceCatalog, type PriceRow } from "./catalog";

export const PRICES_ASSET = "prices.csv";
export const IDENTIFIERS_ASSET = "model_identifiers.csv";

export interface CatalogLock {
  repo: string;
  tag: string;
  /** 附件名 → sha256（十六进制） */
  assets: Record<string, string>;
}

export function lockPath(): string {
  return join(process.cwd(), "config", "pricing-catalog.lock.json");
}

export function readLock(): CatalogLock {
  return JSON.parse(readFileSync(lockPath(), "utf8")) as CatalogLock;
}

export function assetDir(tag: string): string {
  return join(dataRoot(), "pricing", tag);
}

export function sha256(content: Buffer | string): string {
  return createHash("sha256").update(content).digest("hex");
}

let cached: { tag: string; catalog: PriceCatalog | null } | null = null;

/**
 * 读取锁定版本的目录，同一版本在进程内只解析一次。锁文件读不到、附件缺失或哈希
 * 不符时返回 null（成本显示为"未同步"），不影响看板与执行中的一轮。
 */
export function loadPriceCatalog(): PriceCatalog | null {
  let lock: CatalogLock;
  try {
    lock = readLock();
  } catch (cause) {
    console.warn(`读不到价格目录锁文件 ${lockPath()}：${cause instanceof Error ? cause.message : cause}`);
    return null;
  }
  if (cached?.tag === lock.tag) return cached.catalog;
  cached = { tag: lock.tag, catalog: readCatalog(lock) };
  return cached.catalog;
}

function readCatalog(lock: CatalogLock): PriceCatalog | null {
  const texts = new Map<string, string>();
  for (const asset of [PRICES_ASSET, IDENTIFIERS_ASSET]) {
    let content: Buffer;
    try {
      content = readFileSync(join(assetDir(lock.tag), asset));
    } catch {
      console.warn(`价格目录 ${lock.tag} 的 ${asset} 不在本地，运行 ${commandHint("pnpm pricing:sync")}`);
      return null;
    }
    if (sha256(content) !== lock.assets[asset]) {
      console.warn(`价格目录 ${lock.tag} 的 ${asset} 与锁文件的 sha256 不符，运行 ${commandHint("pnpm pricing:sync")}`);
      return null;
    }
    texts.set(asset, content.toString("utf8"));
  }
  return {
    tag: lock.tag,
    prices: priceRows(texts.get(PRICES_ASSET) ?? ""),
    identifiers: identifierRows(texts.get(IDENTIFIERS_ASSET) ?? ""),
  };
}

const FIRST_PARTY: ReadonlySet<string> = new Set(FIRST_PARTY_CHANNELS);

/**
 * 只留"API 等价成本"用得到的行：厂商自营渠道、global、美元、按量（无套餐、时段、
 * 承诺期、上游路由与变体）、基础上下文档。
 */
function priceRows(text: string): PriceRow[] {
  return parseCsv(text)
    .filter(
      (row) =>
        FIRST_PARTY.has(row.channel_id ?? "") &&
        row.region_id === "global" &&
        row.price_unit_id === "USD" &&
        row.context_min_tokens === "0" &&
        [row.plan_id, row.window_id, row.commitment_term, row.upstream_offering_id, row.variant].every(
          (value) => value === "",
        ),
    )
    .map((row) => ({
      modelId: row.model_id ?? "",
      channelId: row.channel_id ?? "",
      serviceTier: row.service_tier ?? "",
      meter: row.meter_id ?? "",
      // 统一换算为每百万 token 的单价
      amount: (Number(row.amount_value) * 1_000_000) / Number(row.per_quantity),
      validFrom: row.valid_from ?? "",
      validTo: row.valid_to || null,
    }));
}

function identifierRows(text: string): IdentifierRow[] {
  return parseCsv(text).map((row) => ({
    identifier: row.identifier ?? "",
    identifierKey: row.identifier_key ?? "",
    namespaceKind: row.namespace_kind ?? "",
    clientId: row.client_id ?? "",
    modelId: row.model_id ?? "",
    impliedServiceTier: row.implied_service_tier ?? "",
    validFrom: row.valid_from || null,
    validTo: row.valid_to || null,
  }));
}
