/**
 * 看板实时状态：`GET /api/events`（Server-Sent Events）。
 *
 * 连接（含断线重连）后先推一份全量快照（progress、auto-run 两类事件），之后只在内容
 * 变化时推送，客户端无需补齐漏掉的事件。命令类操作走各自的 HTTP 接口；监听与广播见
 * live-hub.ts。
 */

import { createResponse } from "better-sse";
import { isRemoteDataSource } from "@/core/deploy-mode";
import { AUTO_RUN_EVENT, liveHub, PROGRESS_EVENT, readyHub } from "./live-hub";

export const dynamic = "force-dynamic";
/** 长连接与文件监听都依赖 Node 运行时 */
export const runtime = "nodejs";

export async function GET(request: Request): Promise<Response> {
  if (isRemoteDataSource()) {
    return createResponse(request, (session) => {
      session.push([], PROGRESS_EVENT);
      session.push(null, AUTO_RUN_EVENT);
    });
  }
  const hub = liveHub();
  await readyHub(hub);
  return createResponse(request, (session) => {
    // 先入频道再推快照，保证快照之后的变化不会漏推
    hub.channel.register(session);
    const snapshot = hub.latest;
    if (snapshot === null) return;
    session.push(snapshot.progress, PROGRESS_EVENT);
    session.push(snapshot.autoRun, AUTO_RUN_EVENT);
  });
}
