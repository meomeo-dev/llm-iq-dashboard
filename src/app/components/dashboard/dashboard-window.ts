import { listRunStarts, loadCardsBetween } from "@/core/data-source";
import { getDeployMode } from "@/core/deploy-mode";
import type { ProfileView } from "@/core/profile-view";
import type { PromptStandard } from "@/core/prompt";
import { computeRunsRevision } from "@/core/runs-revision";
import type { DashboardCard } from "@/core/types";
import {
  buildPromptStandards,
  cardWindow,
  readDashboardSettings,
  sortNewestFirst,
} from "./dashboard-page-data";

export interface DashboardWindowSnapshot {
  readonly cards: DashboardCard[];
  readonly runStarts: string[];
  readonly scheduleTimeZone: string | null;
  readonly promptLabels: Record<string, string>;
  readonly promptStandards: Record<string, PromptStandard>;
  readonly profiles: readonly ProfileView[];
  readonly runsRevision: string;
}

/** 服务端与 `/api/dashboard` 共用的窗口数据加载逻辑，确保首屏 SSR 与增量同步口径一致 */
export async function loadDashboardWindow(dayKey: string | null): Promise<DashboardWindowSnapshot> {
  const { readonly, dataSource } = getDeployMode();
  const isShowcase = readonly || dataSource === "remote";
  const [runStarts, runsRevision] = await Promise.all([
    listRunStarts(),
    dataSource === "remote" ? Promise.resolve("remote") : computeRunsRevision(),
  ]);
  // 只读或远程展台下，未显式指定日期时默认按最新轮次所在日期拉取卡片，确保访客首屏不为空
  const effectiveDayKey =
    dayKey ?? (isShowcase && runStarts.length > 0 ? runStarts[0]?.slice(0, 10) ?? null : null);
  const range = cardWindow(effectiveDayKey, new Date());
  const cards = sortNewestFirst(await loadCardsBetween(range.from, range.to));
  const { prompts, scheduleTimeZone, profiles } = readDashboardSettings();
  const promptLabels = Object.fromEntries(prompts.map((spec) => [spec.id, spec.label]));
  const promptStandards = buildPromptStandards(prompts, cards);

  return {
    cards,
    runStarts,
    scheduleTimeZone,
    promptLabels,
    promptStandards,
    profiles,
    runsRevision,
  };
}
