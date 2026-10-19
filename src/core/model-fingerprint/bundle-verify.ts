/**
 * 模型指纹基准样本包（.tar.gz）Manifest Schema 与 5 层防篡改/防泄漏/合格性重提取校验器（bundle-verify.ts）。
 */

import { createHash } from "node:crypto";
import type { LeakGuard } from "../leak-guard";
import { scanText } from "../sync/leak-scan";
import { CLI_KINDS, EFFORT_LEVELS, type CliKind, type EffortLevel } from "../types";
import { getProbe } from "./probes/index";
import { formatEnvironmentId } from "./store";
import {
  FingerprintBundleError,
  unpackTarGzip,
  type BundleArchiveErrorCode,
} from "./tar-ustar";
import {
  isProbeId,
  PROBE_OUTCOMES,
  type ModelPromptOverrides,
  type ProbeAttempt,
  type ProbeId,
  type ProbeSampleSet,
} from "./types";

export { FingerprintBundleError, type BundleArchiveErrorCode };

export const FINGERPRINT_BASELINE_SCHEMA_VERSION = 1 as const;
export const FINGERPRINT_BASELINE_KIND = "pelican-fingerprint-baseline" as const;

export interface FingerprintBaselineProbeEntry {
  probe: ProbeId;
  file: `samples/${ProbeId}.json`;
  sha256: string;
  byteLength: number;
  totalAttempts: number;
  validAttempts: number;
  validValues: number;
  codecId: string;
}

export interface FingerprintBaselineManifest {
  schemaVersion: typeof FINGERPRINT_BASELINE_SCHEMA_VERSION;
  kind: typeof FINGERPRINT_BASELINE_KIND;
  exportedAt: string;
  cli: CliKind;
  model: string;
  environment: string;
  requestedEffort: EffortLevel;
  appliedEffort: EffortLevel;
  effortHonored: boolean;
  probes: FingerprintBaselineProbeEntry[];
  packageSha256: string;
}

export interface VerifyBaselineOptions {
  leakGuard?: LeakGuard;
  modelPrompts?: ModelPromptOverrides;
}

export interface VerifyBaselineResult {
  manifest: FingerprintBaselineManifest;
  sampleSets: Map<ProbeId, ProbeSampleSet>;
  totalValidValues: number;
  totalAttempts: number;
}

export function sha256Hex(input: Buffer | string): string {
  return createHash("sha256").update(input).digest("hex");
}

export function computeBaselinePackageSha256(
  input: Omit<FingerprintBaselineManifest, "packageSha256">,
): string {
  const canonicalPayload = JSON.stringify({
    schemaVersion: input.schemaVersion,
    kind: input.kind,
    exportedAt: input.exportedAt,
    cli: input.cli,
    model: input.model,
    environment: input.environment,
    requestedEffort: input.requestedEffort,
    appliedEffort: input.appliedEffort,
    effortHonored: input.effortHonored,
    probes: input.probes.map((p) => ({
      probe: p.probe,
      file: p.file,
      sha256: p.sha256,
      byteLength: p.byteLength,
      totalAttempts: p.totalAttempts,
      validAttempts: p.validAttempts,
      validValues: p.validValues,
      codecId: p.codecId,
    })),
  });
  return sha256Hex(canonicalPayload);
}

function isCliKind(v: unknown): v is CliKind {
  return typeof v === "string" && (CLI_KINDS as readonly string[]).includes(v);
}

function isEffortLevel(v: unknown): v is EffortLevel {
  return typeof v === "string" && (EFFORT_LEVELS as readonly string[]).includes(v);
}

export function countQualifiedSampleSet(
  sampleSet: ProbeSampleSet,
  modelPrompts?: ModelPromptOverrides,
): { validAttempts: number; validValues: number; codecId: string } {
  const probe = getProbe(sampleSet.probe);
  const activeCodec = probe.resolveCodec({ cli: sampleSet.cli, model: sampleSet.model }, modelPrompts);
  let validAttempts = 0;
  let validValues = 0;
  for (const attempt of sampleSet.attempts) {
    if (attempt.excluded === true || attempt.outcome !== "ok") continue;
    const extracted = probe.extractAttempt(attempt, activeCodec);
    if (extracted.values.length > 0) {
      validAttempts += 1;
      validValues += extracted.values.length;
    }
  }
  return { validAttempts, validValues, codecId: activeCodec.id };
}

export function assertNoSecretLeak(
  sampleSet: ProbeSampleSet,
  rawJsonText: string,
  leakGuard?: LeakGuard,
): void {
  const fileScan = scanText(rawJsonText, leakGuard);
  if (fileScan.leaked) {
    throw new FingerprintBundleError(
      4,
      "SAMPLE_SET_SECRET_LEAK_DETECTED",
      `探针 ${sampleSet.probe} 样本文件触发安全拦截（${fileScan.reason}）`,
      { probe: sampleSet.probe, reason: fileScan.reason },
    );
  }
  for (const attempt of sampleSet.attempts) {
    if (attempt.outcome === "leak-blocked" && attempt.rawText !== "") {
      throw new FingerprintBundleError(
        4,
        "SAMPLE_SET_SECRET_LEAK_DETECTED",
        `探针 ${sampleSet.probe} 记录 ${attempt.reqId} 标记为 leak-blocked 但仍含原文`,
      );
    }
    const textScan = scanText(attempt.rawText, leakGuard);
    if (textScan.leaked) {
      throw new FingerprintBundleError(
        4,
        "SAMPLE_SET_SECRET_LEAK_DETECTED",
        `探针 ${sampleSet.probe} 记录 ${attempt.reqId} 含敏感内容（${textScan.reason}）`,
      );
    }
  }
}

function isPositiveInt(val: unknown): val is number {
  return typeof val === "number" && Number.isInteger(val) && val > 0;
}

function validateProbeEntrySchema(raw: unknown, seenProbes: Set<string>): FingerprintBaselineProbeEntry {
  if (typeof raw !== "object" || raw === null) {
    throw new FingerprintBundleError(2, "MANIFEST_SCHEMA_INVALID", "manifest.probes 条目必须为对象");
  }
  const obj = raw as Record<string, unknown>;
  const probe = obj.probe;
  if (typeof probe !== "string" || !isProbeId(probe) || seenProbes.has(probe)) {
    throw new FingerprintBundleError(2, "MANIFEST_SCHEMA_INVALID", `manifest.probes 含非法或重复探针：${String(probe)}`);
  }
  seenProbes.add(probe);
  const expectedFile = `samples/${probe}.json` as const;
  const countsValid =
    isPositiveInt(obj.byteLength) &&
    isPositiveInt(obj.totalAttempts) &&
    isPositiveInt(obj.validAttempts) &&
    isPositiveInt(obj.validValues) &&
    obj.totalAttempts >= obj.validAttempts;
  if (
    obj.file !== expectedFile ||
    typeof obj.sha256 !== "string" ||
    !/^[0-9a-f]{64}$/.test(obj.sha256) ||
    !countsValid ||
    typeof obj.codecId !== "string" ||
    !obj.codecId.trim()
  ) {
    throw new FingerprintBundleError(2, "MANIFEST_SCHEMA_INVALID", `探针 ${probe} 的 manifest 条目字段不合法`);
  }
  return {
    probe,
    file: expectedFile,
    sha256: obj.sha256,
    byteLength: obj.byteLength as number,
    totalAttempts: obj.totalAttempts as number,
    validAttempts: obj.validAttempts as number,
    validValues: obj.validValues as number,
    codecId: obj.codecId,
  };
}

function validateManifestHeaderFields(obj: Record<string, unknown>): string {
  const model = typeof obj.model === "string" ? obj.model.trim() : "";
  const valid =
    obj.schemaVersion === FINGERPRINT_BASELINE_SCHEMA_VERSION &&
    obj.kind === FINGERPRINT_BASELINE_KIND &&
    typeof obj.exportedAt === "string" &&
    !Number.isNaN(Date.parse(obj.exportedAt)) &&
    isCliKind(obj.cli) &&
    model.length > 0 &&
    model.length <= 128 &&
    isEffortLevel(obj.requestedEffort) &&
    isEffortLevel(obj.appliedEffort) &&
    typeof obj.effortHonored === "boolean" &&
    obj.effortHonored === (obj.requestedEffort === obj.appliedEffort) &&
    obj.environment === formatEnvironmentId(obj.cli, obj.requestedEffort) &&
    Array.isArray(obj.probes) &&
    obj.probes.length > 0 &&
    typeof obj.packageSha256 === "string" &&
    /^[0-9a-f]{64}$/.test(obj.packageSha256);
  if (!valid) {
    throw new FingerprintBundleError(2, "MANIFEST_SCHEMA_INVALID", "manifest.json Schema 校验失败");
  }
  return model;
}

function parseAndValidateManifest(
  manifestBytes: Buffer,
  archiveEntries: Map<string, Buffer>,
): FingerprintBaselineManifest {
  let parsed: unknown;
  try {
    parsed = JSON.parse(manifestBytes.toString("utf8"));
  } catch {
    throw new FingerprintBundleError(2, "MANIFEST_JSON_INVALID", "manifest.json 不是合法的 JSON");
  }
  if (typeof parsed !== "object" || parsed === null) {
    throw new FingerprintBundleError(2, "MANIFEST_SCHEMA_INVALID", "manifest.json 顶层必须为对象");
  }
  const obj = parsed as Record<string, unknown>;
  const model = validateManifestHeaderFields(obj);
  const seenProbes = new Set<string>();
  const probes = (obj.probes as unknown[]).map((item) => validateProbeEntrySchema(item, seenProbes));
  const archiveSampleFiles = [...archiveEntries.keys()].filter((k) => k !== "manifest.json").sort();
  const manifestFiles = probes.map((p) => p.file).sort();
  if (archiveSampleFiles.join(",") !== manifestFiles.join(",")) {
    throw new FingerprintBundleError(2, "MANIFEST_FILE_LIST_MISMATCH", "归档内样本文件列表与 manifest.probes 不一致");
  }
  const manifest: FingerprintBaselineManifest = {
    schemaVersion: FINGERPRINT_BASELINE_SCHEMA_VERSION,
    kind: FINGERPRINT_BASELINE_KIND,
    exportedAt: obj.exportedAt as string,
    cli: obj.cli as CliKind,
    model,
    environment: obj.environment as string,
    requestedEffort: obj.requestedEffort as EffortLevel,
    appliedEffort: obj.appliedEffort as EffortLevel,
    effortHonored: obj.effortHonored as boolean,
    probes,
    packageSha256: obj.packageSha256 as string,
  };
  if (computeBaselinePackageSha256(manifest) !== manifest.packageSha256) {
    throw new FingerprintBundleError(2, "MANIFEST_PACKAGE_HASH_MISMATCH", "manifest.json 的 packageSha256 校验失败，清单已被篡改");
  }
  return manifest;
}

function validateAttemptItem(raw: unknown, seenReqIds: Set<string>, probe: ProbeId): ProbeAttempt {
  if (typeof raw !== "object" || raw === null) {
    throw new FingerprintBundleError(4, "SAMPLE_SET_ATTEMPT_INVALID", `探针 ${probe} 含非对象 attempt`);
  }
  const a = raw as Record<string, unknown>;
  const reqId = typeof a.reqId === "string" ? a.reqId.trim() : "";
  if (
    !reqId ||
    seenReqIds.has(reqId) ||
    typeof a.at !== "string" ||
    Number.isNaN(Date.parse(a.at)) ||
    typeof a.profile !== "string" ||
    !a.profile.trim() ||
    !isPositiveInt(a.valuesPerCall) ||
    typeof a.outcome !== "string" ||
    !(PROBE_OUTCOMES as readonly string[]).includes(a.outcome) ||
    typeof a.rawText !== "string" ||
    typeof a.durationMs !== "number" ||
    a.durationMs < 0 ||
    typeof a.cliVersion !== "string"
  ) {
    throw new FingerprintBundleError(4, "SAMPLE_SET_ATTEMPT_INVALID", `探针 ${probe} 的 attempt(${reqId}) 字段不合法`);
  }
  seenReqIds.add(reqId);
  return a as unknown as ProbeAttempt;
}

function parseSampleSetAndCheckMeta(
  rawText: string,
  entry: FingerprintBaselineProbeEntry,
  manifest: FingerprintBaselineManifest,
): ProbeSampleSet {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    throw new FingerprintBundleError(4, "SAMPLE_SET_JSON_INVALID", `${entry.file} 不是合法的 JSON`);
  }
  if (typeof parsed !== "object" || parsed === null) {
    throw new FingerprintBundleError(4, "SAMPLE_SET_META_MISMATCH", `${entry.file} 顶层必须为对象`);
  }
  const s = parsed as Record<string, unknown>;
  if (
    s.probe !== entry.probe ||
    s.cli !== manifest.cli ||
    s.model !== manifest.model ||
    s.environment !== manifest.environment ||
    s.requestedEffort !== manifest.requestedEffort ||
    s.appliedEffort !== manifest.appliedEffort ||
    s.effortHonored !== manifest.effortHonored ||
    !Array.isArray(s.attempts) ||
    s.attempts.length !== entry.totalAttempts
  ) {
    throw new FingerprintBundleError(4, "SAMPLE_SET_META_MISMATCH", `${entry.file} 元数据与 manifest.json 不一致`);
  }
  const seenReqIds = new Set<string>();
  for (const item of s.attempts) validateAttemptItem(item, seenReqIds, entry.probe);
  return parsed as ProbeSampleSet;
}

function verifySingleProbeFile(
  entry: FingerprintBaselineProbeEntry,
  rawBytes: Buffer,
  manifest: FingerprintBaselineManifest,
  options?: VerifyBaselineOptions,
): ProbeSampleSet {
  if (rawBytes.byteLength !== entry.byteLength) {
    throw new FingerprintBundleError(3, "PROBE_FILE_BYTE_LENGTH_MISMATCH", `${entry.file} 字节长度与 manifest 不匹配`);
  }
  if (sha256Hex(rawBytes) !== entry.sha256) {
    throw new FingerprintBundleError(3, "PROBE_FILE_SHA256_MISMATCH", `${entry.file} 的 SHA-256 校验失败，内容已被篡改`);
  }
  const rawText = rawBytes.toString("utf8");
  const sampleSet = parseSampleSetAndCheckMeta(rawText, entry, manifest);
  assertNoSecretLeak(sampleSet, rawText, options?.leakGuard);

  const counts = countQualifiedSampleSet(sampleSet, options?.modelPrompts);
  if (counts.validValues <= 0) {
    throw new FingerprintBundleError(5, "QUALIFICATION_ZERO_VALID_VALUES", `${entry.file} 未提取出任何合格样本值`);
  }
  if (counts.validAttempts !== entry.validAttempts || counts.validValues !== entry.validValues) {
    throw new FingerprintBundleError(
      5,
      "QUALIFICATION_COUNT_MISMATCH",
      `${entry.file} 实时提取合格数（${counts.validValues} 条）与 manifest 声明（${entry.validValues} 条）不一致`,
    );
  }
  return sampleSet;
}

export function verifyBaselineBundle(
  compressedBuffer: Buffer,
  options?: VerifyBaselineOptions,
): VerifyBaselineResult {
  const archiveEntries = unpackTarGzip(compressedBuffer);
  const manifestBytes = archiveEntries.get("manifest.json")!;
  const manifest = parseAndValidateManifest(manifestBytes, archiveEntries);
  const sampleSets = new Map<ProbeId, ProbeSampleSet>();
  let totalValidValues = 0;
  let totalAttempts = 0;

  for (const probeEntry of manifest.probes) {
    const rawBytes = archiveEntries.get(probeEntry.file);
    if (!rawBytes) {
      throw new FingerprintBundleError(2, "MANIFEST_FILE_LIST_MISMATCH", `缺少探针文件：${probeEntry.file}`);
    }
    const verified = verifySingleProbeFile(probeEntry, rawBytes, manifest, options);
    sampleSets.set(probeEntry.probe, verified);
    totalValidValues += probeEntry.validValues;
    totalAttempts += probeEntry.totalAttempts;
  }

  return { manifest, sampleSets, totalValidValues, totalAttempts };
}
