#!/usr/bin/env tsx
/**
 * 所有者配对：`pnpm pair [--name 名称]` 打开 10 分钟的配对窗口并打印一次性配对码；
 * `pnpm pair --list` 列出已配对设备；`pnpm pair --revoke <id>` 吊销一台；
 * `pnpm pair --revoke-all` 清空。
 */

import { listDevices, revokeAllDevices, revokeDevice } from "../core/auth/devices";
import { openPairingWindow, PAIRING_TTL_MS } from "../core/auth/pairing";
import { dataRoot } from "../core/paths";

async function main(argv: string[]): Promise<void> {
  if (argv.includes("--list")) return printDevices();
  if (argv.includes("--revoke-all")) {
    const count = await revokeAllDevices();
    console.log(`已吊销 ${count} 台设备`);
    return;
  }
  const revokeAt = argv.indexOf("--revoke");
  if (revokeAt >= 0) {
    const id = argv[revokeAt + 1];
    if (id === undefined) throw new Error("--revoke 需要设备 id，见 pnpm pair --list");
    console.log((await revokeDevice(id)) ? `已吊销设备 ${id}` : `没有 id 为 ${id} 的设备`);
    return;
  }

  const name = readName(argv) ?? defaultName();
  const code = await openPairingWindow(name);
  console.log(`配对码（${Math.round(PAIRING_TTL_MS / 60000)} 分钟内有效，只能用一次）：`);
  console.log("");
  console.log(`    ${code}`);
  console.log("");
  console.log(`在浏览器打开看板的 /pair 页输入；设备名：${name}。数据目录：${dataRoot()}`);
}

async function printDevices(): Promise<void> {
  const devices = await listDevices();
  if (devices.length === 0) {
    console.log("没有已配对的设备");
    return;
  }
  for (const device of devices) {
    console.log(`${device.id}  ${device.name}  签发 ${device.issuedAt}  最近 ${device.lastSeenAt}`);
  }
}

function readName(argv: string[]): string | null {
  const at = argv.indexOf("--name");
  if (at >= 0) return argv[at + 1] ?? null;
  const inline = argv.find((arg) => arg.startsWith("--name="));
  return inline === undefined ? null : inline.slice("--name=".length);
}

function defaultName(): string {
  return `设备 ${new Date().toISOString().slice(0, 16).replace("T", " ")}`;
}

main(process.argv.slice(2)).catch((cause: unknown) => {
  console.error(cause instanceof Error ? cause.message : cause);
  process.exit(1);
});
