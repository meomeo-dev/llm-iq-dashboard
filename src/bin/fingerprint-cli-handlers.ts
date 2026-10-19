/**
 * 模型指纹 CLI 子命令处理器与终端输出格式化（src/bin/fingerprint-cli-handlers.ts）。
 */

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { readCachedCatalog } from "../capabilities/catalog";
import { describeActiveWorkConflict, findActiveWork } from "../core/active-work";
import { resolveModelFingerprintConfig, type AppConfig } from "../core/config";
import { buildConfigLeakGuard } from "../core/leak-guard";
import { exportBaselineBundle, importBaselineBundle } from "../core/model-fingerprint/bundle";
import {
  executeFingerprintCheck,
  executeFingerprintFill,
  resolveFingerprintTarget,
  type CollectDeps,
} from "../core/model-fingerprint/collect";
import {
  planFingerprintStatus,
  planReferenceFill,
  planVerificationCheck,
  resolveSelectedProbes,
  type ModelStatusEntry,
  type ProbeGapSummary,
} from "../core/model-fingerprint/plan";
import {
  buildSelfTestReport,
  decodeSampleSetAttempts,
} from "../core/model-fingerprint/self-test";
import {
  buildSampleSetsByKeyMap,
  buildSampleSetsByModelMap,
  listAllSampleSets,
  rescoreCheckRecord,
} from "../core/model-fingerprint/store";
import type {
  FingerprintCheckRecord,
  ProbeSampleSet,
} from "../core/model-fingerprint/types";
import { DEFAULT_PROFILE, type CliKind } from "../core/types";
import { confirmOrAbort } from "./cli-args";
import type { ParsedFingerprintCliArgs } from "./fingerprint-cli-args";

export interface FingerprintCliDeps {
  loadConfig?: () => Promise<AppConfig>;
  collectDeps?: Partial<CollectDeps>;
  confirm?: (prompt: string) => Promise<boolean>;
  writeLine?: (line: string) => void;
}

function formatCostText(costUsd: number | null): string {
  return costUsd !== null ? `，预计费用 $${costUsd.toFixed(4)}` : "";
}

function formatStatusQuotaHeader(rows: readonly ModelStatusEntry[], defaultTarget: number, effort: string): string {
  const targets = rows.flatMap((r) => Object.values(r.probes).map((g) => g.targetValues));
  if (targets.length === 0) {
    return `=== 模型指纹样本集状态（默认目标 ${defaultTarget} 条，强度=${effort}）===`;
  }
  const minT = Math.min(...targets);
  const maxT = Math.max(...targets);
  const quotaDesc =
    minT === maxT
      ? `目标 ${minT} 条/探针`
      : `目标 ${minT}~${maxT} 条/探针（默认 ${defaultTarget} 条）`;
  return `=== 模型指纹样本集状态（${quotaDesc}，强度=${effort}）===`;
}

function formatStatusGapLine(
  gap: ProbeGapSummary,
  allSets: readonly ProbeSampleSet[],
  fpCfg: ReturnType<typeof resolveModelFingerprintConfig>,
): string {
  const set = allSets.find((s) => s.cli === gap.cli && s.model === gap.model && s.probe === gap.probe);
  const decoded = set
    ? decodeSampleSetAttempts(
        set,
        gap.targetValues,
        fpCfg.valuesPerCheck,
        fpCfg.modelPrompts,
        undefined,
        fpCfg.samplesByProbe,
        fpCfg.valuesPerCheckByProbe,
      )
    : [];
  const sims = decoded.map((d) => d.sampleSelfSim).filter((v): v is number => v !== null);
  const meanLoo = sims.length > 0 ? (sims.reduce((a, b) => a + b, 0) / sims.length).toFixed(3) : "n/a";
  const minLoo = sims.length > 0 ? Math.min(...sims).toFixed(3) : "n/a";
  const convText = gap.intraProbeSim !== null ? gap.intraProbeSim.toFixed(3) : "n/a";
  const driftWarn = gap.cliVersions.length > 1 ? " [版本偏移]" : "";
  const foldWarn = gap.effortHonored === false ? ` [强度折叠->${gap.appliedEffort ?? ""}]` : "";
  return `${gap.cli}/${gap.model} [${gap.probe}] 有效=${gap.validValues}/${gap.targetValues} 缺口=${gap.missingValues} 补齐调用=${gap.estimatedCalls}${formatCostText(gap.estimatedCostUsd)} 收敛=${convText} LOO均值/最低=${meanLoo}/${minLoo} CLI版本=${gap.cliVersions.join(",") || "n/a"}${driftWarn}${foldWarn}`;
}

export async function handleStatusCommand(
  config: AppConfig,
  args: ParsedFingerprintCliArgs,
  writeLine: (line: string) => void,
): Promise<void> {
  const fpCfg = resolveModelFingerprintConfig(config);
  const allSets = await listAllSampleSets({
    cli: args.cli,
    appliedEffort: fpCfg.effort,
    model: args.model,
    probes: args.probes,
  });
  const rows = planFingerprintStatus({
    configuredReferences: fpCfg.references,
    onDiskSampleSets: allSets,
    cliFilter: args.cli,
    modelFilter: args.model,
    requestedProbes: args.probes,
    configuredProbes: fpCfg.probes,
    samplesPerProbe: fpCfg.samplesPerProbe,
    samplesByProbe: fpCfg.samplesByProbe,
    valuesPerCheck: fpCfg.valuesPerCheck,
    valuesPerCheckByProbe: fpCfg.valuesPerCheckByProbe,
    maxCallsFactor: fpCfg.maxCallsFactor,
    overrides: fpCfg.modelPrompts,
  });

  writeLine(formatStatusQuotaHeader(rows, fpCfg.samplesPerProbe, fpCfg.effort));
  if (rows.length === 0) {
    writeLine("提示：当前未匹配到任何指纹目标。可通过 --cli <cli> --model <model> 指定目标或在配置 modelFingerprint.references 中登记。");
  }
  let totalMissingCalls = 0;
  let totalCost = 0;
  let hasCost = false;
  for (const row of rows) {
    for (const gap of Object.values(row.probes)) {
      totalMissingCalls += gap.estimatedCalls;
      if (gap.estimatedCostUsd !== null) {
        totalCost += gap.estimatedCostUsd;
        hasCost = true;
      }
      writeLine(formatStatusGapLine(gap, allSets, fpCfg));
    }
  }
  writeLine(`总计待补齐调用次数：${totalMissingCalls}${formatCostText(hasCost ? totalCost : null)}`);
}

function writeFillPlanPreview(
  plan: ReturnType<typeof planReferenceFill>,
  writeLine: (line: string) => void,
): void {
  writeLine(
    `=== 基准样本补齐预检：待补齐探针 ${plan.pendingItems.length} 项，预计调用 ${plan.totalEstimatedCalls} 次（上限 ${plan.totalMaxCalls} 次）${formatCostText(plan.totalEstimatedCostUsd)} ===`,
  );
  for (const item of plan.pendingItems) {
    writeLine(
      `  - ${item.cli}/${item.model} [${item.probe}]: 现有=${item.validValues}/${item.targetValues}, 本次计划新增=${item.plannedValues}, 预计调用=${item.estimatedCalls}${formatCostText(item.estimatedCostUsd)}`,
    );
  }
}

function writeFillResultSummary(
  result: Awaited<ReturnType<typeof executeFingerprintFill>>,
  plan: ReturnType<typeof planReferenceFill>,
  defaultTargetValues: number,
  writeLine: (line: string) => void,
): void {
  for (const item of result.items) {
    const targetForProbe =
      plan.items.find((p) => p.cli === item.cli && p.model === item.model && p.probe === item.probe)
        ?.targetValues ?? defaultTargetValues;
    const rejText = Object.entries(item.rejectionCounts)
      .map(([k, v]) => `${k}:${v}`)
      .join(",");
    writeLine(
      `  * ${item.cli}/${item.model} [${item.probe}] 有效=${item.effectiveValues}/${targetForProbe} (新增=${item.collectedNewValues}, 调用=${item.attemptsUsed}${rejText ? `, 拒绝=${rejText}` : ""})`,
    );
  }
  writeLine(`补齐完成：实际调用 ${result.callsExecuted} 次，失败 ${result.failedCalls} 次。`);
}

export async function handleFillCommand(
  config: AppConfig,
  args: ParsedFingerprintCliArgs,
  deps: FingerprintCliDeps,
  writeLine: (line: string) => void,
): Promise<void> {
  const fpCfg = resolveModelFingerprintConfig(config);
  const sampleSets = buildSampleSetsByKeyMap(await listAllSampleSets({ appliedEffort: fpCfg.effort }));
  const plan = planReferenceFill({
    ...fpCfg,
    configuredReferences: fpCfg.references,
    sampleSets,
    cliFilter: args.cli,
    modelFilter: args.model,
    requestedProbes: args.probes,
    configuredProbes: fpCfg.probes,
    countLimit: args.count,
    overrides: fpCfg.modelPrompts,
    mutation: { reset: args.reset, excludeReqIds: args.exclude, includeReqIds: args.include },
  });
  writeFillPlanPreview(plan, writeLine);
  if (args.dryRun) {
    writeLine("[dry-run] 仅预演计划，未修改磁盘或调用模型。");
    return;
  }
  const active = await findActiveWork();
  if (active !== null) throw new Error(describeActiveWorkConflict(active));
  if (args.count !== 0 && plan.pendingItems.length > 0) {
    const confirmed = await confirmOrAbort(
      `确认发起 ${plan.totalEstimatedCalls} 次模型调用以补齐基准样本吗？`,
      { yes: args.yes, customConfirm: deps.confirm, nonTtyHint: "pnpm fingerprint fill --yes", writeInfo: writeLine, writeError: writeLine },
    );
    if (!confirmed) return;
  }
  const result = await executeFingerprintFill(
    config,
    { cli: args.cli, profile: args.profile, model: args.model, probes: args.probes, count: args.count, exclude: args.exclude, include: args.include, reset: args.reset },
    deps.collectDeps,
  );
  writeFillResultSummary(result, plan, fpCfg.samplesPerProbe, writeLine);
}

function formatCheckPreviewLine(
  cli: CliKind,
  model: string,
  profile: string,
  targetInfo: ReturnType<typeof resolveFingerprintTarget>,
  plan: ReturnType<typeof planVerificationCheck>,
): string {
  const effortNote = !targetInfo.effortHonored
    ? ` [强度固定:${targetInfo.appliedEffort}]`
    : targetInfo.appliedEffort !== targetInfo.requestedEffort
      ? ` [强度折叠:${targetInfo.requestedEffort}->${targetInfo.appliedEffort}]`
      : "";
  const skippedText = plan.skippedProbes
    .map((p) => `${p.probe}(缺${p.missingValues}/需${p.estimatedCalls}次)`)
    .join(", ");
  return `=== 核验预检：${cli}/${model} (profile=${profile}${effortNote}) 可执行探针=[${plan.executableProbes.map((p) => p.probe).join(", ")}] 跳过探针=[${skippedText}] 候选模型=[${plan.candidateModels.join(", ")}] 区分度不足=[${plan.indistinguishableCandidates.join(", ")}] 预计调用=${plan.totalEstimatedCalls} 次${formatCostText(plan.totalEstimatedCostUsd)} 自检一致率=${plan.expectedConsistency ?? "n/a"} ===`;
}

function formatFailedProbesSummary(record: FingerprintCheckRecord): string | null {
  const entries = Object.entries(record.failedProbes ?? {});
  if (entries.length === 0) return null;
  const details = entries.map(([probe, reason]) => `${probe}->${reason}`).join(", ");
  return `  ! 失败探针诊断: ${details}`;
}

function writeCheckRecordSummary(record: FingerprintCheckRecord, writeLine: (line: string) => void): void {
  writeLine(
    `核验完成 [${record.checkId}]：结论=${record.verdict}${record.inconclusiveReason ? ` (${record.inconclusiveReason})` : ""} selfSim=${record.selfSim ?? "n/a"} 下界=${record.selfLowerBound ?? "n/a"} 最接近候选=${record.closestCandidate ?? "无"}`,
  );
  const failedDiag = formatFailedProbesSummary(record);
  if (failedDiag) writeLine(failedDiag);
}

export async function handleCheckCommand(
  config: AppConfig,
  args: ParsedFingerprintCliArgs,
  deps: FingerprintCliDeps,
  writeLine: (line: string) => void,
): Promise<void> {
  const fpCfg = resolveModelFingerprintConfig(config);
  const cli = args.cli!;
  const model = args.model!;
  const profile = args.profile ?? DEFAULT_PROFILE;
  const catalog = await (deps.collectDeps?.loadCapabilityCatalog ?? readCachedCatalog)();
  const targetInfo = resolveFingerprintTarget(config, catalog, cli, model, profile);
  const sampleSetsByModel = buildSampleSetsByModelMap(
    await listAllSampleSets({ cli, appliedEffort: fpCfg.effort }),
  );
  const plan = planVerificationCheck({
    ...fpCfg,
    cli,
    declaredModel: model,
    sampleSetsByModel,
    requestedProbes: args.probes,
    configuredProbes: fpCfg.probes,
    overrides: fpCfg.modelPrompts,
  });
  writeLine(formatCheckPreviewLine(cli, model, profile, targetInfo, plan));
  if (args.dryRun) {
    writeLine("[dry-run] 仅预演核验计划，未发起模型调用。");
    return;
  }
  if (plan.executableProbes.length === 0) {
    throw new Error(
      `声明模型 ${cli}/${model} 在所选探针上没有任何满额基准样本集，无法发起核验。请先运行 pnpm fingerprint:fill 补齐基准样本。`,
    );
  }
  const active = await findActiveWork();
  if (active !== null) throw new Error(describeActiveWorkConflict(active));
  const confirmed = await confirmOrAbort(
    `确认对 ${cli}/${model} (${profile}) 发起 ${plan.totalEstimatedCalls} 次核验调用吗？`,
    { yes: args.yes, customConfirm: deps.confirm, nonTtyHint: "pnpm fingerprint check --yes", writeInfo: writeLine, writeError: writeLine },
  );
  if (!confirmed) return;

  const record = await executeFingerprintCheck(
    config,
    { cli, profile, model, probes: args.probes },
    deps.collectDeps,
  );
  writeCheckRecordSummary(record, writeLine);
}

function writeSelfTestCliSection(
  cli: CliKind,
  sets: readonly ProbeSampleSet[],
  selectedProbes: ReturnType<typeof resolveSelectedProbes>,
  fpCfg: ReturnType<typeof resolveModelFingerprintConfig>,
  modelFilter: string | undefined,
  writeLine: (line: string) => void,
): void {
  const report = buildSelfTestReport({
    sampleSetsByModel: buildSampleSetsByModelMap(sets),
    probes: selectedProbes,
    samplesPerProbe: fpCfg.samplesPerProbe,
    samplesByProbe: fpCfg.samplesByProbe,
    valuesPerCheck: fpCfg.valuesPerCheck,
    valuesPerCheckByProbe: fpCfg.valuesPerCheckByProbe,
    targetAccuracy: fpCfg.targetAccuracy,
    overrides: fpCfg.modelPrompts,
  });
  writeLine(`=== 自检报告（CLI=${cli}，探针=${selectedProbes.join(",")}）===`);
  writeLine(
    `  探针区分度: ${Object.entries(report.probeSeparability).map(([p, v]) => `${p}=${v.distinguishablePairs}/${v.totalPairs}(${v.meanThreshold !== null ? v.meanThreshold.toFixed(4) : "n/a"})`).join(", ")}`,
  );
  for (const [modelName, stats] of Object.entries(report.modelSelfBounds)) {
    if (modelFilter !== undefined && modelName !== modelFilter) continue;
    writeLine(
      `  模型 ${modelName}: 有效探针=[${stats.usableProbes.join(",")}] 下界=${stats.selfLowerBound.toFixed(4)} 自检一致率=${stats.expectedConsistency.toFixed(4)} 误判率=${stats.expectedFalseInconsistentRate.toFixed(4)}`,
    );
  }
  for (const pair of report.pairs) {
    if (modelFilter !== undefined && pair.modelC !== modelFilter && pair.modelA !== modelFilter) {
      continue;
    }
    writeLine(
      `  配对 ${pair.modelC} vs ${pair.modelA}: 共有探针=[${pair.sharedProbes.join(",")}] 可区分=${pair.distinguishable} 阈值=${pair.threshold ?? "null"} 可判定率=${pair.decidableRate.toFixed(4)} 条件准确率=${pair.conditionalAccuracy ?? "n/a"}`,
    );
  }
  writeLine(
    `  容量曲线: ${report.capacityCurve.map((c) => `${c.subsetSize}:${c.distinguishablePairs}/${c.totalPairs}(${c.meanExpectedConsistency.toFixed(3)})`).join(" | ")}`,
  );
}

export async function handleSelfTestCommand(
  config: AppConfig,
  args: ParsedFingerprintCliArgs,
  writeLine: (line: string) => void,
): Promise<void> {
  const fpCfg = resolveModelFingerprintConfig(config);
  const selectedProbes = resolveSelectedProbes(args.probes, fpCfg.probes);
  const allSets = await listAllSampleSets({ cli: args.cli, appliedEffort: fpCfg.effort });
  const byCli = new Map<CliKind, ProbeSampleSet[]>();
  for (const s of allSets) {
    const list = byCli.get(s.cli) ?? [];
    list.push(s);
    byCli.set(s.cli, list);
  }
  for (const [cli, sets] of byCli.entries()) {
    writeSelfTestCliSection(cli, sets, selectedProbes, fpCfg, args.model, writeLine);
  }
}

export async function handleRescoreCommand(
  config: AppConfig,
  args: ParsedFingerprintCliArgs,
  writeLine: (line: string) => void,
): Promise<void> {
  const updated = await rescoreCheckRecord(config, args.checkId!);
  const latest = updated.rescores[updated.rescores.length - 1]!;
  writeLine(
    `重算完成 [${updated.checkId}]（共 ${updated.rescores.length} 次重算）：最新结论=${latest.verdict}${latest.inconclusiveReason ? ` (${latest.inconclusiveReason})` : ""} selfSim=${latest.selfSim ?? "n/a"} 下界=${latest.selfLowerBound ?? "n/a"}`,
  );
}

export async function handleExportCommand(
  config: AppConfig,
  args: ParsedFingerprintCliArgs,
  writeLine: (line: string) => void,
): Promise<void> {
  const fpCfg = resolveModelFingerprintConfig(config);
  const leakGuard = await buildConfigLeakGuard(config);
  const exported = await exportBaselineBundle({
    cli: args.cli!,
    model: args.model!,
    effort: fpCfg.effort,
    probes: args.probes,
    leakGuard,
    modelPrompts: fpCfg.modelPrompts,
  });
  const outPath = resolve(args.file ?? exported.filename);
  await writeFile(outPath, exported.buffer);
  writeLine(
    `导出完成：${outPath}（${exported.manifest.cli} · ${exported.manifest.requestedEffort} · ${exported.manifest.model}，${exported.manifest.probes.length} 个探针，共 ${exported.totalValidValues} 条有效样本，packageSha256=${exported.manifest.packageSha256}）`,
  );
}

export async function handleImportCommand(
  config: AppConfig,
  args: ParsedFingerprintCliArgs,
  writeLine: (line: string) => void,
): Promise<void> {
  if (!args.dryRun) {
    const active = await findActiveWork();
    if (active !== null) throw new Error(describeActiveWorkConflict(active));
  }
  const fpCfg = resolveModelFingerprintConfig(config);
  const leakGuard = await buildConfigLeakGuard(config);
  const compressed = await readFile(resolve(args.file!));
  const res = await importBaselineBundle(compressed, {
    dryRun: args.dryRun,
    leakGuard,
    modelPrompts: fpCfg.modelPrompts,
  });
  const prefix = args.dryRun ? "[dry-run] 校验通过（未落盘）" : "导入完成";
  const archivedText =
    res.archivedProbes.length > 0 ? `，已归档旧样本探针=[${res.archivedProbes.join(",")}]` : "";
  writeLine(
    `${prefix}：${res.manifest.cli} · ${res.manifest.requestedEffort} · ${res.manifest.model}（探针=[${res.importedProbes.join(",")}]，共 ${res.totalValidValues} 条有效样本 / ${res.totalAttempts} 次调用${archivedText}）`,
  );
}
