import React from "react";
import type { DashboardCard } from "@/core/types";
import { listEfforts } from "../timeline/moments";
import type { FilterGroup } from "./FilterMenu";
import { tally } from "./toolbar-calc";

/**
 * 组装筛选菜单的分组数据（CLI / 模型 / 强度 / 提示词）。
 */
export function buildFilterGroups(
  cards: readonly DashboardCard[],
  promptLabels: Readonly<Record<string, string>>,
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
    { key: "model", label: "模型", items: models },
    { key: "effort", label: "强度", items: efforts },
    { key: "promptId", label: "提示词", items: prompts },
  ];
}
