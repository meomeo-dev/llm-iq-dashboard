/**
 * 模型统计指纹核验（/fingerprint 与配置页）双语字典。
 */

export interface FingerprintMessages {
  pageTitle: string;
  pageSubtitle: string;
  backLink: string;
  configLink: string;
  tabs: { matrix: string; check: string; history: string };
  probes: {
    uuid: { label: string; desc: string };
    number: { label: string; desc: string };
    seed: { label: string; desc: string };
    palette: { label: string; desc: string };
    "words-en": { label: string; desc: string };
    "words-zh": { label: string; desc: string };
  };
  verdict: { consistent: string; inconsistent: string; inconclusive: string; "not-comparable": string };
  inconclusiveReasons: {
    "below-self-lower-bound": string;
    "within-threshold-margin": string;
    "single-reference-only": string;
    "candidates-indistinguishable": string;
  };
  rejectionReasons: {
    tool_write_instead_of_inline: string;
    empty_output: string;
    invalid_format: string;
    duplicate_segments: string;
    low_char_diversity: string;
    no_candidate: string;
  };
  outcomes: { ok: string; timeout: string; "content-filter": string; error: string; "leak-blocked": string };
  matrix: {
    title: string;
    subtitle: string;
    emptyReferences: string;
    modelHeader: string;
    cliEffortHeader: string;
    usableCount: string;
    probeTargetTag: string;
    cellSelfSimTag: string;
    fillAllBtn: string;
    fillSelectedBtn: string;
    fillProfileLabel: string;
    exportModelBtn: string;
    exportingBtn: string;
    importBundleBtn: string;
    importingBtn: string;
    importSuccessBanner: string;
    fillCellTitle: string;
    planPreviewTitle: string;
    confirmFillBtn: string;
    cancelJobBtn: string;
    jobRunningBanner: string;
  };
  drawer: {
    title: string;
    effectiveCount: string;
    targetCount: string;
    intraProbeSimText: string;
    fillProbeBtn: string;
    resetProbeBtn: string;
    resetConfirmText: string;
    excludeBtn: string;
    includeBtn: string;
    excludedBadge: string;
    codecLabel: string;
    valuesPerCallLabel: string;
    selfSimLabel: string;
    attemptActiveWindow: string;
    acceptedValuesLabel: string;
    noAttempts: string;
  };
  check: {
    title: string;
    subtitle: string;
    cliLabel: string;
    profileLabel: string;
    officialProfile: string;
    declaredModelLabel: string;
    probesLabel: string;
    previewPlanBtn: string;
    startCheckBtn: string;
    planExecutableProbes: string;
    planEstimatedCalls: string;
    planEstimatedUsd: string;
    planExpectedConsistency: string;
    skippedProbesNotice: string;
    noChecksYet: string;
    rescoreBtn: string;
    rescoring: string;
    rescoreLatestBadge: string;
    originalVerdictLabel: string;
    closestCandidateLabel: string;
    declaredMeanLabel: string;
    thresholdLabel: string;
    coverageLabel: string;
    usableProbesLabel: string;
    probeBreakdownTitle: string;
    candidatesComparisonTitle: string;
    colProbe: string;
    rowMeanSim: string;
    colCandidateModel: string;
    colSharedProbes: string;
    colCandidateSim: string;
    colDelta: string;
    colThreshold: string;
    colCandidateLowerBound: string;
    colDistinguishable: string;
    singleRefPassedBadge: string;
    selfBoundPassedTag: string;
    selfBoundFailedTag: string;
    singleRefGuideTitle: string;
    singleRefGuideBody: string;
    swimlaneTitle: string;
    swimlaneLaneHeader: string;
    swimlaneChannelCount: string;
    swimlaneConsistentRate: string;
    swimlaneLatestSelfSim: string;
    probeSlotLegendTitle: string;
    verdictShortConsistent: string;
    verdictShortInconsistent: string;
    verdictShortInconclusive: string;
    verdictShortSingleRef: string;
    channelsGroupTitle: string;
    baselineReadyTag: string;
    baselineUnreadyTag: string;
    goToMatrixFillBtn: string;
    multiProfileSwitchTitle: string;
  };
  configSection: {
    enabledLabel: string;
    effortLabel: string;
    samplesPerProbeLabel: string;
    samplesByProbeTitle: string;
    resetDefaultSamplesBtn: string;
    valuesPerCheckLabel: string;
    checkAttemptsLabel: string;
    targetAccuracyLabel: string;
    maxCallsFactorLabel: string;
    concurrencyLabel: string;
    probesLabel: string;
    referencesTitle: string;
    sharedMatrixHint: string;
    manageMatrixLink: string;
    manageProfilesLink: string;
    openFingerprintConsole: string;
  };
}

export const zhCNFingerprint: FingerprintMessages = {
  pageTitle: "模型指纹",
  pageSubtitle: "对比官方登录态基准样本与第三方 Profile 的输出分布（JSD 相似度）",
  backLink: "← 返回看板",
  configLink: "指纹配置",
  tabs: {
    matrix: "基准样本矩阵",
    check: "发起渠道核验",
    history: "历史核验报告",
  },
  probes: {
    uuid: { label: "UUID v4 字符串", desc: "采集 36 位 UUID v4 字符串，统计十六进制字符与相邻双字符分布" },
    number: { label: "12–18 位整数", desc: "采集 12 至 18 位无前导零十进制正整数（至少 5 种不同数字），统计数字与相邻双数字分布" },
    seed: { label: "16 位十六进制串", desc: "采集 seed_ 前缀加 16 位小写十六进制字符（至少 5 种不同字符），统计字符与相邻双字符分布" },
    palette: { label: "5 色 HEX 颜色值", desc: "采集 5 组 #rrggbb 十六进制颜色值，统计字符、色内双字符与 RGB 颜色区间分布" },
    "words-en": { label: "8 个英文单词", desc: "采集 8 个互不相同的英文小写单词，统计字母、词内双字母与单词分布" },
    "words-zh": { label: "8 个中文双字词", desc: "采集 8 个互不相同的非叠字中文双字词，统计单字、首尾字位置与双字词分布" },
  },
  verdict: {
    consistent: "与声明模型一致",
    inconsistent: "与声明模型不一致",
    inconclusive: "证据不足（待定）",
    "not-comparable": "基准不足（不可比）",
  },
  inconclusiveReasons: {
    "below-self-lower-bound": "查询批次与声明模型基准的相似度低于自身下界 q_0.05",
    "within-threshold-margin": "声明模型与候选模型的相似度分差未达到区分阈值",
    "single-reference-only": "已通过自身分布下界检验（≥ q_0.05），但当前仅采集单个基准模型，需至少 2 个基准模型才可完成成对比对",
    "candidates-indistinguishable": "留出交叉验证显示声明模型与部分候选模型在当前样本下尚无法可靠区分",
  },
  rejectionReasons: {
    tool_write_instead_of_inline: "违规调用写文件工具而非直接输出文本",
    empty_output: "模型返回空文本",
    invalid_format: "未通过格式校验",
    duplicate_segments: "包含重复词或重复颜色值",
    low_char_diversity: "字符多样性过低（重复字符过多）",
    no_candidate: "未提取到符合格式的样本值",
  },
  outcomes: {
    ok: "调用成功",
    timeout: "超时",
    "content-filter": "内容过滤",
    error: "调用错误",
    "leak-blocked": "凭据拦截",
  },
  matrix: {
    title: "基准模型 × 探针样本矩阵",
    subtitle: "单元格显示「已采有效样本数 / 目标样本数」及样本池对半一致性；点击单元格可查看样本明细、剔除异常条或单独补齐",
    emptyReferences: "尚未配置被测模型，请先在配置页「被测矩阵 (#matrix)」中添加模型",
    modelHeader: "基准模型",
    cliEffortHeader: "CLI · 强度",
    usableCount: "{usable}/{total} 探针已满",
    probeTargetTag: "目标 {target}",
    cellSelfSimTag: "一致 {sim}",
    fillAllBtn: "一键补齐全部缺口",
    fillSelectedBtn: "补齐此模型",
    fillProfileLabel: "{cli} 采样渠道",
    exportModelBtn: "导出",
    exportingBtn: "导出中…",
    importBundleBtn: "导入基准包",
    importingBtn: "导入中…",
    importSuccessBanner: "已导入 {cli} · {effort} · {model}（{probes} 个探针，共 {values} 条有效样本）",
    fillCellTitle: "查看样本明细或补齐此探针",
    planPreviewTitle: "采样计划预览",
    confirmFillBtn: "确认发起采样",
    cancelJobBtn: "停止当前指纹作业",
    jobRunningBanner: "指纹作业正在执行：{kind}（已完成 {completed}/{total} 次调用）",
  },
  drawer: {
    title: "探针样本明细：{model} · {probe}",
    effectiveCount: "当前有效值：{effective} / {target}",
    targetCount: "差额：{missing}（预计需 {calls} 次调用）",
    intraProbeSimText: "样本对半一致性：{mean}（单次核验下界 q_0.05：{lower}）",
    fillProbeBtn: "补齐此探针样本",
    resetProbeBtn: "归档并清空重采",
    resetConfirmText: "确定将该模型在此探针下的样本移入 archive/ 归档并清空吗？",
    excludeBtn: "剔除",
    includeBtn: "恢复",
    excludedBadge: "已人工剔除",
    codecLabel: "解析规则",
    valuesPerCallLabel: "单次请求条数",
    selfSimLabel: "批次自相似度",
    attemptActiveWindow: "生效窗口内：{active}/{extracted}",
    acceptedValuesLabel: "提取合格样本值",
    noAttempts: "该探针下暂无采样记录",
  },
  check: {
    title: "渠道模型核验",
    subtitle: "对选定 CLI / Profile 采集小批量样本，与本地基准样本集计算 JSD 相似度",
    cliLabel: "被测 CLI",
    profileLabel: "被测渠道 (Profile)",
    officialProfile: "官方默认登录态",
    declaredModelLabel: "声明模型 ID",
    probesLabel: "参与核验的探针",
    previewPlanBtn: "预览调用开销",
    startCheckBtn: "立即发起核验",
    planExecutableProbes: "将核验探针：{probes}",
    planEstimatedCalls: "预计调用：{calls} 次",
    planEstimatedUsd: "预估费用：${usd}",
    planExpectedConsistency: "预期自检一致率：{rate}",
    skippedProbesNotice: "已跳过缺少基准样本的探针：{probes}",
    noChecksYet: "暂无历史核验记录",
    rescoreBtn: "用当前基准重算评分",
    rescoring: "重算中…",
    rescoreLatestBadge: "最新重算：{at}",
    originalVerdictLabel: "原始结论：{verdict}",
    closestCandidateLabel: "最接近候选模型",
    declaredMeanLabel: "声明模型自相似度",
    thresholdLabel: "自身下界 q_0.05",
    coverageLabel: "预期一致率",
    usableProbesLabel: "有效探针数",
    probeBreakdownTitle: "各探针候选模型相似度明细",
    candidatesComparisonTitle: "全部候选模型成对比较",
    colProbe: "探针",
    rowMeanSim: "综合相似度（均值）",
    colCandidateModel: "候选模型",
    colSharedProbes: "共有探针",
    colCandidateSim: "候选相似度",
    colDelta: "分差 (C - A)",
    colThreshold: "阈值 t_C,A",
    colCandidateLowerBound: "下界 q_0.05(A)",
    colDistinguishable: "可区分",
    singleRefPassedBadge: "已过自身下界（单基准）",
    selfBoundPassedTag: "✓ ≥ q_0.05（已通过）",
    selfBoundFailedTag: "✗ < q_0.05（低于下界）",
    singleRefGuideTitle: "自身分布下界检验已通过 — 补充第 2 个基准模型即可完成成对比对",
    singleRefGuideBody:
      "当前批次与声明模型基准的相似度 ({selfSim}) 已高于自身下界 q_0.05 ({lowerBound})。由于当前 CLI 下仅采集了 1 个基准模型，尚无第 2 个对照模型做成对比较，因此暂标为待定。在「基准样本矩阵」中为同一 CLI 补齐至少 1 个其他模型样本后，点击右上角「用当前基准重算评分」即可得出「一致 / 不一致」结论。",
    swimlaneTitle: "渠道核验泳道",
    swimlaneLaneHeader: "被测渠道 · 模型",
    swimlaneChannelCount: "{count} 条泳道",
    swimlaneConsistentRate: "通过 {passed}/{total}",
    swimlaneLatestSelfSim: "最新自相似 {sim}",
    probeSlotLegendTitle: "六宫格探针槽位：",
    verdictShortConsistent: "一致",
    verdictShortInconsistent: "不一致",
    verdictShortInconclusive: "待定",
    verdictShortSingleRef: "单基准达标",
    channelsGroupTitle: "被测渠道 (Profile)",
    baselineReadyTag: "基准 {usable}/{total}",
    baselineUnreadyTag: "基准 {usable}/{total} (待补采)",
    goToMatrixFillBtn: "去矩阵补采基准 →",
    multiProfileSwitchTitle: "本轮同批核验渠道 ({count})",
  },
  configSection: {
    enabledLabel: "启用模型指纹",
    effortLabel: "采样思考强度",
    samplesPerProbeLabel: "默认每探针样本数 (≥10)",
    samplesByProbeTitle: "各探针基准样本数",
    resetDefaultSamplesBtn: "恢复默认值 (40/40/50/60/60/80)",
    valuesPerCheckLabel: "单次核验每探针样本数",
    checkAttemptsLabel: "核验重试上限",
    targetAccuracyLabel: "自检通过率阈值 (0.5–1.0)",
    maxCallsFactorLabel: "单探针调用次数上限倍数",
    concurrencyLabel: "采样并发数",
    probesLabel: "启用探针",
    referencesTitle: "模型与渠道来源",
    sharedMatrixHint: "直接使用上方「被测矩阵」中的 {modelCount} 个模型与「上游 Profile」中的 {profileCount} 个渠道，无需单独配置。",
    manageMatrixLink: "被测矩阵 (#matrix) ↑",
    manageProfilesLink: "上游 Profile (#profiles) ↑",
    openFingerprintConsole: "打开模型指纹页 →",
  },
};

export const enFingerprint: FingerprintMessages = {
  pageTitle: "Model Fingerprint",
  pageSubtitle: "Compare third-party profile output distributions against official baseline samples (JSD similarity)",
  backLink: "← Dashboard",
  configLink: "Fingerprint Config",
  tabs: {
    matrix: "Reference Matrix",
    check: "Run Verification",
    history: "Verification History",
  },
  probes: {
    uuid: { label: "UUID v4 Strings", desc: "36-char UUID v4 strings; counts hex character and bigram distributions" },
    number: { label: "12–18 Digit Integers", desc: "12–18 digit positive integers (no leading zero, >=5 distinct digits); counts digit and bigram distributions" },
    seed: { label: "16-Char Hex Seeds", desc: "seed_ prefix + 16 lowercase hex chars (>=5 distinct chars); counts char and bigram distributions" },
    palette: { label: "5 HEX Color Codes", desc: "5 #rrggbb color codes; counts hex char, intra-color bigram, and RGB bin distributions" },
    "words-en": { label: "8 English Words", desc: "8 distinct lowercase English words; counts letter, intra-word bigram, and word distributions" },
    "words-zh": { label: "8 Two-Char Chinese Words", desc: "8 distinct non-reduplicated two-char Chinese words; counts char, head/tail position, and word distributions" },
  },
  verdict: {
    consistent: "Consistent with Declared Model",
    inconsistent: "Inconsistent with Declared Model",
    inconclusive: "Inconclusive",
    "not-comparable": "Not Comparable (Missing Reference)",
  },
  inconclusiveReasons: {
    "below-self-lower-bound": "Query similarity against declared model is below self lower bound q_0.05",
    "within-threshold-margin": "Similarity margin over candidate model is within threshold",
    "single-reference-only": "Passed self-distribution lower bound (>= q_0.05), but only a single reference model is collected; at least 2 reference models are required for pairwise comparison",
    "candidates-indistinguishable": "Holdout cross-validation indicates declared model and candidate are not yet reliably distinguishable",
  },
  rejectionReasons: {
    tool_write_instead_of_inline: "Model invoked file-write tool instead of inline text response",
    empty_output: "Model returned empty output",
    invalid_format: "Failed format validation",
    duplicate_segments: "Contains duplicate words or color codes",
    low_char_diversity: "Character diversity too low (excessive repetition)",
    no_candidate: "No valid sample extracted",
  },
  outcomes: {
    ok: "OK",
    timeout: "Timeout",
    "content-filter": "Content Filter",
    error: "Error",
    "leak-blocked": "Secret Blocked",
  },
  matrix: {
    title: "Reference Model × Probe Sample Matrix",
    subtitle: "Cells show collected / target samples and split-half consistency; click any cell to inspect, exclude outliers, or fill",
    emptyReferences: "No models configured yet. Add models in Configuration → Test Matrix (#matrix) first.",
    modelHeader: "Reference Model",
    cliEffortHeader: "CLI · Effort",
    usableCount: "{usable}/{total} probes ready",
    probeTargetTag: "target {target}",
    cellSelfSimTag: "sim {sim}",
    fillAllBtn: "Fill All Missing Samples",
    fillSelectedBtn: "Fill Model",
    fillProfileLabel: "{cli} Sampling Profile",
    exportModelBtn: "Export",
    exportingBtn: "Exporting…",
    importBundleBtn: "Import Bundle",
    importingBtn: "Importing…",
    importSuccessBanner: "Imported {cli} · {effort} · {model} ({probes} probes, {values} valid samples)",
    fillCellTitle: "Inspect samples or fill this probe",
    planPreviewTitle: "Sampling Plan Preview",
    confirmFillBtn: "Confirm & Start Sampling",
    cancelJobBtn: "Stop Fingerprint Job",
    jobRunningBanner: "Fingerprint job running: {kind} ({completed}/{total} calls completed)",
  },
  drawer: {
    title: "Probe Sample Details: {model} · {probe}",
    effectiveCount: "Effective values: {effective} / {target}",
    targetCount: "Missing: {missing} (est. {calls} calls)",
    intraProbeSimText: "Split-half consistency: {mean} (single-check q_0.05: {lower})",
    fillProbeBtn: "Fill This Probe",
    resetProbeBtn: "Archive & Reset Probe",
    resetConfirmText: "Archive existing samples for this model & probe into archive/ and reset?",
    excludeBtn: "Exclude",
    includeBtn: "Include",
    excludedBadge: "Excluded",
    codecLabel: "Parser Rule",
    valuesPerCallLabel: "Values / Call",
    selfSimLabel: "Batch Self-Sim",
    attemptActiveWindow: "In active window: {active}/{extracted}",
    acceptedValuesLabel: "Accepted Sample Values",
    noAttempts: "No sampling attempts recorded for this probe yet",
  },
  check: {
    title: "Channel Model Verification",
    subtitle: "Collect a small sample batch from a CLI / Profile and compute JSD similarity against local baseline samples",
    cliLabel: "Target CLI",
    profileLabel: "Target Profile",
    officialProfile: "Official Default Login",
    declaredModelLabel: "Declared Model ID",
    probesLabel: "Active Probes",
    previewPlanBtn: "Preview Plan & Cost",
    startCheckBtn: "Start Verification",
    planExecutableProbes: "Probes to verify: {probes}",
    planEstimatedCalls: "Estimated calls: {calls}",
    planEstimatedUsd: "Estimated cost: ${usd}",
    planExpectedConsistency: "Expected self-test consistency: {rate}",
    skippedProbesNotice: "Skipped probes missing reference samples: {probes}",
    noChecksYet: "No verification records yet",
    rescoreBtn: "Rescore with Current References",
    rescoring: "Rescoring…",
    rescoreLatestBadge: "Latest rescore: {at}",
    originalVerdictLabel: "Original verdict: {verdict}",
    closestCandidateLabel: "Closest Candidate",
    declaredMeanLabel: "Declared Self-Similarity",
    thresholdLabel: "Self Lower Bound q_0.05",
    coverageLabel: "Expected Consistency",
    usableProbesLabel: "Usable Probes",
    probeBreakdownTitle: "Per-Probe Model Similarity Breakdown",
    candidatesComparisonTitle: "Pairwise Candidate Comparison",
    colProbe: "Probe",
    rowMeanSim: "Mean Similarity",
    colCandidateModel: "Candidate Model",
    colSharedProbes: "Shared Probes",
    colCandidateSim: "Candidate Sim",
    colDelta: "Delta (C - A)",
    colThreshold: "Threshold t_C,A",
    colCandidateLowerBound: "q_0.05(A)",
    colDistinguishable: "Distinguishable",
    singleRefPassedBadge: "Self-Bound Passed (Single Ref)",
    selfBoundPassedTag: "✓ >= q_0.05 (Passed)",
    selfBoundFailedTag: "✗ < q_0.05 (Below Bound)",
    singleRefGuideTitle: "Self-Distribution Bound Passed — Add a 2nd Reference Model for Pairwise Comparison",
    singleRefGuideBody:
      "Batch similarity against the declared model ({selfSim}) exceeds the self lower bound q_0.05 ({lowerBound}). Because only 1 reference model is currently collected under this CLI, pairwise comparison cannot run yet. Collect at least 1 additional model under the same CLI in the Reference Matrix, then click 'Rescore with Current References' to get a Consistent / Inconsistent verdict.",
    swimlaneTitle: "Verification Swimlanes",
    swimlaneLaneHeader: "Channel · Model",
    swimlaneChannelCount: "{count} lanes",
    swimlaneConsistentRate: "Passed {passed}/{total}",
    swimlaneLatestSelfSim: "Latest sim {sim}",
    probeSlotLegendTitle: "6-Probe Grid:",
    verdictShortConsistent: "Consistent",
    verdictShortInconsistent: "Inconsistent",
    verdictShortInconclusive: "Inconclusive",
    verdictShortSingleRef: "Self-Bound OK",
    channelsGroupTitle: "Target Channels (Profiles)",
    baselineReadyTag: "Baseline {usable}/{total}",
    baselineUnreadyTag: "Baseline {usable}/{total} (Fill first)",
    goToMatrixFillBtn: "Fill Baseline in Matrix →",
    multiProfileSwitchTitle: "Verified Channels in This Round ({count})",
  },
  configSection: {
    enabledLabel: "Enable Model Fingerprint",
    effortLabel: "Sampling Effort",
    samplesPerProbeLabel: "Default Samples per Probe (>=10)",
    samplesByProbeTitle: "Target Samples per Probe",
    resetDefaultSamplesBtn: "Reset Defaults (40/40/50/60/60/80)",
    valuesPerCheckLabel: "Samples per Probe per Check",
    checkAttemptsLabel: "Max Check Retries",
    targetAccuracyLabel: "Self-Test Pass Threshold (0.5–1.0)",
    maxCallsFactorLabel: "Max Calls Multiplier",
    concurrencyLabel: "Sampling Concurrency",
    probesLabel: "Enabled Probes",
    referencesTitle: "Models & Channels Source",
    sharedMatrixHint: "Directly uses {modelCount} models from Target Matrix and {profileCount} channels from Upstream Profiles above; no duplicate setup needed.",
    manageMatrixLink: "Target Matrix (#matrix) ↑",
    manageProfilesLink: "Upstream Profiles (#profiles) ↑",
    openFingerprintConsole: "Open Model Fingerprint →",
  },
};
