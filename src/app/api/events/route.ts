/**
 * 看板实时状态：`GET /api/events`（Server-Sent Events）。
 *
 * 连接（含断线重连）后先推一份全量快照（progress、auto-run 两类事件），之后只在内容
 * 变化时推送，客户端无需补齐漏掉的事件。命令类操作走各自的 HTTP 接口；监听与广播见
 * live-hub.ts。
 */

import { createResponse } from "better-sse";
import { readCookie } from "@/core/auth/guard";
import { SESSION_COOKIE, verifySession } from "@/core/auth/session";
import { isReadonly, isRemoteDataSource } from "@/core/deploy-mode";
import {
  AUTO_RUN_EVENT,
  FINGERPRINT_JOB_EVENT,
  liveHub,
  PROGRESS_EVENT,
  publicProgressOf,
  readyHub,
  RUNS_REVISION_EVENT,
} from "./live-hub";

export const dynamic = "force-dynamic";
/** 长连接与文件监听都依赖 Node 运行时 */
export const runtime = "nodejs";

export async function GET(request: Request): Promise<Response> {
  if (isRemoteDataSource()) {
    return createResponse(request, (session) => {
      session.push([], PROGRESS_EVENT);
      session.push(null, AUTO_RUN_EVENT);
      session.push(null, FINGERPRINT_JOB_EVENT);
      session.push("remote", RUNS_REVISION_EVENT);
    });
  }
  const owner = isReadonly() ? null : await verifySession(readCookie(request.headers, SESSION_COOKIE));
  const isOwner = owner !== null;
  const hub = liveHub();
  await readyHub(hub);
  return createResponse(request, (session) => {
    // 先入频道再推快照，保证快照之后的变化不会漏推
    if (isOwner) {
      hub.channel.register(session);
    } else {
      hub.publicChannel.register(session);
    }
    const snapshot = hub.latest;
    if (snapshot === null) return;
    session.push(isOwner ? snapshot.progress : publicProgressOf(snapshot.progress), PROGRESS_EVENT);
    session.push(snapshot.autoRun, AUTO_RUN_EVENT);
    session.push(isOwner ? snapshot.fingerprintJob : null, FINGERPRINT_JOB_EVENT);
    session.push(snapshot.runsRevision, RUNS_REVISION_EVENT);
  });
}
