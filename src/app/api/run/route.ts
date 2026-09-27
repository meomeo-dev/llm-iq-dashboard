/**
 * 单次执行：`GET /api/run` 取可选范围，`POST /api/run` 发起一轮。
 *
 * POST 真实调用各家 CLI 并消耗配额。已有一轮在跑（手动或定时）时返回 409，不排队
 * 也不并行：并行会让同一模型的调用互相挤占速率上限，耗时数据失真。
 *
 * 一轮可能持续几十分钟，因此进度文件写好后即返回 202，在后台跑完；进度经
 * /api/events 推送。
 */

import { NextResponse } from "next/server";
import { audit } from "@/core/auth/audit";
import { clientIp, requireOwner, requireOwnerAction } from "@/core/auth/guard";
import { sharedRateLimiter } from "@/core/auth/rate-limit";
import { splitByReadiness, type UnavailableCli } from "@/capabilities/callable-targets";
import { readReadiness } from "@/capabilities/readiness-cache";
import { loadConfig, type AppConfig } from "@/core/config";
import type { BudgetConfig } from "@/core/budget";
import { loadCostHistory } from "@/core/cost-history";
import { configPath } from "@/core/paths";
import { findActiveRun } from "@/core/progress";
import { listPrompts } from "@/core/prompt";
import { enqueueRequest, waitForRequest } from "@/core/requests";
import { narrowConfig, scheduledRound, type RunSelection } from "@/core/run-selection";
import { executeRun } from "@/core/runner";
import { externalRunner } from "@/core/runner-link";
import { parseRunRequestBody } from "./run-request";

export const dynamic = "force-dynamic";

/**
 * 覆盖从收到请求到进度文件出现之间的空档。挂在 globalThis 上，开发模式热重载路由
 * 模块时不会被重置。
 */
const FLAG = Symbol.for("pelican.manualRunInFlight");

/** 每台设备每小时最多发起的轮次；一轮可达上百美元，误触与失窃会话都被这条限住 */
const RUNS_PER_DEVICE = 6;
const RUN_WINDOW_MS = 60 * 60 * 1000;
/** 外部执行器认领并开跑的等待上限：开跑前要读能力目录，首次可能探测十几秒 */
const RUNNER_START_TIMEOUT_MS = 60_000;

interface FlagHolder {
  [FLAG]?: boolean;
}

export interface RunPromptOption {
  id: string;
  label: string;
  defaultSelected: boolean;
  candidates?: { id: string; label: string }[];
}

export interface RunOptionsView {
  /**
   * 被测矩阵中当前能调用的目标（见 capabilities/callable-targets.ts）；
   * defaultSelected：进入定时任务的目标（enabled），与题目的 defaultSelected 对称
   */
  targets: { id: string; label: string; cli: string; model: string; effort: string; defaultSelected: boolean }[];
  /** 因 CLI 没装或没登录而暂不列出的，按 CLI 汇总；登录后自动回到 targets */
  unavailable: UnavailableCli[];
  /** defaultSelected：配置里 run.promptIds 启用的条目；多候选题目带候选清单 */
  prompts: RunPromptOption[];
  activeRunId: string | null;
  /** 预测所需：各目标的预测单次成本（没有可计价历史的不在表里）、近 24 小时花费与上限 */
  costs: { expected: Record<string, number>; spentLastDayUsd: number; budget: BudgetConfig };
}

export async function GET(request: Request): Promise<NextResponse> {
  const guard = await requireOwner(request);
  if (!guard.ok) return NextResponse.json({ error: guard.error }, { status: guard.status });
  try {
    const config = loadConfig(configPath());
    const enabled = new Set(config.run.promptIds);
    const active = await findActiveRun();
    const history = await loadCostHistory();
    const { callable, unavailable } = splitByReadiness(config.targets, await readReadiness());
    const view: RunOptionsView = {
      targets: callable.map(({ id, label, cli, model, effort, enabled }) => ({
        id, label, cli, model, effort, defaultSelected: enabled,
      })),
      unavailable,
      prompts: listPrompts(config.customPrompts).map(({ id, label, candidates }) => ({
        id,
        label,
        defaultSelected: enabled.has(id),
        ...(candidates.length > 0 ? { candidates: candidates.map((c) => ({ id: c.id, label: c.label })) } : {}),
      })),
      activeRunId: active?.runId ?? null,
      costs: {
        expected: Object.fromEntries(history.expected),
        spentLastDayUsd: history.spentLastDayUsd,
        budget: config.budget,
      },
    };
    return NextResponse.json(view);
  } catch (cause) {
    return NextResponse.json({ error: describe(cause) }, { status: 500 });
  }
}

/** 请求体可省略：不带选择时按配置跑整轮（配置页“立即执行”走这条） */
export async function POST(request: Request): Promise<NextResponse> {
  const guard = await requireOwnerAction(request, "run");
  if (!guard.ok) return NextResponse.json({ error: guard.error }, { status: guard.status });
  const { deviceId } = guard.owner;
  const ip = clientIp(request);
  if (!sharedRateLimiter("run", RUNS_PER_DEVICE, RUN_WINDOW_MS).take(deviceId)) {
    await audit({ action: "run", outcome: "denied", deviceId, ip, detail: "限流" });
    return NextResponse.json({ error: `每台设备每小时最多发起 ${RUNS_PER_DEVICE} 轮` }, { status: 429 });
  }

  let config: AppConfig;
  let selection: RunSelection | null;
  try {
    const full = loadConfig(configPath());
    selection = parseRunRequestBody(await request.text());
    // 不带选择（配置页“立即执行”）按定时任务的范围跑整轮
    config = selection === null ? scheduledRound(full) : narrowConfig(full, selection);
  } catch (cause) {
    return NextResponse.json({ error: describe(cause) }, { status: 400 });
  }

  // 先占标记再读进度文件，连续两次请求只有一次能走到 executeRun
  const holder = globalThis as FlagHolder;
  if (holder[FLAG] === true) return NextResponse.json({ error: "已有一轮正在执行" }, { status: 409 });
  holder[FLAG] = true;
  const active = await findActiveRun();
  if (active !== null) {
    holder[FLAG] = false;
    const trigger = active.trigger === "schedule" ? "定时" : "手动";
    return NextResponse.json({ error: `已有一轮正在执行（${trigger} ${active.runId}）` }, { status: 409 });
  }

  // 分容器部署：写请求文件交给执行器，等它开跑后拿到 runId
  if (externalRunner()) {
    try {
      return await startViaRunner(selection, { deviceId, ip });
    } finally {
      holder[FLAG] = false;
    }
  }

  return startLocalRun(config, selection, { deviceId, ip }, () => {
    holder[FLAG] = false;
  });
}

async function startViaRunner(
  selection: RunSelection | null,
  who: { deviceId: string; ip: string | null },
): Promise<NextResponse> {
  const queued = await enqueueRequest("run", selection);
  const settled = await waitForRequest(queued.id, RUNNER_START_TIMEOUT_MS);
  if (settled?.state === "done" && settled.result?.runId !== undefined) {
    const { runId, calls } = settled.result;
    await audit({ action: "run", outcome: "ok", deviceId: who.deviceId, ip: who.ip, detail: `${runId} ${calls ?? 0} 次调用` });
    return NextResponse.json({ started: true, runId, calls: calls ?? 0 }, { status: 202 });
  }
  const error =
    settled?.state === "failed"
      ? (settled.result?.error ?? "执行器拒绝了请求")
      : "执行器未响应：确认 runner 容器在运行（docker compose ps）";
  await audit({ action: "run", outcome: "error", deviceId: who.deviceId, ip: who.ip, detail: error });
  return NextResponse.json({ error }, { status: settled?.state === "failed" ? 409 : 503 });
}

async function startLocalRun(
  config: AppConfig, selection: RunSelection | null,
  who: { deviceId: string; ip: string | null }, onFinished: () => void,
): Promise<NextResponse> {
  // 进度文件写好后才返回 202，前端随即读取进度时必能读到这一轮；开跑前抛错返回 500
  const started = new Promise<string>((resolve, reject) => {
    void executeRun(config, {
      trigger: "manual", candidateOverrides: selection?.candidateOverrides,
      log: (message) => console.log(message), onStarted: resolve,
    })
      .catch((cause: unknown) => {
        console.error(`手动执行失败：${describe(cause)}`);
        reject(cause);
      })
      .finally(onFinished);
  });
  try {
    const runId = await started;
    const calls = config.targets.length * config.run.promptIds.length;
    await audit({ action: "run", outcome: "ok", deviceId: who.deviceId, ip: who.ip, detail: `${runId} ${calls} 次调用` });
    return NextResponse.json({ started: true, runId, calls }, { status: 202 });
  } catch (cause) {
    await audit({ action: "run", outcome: "error", deviceId: who.deviceId, ip: who.ip, detail: describe(cause) });
    return NextResponse.json({ error: describe(cause) }, { status: 500 });
  }
}

function describe(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause);
}
