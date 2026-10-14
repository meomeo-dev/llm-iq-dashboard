/**
 * 看板顶部工具栏、日历、时区、筛选器与运行控制双语字典。
 */

export interface ToolbarMessages {
  brandTitle: string;
  brandSubtitle: string;
  today: string;
  prevDayTitle: string;
  nextDayTitle: string;
  pickDateTitle: string;
  calendarWeekdays: readonly [string, string, string, string, string, string, string];
  calendarMonthYear: string;
  calendarLegendLocal: string;
  calendarLegendPublished: string;
  calendarLegendToday: string;
  timeZoneTitle: string;
  timeZoneLocal: string;
  timeZoneUtc: string;
  filterButton: string;
  filterActiveTitle: string;
  filterTabs: {
    cli: string;
    model: string;
    effort: string;
    prompt: string;
    status: string;
  };
  filterAll: string;
  filterNone: string;
  filterResetAll: string;
  exportButton: string;
  exportMenuTitle: string;
  exportFullPng: string;
  exportFullSvg: string;
  exportPortraitPng: string;
  exportPortraitSvg: string;
  exporting: string;
  autoRunLabel: string;
  autoRunOn: string;
  autoRunOff: string;
  autoRunQueued: string;
  runOnceButton: string;
  runOnceRunning: string;
  runOnceTitle: string;
  runOnceModelsTab: string;
  runOncePromptsTab: string;
  runOnceStart: string;
  runOnceStarting: string;
  stopRunButton: string;
  stopRunStopping: string;
  stopRunConfirmTitle: string;
  configLinkTitle: string;
  pairLinkTitle: string;
  githubRepoTitle: string;
  emptyDayTitle: string;
  emptyDayHint: string;
  emptyFilteredTitle: string;
  emptyFilteredReset: string;
  passRateLabel: string;
  cliStatusRecheck: string;
  cliStatusDismiss: string;
}

export const zhCNToolbar: ToolbarMessages = {
  brandTitle: "鹈鹕自行车基准",
  brandSubtitle: "24h 模型时间线",
  today: "今天",
  prevDayTitle: "前一天",
  nextDayTitle: "后一天",
  pickDateTitle: "选择日期",
  calendarWeekdays: ["一", "二", "三", "四", "五", "六", "日"],
  calendarMonthYear: "{year} 年 {month} 月",
  calendarLegendLocal: "本地运行",
  calendarLegendPublished: "已发布",
  calendarLegendToday: "今天",
  timeZoneTitle: "切换时区",
  timeZoneLocal: "本地时区",
  timeZoneUtc: "UTC 标准时间",
  filterButton: "筛选",
  filterActiveTitle: "当前已启用筛选条件",
  filterTabs: {
    cli: "CLI 工具",
    model: "模型",
    effort: "思考强度",
    prompt: "基准题目",
    status: "调用状态",
  },
  filterAll: "全选",
  filterNone: "清空",
  filterResetAll: "重置全部筛选",
  exportButton: "导出",
  exportMenuTitle: "导出当前时间线视图",
  exportFullPng: "导出横版 PNG 长图",
  exportFullSvg: "导出横版 SVG 矢量图",
  exportPortraitPng: "导出竖版 PNG（适合手机/社交分享）",
  exportPortraitSvg: "导出竖版 SVG 矢量图",
  exporting: "生成中…",
  autoRunLabel: "自动任务",
  autoRunOn: "已开启",
  autoRunOff: "已关闭",
  autoRunQueued: "排队中",
  runOnceButton: "跑一次",
  runOnceRunning: "执行中…",
  runOnceTitle: "手动发起一轮评测",
  runOnceModelsTab: "选择目标（CLI × 模型 × 强度）",
  runOncePromptsTab: "选择评测题目",
  runOnceStart: "立即开始",
  runOnceStarting: "发起中…",
  stopRunButton: "停止本轮",
  stopRunStopping: "停止中…",
  stopRunConfirmTitle: "立即终止当前正在执行的评测轮次",
  configLinkTitle: "打开配置管理台",
  pairLinkTitle: "设备配对与所有者认证",
  githubRepoTitle: "在 GitHub 查看源码仓库",
  emptyDayTitle: "当日暂无评测记录",
  emptyDayHint: "可切换上方日期，或点击「跑一次」立即发起评测",
  emptyFilteredTitle: "当前筛选条件下无匹配结果",
  emptyFilteredReset: "清除筛选条件",
  passRateLabel: "通过率",
  cliStatusRecheck: "重新检查",
  cliStatusDismiss: "不再提示",
};

export const enToolbar: ToolbarMessages = {
  brandTitle: "Pelican Bicycle Benchmark",
  brandSubtitle: "24h LLM Timeline",
  today: "Today",
  prevDayTitle: "Previous day",
  nextDayTitle: "Next day",
  pickDateTitle: "Pick date",
  calendarWeekdays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
  calendarMonthYear: "{month}/{year}",
  calendarLegendLocal: "Local runs",
  calendarLegendPublished: "Published",
  calendarLegendToday: "Today",
  timeZoneTitle: "Switch time zone",
  timeZoneLocal: "Local Time",
  timeZoneUtc: "UTC",
  filterButton: "Filter",
  filterActiveTitle: "Active filters applied",
  filterTabs: {
    cli: "CLI",
    model: "Model",
    effort: "Effort",
    prompt: "Prompt",
    status: "Status",
  },
  filterAll: "Select all",
  filterNone: "Clear",
  filterResetAll: "Reset all filters",
  exportButton: "Export",
  exportMenuTitle: "Export current timeline view",
  exportFullPng: "Export Landscape PNG",
  exportFullSvg: "Export Landscape SVG",
  exportPortraitPng: "Export Portrait PNG (Mobile / Social)",
  exportPortraitSvg: "Export Portrait SVG",
  exporting: "Exporting…",
  autoRunLabel: "Auto-Run",
  autoRunOn: "ON",
  autoRunOff: "OFF",
  autoRunQueued: "Queued",
  runOnceButton: "Run Once",
  runOnceRunning: "Running…",
  runOnceTitle: "Launch a Manual Benchmark Round",
  runOnceModelsTab: "Select Targets (CLI × Model × Effort)",
  runOncePromptsTab: "Select Benchmark Prompts",
  runOnceStart: "Start Run",
  runOnceStarting: "Starting…",
  stopRunButton: "Stop Run",
  stopRunStopping: "Stopping…",
  stopRunConfirmTitle: "Stop the currently running benchmark round",
  configLinkTitle: "Open Configuration Console",
  pairLinkTitle: "Device Pairing & Owner Auth",
  githubRepoTitle: "View source repository on GitHub",
  emptyDayTitle: "No benchmark runs on this date",
  emptyDayHint: "Pick another date above or click “Run Once” to start a round",
  emptyFilteredTitle: "No results match the active filters",
  emptyFilteredReset: "Reset filters",
  passRateLabel: "Pass rate",
  cliStatusRecheck: "Re-check",
  cliStatusDismiss: "Dismiss",
};
