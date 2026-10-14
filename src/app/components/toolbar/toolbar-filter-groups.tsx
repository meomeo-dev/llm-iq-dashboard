import React from "react";
import { profileLabel, type ProfileView } from "@/core/profile-view";
import { DEFAULT_PROFILE, type DashboardCard } from "@/core/types";
import { localizePromptLabel, type Locale } from "@/i18n";
import { profileColor } from "../profile/profile-color";
import { upstreamOf } from "../timeline/effort-slots";
import { listEfforts } from "../timeline/moments";
import type { FilterGroup } from "./FilterMenu";
import { tally } from "./toolbar-calc";

/**
 * 组装筛选菜单的分组数据（CLI / 上游 / 模型 / 强度 / 提示词）。
 * "上游"一节只在当天有第三方上游的结果时出现。
 */
export function buildFilterGroups(
  cards: readonly DashboardCard[],
  promptLabels: Readonly<Record<string, string>>,
  profiles: readonly ProfileView[] = [],
  locale: Locale = "zh-CN",
): FilterGroup[] {
  const isEn = locale === "en";
  const clis = tally(cards.map((card) => card.cli)).map((item) => ({
    ...item,
    marker: <span className={`cli-mark cli-${item.value}`} aria-hidden="true" />,
  }));
  const models = tally(cards.map((card) => card.model));
  // 强度按档位高低排序，与泳道顺序一致
  const efforts = listEfforts(cards).map((effort) => ({
    value: effort,
    label: effort,
    count: cards.filter((card) => card.effort === effort).length,
  }));
  // 按当天数据列出，配置里已停用的提示词仍可筛选
  const prompts = tally(cards.map((card) => card.promptId)).map((item) => {
    const raw = promptLabels[item.value] ?? item.value;
    return {
      ...item,
      label: localizePromptLabel(item.value, raw, locale),
    };
  });
  return [
    { key: "cli", label: "CLI", items: clis },
    ...upstreamGroup(cards, profiles, locale),
    { key: "model", label: isEn ? "Model" : "模型", items: models },
    { key: "effort", label: isEn ? "Effort" : "强度", items: efforts },
    { key: "promptId", label: isEn ? "Prompt" : "提示词", items: prompts },
  ];
}

function upstreamGroup(
  cards: readonly DashboardCard[],
  profiles: readonly ProfileView[],
  locale: Locale,
): FilterGroup[] {
  if (!cards.some((card) => card.profile !== undefined)) return [];
  const isEn = locale === "en";
  const items = tally(cards.map(upstreamOf)).map((item) => {
    const label = item.value === DEFAULT_PROFILE && isEn ? "Official Login" : profileLabel(item.value, profiles);
    return {
      ...item,
      label,
      marker:
        item.value === DEFAULT_PROFILE ? undefined : (
          <span className="profile-dot" style={{ background: profileColor(item.value) }} aria-hidden="true" />
        ),
    };
  });
  return [{ key: "profile", label: isEn ? "Profile" : "上游", items }];
}
