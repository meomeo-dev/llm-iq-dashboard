/** 每次调用各起一个进程的 CLI（claude / agy）的会话：仅包装单次调用函数 */

import type { AgentReply, AgentRequest, AgentSession } from "./types";

export function statelessSession(
  ask: (request: AgentRequest) => Promise<AgentReply>,
): AgentSession {
  return {
    ask,
    close: async () => {},
  };
}
