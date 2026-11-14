/**
 * 模型指纹存储层（store.ts）：
 * - 按规范化绝对路径索引的进程内互斥锁 withProbeFileLock(filePath, fn)
 * - 样本集（samples/）、归档（archive/）与核验记录（checks/<yyyy-mm>/）的原子读写
 * - 经 Probe.extractAttempt() 实时解码及 rescoreCheckRecord 时的 archive/ 自动回退
 */

import { mkdir, readdir, readFile, rename } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { resolveModelFingerprintConfig, type AppConfig, type ModelFingerprintConfig } from "../config";
import { fingerprintArchiveRoot, fingerprintChecksRoot, fingerprintSamplesRoot } from "../paths";
import { writeJsonPathAtomic } from "../store";
import { sanitizeSegment, type CliKind, type EffortLevel } from "../types";
import { getProbe } from "./probes/index";
import { scoreVerificationQuery } from "./score";
import { capAndSliceReferencePool, extractValidValuesFromSampleSet } from "./self-test";
import {
  DEFAULT_VALUES_PER_CHECK,
  MIN_SAMPLES_PER_PROBE,
  resolveProbeTargetSamples,
  resolveProbeValuesPerCheck,
  type CheckRescoreEntry,
  type FingerprintCheckRecord,
  type ModelPromptOverrides,
  type ProbeAttempt,
  type ProbeId,
  type ProbeSampleSet,
  type QualifiedProbeValue,
} from "./types";

const fileLockChains = new Map<string, Promise<void>>();

/**
 * 按规范化绝对路径串行化同一文件上的读—改—写操作，防止并发覆盖。
 */
export async function withProbeFileLock<T>(filePath: string, fn: () => Promise<T>): Promise<T> {
  const key = resolve(filePath);
  const previous = fileLockChains.get(key) ?? Promise.resolve();
  let release!: () => void;
  const current = new Promise<void>((res) => {
    release = res;
  });
  const chained = previous.then(() => current);
  fileLockChains.set(key, chained);

  await previous;
  try {
    return await fn();
  } finally {
    release();
    if (fileLockChains.get(key) === chained) fileLockChains.delete(key);
  }
}

export function formatEnvironmentId(cli: CliKind, appliedEffort: EffortLevel): string {
  return `${cli}-${appliedEffort}`;
}

export function sampleSetFilePath(
  cli: CliKind,
  appliedEffort: EffortLevel,
  model: string,
  probe: ProbeId,
): string {
  return join(
    fingerprintSamplesRoot(),
    formatEnvironmentId(cli, appliedEffort),
    sanitizeSegment(model),
    `${probe}.json`,
  );
}

export function formatArchiveTimestamp(at: Date = new Date()): string {
  return at.toISOString().replace(/[-:.]/g, "");
}

export function archiveSampleSetDir(cli: CliKind, appliedEffort: EffortLevel, model: string): string {
  return join(fingerprintArchiveRoot(), formatEnvironmentId(cli, appliedEffort), sanitizeSegment(model));
}

export function archiveSampleSetFilePath(
  cli: CliKind,
  appliedEffort: EffortLevel,
  model: string,
  probe: ProbeId,
  timestampCompact: string = formatArchiveTimestamp(),
): string {
  return join(archiveSampleSetDir(cli, appliedEffort, model), `${probe}.${timestampCompact}.json`);
}

export async function readSampleSetAt(filePath: string): Promise<ProbeSampleSet | null> {
  try {
    return JSON.parse(await readFile(filePath, "utf8")) as ProbeSampleSet;
  } catch {
    return null;
  }
}

export async function readSampleSet(
  cli: CliKind,
  appliedEffort: EffortLevel,
  model: string,
  probe: ProbeId,
): Promise<ProbeSampleSet | null> {
  return readSampleSetAt(sampleSetFilePath(cli, appliedEffort, model, probe));
}

export async function saveSampleSet(sampleSet: ProbeSampleSet): Promise<string> {
  const filePath = sampleSetFilePath(sampleSet.cli, sampleSet.appliedEffort, sampleSet.model, sampleSet.probe);
  await withProbeFileLock(filePath, async () => {
    await writeJsonPathAtomic(filePath, sampleSet);
  });
  return filePath;
}

export async function appendSampleAttempt(
  meta: {
    probe: ProbeId;
    cli: CliKind;
    model: string;
    requestedEffort: EffortLevel;
    appliedEffort: EffortLevel;
    effortHonored: boolean;
  },
  attempt: ProbeAttempt,
): Promise<ProbeSampleSet> {
  const filePath = sampleSetFilePath(meta.cli, meta.appliedEffort, meta.model, meta.probe);
  return withProbeFileLock(filePath, async () => {
    const existing = await readSampleSetAt(filePath);
    const updated: ProbeSampleSet = existing
      ? {
          ...existing,
          environment: formatEnvironmentId(meta.cli, meta.appliedEffort),
          requestedEffort: meta.requestedEffort,
          appliedEffort: meta.appliedEffort,
          effortHonored: meta.effortHonored,
          attempts: [...existing.attempts, attempt],
        }
      : {
          probe: meta.probe,
          cli: meta.cli,
          environment: formatEnvironmentId(meta.cli, meta.appliedEffort),
          model: meta.model,
          requestedEffort: meta.requestedEffort,
          appliedEffort: meta.appliedEffort,
          effortHonored: meta.effortHonored,
          attempts: [attempt],
        };
    await writeJsonPathAtomic(filePath, updated);
    return updated;
  });
}

export async function mutateSampleSetFlags(params: {
  cli: CliKind;
  appliedEffort: EffortLevel;
  model: string;
  probe: ProbeId;
  exclude?: readonly string[];
  include?: readonly string[];
}): Promise<ProbeSampleSet | null> {
  const filePath = sampleSetFilePath(params.cli, params.appliedEffort, params.model, params.probe);
  const excludeSet = new Set(params.exclude ?? []);
  const includeSet = new Set(params.include ?? []);
  return withProbeFileLock(filePath, async () => {
    const existing = await readSampleSetAt(filePath);
    if (existing === null) return null;
    const attempts = existing.attempts.map((attempt) => {
      const next = { ...attempt };
      if (excludeSet.has(next.reqId)) next.excluded = true;
      else if (includeSet.has(next.reqId)) delete next.excluded;
      return next;
    });
    const updated: ProbeSampleSet = { ...existing, attempts };
    await writeJsonPathAtomic(filePath, updated);
    return updated;
  });
}

export async function resetSampleSetToArchive(params: {
  cli: CliKind;
  appliedEffort: EffortLevel;
  model: string;
  probe: ProbeId;
  now?: Date;
}): Promise<string | null> {
  const filePath = sampleSetFilePath(params.cli, params.appliedEffort, params.model, params.probe);
  return withProbeFileLock(filePath, async () => {
    const existing = await readSampleSetAt(filePath);
    if (existing === null) return null;
    const archivePath = archiveSampleSetFilePath(
      params.cli,
      params.appliedEffort,
      params.model,
      params.probe,
      formatArchiveTimestamp(params.now ?? new Date()),
    );
    await mkdir(dirname(archivePath), { recursive: true });
    await rename(filePath, archivePath);
    return archivePath;
  });
}

export async function listAllSampleSets(filter?: {
  cli?: CliKind;
  appliedEffort?: EffortLevel;
  model?: string;
  probes?: readonly ProbeId[];
}): Promise<ProbeSampleSet[]> {
  const root = fingerprintSamplesRoot();
  const envDirs = await safeReaddirDirs(root);
  const probeFilter = filter?.probes ? new Set(filter.probes) : null;
  const results: ProbeSampleSet[] = [];

  for (const envName of envDirs) {
    const modelDirs = await safeReaddirDirs(join(root, envName));
    for (const modelDir of modelDirs) {
      const files = await safeReaddirFiles(join(root, envName, modelDir));
      for (const file of files) {
        if (!file.endsWith(".json")) continue;
        const set = await readSampleSetAt(join(root, envName, modelDir, file));
        if (set === null) continue;
        if (filter?.cli !== undefined && set.cli !== filter.cli) continue;
        if (
          filter?.appliedEffort !== undefined &&
          set.appliedEffort !== filter.appliedEffort
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

export function extractValidCanonicalValues(
  sampleSet: ProbeSampleSet,
  samplesPerProbe: number,
  valuesPerCheck: number = DEFAULT_VALUES_PER_CHECK,
  modelPrompts?: ModelPromptOverrides,
  samplesByProbe?: Partial<Record<ProbeId, number>>,
): QualifiedProbeValue[] {
  const targetForProbe = resolveProbeTargetSamples(sampleSet.probe, { samplesPerProbe, samplesByProbe });
  const raw = extractValidValuesFromSampleSet(sampleSet, modelPrompts);
  return capAndSliceReferencePool(raw, targetForProbe, valuesPerCheck);
}

export function buildSampleSetsByKeyMap(sampleSets: readonly ProbeSampleSet[]): Map<string, ProbeSampleSet> {
  return new Map(sampleSets.map((s) => [`${s.cli}:${s.model}:${s.probe}`, s]));
}

export function buildSampleSetsByModelMap(
  sampleSets: readonly ProbeSampleSet[],
): Map<string, Partial<Record<ProbeId, ProbeSampleSet>>> {
  const byModel = new Map<string, Partial<Record<ProbeId, ProbeSampleSet>>>();
  for (const set of sampleSets) {
    const entry = byModel.get(set.model) ?? {};
    entry[set.probe] = set;
    byModel.set(set.model, entry);
  }
  return byModel;
}

/**
 * 读取基准样本集；若 samples/ 下不存在或有效合格值少于探针目标数，
 * 则从 archive/ 按时间戳倒序查找最新满额的归档样本集。
 */
export async function readReferenceSampleSetWithArchiveFallback(params: {
  cli: CliKind; appliedEffort: EffortLevel; model: string; probe: ProbeId;
  samplesPerProbe: number; samplesByProbe?: Partial<Record<ProbeId, number>>;
  valuesPerCheck?: number; valuesPerCheckByProbe?: Partial<Record<ProbeId, number>>;
  modelPrompts?: ModelPromptOverrides;
}): Promise<{ sampleSet: ProbeSampleSet | null; fromArchive: boolean; archiveFile?: string }> {
  const valuesPerCheck = resolveProbeValuesPerCheck(params.probe, params);
  const targetForProbe = resolveProbeTargetSamples(params.probe, {
    samplesPerProbe: params.samplesPerProbe, samplesByProbe: params.samplesByProbe,
  });
  const current = await readSampleSet(params.cli, params.appliedEffort, params.model, params.probe);
  if (current !== null) {
    const valid = extractValidCanonicalValues(current, targetForProbe, valuesPerCheck, params.modelPrompts);
    if (valid.length >= targetForProbe) return { sampleSet: current, fromArchive: false };
  }

  const archiveDir = archiveSampleSetDir(params.cli, params.appliedEffort, params.model);
  const prefix = `${params.probe}.`;
  const files = (await safeReaddirFiles(archiveDir))
    .filter((name) => name.startsWith(prefix) && name.endsWith(".json"))
    .sort()
    .reverse();

  for (const name of files) {
    const candidatePath = join(archiveDir, name);
    const archived = await readSampleSetAt(candidatePath);
    if (archived === null) continue;
    const valid = extractValidCanonicalValues(archived, targetForProbe, valuesPerCheck, params.modelPrompts);
    if (valid.length >= targetForProbe) {
      return { sampleSet: archived, fromArchive: true, archiveFile: candidatePath };
    }
  }
  return { sampleSet: current, fromArchive: false };
}

export function formatCheckId(cli: CliKind, profile: string, at: Date = new Date(), model?: string): string {
  const iso = at.toISOString();
  const base = `${iso.slice(0, 10).replace(/-/g, "")}-${iso.slice(11, 19).replace(/:/g, "")}-${cli}-${sanitizeSegment(profile)}`;
  return model ? `${base}-${sanitizeSegment(model)}` : base;
}

export function checkRecordFilePath(checkId: string, createdAtIso?: string): string {
  const month =
    createdAtIso !== undefined && /^\d{4}-\d{2}/.test(createdAtIso)
      ? createdAtIso.slice(0, 7)
      : /^\d{8}-/.test(checkId)
        ? `${checkId.slice(0, 4)}-${checkId.slice(4, 6)}`
        : new Date().toISOString().slice(0, 7);
  return join(fingerprintChecksRoot(), month, `${checkId}.json`);
}

export async function saveCheckRecord(record: FingerprintCheckRecord): Promise<string> {
  const filePath = checkRecordFilePath(record.checkId, record.createdAt);
  await withProbeFileLock(filePath, async () => {
    await writeJsonPathAtomic(filePath, record);
  });
  return filePath;
}

export async function readCheckRecord(
  checkId: string,
): Promise<{ record: FingerprintCheckRecord; filePath: string } | null> {
  if (!/^[A-Za-z0-9._-]+$/.test(checkId)) return null;
  const directPath = checkRecordFilePath(checkId);
  const direct = await readCheckRecordAt(directPath);
  if (direct !== null) return { record: direct, filePath: directPath };

  const root = fingerprintChecksRoot();
  const months = (await safeReaddirDirs(root)).sort().reverse();
  for (const month of months) {
    const candidatePath = join(root, month, `${checkId}.json`);
    const found = await readCheckRecordAt(candidatePath);
    if (found !== null) return { record: found, filePath: candidatePath };
  }
  return null;
}

async function readCheckRecordAt(filePath: string): Promise<FingerprintCheckRecord | null> {
  try {
    return JSON.parse(await readFile(filePath, "utf8")) as FingerprintCheckRecord;
  } catch {
    return null;
  }
}

export async function listCheckRecords(limit: number = 50): Promise<FingerprintCheckRecord[]> {
  const root = fingerprintChecksRoot();
  const months = (await safeReaddirDirs(root)).sort().reverse();
  const records: FingerprintCheckRecord[] = [];
  for (const month of months) {
    const files = (await safeReaddirFiles(join(root, month)))
      .filter((name) => name.endsWith(".json"))
      .sort()
      .reverse();
    for (const file of files) {
      const record = await readCheckRecordAt(join(root, month, file));
      if (record !== null) {
        records.push(record);
        if (records.length >= limit) return records;
      }
    }
  }
  return records;
}

/**
 * 离线重算历史核验记录（0 次 CLI 调用）：
 * 对 probeAttempts 原文按最新 Probe & PromptCodec 重新提取标准值，
 * 并读取 samples/（缺失或未满额时自动回退 archive/）重新计算分数并追加到 rescores[]。
 */
export async function rescoreCheckRecord(
  config: AppConfig,
  checkId: string,
): Promise<FingerprintCheckRecord> {
  const initialLoaded = await readCheckRecord(checkId);
  if (initialLoaded === null) throw new Error(`找不到核验记录：${checkId}`);
  return withProbeFileLock(initialLoaded.filePath, async () => {
    const loaded = await readCheckRecordAt(initialLoaded.filePath);
    if (loaded === null) throw new Error(`找不到核验记录：${checkId}`);
    const fpCfg = resolveModelFingerprintConfig(config);
    const queryValuesByProbe = decodeRecordedCheckAttempts(loaded, fpCfg);
    const referenceSampleSets = await loadRescoreReferenceSets(fpCfg, loaded);
    const sampleSetsByModel = buildSampleSetsByModelMap(referenceSampleSets);
    const effectiveByProbe: Partial<Record<ProbeId, number>> = { ...fpCfg.samplesByProbe };
    for (const p of loaded.selectedProbes) {
      const cfgTarget = resolveProbeTargetSamples(p, fpCfg);
      const cfgCheck = resolveProbeValuesPerCheck(p, fpCfg);
      const declSet = sampleSetsByModel.get(loaded.declaredModel)?.[p];
      const avail = declSet ? extractValidCanonicalValues(declSet, cfgTarget, cfgCheck, fpCfg.modelPrompts).length : 0;
      if (avail >= MIN_SAMPLES_PER_PROBE && avail < cfgTarget) effectiveByProbe[p] = avail;
    }
    const scoreOut = scoreVerificationQuery({
      declaredModel: loaded.declaredModel, selectedProbes: loaded.selectedProbes,
      queryValuesByProbe, sampleSetsByModel,
      samplesPerProbe: fpCfg.samplesPerProbe, samplesByProbe: effectiveByProbe,
      valuesPerCheck: fpCfg.valuesPerCheck, valuesPerCheckByProbe: fpCfg.valuesPerCheckByProbe,
      targetAccuracy: fpCfg.targetAccuracy, overrides: fpCfg.modelPrompts,
    });

    const entry: CheckRescoreEntry = { rescoredAt: new Date().toISOString(), ...scoreOut };
    const updated: FingerprintCheckRecord = { ...loaded, rescores: [...loaded.rescores, entry] };
    await writeJsonPathAtomic(initialLoaded.filePath, updated);
    return updated;
  });
}

function decodeRecordedCheckAttempts(
  record: FingerprintCheckRecord,
  fpCfg: ModelFingerprintConfig,
): Partial<Record<ProbeId, string[]>> {
  const queryValuesByProbe: Partial<Record<ProbeId, string[]>> = {};
  for (const probeId of record.selectedProbes) {
    const attempts = record.probeAttempts[probeId] ?? [];
    const probe = getProbe(probeId);
    const activeCodec = probe.resolveCodec({ cli: record.cli, model: record.declaredModel }, fpCfg.modelPrompts);
    const cfgCheck = resolveProbeValuesPerCheck(probeId, fpCfg);
    const minNeeded = fpCfg.valuesPerCheckByProbe?.[probeId] !== undefined
      ? Math.min(cfgCheck, activeCodec.valuesPerCall)
      : fpCfg.valuesPerCheck;
    const maxBatch = Math.max(cfgCheck, activeCodec.valuesPerCall);
    const collected: string[] = [];
    for (const attempt of attempts) {
      if (attempt.excluded === true || attempt.outcome !== "ok") continue;
      for (const val of probe.extractAttempt(attempt, activeCodec).values) {
        if (collected.length < maxBatch) collected.push(val);
      }
    }
    if (collected.length >= minNeeded) queryValuesByProbe[probeId] = collected.slice(0, maxBatch);
  }
  return queryValuesByProbe;
}

async function loadRescoreReferenceSets(
  fpCfg: ModelFingerprintConfig,
  record: FingerprintCheckRecord,
): Promise<ProbeSampleSet[]> {
  const envEffort = record.appliedEffort;
  const currentSets = await listAllSampleSets({ cli: record.cli, appliedEffort: envEffort });
  const effortByModel = new Map<string, EffortLevel>();
  for (const set of currentSets) effortByModel.set(set.model, set.appliedEffort);
  effortByModel.set(record.declaredModel, envEffort);

  const models = new Set<string>([
    record.declaredModel,
    ...fpCfg.references.filter((r) => r.cli === record.cli).map((r) => r.model),
    ...currentSets.map((s) => s.model),
    ...record.comparisons.map((c) => c.candidateModel),
    ...record.uncomparedModels.map((u) => u.model),
  ]);

  const resolved: ProbeSampleSet[] = [];
  for (const model of models) {
    const appliedEffort = effortByModel.get(model) ?? envEffort;
    for (const probe of record.selectedProbes) {
      const { sampleSet } = await readReferenceSampleSetWithArchiveFallback({
        cli: record.cli, appliedEffort, model, probe,
        samplesPerProbe: fpCfg.samplesPerProbe, samplesByProbe: fpCfg.samplesByProbe,
        valuesPerCheck: fpCfg.valuesPerCheck, valuesPerCheckByProbe: fpCfg.valuesPerCheckByProbe,
        modelPrompts: fpCfg.modelPrompts,
      });
      if (sampleSet !== null) resolved.push(sampleSet);
    }
  }
  return resolved;
}

async function safeReaddirDirs(dirPath: string): Promise<string[]> {
  try {
    const entries = await readdir(dirPath, { withFileTypes: true });
    return entries.filter((e) => e.isDirectory()).map((e) => e.name).sort();
  } catch {
    return [];
  }
}

async function safeReaddirFiles(dirPath: string): Promise<string[]> {
  try {
    const entries = await readdir(dirPath, { withFileTypes: true });
    return entries.filter((e) => e.isFile()).map((e) => e.name).sort();
  } catch {
    return [];
  }
}
