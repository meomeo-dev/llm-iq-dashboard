/**
 * 模型对比弹窗、作品大图详情页（/view）、评审抽屉与导出长图双语字典。
 */

export interface ViewerMessages {
  modal: {
    effortComparison: string;
    standardToggleShow: string;
    standardToggleHide: string;
    coreKeyLabel: string;
    groundTruthLabel: string;
    evaluationCriteriaLabel: string;
    referenceSourceLabel: string;
    openFullView: string;
    exportResultPng: string;
    exportResultSvg: string;
    exportResultGif: string;
    profileComparison: string;
    officialLogin: string;
    effortFoldedTitle: string;
    effortNotHonoredTitle: string;
  };
  artViewer: {
    backToTimeline: string;
    promptSectionTitle: string;
    harnessGuardLabel: string;
    rawSvgDownload: string;
    openRawSvg: string;
    durationLabel: string;
    svgBytesLabel: string;
    tokensLabel: string;
    costLabel: string;
    judgeScoreLabel: string;
    judgeDrawerToggle: string;
    siblingsTitle: string;
  };
  judgeDrawer: {
    title: string;
    totalScore: string;
    passThreshold: string;
    gatesTitle: string;
    gatePassed: string;
    gateFailed: string;
    criteriaTitle: string;
    sourceStatic: string;
    sourceRender: string;
    sourceAi: string;
    contactSheetTitle: string;
    detailSheetsTitle: string;
    locatedByAi: string;
    locatedByCode: string;
    blindSummaryTitle: string;
    judgesMetaTitle: string;
  };
  exportImage: {
    headerTitle: string;
    headerSubtitle: string;
    portraitSubtitle: string;
    generatedAt: string;
    timeZoneLabel: string;
    filterSummaryAll: string;
    passRatePrefix: string;
    footerAttribution: string;
    resultSetHeader: string;
    verdictOnline: string;
    verdictDegraded: string;
    verdictPending: string;
  };
}

export const zhCNViewer: ViewerMessages = {
  modal: {
    effortComparison: "各思考强度对比",
    standardToggleShow: "查看黄金参考标准",
    standardToggleHide: "收起黄金参考标准",
    coreKeyLabel: "核心考点",
    groundTruthLabel: "客观黄金参考标准（Ground Truth）",
    evaluationCriteriaLabel: "判断与鉴别标准（Evaluation Criteria）",
    referenceSourceLabel: "权威参考来源",
    openFullView: "打开独立大图与评审详情",
    exportResultPng: "导出对比图 PNG",
    exportResultSvg: "导出对比图 SVG",
    exportResultGif: "导出动态对比图 GIF",
    profileComparison: "不同上游渠道（Profile）对比",
    officialLogin: "官方登录态",
    effortFoldedTitle: "请求档位 {requested} 已折叠为模型最高支持档位 {applied}",
    effortNotHonoredTitle: "该模型不支持调节思考强度，仅按固定默认强度执行",
  },
  artViewer: {
    backToTimeline: "返回看板时间线",
    promptSectionTitle: "完整提示词原文",
    harnessGuardLabel: "直出约束（Harness Guard）",
    rawSvgDownload: "下载 SVG",
    openRawSvg: "沙箱原图",
    durationLabel: "耗时",
    svgBytesLabel: "SVG 大小",
    tokensLabel: "Token 用量",
    costLabel: "API 等价成本",
    judgeScoreLabel: "作品评审得分",
    judgeDrawerToggle: "评审详情与联系图",
    siblingsTitle: "同轮同题各思考强度",
  },
  judgeDrawer: {
    title: "作品客观与语义评审报告",
    totalScore: "总分",
    passThreshold: "及格线 {score} 分",
    gatesTitle: "硬性门槛（一票否决）",
    gatePassed: "通过",
    gateFailed: "未过",
    criteriaTitle: "逐项评分明细（代码层 30 分 + AI 语义层 70 分）",
    sourceStatic: "静态解析",
    sourceRender: "渲染定格",
    sourceAi: "AI 裁判",
    contactSheetTitle: "8 帧定格序列联系表",
    detailSheetsTitle: "关键部位放大联系表",
    locatedByAi: "AI 视觉定位框",
    locatedByCode: "几何推断框",
    blindSummaryTitle: "裁判首轮盲描述（不知题面）",
    judgesMetaTitle: "裁判执行记录",
  },
  exportImage: {
    headerTitle: "鹈鹕自行车基准 · 24 小时时间线",
    headerSubtitle: "定时驱动 agy / codex / claude 执行 SVG 基准测试",
    portraitSubtitle: "24 小时模型表现纵览",
    generatedAt: "生成时刻",
    timeZoneLabel: "时区",
    filterSummaryAll: "全部结果",
    passRatePrefix: "通过率",
    footerAttribution: "LLM IQ Dashboard · meomeo-dev/llm-iq-dashboard",
    resultSetHeader: "思考强度对比视图",
    verdictOnline: "通过",
    verdictDegraded: "未过",
    verdictPending: "待复核",
  },
};

export const enViewer: ViewerMessages = {
  modal: {
    effortComparison: "Reasoning Effort Comparison",
    standardToggleShow: "Show Ground Truth & Criteria",
    standardToggleHide: "Hide Ground Truth & Criteria",
    coreKeyLabel: "Core Dimension",
    groundTruthLabel: "Physical & Geometric Ground Truth",
    evaluationCriteriaLabel: "Visual Evaluation Criteria",
    referenceSourceLabel: "Reference Source",
    openFullView: "Open Full Artwork & Judge Report",
    exportResultPng: "Export Comparison PNG",
    exportResultSvg: "Export Comparison SVG",
    exportResultGif: "Export Animated GIF",
    profileComparison: "Upstream Profile Comparison",
    officialLogin: "Official Login",
    effortFoldedTitle: "Requested effort {requested} folded to highest supported {applied}",
    effortNotHonoredTitle: "Reasoning effort adjustment is not supported by this model",
  },
  artViewer: {
    backToTimeline: "Back to Timeline",
    promptSectionTitle: "Exact Prompt Sent",
    harnessGuardLabel: "Harness Guard Appended",
    rawSvgDownload: "Download SVG",
    openRawSvg: "Raw Sandboxed SVG",
    durationLabel: "Duration",
    svgBytesLabel: "SVG Size",
    tokensLabel: "Token Usage",
    costLabel: "API-Eq Cost",
    judgeScoreLabel: "Judge Score",
    judgeDrawerToggle: "Judge Report & Contact Sheets",
    siblingsTitle: "Sibling Efforts in This Round",
  },
  judgeDrawer: {
    title: "Automated & AI Artwork Evaluation Report",
    totalScore: "Total Score",
    passThreshold: "Pass threshold: {score}/100",
    gatesTitle: "Hard Gates (Pass/Fail Veto)",
    gatePassed: "PASS",
    gateFailed: "FAIL",
    criteriaTitle: "Criterion Breakdown (30pt Code + 70pt AI Judge)",
    sourceStatic: "Static AST",
    sourceRender: "Browser Render",
    sourceAi: "AI Judge",
    contactSheetTitle: "8-Frame Sequence Contact Sheet",
    detailSheetsTitle: "Part Crop Contact Sheets",
    locatedByAi: "AI Located Crop",
    locatedByCode: "Geometric Crop",
    blindSummaryTitle: "Blind First-Pass Description (Prompt-Agnostic)",
    judgesMetaTitle: "Judge Execution Metadata",
  },
  exportImage: {
    headerTitle: "Pelican Bicycle Benchmark · 24h Timeline",
    headerSubtitle: "Scheduled SVG benchmark across agy / codex / claude",
    portraitSubtitle: "24-Hour Model Performance Overview",
    generatedAt: "Generated",
    timeZoneLabel: "Time Zone",
    filterSummaryAll: "All results",
    passRatePrefix: "Pass",
    footerAttribution: "LLM IQ Dashboard · meomeo-dev/llm-iq-dashboard",
    resultSetHeader: "Reasoning Effort Comparison",
    verdictOnline: "PASS",
    verdictDegraded: "FAIL",
    verdictPending: "PENDING",
  },
};
