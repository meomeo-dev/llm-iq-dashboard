/**
 * 提示词生命周期与题龄计算
 */

import type { PromptLifecycle, PromptSpec } from "./types";

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const DAYS_PER_MONTH = 30.4375;

function calculateOriginAge(originDate: string | null, now: Date): string | null {
  if (originDate === null) return null;
  const originTime = new Date(originDate.length === 7 ? `${originDate}-01` : originDate).getTime();
  if (Number.isNaN(originTime)) return null;

  const diffMonths = Math.max(0, Math.floor((now.getTime() - originTime) / (MS_PER_DAY * DAYS_PER_MONTH)));
  if (diffMonths >= 12) {
    const years = (diffMonths / 12).toFixed(1).replace(/\.0$/, "");
    return `${years} 年前`;
  }
  return `${Math.max(1, diffMonths)} 个月前`;
}

function calculateCollectedAge(
  registeredAt: string | null,
  now: Date,
): { days: number | null; text: string | null } {
  if (registeredAt === null) return { days: null, text: null };
  const collectedTime = new Date(registeredAt).getTime();
  if (Number.isNaN(collectedTime)) return { days: null, text: null };

  const days = Math.max(0, Math.floor((now.getTime() - collectedTime) / MS_PER_DAY));
  if (days === 0) return { days, text: "今天收录" };
  if (days < 30) return { days, text: `${days} 天前` };
  const months = Math.floor(days / DAYS_PER_MONTH);
  return { days, text: `${months} 个月前` };
}

function determineStatus(specId: string, daysSinceCollected: number | null): "active" | "aging" | "legacy" {
  if (specId === "classic-v1" || specId === "upgraded-v2") return "legacy";
  if (daysSinceCollected !== null && daysSinceCollected > 180) return "aging";
  return "active";
}

/** 计算提示词的题龄与生命周期状态，用于淘汰评估与题目迭代 */
export function promptLifecycle(spec: PromptSpec, now: Date = new Date()): PromptLifecycle {
  const originDate = spec.originDate ?? null;
  const registeredAt = spec.registeredAt ?? null;
  const originAgeText = calculateOriginAge(originDate, now);
  const { days: daysSinceCollected, text: collectedAgeText } = calculateCollectedAge(registeredAt, now);
  const status = determineStatus(spec.id, daysSinceCollected);

  return {
    originDate,
    registeredAt,
    originAgeText,
    daysSinceCollected,
    collectedAgeText,
    status,
  };
}
