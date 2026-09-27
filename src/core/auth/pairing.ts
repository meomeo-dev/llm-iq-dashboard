/**
 * 配对窗口：宿主机命令生成一次性配对码，浏览器在窗口期内用它换取设备凭据。
 *
 * 窗口只在宿主机执行命令后打开，10 分钟有效，用一次即关；连续猜错达上限也关。
 * 文件 `data/pairing.json` 只存配对码的 HMAC 与元数据。
 */

import { randomInt } from "node:crypto";
import { unlink } from "node:fs/promises";
import { join } from "node:path";
import { dataRoot } from "../paths";
import { digestsEqual, hmacOf, loadServerKey, readJsonFile, writeJsonFile } from "./store";

const PAIRING_FILE = "pairing.json";
export const PAIRING_TTL_MS = 10 * 60 * 1000;
/** 配对码为 8 组 4 位数字，约 106 bit；窗口内猜错这么多次即关闭 */
export const PAIRING_MAX_FAILURES = 5;
const CODE_GROUPS = 8;
const GROUP_DIGITS = 4;

interface PairingWindow {
  codeHmac: string;
  /** 配对成功后设备的显示名 */
  deviceName: string;
  openedAt: string;
  expiresAt: string;
  failures: number;
}

export type PairingOutcome =
  | { ok: true; deviceName: string }
  | { ok: false; reason: "no-window" | "expired" | "mismatch" | "locked" };

/** 打开新窗口并返回明文配对码；旧窗口直接作废 */
export async function openPairingWindow(deviceName: string, now: Date = new Date()): Promise<string> {
  const code = generateCode();
  const key = await loadServerKey();
  const window: PairingWindow = {
    codeHmac: hmacOf(key, normalizeCode(code)),
    deviceName,
    openedAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + PAIRING_TTL_MS).toISOString(),
    failures: 0,
  };
  await writeJsonFile(PAIRING_FILE, window);
  return code;
}

/** 用配对码兑换：成功即关窗；错误累计到上限也关窗 */
export async function redeemPairingCode(input: string, now: Date = new Date()): Promise<PairingOutcome> {
  const window = await readPairingWindow();
  if (window === null) return { ok: false, reason: "no-window" };
  if (Date.parse(window.expiresAt) <= now.getTime()) {
    await closePairingWindow();
    return { ok: false, reason: "expired" };
  }
  const key = await loadServerKey();
  if (digestsEqual(window.codeHmac, hmacOf(key, normalizeCode(input)))) {
    await closePairingWindow();
    return { ok: true, deviceName: window.deviceName };
  }
  const failures = window.failures + 1;
  if (failures >= PAIRING_MAX_FAILURES) {
    await closePairingWindow();
    return { ok: false, reason: "locked" };
  }
  await writeJsonFile(PAIRING_FILE, { ...window, failures });
  return { ok: false, reason: "mismatch" };
}

export async function closePairingWindow(): Promise<void> {
  await unlink(join(dataRoot(), PAIRING_FILE)).catch(() => {});
}

/** 输入里的空格、连字符与全角空格都忽略，只比数字 */
export function normalizeCode(input: string): string {
  return input.replace(/[^0-9]/g, "");
}

function generateCode(): string {
  const groups: string[] = [];
  for (let i = 0; i < CODE_GROUPS; i += 1) {
    groups.push(String(randomInt(0, 10 ** GROUP_DIGITS)).padStart(GROUP_DIGITS, "0"));
  }
  return groups.join("-");
}

async function readPairingWindow(): Promise<PairingWindow | null> {
  const stored = (await readJsonFile(PAIRING_FILE)) as Partial<PairingWindow> | null;
  if (stored === null || typeof stored.codeHmac !== "string" || typeof stored.expiresAt !== "string") return null;
  return {
    codeHmac: stored.codeHmac,
    deviceName: typeof stored.deviceName === "string" ? stored.deviceName : "设备",
    openedAt: typeof stored.openedAt === "string" ? stored.openedAt : stored.expiresAt,
    expiresAt: stored.expiresAt,
    failures: typeof stored.failures === "number" ? stored.failures : 0,
  };
}
