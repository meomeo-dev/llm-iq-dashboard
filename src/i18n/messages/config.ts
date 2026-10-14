/**
 * 配置管理台（/config）双语字典。
 */

export interface ConfigMessages {
  headerTitle: string;
  headerSubtitle: string;
  backLink: string;
  unsavedChanges: string;
  savedSuccess: string;
  saveFailed: string;
  readOnlyBanner: string;
  nav: {
    capabilities: string;
    targets: string;
    profiles: string;
    schedule: string;
    prompts: string;
    timeouts: string;
    harnessGuard: string;
    judge: string;
    dataRepo: string;
    devices: string;
  };
  sections: {
    capabilitiesTitle: string;
    capabilitiesDesc: string;
    reprobeButton: string;
    reprobing: string;
    targetsTitle: string;
    targetsDesc: string;
    profilesTitle: string;
    profilesDesc: string;
    scheduleTitle: string;
    scheduleDesc: string;
    promptsTitle: string;
    promptsDesc: string;
    timeoutsTitle: string;
    timeoutsDesc: string;
    harnessGuardTitle: string;
    harnessGuardDesc: string;
    judgeTitle: string;
    judgeDesc: string;
    dataRepoTitle: string;
    dataRepoDesc: string;
    devicesTitle: string;
    devicesDesc: string;
  };
  labels: {
    enabled: string;
    disabled: string;
    cli: string;
    model: string;
    effort: string;
    profile: string;
    timeoutMs: string;
    cronExpression: string;
    intervalMinutes: string;
    timezone: string;
    runOnStart: string;
    concurrency: string;
    perRoundUsd: string;
    perDayUsd: string;
    retentionDays: string;
    judgeEnabled: string;
    judgeAiEnabled: string;
    judgeAiConcurrency: string;
    dataRepoPath: string;
    dataRepoUrl: string;
    dataRepoAutoSync: string;
    dataRepoPush: string;
    revokeDevice: string;
    revokeAllDevices: string;
    currentDevice: string;
  };
}

export const zhCNConfig: ConfigMessages = {
  headerTitle: "基准配置",
  headerSubtitle: "修改直接写回 pelican.config.yaml 并保留原有注释，下一轮触发即生效",
  backLink: "← 看板",
  unsavedChanges: "有未保存的改动",
  savedSuccess: "配置已保存并生效",
  saveFailed: "保存失败",
  readOnlyBanner: "当前为只读模式或未配对设备，仅可浏览配置，无法保存修改",
  nav: {
    capabilities: "CLI 能力目录",
    targets: "被测模型矩阵",
    profiles: "第三方上游 (Profiles)",
    schedule: "定时节奏与预算",
    prompts: "评测题库与轮换",
    timeouts: "超时与并发",
    harnessGuard: "考场直出约束",
    judge: "作品自动评审",
    dataRepo: "公开数据仓同步",
    devices: "已配对设备",
  },
  sections: {
    capabilitiesTitle: "CLI 能力目录与探测状态",
    capabilitiesDesc: "展示 claude / codex / agy 的安装、登录与可用模型；点击可快速加入被测矩阵",
    reprobeButton: "重新探测能力",
    reprobing: "探测中…",
    targetsTitle: "被测目标矩阵（Targets）",
    targetsDesc: "勾选进入定时任务的条目，亦作为手动「跑一次」的默认勾选集合",
    profilesTitle: "第三方上游与 API 渠道（Profiles）",
    profilesDesc: "为 CLI 配置自定义 API 端点、倍率与密钥，密钥仅保存在 runner 专用凭据卷中",
    scheduleTitle: "定时调度、成本预算与保留期",
    scheduleDesc: "设置自动任务触发周期、单轮/每日 API 等价美元上限及历史轮次保留天数",
    promptsTitle: "基准题库选择与候选轮换",
    promptsDesc: "勾选每轮执行的提示词条目，配置候选集与变量的轮换周期",
    timeoutsTitle: "并发道数与分层超时",
    timeoutsDesc: "按模型分道并发，道内从 low 到 max 串行；超时优先级：目标 > 强度 > CLI > 全局默认",
    harnessGuardTitle: "考场直出约束（Harness Guard）",
    harnessGuardDesc: "开启后在每条提示词末尾附加直出约束，抑制联网检索、代码自测与截图自检",
    judgeTitle: "作品评审（代码层 30 分 + AI 语义层 70 分）",
    judgeDesc: "静态 AST 与 Chromium 定格截帧打 30 分，通过门槛后交跨厂商 AI 裁判打 70 分",
    dataRepoTitle: "公开数据仓（Data Repository）脱敏与发布",
    dataRepoDesc: "每轮定稿后自动脱敏导出至数据仓工作副本，支持连接 GitHub App 一键推送",
    devicesTitle: "已配对的所有者设备",
    devicesDesc: "管理通过 pnpm pair 授权的浏览器会话，可随时单台或全部吊销",
  },
  labels: {
    enabled: "已启用",
    disabled: "已停用",
    cli: "CLI",
    model: "模型",
    effort: "思考强度",
    profile: "上游渠道",
    timeoutMs: "超时 (ms)",
    cronExpression: "Cron 表达式",
    intervalMinutes: "固定间隔（分钟）",
    timezone: "时区",
    runOnStart: "启动调度器时立即先跑一轮",
    concurrency: "并发模型道数",
    perRoundUsd: "单轮预算上限 (USD)",
    perDayUsd: "24 小时预算上限 (USD)",
    retentionDays: "历史保留天数",
    judgeEnabled: "启用代码层评审（静态 + 渲染）",
    judgeAiEnabled: "启用跨厂商 AI 语义裁判",
    judgeAiConcurrency: "单裁判并发件数",
    dataRepoPath: "本地数据仓路径",
    dataRepoUrl: "GitHub 数据仓地址",
    dataRepoAutoSync: "每轮结束后自动脱敏导出",
    dataRepoPush: "导出后自动推送到远端",
    revokeDevice: "吊销",
    revokeAllDevices: "全部吊销",
    currentDevice: "当前浏览器",
  },
};

export const enConfig: ConfigMessages = {
  headerTitle: "Benchmark Configuration",
  headerSubtitle: "Changes are written atomically to pelican.config.yaml preserving comments",
  backLink: "← Dashboard",
  unsavedChanges: "Unsaved changes",
  savedSuccess: "Configuration saved",
  saveFailed: "Failed to save configuration",
  readOnlyBanner: "Read-only mode or unpaired browser: viewing configuration only",
  nav: {
    capabilities: "CLI Capabilities",
    targets: "Target Matrix",
    profiles: "Upstream Profiles",
    schedule: "Schedule & Budget",
    prompts: "Prompts & Rotation",
    timeouts: "Timeouts & Lanes",
    harnessGuard: "Harness Guard",
    judge: "Artwork Judging",
    dataRepo: "Data Repository",
    devices: "Paired Devices",
  },
  sections: {
    capabilitiesTitle: "CLI Capabilities & Readiness",
    capabilitiesDesc: "Probed models and login status for claude / codex / agy; click to add to matrix",
    reprobeButton: "Re-probe CLIs",
    reprobing: "Probing…",
    targetsTitle: "Target Matrix (CLI × Model × Effort)",
    targetsDesc: "Checked targets run on schedule and serve as defaults for manual Run Once rounds",
    profilesTitle: "Upstream Profiles & API Endpoints",
    profilesDesc: "Configure custom endpoints, cost multipliers, and isolated runner API keys",
    scheduleTitle: "Schedule, Cost Budget & Retention",
    scheduleDesc: "Configure cron/interval triggers, per-round/daily USD caps, and retention days",
    promptsTitle: "Benchmark Prompts & Candidate Rotation",
    promptsDesc: "Select active prompts and configure rotation intervals for candidate sets",
    timeoutsTitle: "Concurrency Lanes & Tiered Timeouts",
    timeoutsDesc: "Parallel across models, serial low→max within each model; Target > Effort > CLI > Default",
    harnessGuardTitle: "Direct-Output Harness Guard",
    harnessGuardDesc: "Append direct-output rules to suppress web search, code execution, and self-screenshots",
    judgeTitle: "Artwork Judging (30pt Code + 70pt AI Judge)",
    judgeDesc: "Static AST + Chromium frame capture (30pt) followed by cross-vendor AI judging (70pt)",
    dataRepoTitle: "Public Data Repository Sync & Publishing",
    dataRepoDesc: "Sanitize and export completed rounds to the public data repo with optional GitHub App push",
    devicesTitle: "Paired Owner Devices",
    devicesDesc: "Manage browser sessions authorized via pnpm pair; revoke individual or all devices",
  },
  labels: {
    enabled: "Enabled",
    disabled: "Disabled",
    cli: "CLI",
    model: "Model",
    effort: "Effort",
    profile: "Profile",
    timeoutMs: "Timeout (ms)",
    cronExpression: "Cron Expression",
    intervalMinutes: "Interval (minutes)",
    timezone: "Time Zone",
    runOnStart: "Run immediately when scheduler starts",
    concurrency: "Concurrent Model Lanes",
    perRoundUsd: "Per-Round Cap (USD)",
    perDayUsd: "Rolling 24h Cap (USD)",
    retentionDays: "Retention Days",
    judgeEnabled: "Enable Code Layer Judging (Static + Render)",
    judgeAiEnabled: "Enable Cross-Vendor AI Semantic Judge",
    judgeAiConcurrency: "AI Judge Concurrency",
    dataRepoPath: "Local Data Repo Path",
    dataRepoUrl: "GitHub Data Repo URL",
    dataRepoAutoSync: "Auto-export after each round",
    dataRepoPush: "Auto-push to remote after export",
    revokeDevice: "Revoke",
    revokeAllDevices: "Revoke All",
    currentDevice: "Current Browser",
  },
};
