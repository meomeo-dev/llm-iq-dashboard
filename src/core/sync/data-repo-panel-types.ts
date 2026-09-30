import type { SyncReport } from "./sync-orchestrator";
import type { ConfirmPublishedReport } from "./confirm-published";
import type { LedgerDecisionReport } from "./ledger-decisions";
import type { GithubConnection, GithubConnectionState } from "../github-auth";

export type { GithubConnection, GithubConnectionState };
export type PushCapability = "github-app" | "host-credentials" | "unavailable";

/** 待导出轮次里的一次调用，供面板预览与按调用勾选；作品经 /art 路由按 svgFile 读取 */
export interface PendingAttempt {
  /** attemptKey：`targetId@promptId` */
  key: string;
  promptId: string;
  cli: string;
  model: string;
  effort: string;
  /** 非登录态调用所经的 profile 名 */
  profile?: string;
  /** ok / no-svg / error / timeout */
  status: string;
  svgFile: string | null;
}

/** 待导出轮次的摘要，供面板勾选；只读 run.json 的题目、调用与上游，不读作品 */
export interface PendingRun {
  runId: string;
  /** 本轮题目 id，按记录顺序去重 */
  promptIds: string[];
  attempts: number;
  ok: number;
  /** 本轮用到的非登录态 profile 名，按首次出现去重 */
  profiles: string[];
  /** 本轮全部调用，按记录顺序；旧状态快照可能缺失 */
  items?: PendingAttempt[];
}

/** 数据仓面板状态：GET /api/data-repo 的响应体 */
export interface DataRepoStatus {
  /** 配置是否含 dataRepo 段 */
  configured: boolean;
  /** 配置的 dataRepo.autoSync：轮次结束后是否自动导出；旧状态快照可能缺失 */
  autoSync?: boolean;
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
    skipped?: number;
    skippedByReason?: {
      "unpublishable-prompt": number;
      rejected: number;
      abandoned: number;
      /** 没有任何完成调用的轮次；旧状态快照可能缺失 */
      empty?: number;
      /** 所有者在面板上丢弃的轮次 */
      discarded?: number;
    };
    lastExportedAt: string | null;
    lastPublishedAt: string | null;
  };
  local: {
    /** data/runs 下轮次目录总数 */
    totalRuns: number;
    /** 已完成（有 run.json 且非 inProgress）但台账里没有记录的轮次，新的在前 */
    pending: string[];
    /** pending 里每一轮的摘要，顺序与 pending 相同；旧状态快照可能缺失 */
    pendingRuns?: PendingRun[];
    /** 未完成的轮次数 = running + interrupted */
    incomplete: number;
    /** 未完成且开始不足 6 小时的轮次数：仍在执行，结束后自动导出 */
    running?: number;
    /** 未完成且开始超过 6 小时的轮次数：进程中途退出，由执行进程启动时收尾或保留策略清理，面板不展示 */
    interrupted?: number;
    /** 台账 skipped/rejected 且本地目录仍在的 runId，新的在前 */
    rejected?: string[];
    /** 所有者丢弃且本地目录仍在的 runId，新的在前；可在面板恢复 */
    discarded?: string[];
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

/** discard / restore 只改本地台账（丢弃与恢复），不碰数据仓 */
export type SyncActionMode = "dry-run" | "export" | "confirm" | "push" | "discard" | "restore";

/** POST /api/data-repo/sync 的请求体 */
export interface SyncActionRequest {
  mode: SyncActionMode;
  /** 只处理这些轮次（面板勾选）；缺省为全部候选。空数组视为非法，由解析拒绝。discard / restore 必填 */
  runIds?: string[];
  /** 按轮次只导出部分调用（attemptKey）；键须在 runIds 里，没有条目的轮次整轮导出 */
  attempts?: Record<string, string[]>;
  /** 仅 push 必填：面板展示给用户并被确认的领先提交清单，须与服务端当下的 aheadCommits 完全一致 */
  confirmation?: { aheadCommits: string[] };
}

/** 动作结果：POST 的响应体，也写入 lastAction */
export interface SyncActionResult {
  mode: SyncActionMode;
  startedAt: string;
  finishedAt: string;
  ok: boolean;
  /** dry-run / export / push 为 SyncReport；confirm 为 ConfirmPublishedReport；discard / restore 为 LedgerDecisionReport；失败为 null */
  report: SyncReport | ConfirmPublishedReport | LedgerDecisionReport | null;
  /** 执行者：web 进程就地执行，或经请求通道由执行器执行 */
  executedBy: "web" | "runner";
  error: string | null;
}



