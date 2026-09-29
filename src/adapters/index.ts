/** 适配器注册表：CLI 种类 → 实现 */

import { DEFAULT_PROFILE, type CliKind } from "../core/types";
import type { AgentAdapter, AgentSession, ProfileLaunch } from "./types";
import { claudeAdapter } from "./claude";
import { codexAdapter } from "./codex";
import { agyAdapter } from "./agy";

const ADAPTERS: Readonly<Record<CliKind, AgentAdapter>> = {
  claude: claudeAdapter,
  codex: codexAdapter,
  agy: agyAdapter,
};

/** 能以非默认 profile 启动的 CLI；其余 CLI 忽略 profile 会静默改用登录态，因此直接拒绝 */
const PROFILE_CAPABLE: ReadonlySet<CliKind> = new Set<CliKind>(["codex"]);

/**
 * 一轮内的会话，按 CLI × profile 各一个：同一 CLI、同一 profile 的调用共用一个会话，
 * 不同 profile 之间不共享进程与环境。
 */
export interface SessionPool {
  /** profile 缺省或为 default 时即登录态会话 */
  sessionFor(cli: CliKind, profile?: string): AgentSession;
  /** 关闭本轮打开过的全部会话；单个关闭失败不影响其余 */
  closeAll(): Promise<void>;
}

/**
 * `launches` 以 profile 名为键，只含本轮用到、已通过放行检查的非默认 profile。
 * 查不到启动参数说明编排层漏了放行检查，抛错而不回落到登录态。
 */
export function openSessionPool(launches: ReadonlyMap<string, ProfileLaunch> = new Map()): SessionPool {
  const sessions = new Map<string, AgentSession>();

  const open = (cli: CliKind, profile: string): AgentSession => {
    if (profile === DEFAULT_PROFILE) return ADAPTERS[cli].openSession();
    if (!PROFILE_CAPABLE.has(cli)) throw new Error(`${cli} 不支持 profile（${profile}）`);
    const launch = launches.get(profile);
    if (launch === undefined) throw new Error(`profile ${profile} 没有启动参数，未发起调用`);
    return ADAPTERS[cli].openSession(launch);
  };

  return {
    sessionFor(cli, profile = DEFAULT_PROFILE) {
      const key = `${cli}::${profile}`;
      const existing = sessions.get(key);
      if (existing !== undefined) return existing;
      const session = open(cli, profile);
      sessions.set(key, session);
      return session;
    },
    async closeAll() {
      await Promise.allSettled([...sessions.values()].map((session) => session.close()));
      sessions.clear();
    },
  };
}

export type { AgentReply, AgentRequest, AgentSession, ProfileLaunch, WrittenFile } from "./types";
