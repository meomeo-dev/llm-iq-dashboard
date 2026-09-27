/**
 * 配置页侧边导航栏配置项定义
 */

export interface ConfigNavItem {
  /** 区块锚点标识符（kebab-case） */
  readonly id: string;
  /** 导航显示的中文标题 */
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
  { id: "matrix", title: "被测矩阵", href: "#matrix" },
  { id: "schedule", title: "调度", href: "#schedule" },
  { id: "timeout", title: "执行与超时", href: "#timeout" },
  { id: "data-repo", title: "数据仓", href: "#data-repo" },
  { id: "devices", title: "已配对设备", href: "#devices" },
] as const;
