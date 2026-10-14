/**
 * 配置页侧边导航栏配置项定义
 */

import type { Locale } from "@/i18n";

export interface ConfigNavItem {
  /** 区块锚点标识符（kebab-case） */
  readonly id: string;
  /** 导航显示的标题 */
  readonly title: string;
  /** 锚点链接，形如 #id */
  readonly href: string;
}

/**
 * 配置页导航项清单，按页面区块自上而下的渲染顺序排列
 */
export const CONFIG_NAV_ITEMS: readonly ConfigNavItem[] = [
  { id: "capability", title: "CLI 能力目录", href: "#capability" },
  { id: "prompts", title: "提示词", href: "#prompts" },
  { id: "harness-guard", title: "直出约束", href: "#harness-guard" },
  { id: "profiles", title: "上游 Profile", href: "#profiles" },
  { id: "matrix", title: "被测矩阵", href: "#matrix" },
  { id: "schedule", title: "调度", href: "#schedule" },
  { id: "timeout", title: "执行与超时", href: "#timeout" },
  { id: "judge", title: "作品评审", href: "#judge" },
  { id: "data-repo-settings", title: "数据仓设置", href: "#data-repo-settings" },
  { id: "data-repo", title: "数据仓", href: "#data-repo" },
  { id: "devices", title: "已配对设备", href: "#devices" },
] as const;

const CONFIG_NAV_ITEMS_EN: readonly ConfigNavItem[] = [
  { id: "capability", title: "CLI Capabilities", href: "#capability" },
  { id: "prompts", title: "Prompts", href: "#prompts" },
  { id: "harness-guard", title: "Harness Guard", href: "#harness-guard" },
  { id: "profiles", title: "Upstream Profiles", href: "#profiles" },
  { id: "matrix", title: "Target Matrix", href: "#matrix" },
  { id: "schedule", title: "Schedule", href: "#schedule" },
  { id: "timeout", title: "Execution & Timeouts", href: "#timeout" },
  { id: "judge", title: "Artwork Judging", href: "#judge" },
  { id: "data-repo-settings", title: "Data Repo Settings", href: "#data-repo-settings" },
  { id: "data-repo", title: "Data Repository", href: "#data-repo" },
  { id: "devices", title: "Paired Devices", href: "#devices" },
] as const;

export function getConfigNavItems(locale: Locale = "zh-CN"): readonly ConfigNavItem[] {
  return locale === "en" ? CONFIG_NAV_ITEMS_EN : CONFIG_NAV_ITEMS;
}
