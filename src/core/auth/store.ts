/**
 * auth 模块的落盘：JSON 文件原子写入，以及服务端密钥 `data/server.key`。
 *
 * 密钥 32 字节随机、权限 0600，首次启动生成；配对码与设备凭据只以它的 HMAC 落盘，
 * 文件被读走也得不到可用的凭据。
 */

import { randomBytes, timingSafeEqual, createHmac } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { dataRoot } from "../paths";
import { isReadonly } from "../deploy-mode";

const SERVER_KEY_FILE = "server.key";
const SERVER_KEY_BYTES = 32;

export async function readJsonFile(filename: string): Promise<unknown> {
  try {
    return JSON.parse(await readFile(join(dataRoot(), filename), "utf8"));
  } catch {
    return null;
  }
}

/** 写临时文件再原子替换，另一进程随时可能读取 */
export async function writeJsonFile(filename: string, value: unknown): Promise<void> {
  if (isReadonly()) {
    throw new Error("只读部署下不可写入数据");
  }
  await mkdir(dataRoot(), { recursive: true });
  const target = join(dataRoot(), filename);
  const staging = `${target}.${process.pid}.${Date.now()}.${Math.random().toString(36).slice(2)}.tmp`;
  await writeFile(staging, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  try {
    await rename(staging, target);
  } catch (err) {
    try {
      const { unlink } = await import("node:fs/promises");
      await unlink(staging);
    } catch {}
    throw err;
  }
}

/** 读取服务端密钥，不存在则生成；生成失败直接抛错，没有密钥就没有登录 */
export async function loadServerKey(): Promise<Buffer> {
  if (isReadonly()) {
    throw new Error("只读部署下不可生成或读取 server.key");
  }
  const path = join(dataRoot(), SERVER_KEY_FILE);
  try {
    const hex = (await readFile(path, "utf8")).trim();
    const key = Buffer.from(hex, "hex");
    if (key.length === SERVER_KEY_BYTES) return key;
    throw new Error(`${path} 内容不是 ${SERVER_KEY_BYTES} 字节的十六进制密钥，请删除后重启以重新生成`);
  } catch (cause) {
    if (!isMissing(cause)) throw cause;
  }
  await mkdir(dataRoot(), { recursive: true });
  const key = randomBytes(SERVER_KEY_BYTES);
  // wx：并发首启时只有一方能创建，另一方读回同一把密钥
  try {
    await writeFile(path, `${key.toString("hex")}\n`, { encoding: "utf8", mode: 0o600, flag: "wx" });
    return key;
  } catch (cause) {
    if ((cause as NodeJS.ErrnoException).code !== "EEXIST") throw cause;
    return Buffer.from((await readFile(path, "utf8")).trim(), "hex");
  }
}

/** 凭据类字符串统一以 HMAC-SHA-256 落盘 */
export function hmacOf(key: Buffer, value: string): string {
  return createHmac("sha256", key).update(value).digest("base64url");
}

/** 常量时间比较两个摘要，长度不同直接判不等 */
export function digestsEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function isMissing(cause: unknown): boolean {
  return (cause as NodeJS.ErrnoException).code === "ENOENT";
}
