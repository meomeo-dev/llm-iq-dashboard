/**
 * 设备表 `data/devices.json`：每台配对过的浏览器一条记录，只存凭据的 HMAC。
 *
 * 凭据每 24 小时轮换一次；轮换后旧值保留一小段宽限期，让同时在飞的请求不至于失败。
 */

import { readJsonFile, writeJsonFile } from "./store";

const DEVICES_FILE = "devices.json";

export interface DeviceRecord {
  id: string;
  name: string;
  /** 当前凭据的 HMAC */
  tokenHmac: string;
  /** 上一枚凭据的 HMAC 与其失效时刻；轮换后的宽限期用 */
  previousHmac: string | null;
  previousValidUntil: string | null;
  issuedAt: string;
  rotatedAt: string;
  lastSeenAt: string;
}

export async function listDevices(): Promise<DeviceRecord[]> {
  const stored = (await readJsonFile(DEVICES_FILE)) as { devices?: unknown } | null;
  if (stored === null || !Array.isArray(stored.devices)) return [];
  return stored.devices.filter(isDeviceRecord);
}

export async function findDevice(id: string): Promise<DeviceRecord | null> {
  return (await listDevices()).find((device) => device.id === id) ?? null;
}

export async function addDevice(device: DeviceRecord): Promise<void> {
  const devices = await listDevices();
  await saveDevices([...devices.filter((existing) => existing.id !== device.id), device]);
}

/** 更新一条记录；设备已被吊销时不再写回 */
export async function updateDevice(id: string, patch: Partial<DeviceRecord>): Promise<DeviceRecord | null> {
  const devices = await listDevices();
  const index = devices.findIndex((device) => device.id === id);
  if (index < 0) return null;
  const updated = { ...devices[index], ...patch } as DeviceRecord;
  devices[index] = updated;
  await saveDevices(devices);
  return updated;
}

export async function revokeDevice(id: string): Promise<boolean> {
  const devices = await listDevices();
  const remaining = devices.filter((device) => device.id !== id);
  if (remaining.length === devices.length) return false;
  await saveDevices(remaining);
  return true;
}

export async function revokeAllDevices(): Promise<number> {
  const count = (await listDevices()).length;
  await saveDevices([]);
  return count;
}

async function saveDevices(devices: DeviceRecord[]): Promise<void> {
  await writeJsonFile(DEVICES_FILE, { devices });
}

function isDeviceRecord(value: unknown): value is DeviceRecord {
  if (value === null || typeof value !== "object") return false;
  const record = value as Partial<DeviceRecord>;
  return (
    typeof record.id === "string" &&
    typeof record.name === "string" &&
    typeof record.tokenHmac === "string" &&
    typeof record.issuedAt === "string" &&
    typeof record.rotatedAt === "string" &&
    typeof record.lastSeenAt === "string"
  );
}
