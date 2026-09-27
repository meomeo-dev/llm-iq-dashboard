/** 适配器注册表：CLI 种类 → 实现 */

import type { CliKind } from "../core/types";
import type { AgentAdapter, AgentSession } from "./types";
import { claudeAdapter } from "./claude";
import { codexAdapter } from "./codex";
import { agyAdapter } from "./agy";

const ADAPTERS: Readonly<Record<CliKind, AgentAdapter>> = {
  claude: claudeAdapter,
  codex: codexAdapter,
  agy: agyAdapter,
};

/** 一轮内各 CLI 的会话；同一 CLI 的所有调用共用一个会话 */
export interface SessionPool {
  sessionFor(cli: CliKind): AgentSession;
  /** 关闭本轮打开过的全部会话；单个关闭失败不影响其余 */
  closeAll(): Promise<void>;
}

export function openSessionPool(): SessionPool {
  const sessions = new Map<CliKind, AgentSession>();

  return {
    sessionFor(cli) {
      const existing = sessions.get(cli);
      if (existing !== undefined) return existing;
      const session = ADAPTERS[cli].openSession();
      sessions.set(cli, session);
      return session;
    },
    async closeAll() {
      await Promise.allSettled([...sessions.values()].map((session) => session.close()));
      sessions.clear();
    },
  };
}

export type { AgentReply, AgentRequest, AgentSession, WrittenFile } from "./types";
