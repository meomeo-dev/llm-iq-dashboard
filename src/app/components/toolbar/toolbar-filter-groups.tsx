import React from "react";
import { profileLabel, type ProfileView } from "@/core/profile-view";
import { DEFAULT_PROFILE, type DashboardCard } from "@/core/types";
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
): FilterGroup[] {
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
  const prompts = tally(cards.map((card) => card.promptId)).map((item) => ({
    ...item,
    label: promptLabels[item.value] ?? item.value,
  }));
  return [
    { key: "cli", label: "CLI", items: clis },
    ...upstreamGroup(cards, profiles),
    { key: "model", label: "模型", items: models },
    { key: "effort", label: "强度", items: efforts },
    { key: "promptId", label: "提示词", items: prompts },
  ];
}

function upstreamGroup(cards: readonly DashboardCard[], profiles: readonly ProfileView[]): FilterGroup[] {
  if (!cards.some((card) => card.profile !== undefined)) return [];
  const items = tally(cards.map(upstreamOf)).map((item) => ({
    ...item,
    label: profileLabel(item.value, profiles),
    marker:
      item.value === DEFAULT_PROFILE ? undefined : (
        <span className="profile-dot" style={{ background: profileColor(item.value) }} aria-hidden="true" />
      ),
  }));
  return [{ key: "profile", label: "上游", items }];
}
