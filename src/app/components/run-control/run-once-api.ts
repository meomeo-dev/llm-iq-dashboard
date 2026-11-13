import { actionFetch } from "../action-fetch";
import type { RunOptionsView } from "@/app/api/run/route";
import type { Locale } from "@/i18n";

// 外部执行器最多等 60 秒。给服务端留出响应时间，同时防止网络排队时一直停在发起中。
const RUN_SUBMISSION_TIMEOUT_MS = 75_000;

type RunSubmission = {
  targetIds: string[];
  promptIds: string[];
  candidateOverrides?: Record<string, string>;
  profiles?: string[];
};

let cachedRunOptions: RunOptionsView | null = null;
let prefetchPromise: Promise<RunOptionsView | { error: string }> | null = null;

export function getCachedRunOptions(): RunOptionsView | null {
  return cachedRunOptions;
}

export function setCachedRunOptions(options: RunOptionsView | null): void {
  cachedRunOptions = options;
}

const EXACT_ERRORS_EN: Record<string, string> = {
  读取可选范围失败: "Failed to load available options",
  发起失败: "Failed to start run",
  需要所有者登录: "Owner sign-in required",
  只读部署: "Read-only deployment",
  已有一轮正在执行: "A round is already running",
  执行器拒绝了请求: "Runner rejected the request",
  "执行器未响应：确认 runner 容器在运行（docker compose ps）":
    "Runner did not respond: verify the runner container is running (docker compose ps)",
  至少选择一个目标: "Select at least one target",
  至少选择一道题目: "Select at least one prompt",
  至少选择一个上游: "Select at least one profile",
  "所选目标的上游 profile 均已停用": "All upstream profiles for the selected targets are disabled",
};

export function localizeRunApiError(error: string, locale: Locale = "zh-CN"): string {
  if (locale !== "en") return error;
  const exact = EXACT_ERRORS_EN[error];
  if (exact !== undefined) return exact;
  const rateMatch = /^每台设备每小时最多发起 (\d+) 轮$/.exec(error);
  if (rateMatch) return `Rate limit: at most ${rateMatch[1]} rounds per hour per device`;
  const activeMatch = /^已有一轮正在执行（(定时|手动) (.+)）$/.exec(error);
  if (activeMatch) {
    return `A round is already running (${activeMatch[1] === "定时" ? "scheduled" : "manual"} ${activeMatch[2]})`;
  }
  const fpMatch = /^模型指纹作业正在执行（(.+)）$/.exec(error);
  if (fpMatch) return `A model fingerprint job is running (${fpMatch[1]})`;
  const missingCfg = /^配置里没有：(.+)$/.exec(error);
  if (missingCfg) {
    const items = missingCfg[1]!.replaceAll("目标 ", "target ").replaceAll("题目 ", "prompt ").replaceAll("、", ", ");
    return `Not found in config: ${items}`;
  }
  const missingProf = /^配置里没有 (.+) 的上游 (.+)$/.exec(error);
  if (missingProf) return `Profile ${missingProf[2]} for ${missingProf[1]} is not in config`;
  const disabledProf = /^上游 (.+) 已停用$/.exec(error);
  if (disabledProf) return `Profile ${disabledProf[1]} is disabled`;
  const missingModel = /^上游 (.+) 的模型清单里没有 (.+)$/.exec(error);
  if (missingModel) return `Profile ${missingModel[1]} does not include model ${missingModel[2]}`;
  const missingCand = /^题目 (.+) 没有候选 (.+)$/.exec(error);
  if (missingCand) return `Prompt ${missingCand[1]} has no candidate ${missingCand[2]}`;
  const budgetMatch = /^近 24 小时 API 等价成本 (.+) 已达每日上限 (.+)，本轮不执行（上限见配置 budget\.perDayUsd）$/.exec(error);
  if (budgetMatch) {
    return `24h API-equivalent cost ${budgetMatch[1]} reached daily cap ${budgetMatch[2]}; round skipped (see budget.perDayUsd)`;
  }
  return error;
}

/**
 * 提前预拉取单次执行选项，抹平首次打开时的网络往返与 Next.js 路由编译延迟。
 */
export async function prefetchRunOptions(): Promise<RunOptionsView | { error: string }> {
  if (cachedRunOptions !== null) return cachedRunOptions;
  if (prefetchPromise !== null) return prefetchPromise;
  prefetchPromise = fetchOptions().then((next) => {
    if (!("error" in next)) {
      cachedRunOptions = next;
    }
    prefetchPromise = null;
    return next;
  });
  return prefetchPromise;
}

export async function fetchOptions(locale: Locale = "zh-CN"): Promise<RunOptionsView | { error: string }> {
  try {
    const response = await actionFetch("/api/run");
    const body = (await response.json()) as RunOptionsView & { error?: string };
    return response.ok ? body : { error: localizeRunApiError(body.error ?? "读取可选范围失败", locale) };
  } catch (cause) {
    return { error: localizeRunApiError(cause instanceof Error ? cause.message : String(cause), locale) };
  }
}

export async function postRun(
  targetIds: string[],
  promptIds: string[],
  candidateOverrides?: Record<string, string>,
  profiles?: readonly string[],
  locale: Locale = "zh-CN",
): Promise<{ runId: string; calls: number } | { error: string }> {
  const payload: RunSubmission = { targetIds, promptIds };
  if (candidateOverrides && Object.keys(candidateOverrides).length > 0) {
    payload.candidateOverrides = candidateOverrides;
  }
  // 不涉及上游时不带该字段，请求与引入上游之前逐字相同
  if (profiles !== undefined) payload.profiles = [...profiles];
  return submitRun(locale, payload);
}

/** 无 payload 时按保存的配置发起一轮。 */
export async function submitRun(
  locale: Locale,
  payload?: RunSubmission,
): Promise<{ runId: string; calls: number } | { error: string }> {
  try {
    const response = await actionFetch("/api/run", {
      method: "POST",
      signal: AbortSignal.timeout(RUN_SUBMISSION_TIMEOUT_MS),
      ...(payload !== undefined && {
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      }),
    });
    const body = (await response.json()) as { runId?: string; calls?: number; error?: string };
    return response.ok
      ? { runId: body.runId ?? "", calls: body.calls ?? 0 }
      : { error: localizeRunApiError(body.error ?? "发起失败", locale) };
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === "TimeoutError") {
      return { error: locale === "en"
        ? "No start confirmation received. Check live status before submitting again."
        : "未收到发起确认，请先查看执行状态，再决定是否重新发起。" };
    }
    return { error: localizeRunApiError(cause instanceof Error ? cause.message : String(cause), locale) };
  }
}
