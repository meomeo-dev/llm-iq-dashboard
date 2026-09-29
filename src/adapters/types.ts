/**
 * CLI 适配器契约（adapter contract），编排层（core/runner.ts、core/run-attempt.ts）只依赖此接口。
 *
 * 契约以会话为单位：codex 一轮内共用一个长驻 app-server，claude / agy 每次调用各起
 * 一个进程，两者统一为 `openSession → ask × N → close`。
 *
 * 非默认 profile 各开一个会话（见 index.ts 的会话池），会话持有该 profile 的启动参数。
 */

import type { EffortLevel, Target } from "../core/types";

/** 一次提问所需的全部输入 */
export interface AgentRequest {
  target: Target;
  /** 渲染后的提示词，逐字发送 */
  promptText: string;
  /** CLI 的 cwd，为空目录，避免仓库里的 CLAUDE.md / AGENTS.md 影响基准 */
  workdir: string;
  /**
   * 实际生效的思考强度，已由编排层（core/run-plan.ts）依据能力目录折叠。
   * 适配器不应读 `target.effort`：那是请求的档位，可能超出模型支持的上限。
   */
  appliedEffort: EffortLevel;
  /**
   * 该模型是否接受强度调节。为假时不得传强度参数，否则 agy 等 CLI 会直接报错。
   */
  effortAdjustable: boolean;
  timeoutMs: number;
  /**
   * 轮次被停止时触发（见 core/run-cancel.ts）。适配器按超时路径终止调用并尽快返回，
   * 返回内容由编排层丢弃。
   */
  signal?: AbortSignal;
}

/** 模型在回答过程中写出的文件，内容已由适配器当场读回 */
export interface WrittenFile {
  path: string;
  content: string;
}

export interface AgentReply {
  /** 模型回答的正文；超时时为截至终止前已收到的部分 */
  text: string;
  /** 模型写成文件而非内联在回答里的作品（如 agy 的 gemini），按事件流中的路径取回 */
  writtenFiles: WrittenFile[];
  /** 原始事件流与 stderr，存档为 .txt */
  transcript: string;
  timedOut: boolean;
  /**
   * CLI 或服务端层面的失败（参数被拒、模型不存在、turn 失败、进程异常退出）；
   * 非 null 表示运维故障，而非模型表现。
   */
  error: string | null;
  /** 调用中的诊断观察（如工具调用被 headless 模式拒绝），无 SVG 时用作失败原因 */
  notes: string[];
  /**
   * 请求的强度是否生效。为 false 时模型不接受强度调节，记录里的 effort 仅用于分组，
   * 看板需区分显示。
   */
  effortHonored: boolean;
}

export interface AgentSession {
  /** 超时、CLI 报错等通过 AgentReply 返回；抛出表示调用链本身故障 */
  ask(request: AgentRequest): Promise<AgentReply>;
  /** 释放会话持有的进程；一轮结束时必须调用，即使中途有调用失败 */
  close(): Promise<void>;
}

/**
 * 非默认 profile 的启动参数：上游地址与 key。由编排层在开轮时组装，key 只进该会话的
 * 子进程环境，不写盘、不进日志。
 */
export interface ProfileLaunch {
  name: string;
  baseUrl: string;
  queryParams: Record<string, string>;
  apiKey: string;
}

export interface AgentAdapter {
  /**
   * 一轮开始时调用；进程在第一次 ask 时才启动。
   * 不传 profile 即默认 profile：继承宿主机的登录态。
   */
  openSession(profile?: ProfileLaunch): AgentSession;
}
