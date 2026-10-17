/**
 * 模型指纹命令行入口（src/bin/model-fingerprint.ts）：
 * 支持 status | fill | check | self-test | rescore 五个子命令。
 */

import { createInterface } from "node:readline/promises";
import { pathToFileURL } from "node:url";
import { readCachedCatalog } from "../capabilities/catalog";
import { describeActiveWorkConflict, findActiveWork } from "../core/active-work";
import { loadConfig, resolveModelFingerprintConfig, type AppConfig } from "../core/config";
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
import { isProbeId, type ProbeId } from "../core/model-fingerprint/types";
import { configPath } from "../core/paths";
import { CLI_KINDS, DEFAULT_PROFILE, type CliKind } from "../core/types";

export type FingerprintCliCommand = "status" | "fill" | "check" | "self-test" | "rescore";

function isCliKind(value: string): value is CliKind {
  return (CLI_KINDS as readonly string[]).includes(value);
}

export interface ParsedFingerprintCliArgs {
  command: FingerprintCliCommand;
  cli?: CliKind;
  profile?: string;
  model?: string;
  probes?: ProbeId[];
  count?: number;
  exclude?: string[];
  include?: string[];
  reset: boolean;
  dryRun: boolean;
  yes: boolean;
  checkId?: string;
}

export interface FingerprintCliDeps {
  loadConfig?: () => Promise<AppConfig>;
  collectDeps?: Partial<CollectDeps>;
  confirm?: (prompt: string) => Promise<boolean>;
  writeLine?: (line: string) => void;
}

function parseCsvList(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function parseProbesArg(raw: string): ProbeId[] {
  const items = parseCsvList(raw);
  if (items.length === 0) throw new Error("--probes 不能为空");
  const out: ProbeId[] = [];
  for (const item of items) {
    if (!isProbeId(item)) throw new Error(`未知探针 ID：${item}`);
    if (!out.includes(item)) out.push(item);
  }
  return out;
}

function consumeFlagValue(argsList: readonly string[], index: number, flag: string): string {
  const val = argsList[index + 1];
  if (val === undefined || val.startsWith("--")) {
    throw new Error(`参数 ${flag} 缺少取值`);
  }
  return val;
}

function requireNonEmptyTrimmed(flag: string, value: string): string {
  const trimmed = value.trim();
  if (trimmed === "") throw new Error(`参数 ${flag} 不能为空`);
  return trimmed;
}

export function parseFingerprintCliArgs(argv: readonly string[]): ParsedFingerprintCliArgs {
  const argsList = argv.filter((arg) => arg !== "--");
  const cmdRaw = argsList[0];
  if (
    cmdRaw !== "status" &&
    cmdRaw !== "fill" &&
    cmdRaw !== "check" &&
    cmdRaw !== "self-test" &&
    cmdRaw !== "rescore"
  ) {
    throw new Error(`未知或缺失子命令：${String(cmdRaw ?? "")}（可选：status | fill | check | self-test | rescore）`);
  }

  const parsed: ParsedFingerprintCliArgs = {
    command: cmdRaw,
    reset: false,
    dryRun: false,
    yes: false,
  };

  for (let i = 1; i < argsList.length; i += 1) {
    const argItem = argsList[i]!;
    i = applySingleCliArg(parsed, argsList, i, argItem);
  }
  validateParsedCommandArgs(parsed);
  return parsed;
}

function applySingleCliArg(
  parsed: ParsedFingerprintCliArgs,
  argsList: readonly string[],
  i: number,
  argItem: string,
): number {
  if (argItem === "--reset") {
    parsed.reset = true;
    return i;
  }
  if (argItem === "--dry-run") {
    parsed.dryRun = true;
    return i;
  }
  if (argItem === "--yes" || argItem === "-y") {
    parsed.yes = true;
    return i;
  }
  if (!argItem.startsWith("--")) {
    if (parsed.command === "rescore" && parsed.checkId === undefined) {
      parsed.checkId = requireNonEmptyTrimmed("<checkId>", argItem);
      return i;
    }
    throw new Error(`无法识别的位置参数：${argItem}`);
  }
  const value = consumeFlagValue(argsList, i, argItem);
  applyKeyValueFlag(parsed, argItem, value);
  return i + 1;
}

function applyKeyValueFlag(parsed: ParsedFingerprintCliArgs, flag: string, value: string): void {
  if (flag === "--cli") {
    if (!isCliKind(value)) throw new Error(`无效 --cli：${value}（可选：${CLI_KINDS.join(", ")}）`);
    parsed.cli = value;
  } else if (flag === "--profile") {
    parsed.profile = requireNonEmptyTrimmed(flag, value);
  } else if (flag === "--model" || flag === "--declared") {
    parsed.model = requireNonEmptyTrimmed(flag, value);
  } else if (flag === "--probes") {
    parsed.probes = parseProbesArg(value);
  } else if (flag === "--count") {
    const num = Number(value);
    if (!Number.isInteger(num) || num < 0) throw new Error(`--count 必须为非负整数，收到：${value}`);
    parsed.count = num;
  } else if (flag === "--exclude") {
    parsed.exclude = parseCsvList(value);
  } else if (flag === "--include") {
    parsed.include = parseCsvList(value);
  } else if (flag === "--id") {
    parsed.checkId = requireNonEmptyTrimmed(flag, value);
  } else {
    throw new Error(`未知选项：${flag}`);
  }
}

function validateParsedCommandArgs(parsed: ParsedFingerprintCliArgs): void {
  if (parsed.reset) {
    if (parsed.cli === undefined || !parsed.model || (parsed.probes?.length ?? 0) === 0) {
      throw new Error("--reset 必须同时显式指定 --cli <cli>、--model <model> 与 --probes <probe,...>");
    }
  }
  if (parsed.command === "check") {
    if (parsed.cli === undefined || !parsed.model) {
      throw new Error("check 子命令必须显式指定 --cli <cli> 与 --model <model>");
    }
  }
  if (parsed.command === "rescore") {
    if (!parsed.checkId) {
      throw new Error("rescore 子命令必须指定 <checkId>");
    }
  }
}

async function defaultInteractiveConfirm(promptText: string): Promise<boolean> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    const answer = await rl.question(`${promptText} [y/N]: `);
    return /^y(es)?$/i.test(answer.trim());
  } finally {
    rl.close();
  }
}

function formatCostText(costUsd: number | null): string {
  return costUsd !== null ? `，预计费用 $${costUsd.toFixed(4)}` : "";
}

async function handleStatusCommand(
  config: AppConfig,
  args: ParsedFingerprintCliArgs,
  writeLine: (line: string) => void,
): Promise<void> {
  const fpCfg = resolveModelFingerprintConfig(config);
  const allSets = await listAllSampleSets({ cli: args.cli, appliedEffort: fpCfg.effort, model: args.model, probes: args.probes });
  const rows = planFingerprintStatus({
    configuredReferences: fpCfg.references, onDiskSampleSets: allSets,
    cliFilter: args.cli, modelFilter: args.model, requestedProbes: args.probes,
    configuredProbes: fpCfg.probes, samplesPerProbe: fpCfg.samplesPerProbe, samplesByProbe: fpCfg.samplesByProbe,
    valuesPerCheck: fpCfg.valuesPerCheck, maxCallsFactor: fpCfg.maxCallsFactor, overrides: fpCfg.modelPrompts,
  });

  writeLine(`=== 模型指纹样本集状态（默认目标 ${fpCfg.samplesPerProbe} 条）===`);
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
      const set = allSets.find((s) => s.cli === gap.cli && s.model === gap.model && s.probe === gap.probe);
      const decoded = set
        ? decodeSampleSetAttempts(set, gap.targetValues, fpCfg.valuesPerCheck, fpCfg.modelPrompts, undefined, fpCfg.samplesByProbe)
        : [];
      const sims = decoded.map((d) => d.sampleSelfSim).filter((v): v is number => v !== null);
      const meanLoo = sims.length > 0 ? (sims.reduce((a, b) => a + b, 0) / sims.length).toFixed(3) : "n/a";
      const minLoo = sims.length > 0 ? Math.min(...sims).toFixed(3) : "n/a";
      const convText = gap.intraProbeSim !== null ? gap.intraProbeSim.toFixed(3) : "n/a";
      const driftWarn = gap.cliVersions.length > 1 ? " [版本偏移]" : "";
      const foldWarn = gap.effortHonored === false ? ` [强度折叠->${gap.appliedEffort ?? ""}]` : "";
      writeLine(
        `${gap.cli}/${gap.model} [${gap.probe}] 有效=${gap.validValues}/${gap.targetValues} 缺口=${gap.missingValues} 补齐调用=${gap.estimatedCalls}${formatCostText(gap.estimatedCostUsd)} 收敛=${convText} LOO均值/最低=${meanLoo}/${minLoo} CLI版本=${gap.cliVersions.join(",") || "n/a"}${driftWarn}${foldWarn}`,
      );
    }
  }
  writeLine(`总计待补齐调用次数：${totalMissingCalls}${formatCostText(hasCost ? totalCost : null)}`);
}

async function handleFillCommand(
  config: AppConfig, args: ParsedFingerprintCliArgs, deps: FingerprintCliDeps, writeLine: (line: string) => void,
): Promise<void> {
  const fpCfg = resolveModelFingerprintConfig(config);
  const plan = planReferenceFill({
    configuredReferences: fpCfg.references, sampleSets: buildSampleSetsByKeyMap(await listAllSampleSets({ appliedEffort: fpCfg.effort })),
    cliFilter: args.cli, modelFilter: args.model, requestedProbes: args.probes, configuredProbes: fpCfg.probes,
    samplesPerProbe: fpCfg.samplesPerProbe, samplesByProbe: fpCfg.samplesByProbe,
    valuesPerCheck: fpCfg.valuesPerCheck, maxCallsFactor: fpCfg.maxCallsFactor,
    countLimit: args.count, overrides: fpCfg.modelPrompts,
    mutation: { reset: args.reset, excludeReqIds: args.exclude, includeReqIds: args.include },
  });

  writeLine(`=== 基准样本补齐预检：待补齐探针 ${plan.pendingItems.length} 项，预计调用 ${plan.totalEstimatedCalls} 次（上限 ${plan.totalMaxCalls} 次）${formatCostText(plan.totalEstimatedCostUsd)} ===`);
  for (const item of plan.pendingItems) {
    writeLine(`  - ${item.cli}/${item.model} [${item.probe}]: 现有=${item.validValues}/${item.targetValues}, 本次计划新增=${item.plannedValues}, 预计调用=${item.estimatedCalls}${formatCostText(item.estimatedCostUsd)}`);
  }
  if (args.dryRun) {
    writeLine("[dry-run] 仅预演计划，未修改磁盘或调用模型。");
    return;
  }
  const active = await findActiveWork();
  if (active !== null) throw new Error(describeActiveWorkConflict(active));
  if (args.count !== 0 && plan.pendingItems.length > 0 && !args.yes) {
    const confirmFn = deps.confirm ?? defaultInteractiveConfirm;
    if (!(await confirmFn(`确认发起 ${plan.totalEstimatedCalls} 次模型调用以补齐基准样本吗？`))) {
      writeLine("已取消补齐作业。");
      return;
    }
  }
  const result = await executeFingerprintFill(
    config,
    { cli: args.cli, profile: args.profile, model: args.model, probes: args.probes, count: args.count, exclude: args.exclude, include: args.include, reset: args.reset },
    deps.collectDeps,
  );
  for (const item of result.items) {
    const targetForProbe = plan.items.find((p) => p.cli === item.cli && p.model === item.model && p.probe === item.probe)?.targetValues ?? fpCfg.samplesPerProbe;
    const rejText = Object.entries(item.rejectionCounts).map(([k, v]) => `${k}:${v}`).join(",");
    writeLine(`  * ${item.cli}/${item.model} [${item.probe}] 有效=${item.effectiveValues}/${targetForProbe} (新增=${item.collectedNewValues}, 调用=${item.attemptsUsed}${rejText ? `, 拒绝=${rejText}` : ""})`);
  }
  writeLine(`补齐完成：实际调用 ${result.callsExecuted} 次，失败 ${result.failedCalls} 次。`);
}

async function handleCheckCommand(
  config: AppConfig, args: ParsedFingerprintCliArgs, deps: FingerprintCliDeps, writeLine: (line: string) => void,
): Promise<void> {
  const fpCfg = resolveModelFingerprintConfig(config);
  const cli = args.cli!;
  const model = args.model!;
  const profile = args.profile ?? DEFAULT_PROFILE;
  const catalog = await (deps.collectDeps?.loadCapabilityCatalog ?? readCachedCatalog)();
  const targetInfo = resolveFingerprintTarget(config, catalog, cli, model, profile);
  const sampleSetsByModel = buildSampleSetsByModelMap(await listAllSampleSets({ cli, appliedEffort: fpCfg.effort }));

  const plan = planVerificationCheck({
    cli, declaredModel: model, sampleSetsByModel, requestedProbes: args.probes, configuredProbes: fpCfg.probes,
    samplesPerProbe: fpCfg.samplesPerProbe, samplesByProbe: fpCfg.samplesByProbe, valuesPerCheck: fpCfg.valuesPerCheck,
    checkAttempts: fpCfg.checkAttempts, targetAccuracy: fpCfg.targetAccuracy, overrides: fpCfg.modelPrompts,
  });

  const effortNote = !targetInfo.effortHonored ? ` [强度固定:${targetInfo.appliedEffort}]` : targetInfo.appliedEffort !== targetInfo.requestedEffort ? ` [强度折叠:${targetInfo.requestedEffort}->${targetInfo.appliedEffort}]` : "";
  const skippedText = plan.skippedProbes.map((p) => `${p.probe}(缺${p.missingValues}/需${p.estimatedCalls}次)`).join(", ");
  writeLine(`=== 核验预检：${cli}/${model} (profile=${profile}${effortNote}) 可执行探针=[${plan.executableProbes.map((p) => p.probe).join(", ")}] 跳过探针=[${skippedText}] 候选模型=[${plan.candidateModels.join(", ")}] 区分度不足=[${plan.indistinguishableCandidates.join(", ")}] 预计调用=${plan.totalEstimatedCalls} 次${formatCostText(plan.totalEstimatedCostUsd)} 自检一致率=${plan.expectedConsistency ?? "n/a"} ===`);
  if (args.dryRun) {
    writeLine("[dry-run] 仅预演核验计划，未发起模型调用。");
    return;
  }
  if (plan.executableProbes.length === 0) {
    throw new Error(`声明模型 ${cli}/${model} 在所选探针上没有任何满额基准样本集，无法发起核验。请先运行 pnpm fingerprint:fill 补齐基准样本。`);
  }
  const active = await findActiveWork();
  if (active !== null) throw new Error(describeActiveWorkConflict(active));
  if (!args.yes && !(await (deps.confirm ?? defaultInteractiveConfirm)(`确认对 ${cli}/${model} (${profile}) 发起 ${plan.totalEstimatedCalls} 次核验调用吗？`))) {
    writeLine("已取消核验作业。");
    return;
  }
  const record = await executeFingerprintCheck(config, { cli, profile, model, probes: args.probes }, deps.collectDeps);
  writeLine(`核验完成 [${record.checkId}]：结论=${record.verdict}${record.inconclusiveReason ? ` (${record.inconclusiveReason})` : ""} selfSim=${record.selfSim ?? "n/a"} 下界=${record.selfLowerBound ?? "n/a"} 最接近候选=${record.closestCandidate ?? "无"}`);
}

async function handleSelfTestCommand(
  config: AppConfig,
  args: ParsedFingerprintCliArgs,
  writeLine: (line: string) => void,
): Promise<void> {
  const fpCfg = resolveModelFingerprintConfig(config);
  const selectedProbes = resolveSelectedProbes(args.probes, fpCfg.probes);
  const allSets = await listAllSampleSets({ cli: args.cli, appliedEffort: fpCfg.effort });
  const byCli = new Map<CliKind, typeof allSets>();
  for (const s of allSets) {
    const list = byCli.get(s.cli) ?? [];
    list.push(s);
    byCli.set(s.cli, list);
  }

  for (const [cli, sets] of byCli.entries()) {
    const report = buildSelfTestReport({
      sampleSetsByModel: buildSampleSetsByModelMap(sets),
      probes: selectedProbes,
      samplesPerProbe: fpCfg.samplesPerProbe,
      samplesByProbe: fpCfg.samplesByProbe,
      valuesPerCheck: fpCfg.valuesPerCheck,
      targetAccuracy: fpCfg.targetAccuracy,
      overrides: fpCfg.modelPrompts,
    });
    writeLine(`=== 自检报告（CLI=${cli}，探针=${selectedProbes.join(",")}）===`);
    writeLine(
      `  探针区分度: ${Object.entries(report.probeSeparability).map(([p, v]) => `${p}=${v.distinguishablePairs}/${v.totalPairs}(${v.meanThreshold !== null ? v.meanThreshold.toFixed(4) : "n/a"})`).join(", ")}`,
    );
    for (const [modelName, stats] of Object.entries(report.modelSelfBounds)) {
      if (args.model !== undefined && modelName !== args.model) continue;
      writeLine(
        `  模型 ${modelName}: 有效探针=[${stats.usableProbes.join(",")}] 下界=${stats.selfLowerBound.toFixed(4)} 自检一致率=${stats.expectedConsistency.toFixed(4)} 误判率=${stats.expectedFalseInconsistentRate.toFixed(4)}`,
      );
    }
    for (const pair of report.pairs) {
      if (args.model !== undefined && pair.modelC !== args.model && pair.modelA !== args.model) continue;
      writeLine(
        `  配对 ${pair.modelC} vs ${pair.modelA}: 共有探针=[${pair.sharedProbes.join(",")}] 可区分=${pair.distinguishable} 阈值=${pair.threshold ?? "null"} 可判定率=${pair.decidableRate.toFixed(4)} 条件准确率=${pair.conditionalAccuracy ?? "n/a"}`,
      );
    }
    writeLine(
      `  容量曲线: ${report.capacityCurve.map((c) => `${c.subsetSize}:${c.distinguishablePairs}/${c.totalPairs}(${c.meanExpectedConsistency.toFixed(3)})`).join(" | ")}`,
    );
  }
}

async function handleRescoreCommand(
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

export async function runModelFingerprintCli(
  argv: readonly string[],
  deps: FingerprintCliDeps = {},
): Promise<void> {
  const args = parseFingerprintCliArgs(argv);
  const writeLine = deps.writeLine ?? ((line: string) => console.log(line));
  const config = await (deps.loadConfig ? deps.loadConfig() : loadConfig(configPath()));

  switch (args.command) {
    case "status":
      await handleStatusCommand(config, args, writeLine);
      break;
    case "fill":
      await handleFillCommand(config, args, deps, writeLine);
      break;
    case "check":
      await handleCheckCommand(config, args, deps, writeLine);
      break;
    case "self-test":
      await handleSelfTestCommand(config, args, writeLine);
      break;
    case "rescore":
      await handleRescoreCommand(config, args, writeLine);
      break;
  }
}

const isMainModule =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
  runModelFingerprintCli(process.argv.slice(2)).catch((err: unknown) => {
    console.error(err instanceof Error ? err.message : String(err));
    process.exitCode = 1;
  });
}
