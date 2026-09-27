import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/core/auth/session";
import { listRunStarts, loadCardsBetween } from "@/core/store";
import { BUILTIN_PROMPTS, FRONTIER_INDIVIDUAL_PROMPT_MAP, listPrompts, type PromptSpec, type PromptStandard } from "@/core/prompt";
import { loadConfig } from "@/core/config";
import { configPath } from "@/core/paths";
import type { DashboardCard } from "@/core/types";
import { CliStatusBanner } from "./components/cli-status/CliStatusBanner";
import { Dashboard } from "./components/Dashboard";

/** 产物由其他进程写入，每次请求都重读，禁止构建期静态化 */
export const dynamic = "force-dynamic";

const HOUR_MS = 60 * 60 * 1000;
/** 时区偏移范围 UTC−12 到 UTC+14，任一时区的某一天都落在 UTC 同名日期加此余量的窗口内 */
const EARLIEST_OFFSET_MS = 14 * HOUR_MS;
const LATEST_OFFSET_MS = 12 * HOUR_MS;
const DAY_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

interface PageProps {
  /** day=YYYY-MM-DD：看板选中的日期（按浏览器所选时区）；缺省为今天 */
  searchParams: Promise<{ day?: string | string[] }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { day } = await searchParams;
  const owner = (await verifySession((await cookies()).get(SESSION_COOKIE)?.value)) !== null;
  const dayKey = typeof day === "string" ? day : null;
  const range = cardWindow(dayKey, new Date());
  const runStarts = await listRunStarts();
  const cards = sortNewestFirst(await loadCardsBetween(range.from, range.to));
  const { prompts, scheduleTimeZone } = readDashboardSettings();
  const promptLabels = Object.fromEntries(prompts.map((spec) => [spec.id, spec.label]));
  
  const promptStandards: Record<string, PromptStandard> = {};
  for (const spec of prompts) {
    if (spec.standard) {
      promptStandards[spec.id] = spec.standard;
    }
    if (spec.candidates && spec.candidates.length > 0) {
      for (const cand of spec.candidates) {
        const candStd =
          cand.standard ??
          FRONTIER_INDIVIDUAL_PROMPT_MAP.get(cand.id)?.standard ??
          spec.standard;
        if (candStd) {
          promptStandards[`${spec.id}::${cand.label}`] = candStd;
          promptStandards[`${spec.id}::${cand.id}`] = candStd;
          promptStandards[cand.label] = candStd;
          promptStandards[cand.id] = candStd;
        }
      }
    }
  }
  for (const [id, spec] of FRONTIER_INDIVIDUAL_PROMPT_MAP.entries()) {
    if (spec.standard) {
      promptStandards[id] = spec.standard;
      promptStandards[spec.label] = spec.standard;
    }
  }

  return (
    <div className="page">
      {/* CLI 登录状态与安装命令只给所有者看 */}
      {owner && <CliStatusBanner />}
      {/* 无记录时同样渲染完整看板，由时间线给出引导 */}
      <Dashboard
        owner={owner}
        cards={cards}
        runStarts={runStarts}
        initialDay={dayKey}
        promptLabels={promptLabels}
        promptStandards={promptStandards}
        scheduleTimeZone={scheduleTimeZone}
      />
    </div>
  );
}

/**
 * 只载入所选那天的轮次。服务端不知道浏览器所选时区，按覆盖所有时区的宽窗口取数，
 * 由客户端精确分天；未选日期时取最近 24 小时。
 */
function cardWindow(dayKey: string | null, now: Date): { from: Date; to: Date } {
  const dayStart = dayKey !== null && DAY_KEY_PATTERN.test(dayKey) ? Date.parse(`${dayKey}T00:00:00Z`) : NaN;
  if (Number.isNaN(dayStart)) return { from: new Date(now.getTime() - 24 * HOUR_MS), to: new Date(now.getTime() + HOUR_MS) };
  return { from: new Date(dayStart - EARLIEST_OFFSET_MS), to: new Date(dayStart + 24 * HOUR_MS + LATEST_OFFSET_MS) };
}

/** 跨轮次、跨模型统一按执行时刻从新到旧；日期选择以此为序 */
function sortNewestFirst(cards: DashboardCard[]): DashboardCard[] {
  return [...cards].sort((a, b) => b.startedAt.localeCompare(a.startedAt));
}

/**
 * 提示词显示名取全部已登记条目（含已停用的），保证历史结果在筛选里显示正确名称。
 * 配置缺失或损坏时退回内置条目、不带调度时区，页面仍能呈现历史。
 */
function readDashboardSettings(): { prompts: readonly PromptSpec[]; scheduleTimeZone: string | null } {
  try {
    const config = loadConfig(configPath());
    return { prompts: listPrompts(config.customPrompts), scheduleTimeZone: config.schedule.timezone };
  } catch {
    return { prompts: BUILTIN_PROMPTS, scheduleTimeZone: null };
  }
}
