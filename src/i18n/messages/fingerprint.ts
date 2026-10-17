/**
 * 模型统计指纹核验（/fingerprint 与配置页）双语字典。
 */

export interface FingerprintMessages {
  pageTitle: string;
  pageSubtitle: string;
  backLink: string;
  configLink: string;
  tabs: {
    matrix: string;
    check: string;
    history: string;
  };
  probes: {
    uuid: { label: string; desc: string };
    number: { label: string; desc: string };
    seed: { label: string; desc: string };
    palette: { label: string; desc: string };
    "words-en": { label: string; desc: string };
    "words-zh": { label: string; desc: string };
  };
  verdict: {
    consistent: string;
    inconsistent: string;
    inconclusive: string;
    "not-comparable": string;
  };
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
  outcomes: {
    ok: string;
    timeout: string;
    "content-filter": string;
    error: string;
    "leak-blocked": string;
  };
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
    colCandidateModel: string;
    colSharedProbes: string;
    colDelta: string;
    colThreshold: string;
    colCandidateLowerBound: string;
    colDistinguishable: string;
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
    addReferenceBtn: string;
    removeReferenceBtn: string;
    openFingerprintConsole: string;
  };
}

export const zhCNFingerprint: FingerprintMessages = {
  pageTitle: "模型统计指纹核验",
  pageSubtitle: "基于经验字符/词元分布与 Jensen-Shannon 散度（JSD）的渠道模型身份核验工作台",
  backLink: "← 返回看板",
  configLink: "指纹配置",
  tabs: {
    matrix: "基准样本矩阵",
    check: "发起渠道核验",
    history: "历史核验报告",
  },
  probes: {
    uuid: {
      label: "UUID v4 伪随机串",
      desc: "采集 36 字符标准 UUID v4 格式串，提取十六进制字符与双字符二元组分布",
    },
    number: {
      label: "12–18 位十进制整数",
      desc: "采集 12 至 18 位无前导零十进制正整数（至少 5 个不同数字），提取数位与相邻二元组分布",
    },
    seed: {
      label: "十六进制种子标识",
      desc: "采集 seed_ 前缀加 16 位小写十六进制字符（至少 5 个不同字符），剥离前缀后提取字符与二元组分布",
    },
    palette: {
      label: "五色十六进制调色盘",
      desc: "采集 5 组 #rrggbb 十六进制色彩组合，提取色彩字符、色内双字符与 6-bit RGB 色块分布",
    },
    "words-en": {
      label: "英文八词组合",
      desc: "采集 8 个互异英文小写单词连字符组合，提取字母、词内双字母与词段分布",
    },
    "words-zh": {
      label: "中文八词组合",
      desc: "采集 8 个互异非叠字双字中文词组合，提取汉字、词首/词尾构词位置与双字词分布",
    },
  },
  verdict: {
    consistent: "与声明模型一致",
    inconsistent: "与声明模型不一致",
    inconclusive: "证据不足（待定）",
    "not-comparable": "基准不足（不可比）",
  },
  inconclusiveReasons: {
    "below-self-lower-bound": "查询批次与声明模型基准的相似度低于自身下界 q_0.05",
    "within-threshold-margin": "声明模型与候选模型的相似度分差未超过显著裕度阈值",
    "single-reference-only": "仅配置单个基准模型，无其他对照模型可做排他区分",
    "candidates-indistinguishable": "自检留出交叉验证显示声明模型与部分候选模型无法可靠区分",
  },
  rejectionReasons: {
    tool_write_instead_of_inline: "违规调用写文件工具而非内联输出",
    empty_output: "模型返回空文本",
    invalid_format: "候选值未通过标准格式校验",
    duplicate_segments: "分段内存在重复词或重复色值",
    low_char_diversity: "候选值字符多样性过低（疑似退化重复）",
    no_candidate: "未提取到符合探针格式的候选值",
  },
  outcomes: {
    ok: "调用成功",
    timeout: "超时",
    "content-filter": "内容过滤",
    error: "调用错误",
    "leak-blocked": "凭据拦截",
  },
  matrix: {
    title: "基准模型 × 探针有效样本矩阵",
    subtitle: "单元格显示「有效标准值数 / 该探针标定目标数」及基准池对半收敛度；点击单元格可抽检原始应答、剔除异常值或单点补齐",
    emptyReferences: "尚未配置基准模型，请先在配置页添加参考模型",
    modelHeader: "基准模型",
    cliEffortHeader: "CLI · 强度",
    usableCount: "{usable}/{total} 探针可用",
    probeTargetTag: "目标 {target}",
    cellSelfSimTag: "收敛 {sim}",
    fillAllBtn: "一键补齐全部缺口",
    fillSelectedBtn: "补齐此模型",
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
    intraProbeSimText: "基准对半收敛度：{mean}（单次核验下界 q_0.05：{lower}）",
    fillProbeBtn: "补齐此探针样本",
    resetProbeBtn: "归档并清空重采",
    resetConfirmText: "确定将该模型在此探针下的样本移入 archive/ 归档并清空吗？",
    excludeBtn: "剔除",
    includeBtn: "恢复",
    excludedBadge: "已人工剔除",
    codecLabel: "提示词编码器",
    valuesPerCallLabel: "单次要求条数",
    selfSimLabel: "批次自相似度",
    attemptActiveWindow: "生效窗口内：{active}/{extracted}",
    acceptedValuesLabel: "提取合格标准值",
    noAttempts: "该探针下暂无采样记录",
  },
  check: {
    title: "待测渠道模型身份核验",
    subtitle: "对指定 CLI / Profile 采集小样本查询批次，与本地基准模型库做等容量子参照 JSD 相似度比对",
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
    colCandidateModel: "候选模型",
    colSharedProbes: "共有探针",
    colDelta: "分差 (C - A)",
    colThreshold: "阈值 t_C,A",
    colCandidateLowerBound: "下界 q_0.05(A)",
    colDistinguishable: "可区分",
  },
  configSection: {
    enabledLabel: "启用模型统计指纹功能",
    effortLabel: "固定采样思考强度",
    samplesPerProbeLabel: "兜底目标合格值数 (>=10)",
    samplesByProbeTitle: "按探针自由度标定的目标样本数 (>=10)",
    resetDefaultSamplesBtn: "恢复推荐标定值 (40/40/50/60/60/80)",
    valuesPerCheckLabel: "每次核验每探针采集值数",
    checkAttemptsLabel: "核验尝试批次数",
    targetAccuracyLabel: "自检目标准确率 (0.5–1.0)",
    maxCallsFactorLabel: "最大调用倍数上限",
    concurrencyLabel: "并发采集道数",
    probesLabel: "启用的探针列表",
    referencesTitle: "官方基准参考模型列表",
    addReferenceBtn: "添加参考模型",
    removeReferenceBtn: "移除",
    openFingerprintConsole: "打开模型指纹核验工作台 →",
  },
};

export const enFingerprint: FingerprintMessages = {
  pageTitle: "Model Statistical Fingerprint",
  pageSubtitle: "Verify upstream model identity via empirical token/char distributions and Jensen-Shannon divergence (JSD)",
  backLink: "← Dashboard",
  configLink: "Fingerprint Config",
  tabs: {
    matrix: "Reference Matrix",
    check: "Run Verification",
    history: "Verification History",
  },
  probes: {
    uuid: {
      label: "UUID v4 Strings",
      desc: "Collects 36-char UUID v4 strings and extracts hex character and bigram distributions",
    },
    number: {
      label: "12–18 Digit Integers",
      desc: "Collects 12..18 digit positive decimal integers (no leading zero, >=5 distinct digits) and extracts digit and bigram distributions",
    },
    seed: {
      label: "Hex Seed Identifiers",
      desc: "Collects seed_ + 16 lowercase hex chars (>=5 distinct chars) and extracts post-prefix char and bigram distributions",
    },
    palette: {
      label: "5-Color Hex Palettes",
      desc: "Collects 5-color #rrggbb palettes and extracts hex char, intra-color bigram, and 6-bit RGB color cube distributions",
    },
    "words-en": {
      label: "8 English Words",
      desc: "Collects 8 distinct lowercase English words joined by hyphens and extracts char, intra-word bigram, and word distributions",
    },
    "words-zh": {
      label: "8 Two-Char Chinese Words",
      desc: "Collects 8 distinct non-reduplicated two-character Chinese words and extracts char, head/tail morpheme position, and word distributions",
    },
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
    "single-reference-only": "Only a single reference model is available; no alternative candidate for comparative exclusion",
    "candidates-indistinguishable": "Holdout self-test indicates declared model and candidate are not reliably distinguishable",
  },
  rejectionReasons: {
    tool_write_instead_of_inline: "Model invoked file-write tool instead of inline response",
    empty_output: "Model returned empty output",
    invalid_format: "Candidate failed canonical format validation",
    duplicate_segments: "Candidate contains duplicate words or color segments",
    low_char_diversity: "Candidate character diversity too low (degenerate repetition)",
    no_candidate: "No candidate matching probe pattern extracted",
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
    subtitle: "Cells show effective canonical values / calibrated probe target and split-half pool convergence; click any cell to inspect or fill",
    emptyReferences: "No reference models configured yet. Add reference models in Configuration first.",
    modelHeader: "Reference Model",
    cliEffortHeader: "CLI · Effort",
    usableCount: "{usable}/{total} probes ready",
    probeTargetTag: "target {target}",
    cellSelfSimTag: "sim {sim}",
    fillAllBtn: "Fill All Missing Samples",
    fillSelectedBtn: "Fill Model",
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
    intraProbeSimText: "Split-half convergence: {mean} (single-check q_0.05: {lower})",
    fillProbeBtn: "Fill This Probe",
    resetProbeBtn: "Archive & Reset Probe",
    resetConfirmText: "Archive existing samples for this model & probe into archive/ and reset?",
    excludeBtn: "Exclude",
    includeBtn: "Include",
    excludedBadge: "Excluded",
    codecLabel: "Prompt Codec",
    valuesPerCallLabel: "Values / Call",
    selfSimLabel: "Sample Self-Sim",
    attemptActiveWindow: "In active window: {active}/{extracted}",
    acceptedValuesLabel: "Accepted Canonical Values",
    noAttempts: "No sampling attempts recorded for this probe yet",
  },
  check: {
    title: "Verify Upstream Channel Model Identity",
    subtitle: "Collect a small query batch from a CLI / Profile and compare against local references via equal-size sub-reference JSD",
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
    colCandidateModel: "Candidate Model",
    colSharedProbes: "Shared Probes",
    colDelta: "Delta (C - A)",
    colThreshold: "Threshold t_C,A",
    colCandidateLowerBound: "q_0.05(A)",
    colDistinguishable: "Distinguishable",
  },
  configSection: {
    enabledLabel: "Enable Model Statistical Fingerprinting",
    effortLabel: "Sampling Effort Level",
    samplesPerProbeLabel: "Fallback Target Samples (>=10)",
    samplesByProbeTitle: "Per-Probe Calibrated Target Samples (>=10)",
    resetDefaultSamplesBtn: "Reset to Calibrated Defaults (40/40/50/60/60/80)",
    valuesPerCheckLabel: "Values per Probe in Check",
    checkAttemptsLabel: "Check Attempts",
    targetAccuracyLabel: "Self-Test Target Accuracy (0.5–1.0)",
    maxCallsFactorLabel: "Max Calls Factor",
    concurrencyLabel: "Sampling Concurrency",
    probesLabel: "Active Probes",
    referencesTitle: "Official Reference Models",
    addReferenceBtn: "Add Reference Model",
    removeReferenceBtn: "Remove",
    openFingerprintConsole: "Open Model Fingerprint Console →",
  },
};
