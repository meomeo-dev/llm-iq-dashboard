import type { SyncReport } from "./sync-orchestrator";
import type { ConfirmPublishedReport } from "./confirm-published";
import type { GithubConnection, GithubConnectionState } from "../github-auth";

export type { GithubConnection, GithubConnectionState };
export type PushCapability = "github-app" | "host-credentials" | "unavailable";

/** 数据仓面板状态：GET /api/data-repo 的响应体 */
export interface DataRepoStatus {
  /** 配置是否含 dataRepo 段 */
  configured: boolean;
  deploy: { readonly: boolean; externalRunner: boolean };
  /** 数据仓工作副本状态；web 进程不可达（分容器部署）时由执行器代答，仍不可得则为 null */
  repo: {
    /** 配置里写的路径原文，不做绝对路径展开 */
    path: string;
    reachable: boolean;
    isGitRepo: boolean;
    clean: boolean;
    branch: string | null;
    upstream: string | null;
    /** 本地领先 / 落后上游的提交数；无上游为 null */
    ahead: number | null;
    behind: number | null;
    /** 领先上游的本地提交短哈希，新的在前；用于推送前的确认比对 */
    aheadCommits: string[];
  } | null;
  /** 数据仓根清单 index.json 摘要；读不到为 null */
  manifest: { totalRuns: number; updatedAt: string; latestDay: string | null } | null;
  ledger: {
    exported: number;
    published: number;
    lastExportedAt: string | null;
    lastPublishedAt: string | null;
  };
  local: {
    /** data/runs 下轮次目录总数 */
    totalRuns: number;
    /** 已完成（有 run.json 且非 inProgress）但台账里没有记录的轮次，新的在前 */
    pending: string[];
    /** 仍在进行或缺 run.json 的轮次数 */
    incomplete: number;
  };
  /** 最近一次面板动作的结果；无则 null */
  lastAction: SyncActionResult | null;
  /** 聚合过程中的非致命错误说明（中文），无则 null */
  notice: string | null;
  /** GitHub App 连接状态 */
  github?: GithubConnection;
  /** 推送能力：github-app（已连接 GitHub App）、host-credentials（宿主机凭据）、unavailable（容器内无凭据） */
  pushCapability?: PushCapability;
}

export type SyncActionMode = "dry-run" | "export" | "confirm" | "push";

/** POST /api/data-repo/sync 的请求体 */
export interface SyncActionRequest {
  mode: SyncActionMode;
  /** 仅 push 必填：面板展示给用户并被确认的领先提交清单，须与服务端当下的 aheadCommits 完全一致 */
  confirmation?: { aheadCommits: string[] };
}

/** 动作结果：POST 的响应体，也写入 lastAction */
export interface SyncActionResult {
  mode: SyncActionMode;
  startedAt: string;
  finishedAt: string;
  ok: boolean;
  /** dry-run / export / push 为 SyncReport；confirm 为 ConfirmPublishedReport；失败为 null */
  report: SyncReport | ConfirmPublishedReport | null;
  /** 执行者：web 进程就地执行，或经请求通道由执行器执行 */
  executedBy: "web" | "runner";
  error: string | null;
}



