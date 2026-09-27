/**
 * 设备会话：签发与校验设备凭据，决定 cookie 属性。
 *
 * cookie 值为 `<设备 id>.<32 字节随机凭据>`；服务端只存凭据的 HMAC。
 * 有效期：30 天内没来过即失效（滑动），签发 90 天后无论如何失效（绝对）；
 * 凭据每 24 小时轮换，旧值保留 60 秒宽限。
 */

import { randomBytes } from "node:crypto";
import { addDevice, findDevice, updateDevice, type DeviceRecord } from "./devices";
import { digestsEqual, hmacOf, loadServerKey } from "./store";

export const SESSION_COOKIE = "pelican_owner";
const SLIDING_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const ABSOLUTE_TTL_MS = 90 * 24 * 60 * 60 * 1000;
const ROTATE_AFTER_MS = 24 * 60 * 60 * 1000;
const ROTATION_GRACE_MS = 60 * 1000;
const TOKEN_BYTES = 32;
const DEVICE_ID_BYTES = 8;

export interface OwnerSession {
  deviceId: string;
  deviceName: string;
  /** 轮换后要写回浏览器的新 cookie 值；不需轮换时为 null */
  rotatedCookie: string | null;
}

/** 配对成功后签发：登记设备并返回要下发的 cookie 值 */
export async function issueSession(deviceName: string, now: Date = new Date()): Promise<{ cookie: string; device: DeviceRecord }> {
  const key = await loadServerKey();
  const token = newToken();
  const at = now.toISOString();
  const device: DeviceRecord = {
    id: randomBytes(DEVICE_ID_BYTES).toString("hex"),
    name: deviceName,
    tokenHmac: hmacOf(key, token),
    previousHmac: null,
    previousValidUntil: null,
    issuedAt: at,
    rotatedAt: at,
    lastSeenAt: at,
  };
  await addDevice(device);
  return { cookie: `${device.id}.${token}`, device };
}

/**
 * 校验 cookie 值：设备存在、凭据匹配（当前值或宽限期内的旧值）、未过期。
 * 通过后更新最近使用时刻；到轮换点时换发新凭据。
 */
export async function verifySession(cookie: string | null | undefined, now: Date = new Date()): Promise<OwnerSession | null> {
  const parsed = parseCookie(cookie);
  if (parsed === null) return null;
  const device = await findDevice(parsed.deviceId);
  if (device === null || isExpired(device, now)) return null;

  const key = await loadServerKey();
  const presented = hmacOf(key, parsed.token);
  const matchesCurrent = digestsEqual(device.tokenHmac, presented);
  const matchesPrevious =
    device.previousHmac !== null &&
    device.previousValidUntil !== null &&
    Date.parse(device.previousValidUntil) > now.getTime() &&
    digestsEqual(device.previousHmac, presented);
  if (!matchesCurrent && !matchesPrevious) return null;

  const at = now.toISOString();
  // 拿旧值来的请求不触发轮换，避免两枚新凭据互相顶掉
  const due = matchesCurrent && now.getTime() - Date.parse(device.rotatedAt) >= ROTATE_AFTER_MS;
  if (!due) {
    if (now.getTime() - Date.parse(device.lastSeenAt) >= 60_000) {
      await updateDevice(device.id, { lastSeenAt: at });
    }
    return { deviceId: device.id, deviceName: device.name, rotatedCookie: null };
  }
  const token = newToken();
  await updateDevice(device.id, {
    tokenHmac: hmacOf(key, token),
    previousHmac: device.tokenHmac,
    previousValidUntil: new Date(now.getTime() + ROTATION_GRACE_MS).toISOString(),
    rotatedAt: at,
    lastSeenAt: at,
  });
  return { deviceId: device.id, deviceName: device.name, rotatedCookie: `${device.id}.${token}` };
}

/** Set-Cookie 属性；本机 http 调试时不加 Secure，否则浏览器直接丢弃 */
export function sessionCookieAttributes(secure: boolean): {
  httpOnly: true; sameSite: "strict"; path: "/"; secure: boolean; maxAge: number;
} {
  return { httpOnly: true, sameSite: "strict", path: "/", secure, maxAge: Math.floor(SLIDING_TTL_MS / 1000) };
}

export function parseCookie(cookie: string | null | undefined): { deviceId: string; token: string } | null {
  if (typeof cookie !== "string") return null;
  const dot = cookie.indexOf(".");
  if (dot <= 0 || dot === cookie.length - 1) return null;
  return { deviceId: cookie.slice(0, dot), token: cookie.slice(dot + 1) };
}

function isExpired(device: DeviceRecord, now: Date): boolean {
  const idle = now.getTime() - Date.parse(device.lastSeenAt) > SLIDING_TTL_MS;
  const aged = now.getTime() - Date.parse(device.issuedAt) > ABSOLUTE_TTL_MS;
  return idle || aged;
}

function newToken(): string {
  return randomBytes(TOKEN_BYTES).toString("base64url");
}
