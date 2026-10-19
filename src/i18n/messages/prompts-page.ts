/**
 * 「测评题目」（/prompts）题库瀑布流页、筛选工具栏、快捷复制与详情模态窗双语字典。
 */

export interface PromptsPageMessages {
  pageTitle: string;
  pageSubtitle: string;
  statsSummary: string;
  searchPlaceholder: string;
  searchClearTitle: string;
  filterGroupLabel: string;
  filterGroupAll: string;
  filterFeatureLabel: string;
  filterFeatureAll: string;
  filterFeatureSuite: string;
  filterFeatureAnimated: string;
  filterFeatureStandard: string;
  filterFeatureRubric: string;
  filterFeatureScheduled: string;
  filterScopeLabel: string;
  filterScopeActive: string;
  filterScopeAll: string;
  filterScopeArchived: string;
  filterResetButton: string;
  resultCountSummary: string;
  emptyFilterTitle: string;
  emptyFilterHint: string;
  cardCopyPromptButton: string;
  cardCopiedBadge: string;
  cardCopyPromptTitle: string;
  cardViewDetailHint: string;
  cardCandidateCountBadge: string;
  cardMoreCandidatesBadge: string;
  cardVariablesBadge: string;
  cardAnimatedBadge: string;
  cardStaticSvgBadge: string;
  cardRubricBadge: string;
  cardStandardBadge: string;
  cardScheduledBadge: string;
  cardCustomBadge: string;
  cardArchivedBadge: string;
  cardLockedBadge: string;
  cardCoreKeyPrefix: string;
  lifecycleActiveBadge: string;
  lifecycleAgingBadge: string;
  lifecycleLegacyBadge: string;
  modalTitlePrefix: string;
  modalCopyCurrentButton: string;
  modalCopiedBadge: string;
  modalCandidateSectionTitle: string;
  modalCandidatePickerHint: string;
  modalPromptTextSectionTitle: string;
  modalPromptTemplateLabel: string;
  modalVariablesSectionTitle: string;
  modalVariableValuesLabel: string;
  modalStandardSectionTitle: string;
  modalNoStandardHint: string;
  modalRubricSectionTitle: string;
  modalRubricSummary: string;
  modalRubricGatesTitle: string;
  modalRubricCriteriaTitle: string;
  modalRubricLayerCode: string;
  modalRubricLayerAi: string;
  modalRubricMaxPoints: string;
  modalNoRubricHint: string;
  modalLifecycleSectionTitle: string;
  modalOriginDateLabel: string;
  modalRegisteredAtLabel: string;
  modalLifecycleStatusLabel: string;
  modalSourceLabel: string;
  modalVerifiedBadge: string;
}

export const zhCNPromptsPage: PromptsPageMessages = {
  pageTitle: "测评题目库",
  pageSubtitle: "浏览、检索与复制基准测试提示词、场景变体、黄金标准及自动/AI 评分细则",
  statsSummary: "共 {total} 道题目 · {candidates} 个测试场景 · {rubrics} 道支持自动/AI 评分",
  searchPlaceholder: "搜索题目 ID、名称、提示词原文、考察核心或候选场景…",
  searchClearTitle: "清空搜索关键词",
  filterGroupLabel: "题材分组",
  filterGroupAll: "全部分组",
  filterFeatureLabel: "特性筛选",
  filterFeatureAll: "全部",
  filterFeatureSuite: "多场景题组",
  filterFeatureAnimated: "动态 SVG",
  filterFeatureStandard: "含黄金标准",
  filterFeatureRubric: "含评分量表",
  filterFeatureScheduled: "定时轮次启用",
  filterScopeLabel: "题库范围",
  filterScopeActive: "在役题目",
  filterScopeAll: "含已归档",
  filterScopeArchived: "仅已归档",
  filterResetButton: "重置筛选",
  resultCountSummary: "显示 {shown} / {total} 道题目（涵盖 {shownCandidates} 个具体测试场景）",
  emptyFilterTitle: "没有匹配的测评题目",
  emptyFilterHint: "请尝试调整搜索关键词、切换题材分组或重置筛选条件",
  cardCopyPromptButton: "复制提示词",
  cardCopiedBadge: "已复制",
  cardCopyPromptTitle: "一键复制完整发给模型的原始提示词文本",
  cardViewDetailHint: "点击查看完整提示词、候选变体与评分细则",
  cardCandidateCountBadge: "{count} 个场景",
  cardMoreCandidatesBadge: "+{count} 更多",
  cardVariablesBadge: "{count} 个变量",
  cardAnimatedBadge: "SMIL 动画",
  cardStaticSvgBadge: "静态 SVG",
  cardRubricBadge: "100 分量表",
  cardStandardBadge: "黄金标准",
  cardScheduledBadge: "定时在跑",
  cardCustomBadge: "自定义",
  cardArchivedBadge: "已归档",
  cardLockedBadge: "逐字锁定",
  cardCoreKeyPrefix: "考察核心：",
  lifecycleActiveBadge: "在役",
  lifecycleAgingBadge: "老化观察",
  lifecycleLegacyBadge: "经典锚点",
  modalTitlePrefix: "题目详情",
  modalCopyCurrentButton: "复制当前提示词",
  modalCopiedBadge: "已复制到剪贴板",
  modalCandidateSectionTitle: "测试场景列表（共 {count} 个变体）",
  modalCandidatePickerHint: "点击下方场景标签可切换预览并复制对应场景的完整提示词原文",
  modalPromptTextSectionTitle: "发送给模型的完整提示词原文",
  modalPromptTemplateLabel: "母版模板（含插槽占位符）",
  modalVariablesSectionTitle: "模板变量插槽定义",
  modalVariableValuesLabel: "可选取值：",
  modalStandardSectionTitle: "客观黄金标准与验收判据",
  modalNoStandardHint: "该题目为开放式视觉基线题，未配置固定物理/教科书黄金标准。",
  modalRubricSectionTitle: "作品评审量表（{id} · v{version}）",
  modalRubricSummary: "代码测量 {codePoints} 分 + AI 视觉复核 {aiPoints} 分（共 {gates} 项硬门槛、{criteria} 项计分维度）",
  modalRubricGatesTitle: "硬性准入门槛（G1–G5）",
  modalRubricCriteriaTitle: "分项计分维度（C1–C9）",
  modalRubricLayerCode: "代码层",
  modalRubricLayerAi: "AI 裁判层",
  modalRubricMaxPoints: "{points} 分",
  modalNoRubricHint: "该题目暂未配置自动化结构/动画评分量表。",
  modalLifecycleSectionTitle: "生命周期与溯源元数据",
  modalOriginDateLabel: "首次公开：{date}",
  modalRegisteredAtLabel: "收录日期：{date}",
  modalLifecycleStatusLabel: "生命周期：{status}",
  modalSourceLabel: "题目出处：",
  modalVerifiedBadge: "出处已核对",
};

export const enPromptsPage: PromptsPageMessages = {
  pageTitle: "Benchmark Prompts",
  pageSubtitle: "Browse, filter, and copy benchmark prompts, scene variants, golden standards, and judge rubrics",
  statsSummary: "{total} prompts · {candidates} test scenes · {rubrics} with automated/AI rubrics",
  searchPlaceholder: "Search prompt ID, title, verbatim prompt text, core key, or candidate scenes…",
  searchClearTitle: "Clear search query",
  filterGroupLabel: "Category",
  filterGroupAll: "All Categories",
  filterFeatureLabel: "Features",
  filterFeatureAll: "All",
  filterFeatureSuite: "Multi-Scene Suite",
  filterFeatureAnimated: "Animated SVG",
  filterFeatureStandard: "Golden Standard",
  filterFeatureRubric: "Judge Rubric",
  filterFeatureScheduled: "Scheduled",
  filterScopeLabel: "Lifecycle",
  filterScopeActive: "Active Only",
  filterScopeAll: "Include Archived",
  filterScopeArchived: "Archived Only",
  filterResetButton: "Reset Filters",
  resultCountSummary: "Showing {shown} / {total} prompts ({shownCandidates} test scenes)",
  emptyFilterTitle: "No prompts match the current filters",
  emptyFilterHint: "Try adjusting your search query, category filter, or feature chips",
  cardCopyPromptButton: "Copy Prompt",
  cardCopiedBadge: "Copied",
  cardCopyPromptTitle: "Copy verbatim prompt text sent to the model",
  cardViewDetailHint: "Click to inspect full prompt, scene variants, and scoring rubric",
  cardCandidateCountBadge: "{count} scenes",
  cardMoreCandidatesBadge: "+{count} more",
  cardVariablesBadge: "{count} vars",
  cardAnimatedBadge: "SMIL Animated",
  cardStaticSvgBadge: "Static SVG",
  cardRubricBadge: "100-pt Rubric",
  cardStandardBadge: "Golden Standard",
  cardScheduledBadge: "Scheduled",
  cardCustomBadge: "Custom",
  cardArchivedBadge: "Archived",
  cardLockedBadge: "Locked Verbatim",
  cardCoreKeyPrefix: "Core Focus: ",
  lifecycleActiveBadge: "Active",
  lifecycleAgingBadge: "Aging",
  lifecycleLegacyBadge: "Legacy Anchor",
  modalTitlePrefix: "Prompt Details",
  modalCopyCurrentButton: "Copy Current Prompt",
  modalCopiedBadge: "Copied to Clipboard",
  modalCandidateSectionTitle: "Test Scene Variants ({count} scenes)",
  modalCandidatePickerHint: "Select a scene chip below to preview and copy its verbatim prompt text",
  modalPromptTextSectionTitle: "Verbatim Prompt Sent to Model",
  modalPromptTemplateLabel: "Master Template (with placeholders)",
  modalVariablesSectionTitle: "Template Variable Slots",
  modalVariableValuesLabel: "Allowed values: ",
  modalStandardSectionTitle: "Objective Golden Standard & Criteria",
  modalNoStandardHint: "This prompt is an open visual baseline without a fixed textbook golden standard.",
  modalRubricSectionTitle: "Judge Rubric ({id} · v{version})",
  modalRubricSummary: "Code Layer {codePoints} pts + AI Vision Layer {aiPoints} pts ({gates} gates, {criteria} criteria)",
  modalRubricGatesTitle: "Hard Eligibility Gates (G1–G5)",
  modalRubricCriteriaTitle: "Scored Criteria (C1–C9)",
  modalRubricLayerCode: "Code Layer",
  modalRubricLayerAi: "AI Judge Layer",
  modalRubricMaxPoints: "{points} pts",
  modalNoRubricHint: "No automated/AI judge rubric is configured for this prompt.",
  modalLifecycleSectionTitle: "Lifecycle & Provenance Metadata",
  modalOriginDateLabel: "First Appeared: {date}",
  modalRegisteredAtLabel: "Registered: {date}",
  modalLifecycleStatusLabel: "Lifecycle: {status}",
  modalSourceLabel: "Provenance: ",
  modalVerifiedBadge: "Verified Source",
};
