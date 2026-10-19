/**
 * 模型指纹看板基准快照计算与自校验内存缓存（baseline-cache.ts）：
 * - 基于文件 `stat`（mtimeMs + size）缓存已解析的样本集与核验记录 JSON，未变更时不重复触发
 *   `readFile` + `JSON.parse`（同时避免 Next.js 15 开发模式将数十个 `readFile` 原始字符串打入 RSC 流）；
 * - 消除 `planFingerprintStatus` 与 `planReferenceFill` 对同一组样本集的重复 50 折收敛度计算；
 * - 看板场景跳过仅 CLI 使用的 9 阶容量曲线模拟（`includeCapacityCurve: false`）；
 * - 以配置 + 样本集内容摘要作为确定性签名缓存计算结果，任意样本或配置变更时自动失效。
 */

import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import type { ModelFingerprintConfig } from "../config";
import { fingerprintChecksRoot, fingerprintSamplesRoot } from "../paths";
import { CLI_KINDS, type CliKind, type EffortLevel } from "../types";
import {
  planFingerprintStatus,
  resolveSelectedProbes,
  type FillPlan,
  type ModelStatusEntry,
  type ProbeGapSummary,
} from "./plan";
import { buildSelfTestReport, type SelfTestReport } from "./self-test";
import { buildSampleSetsByModelMap } from "./store";
import type { FingerprintCheckRecord, ProbeId, ProbeSampleSet } from "./types";

export interface DashboardBaselineSnapshot {
  readonly matrix: ModelStatusEntry[];
  readonly fillPlan: FillPlan;
  readonly selfTest: SelfTestReport;
  readonly selfTestByCli: Record<string, SelfTestReport>;
}

interface StatCachedItem<T> {
  readonly mtimeMs: number;
  readonly size: number;
  readonly value: T;
}

interface CacheState {
  signature?: string;
  snapshot?: DashboardBaselineSnapshot;
  sampleFiles: Map<string, StatCachedItem<ProbeSampleSet>>;
  checkFiles: Map<string, StatCachedItem<FingerprintCheckRecord>>;
}

const CACHE_KEY = Symbol.for("pelican.fingerprintDashboardBaselineCache");

function getCacheState(): CacheState {
  const holder = globalThis as unknown as { [CACHE_KEY]?: Partial<CacheState> };
  const cur = holder[CACHE_KEY];
  if (!cur || !(cur.sampleFiles instanceof Map) || !(cur.checkFiles instanceof Map)) {
    holder[CACHE_KEY] = {
      signature: cur?.signature,
      snapshot: cur?.snapshot,
      sampleFiles: new Map(),
      checkFiles: new Map(),
    };
  }
  return holder[CACHE_KEY] as CacheState;
}

async function readStatCachedJson<T>(
  filePath: string,
  cache: Map<string, StatCachedItem<T>>,
): Promise<T | null> {
  try {
    const st = await stat(filePath);
    const hit = cache.get(filePath);
    if (hit && hit.mtimeMs === st.mtimeMs && hit.size === st.size) {
      return hit.value;
    }
    const parsed = JSON.parse(await readFile(filePath, "utf8")) as T;
    cache.set(filePath, { mtimeMs: st.mtimeMs, size: st.size, value: parsed });
    return parsed;
  } catch {
    cache.delete(filePath);
    return null;
  }
}

async function safeListNames(dir: string, wantDirs: boolean): Promise<string[]> {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    return entries
      .filter((e) => (wantDirs ? e.isDirectory() : e.isFile()))
      .map((e) => e.name);
  } catch {
    return [];
  }
}

export async function listCachedSampleSets(filter?: {
  cli?: CliKind;
  appliedEffort?: EffortLevel;
  model?: string;
  probes?: readonly ProbeId[];
}): Promise<ProbeSampleSet[]> {
  const root = fingerprintSamplesRoot();
  const state = getCacheState();
  const envDirs = await safeListNames(root, true);
  const probeFilter = filter?.probes ? new Set(filter.probes) : null;
  const results: ProbeSampleSet[] = [];

  for (const envName of envDirs) {
    const modelDirs = await safeListNames(join(root, envName), true);
    for (const modelDir of modelDirs) {
      const files = await safeListNames(join(root, envName, modelDir), false);
      for (const file of files) {
        if (!file.endsWith(".json")) continue;
        const set = await readStatCachedJson(
          join(root, envName, modelDir, file),
          state.sampleFiles,
        );
        if (set === null) continue;
        if (filter?.cli !== undefined && set.cli !== filter.cli) continue;
        if (
          filter?.appliedEffort !== undefined &&
          (set.requestedEffort ?? set.appliedEffort) !== filter.appliedEffort
        ) {
          continue;
        }
        if (filter?.model !== undefined && set.model !== filter.model) continue;
        if (probeFilter !== null && !probeFilter.has(set.probe)) continue;
        results.push(set);
      }
    }
  }
  return results;
}

export async function listCachedCheckRecords(
  limit: number = 50,
): Promise<FingerprintCheckRecord[]> {
  const root = fingerprintChecksRoot();
  const state = getCacheState();
  const months = (await safeListNames(root, true)).sort().reverse();
  const records: FingerprintCheckRecord[] = [];
  for (const month of months) {
    const files = (await safeListNames(join(root, month), false))
      .filter((name) => name.endsWith(".json"))
      .sort()
      .reverse();
    for (const file of files) {
      const record = await readStatCachedJson(
        join(root, month, file),
        state.checkFiles,
      );
      if (record !== null) {
        records.push(record);
        if (records.length >= limit) return records;
      }
    }
  }
  return records;
}

function buildBaselineSignature(
  fpCfg: ModelFingerprintConfig,
  allSets: readonly ProbeSampleSet[],
): string {
  const setFingerprints = allSets.map((s) => [
    s.cli,
    s.model,
    s.probe,
    s.appliedEffort,
    s.effortHonored,
    s.attempts.length,
    s.attempts.map((a) => [
      a.reqId,
      a.outcome,
      a.excluded === true ? 1 : 0,
      a.estimatedCostUsd ?? a.usage?.reportedCostUsd ?? null,
    ]),
  ]);
  return JSON.stringify({ fpCfg, setFingerprints });
}

export function deriveFillPlanFromStatus(
  matrix: readonly ModelStatusEntry[],
  fpCfg: ModelFingerprintConfig,
): FillPlan {
  const probes = resolveSelectedProbes(undefined, fpCfg.probes);
  const byTarget = new Map<string, ModelStatusEntry>(
    matrix.map((entry) => [`${entry.cli}:${entry.model}`, entry]),
  );
  const items: ProbeGapSummary[] = [];
  for (const ref of fpCfg.references) {
    const entry = byTarget.get(`${ref.cli}:${ref.model}`);
    if (!entry) continue;
    for (const probe of probes) {
      const gap = entry.probes[probe];
      if (gap) items.push(gap);
    }
  }
  const pendingItems = items.filter((item) => item.plannedValues > 0);
  const knownCosts = pendingItems
    .map((i) => i.estimatedCostUsd)
    .filter((c): c is number => c !== null);

  return {
    probes,
    items,
    pendingItems,
    totalPlannedValues: pendingItems.reduce((acc, i) => acc + i.plannedValues, 0),
    totalEstimatedCalls: pendingItems.reduce((acc, i) => acc + i.estimatedCalls, 0),
    totalMaxCalls: pendingItems.reduce((acc, i) => acc + i.maxCalls, 0),
    totalEstimatedCostUsd:
      knownCosts.length > 0 ? knownCosts.reduce((a, b) => a + b, 0) : null,
  };
}

function computeDashboardSelfTests(
  fpCfg: ModelFingerprintConfig,
  allSets: readonly ProbeSampleSet[],
): { selfTest: SelfTestReport; selfTestByCli: Record<string, SelfTestReport> } {
  const probes = resolveSelectedProbes(undefined, fpCfg.probes);
  const selfTestOpts = {
    probes,
    samplesPerProbe: fpCfg.samplesPerProbe,
    samplesByProbe: fpCfg.samplesByProbe,
    valuesPerCheck: fpCfg.valuesPerCheck,
    valuesPerCheckByProbe: fpCfg.valuesPerCheckByProbe,
    targetAccuracy: fpCfg.targetAccuracy,
    overrides: fpCfg.modelPrompts,
    includeCapacityCurve: false,
  };
  const selfTestByCli: Record<string, SelfTestReport> = {};
  for (const cli of CLI_KINDS) {
    const cliSets = allSets.filter((s) => s.cli === cli);
    if (cliSets.length === 0) continue;
    selfTestByCli[cli] = buildSelfTestReport({
      sampleSetsByModel: buildSampleSetsByModelMap(cliSets),
      ...selfTestOpts,
    });
  }
  const firstCli = Object.keys(selfTestByCli)[0];
  const selfTest = firstCli
    ? selfTestByCli[firstCli]!
    : buildSelfTestReport({ sampleSetsByModel: new Map(), ...selfTestOpts });
  return { selfTest, selfTestByCli };
}

export function resolveDashboardBaseline(
  fpCfg: ModelFingerprintConfig,
  allSets: readonly ProbeSampleSet[],
): DashboardBaselineSnapshot {
  const signature = buildBaselineSignature(fpCfg, allSets);
  const state = getCacheState();
  if (state.signature === signature && state.snapshot) {
    return state.snapshot;
  }

  const matrix = planFingerprintStatus({
    configuredReferences: fpCfg.references,
    onDiskSampleSets: allSets,
    configuredProbes: fpCfg.probes,
    samplesPerProbe: fpCfg.samplesPerProbe,
    samplesByProbe: fpCfg.samplesByProbe,
    valuesPerCheck: fpCfg.valuesPerCheck,
    valuesPerCheckByProbe: fpCfg.valuesPerCheckByProbe,
    maxCallsFactor: fpCfg.maxCallsFactor,
    overrides: fpCfg.modelPrompts,
  });
  const fillPlan = deriveFillPlanFromStatus(matrix, fpCfg);
  const { selfTest, selfTestByCli } = computeDashboardSelfTests(fpCfg, allSets);

  const snapshot: DashboardBaselineSnapshot = {
    matrix,
    fillPlan,
    selfTest,
    selfTestByCli,
  };
  state.signature = signature;
  state.snapshot = snapshot;
  return snapshot;
}

