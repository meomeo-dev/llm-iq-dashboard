/**
 * 审计日志 `data/audit.log`：每个写操作与登录事件追加一行 JSON，只追加不覆盖。
 */

import { appendFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { dataRoot } from "../paths";
import { isReadonly } from "../deploy-mode";

const AUDIT_FILE = "audit.log";

export interface AuditEvent {
  action: string;
  outcome: "ok" | "denied" | "error";
  deviceId: string | null;
  ip: string | null;
  detail?: string;
}

export async function audit(event: AuditEvent, now: Date = new Date()): Promise<void> {
  if (isReadonly()) return;
  await mkdir(dataRoot(), { recursive: true });
  const line = JSON.stringify({ at: now.toISOString(), ...event });
  await appendFile(join(dataRoot(), AUDIT_FILE), `${line}\n`, "utf8");
}
