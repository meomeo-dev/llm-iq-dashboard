/**
 * 通用与全局元数据双语字典。
 */

export interface CommonMessages {
  siteTitle: string;
  siteDescription: string;
  configPageTitle: string;
  pairPageTitle: string;
  languageSwitchLabel: string;
  languageSwitchTitle: string;
  status: {
    ok: string;
    noSvg: string;
    error: string;
    timeout: string;
    running: string;
    queued: string;
    cancelled: string;
  };
  verdict: {
    online: string;
    degraded: string;
    pending: string;
    unjudged: string;
  };
  trigger: {
    schedule: string;
    manual: string;
  };
  actions: {
    save: string;
    saving: string;
    cancel: string;
    close: string;
    confirm: string;
    refresh: string;
    reset: string;
    delete: string;
    edit: string;
    add: string;
    copy: string;
    copied: string;
    backToDashboard: string;
    selectAll: string;
    clearAll: string;
    retry: string;
  };
  units: {
    secondsShort: string;
    minutesShort: string;
    msShort: string;
    calls: string;
    models: string;
    prompts: string;
    targets: string;
    runs: string;
  };
}

export const zhCNCommon: CommonMessages = {
  siteTitle: "鹈鹕自行车基准 · LLM IQ Dashboard",
  siteDescription:
    "定时调用 agy / codex / claude 执行鹈鹕自行车 SVG 基准，并以 24 小时时间线呈现历史结果",
  configPageTitle: "配置 · 鹈鹕自行车基准",
  pairPageTitle: "设备配对 · 鹈鹕自行车基准",
  languageSwitchLabel: "EN",
  languageSwitchTitle: "Switch language to English",
  status: {
    ok: "成功出图",
    noSvg: "未输出 SVG",
    error: "调用错误",
    timeout: "超时",
    running: "运行中",
    queued: "排队中",
    cancelled: "已停止",
  },
  verdict: {
    online: "通过",
    degraded: "未过",
    pending: "待复核",
    unjudged: "未评审",
  },
  trigger: {
    schedule: "定时",
    manual: "手动",
  },
  actions: {
    save: "保存",
    saving: "保存中…",
    cancel: "取消",
    close: "关闭",
    confirm: "确认",
    refresh: "刷新",
    reset: "重置",
    delete: "删除",
    edit: "编辑",
    add: "添加",
    copy: "复制",
    copied: "已复制",
    backToDashboard: "返回看板",
    selectAll: "全选",
    clearAll: "清空",
    retry: "重试",
  },
  units: {
    secondsShort: "秒",
    minutesShort: "分",
    msShort: "毫秒",
    calls: "次调用",
    models: "个模型",
    prompts: "道题",
    targets: "个目标",
    runs: "轮",
  },
};

export const enCommon: CommonMessages = {
  siteTitle: "Pelican Bicycle Benchmark · LLM IQ Dashboard",
  siteDescription:
    "Scheduled SVG benchmark runner for agy / codex / claude with a 24-hour visual timeline dashboard",
  configPageTitle: "Configuration · Pelican Bicycle Benchmark",
  pairPageTitle: "Device Pairing · Pelican Bicycle Benchmark",
  languageSwitchLabel: "中文",
  languageSwitchTitle: "切换为简体中文",
  status: {
    ok: "OK",
    noSvg: "No SVG",
    error: "Error",
    timeout: "Timeout",
    running: "Running",
    queued: "Queued",
    cancelled: "Stopped",
  },
  verdict: {
    online: "Pass",
    degraded: "Fail",
    pending: "Pending AI",
    unjudged: "Unjudged",
  },
  trigger: {
    schedule: "Scheduled",
    manual: "Manual",
  },
  actions: {
    save: "Save",
    saving: "Saving…",
    cancel: "Cancel",
    close: "Close",
    confirm: "Confirm",
    refresh: "Refresh",
    reset: "Reset",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    copy: "Copy",
    copied: "Copied",
    backToDashboard: "Back to Dashboard",
    selectAll: "Select all",
    clearAll: "Clear",
    retry: "Retry",
  },
  units: {
    secondsShort: "s",
    minutesShort: "m",
    msShort: "ms",
    calls: "calls",
    models: "models",
    prompts: "prompts",
    targets: "targets",
    runs: "runs",
  },
};
