/**
 * 模型指纹基准样本包（.tar.gz）导出与原子导入（bundle.ts）。
 * 校验逻辑与 Manifest Schema 定义于 bundle-verify.ts。
 */

import { mkdir, rename } from "node:fs/promises";
import { dirname } from "node:path";
import type { LeakGuard } from "../leak-guard";
import { writeJsonPathAtomic } from "../store";
import { sanitizeSegment, type CliKind, type EffortLevel } from "../types";
import {
  assertNoSecretLeak,
  computeBaselinePackageSha256,
  countQualifiedSampleSet,
  FINGERPRINT_BASELINE_KIND,
  FINGERPRINT_BASELINE_SCHEMA_VERSION,
  FingerprintBundleError,
  sha256Hex,
  verifyBaselineBundle,
  type BundleArchiveErrorCode,
  type FingerprintBaselineManifest,
  type FingerprintBaselineProbeEntry,
  type VerifyBaselineOptions,
  type VerifyBaselineResult,
} from "./bundle-verify";
import {
  archiveSampleSetFilePath,
  formatArchiveTimestamp,
  formatEnvironmentId,
  listAllSampleSets,
  readSampleSet,
  readSampleSetAt,
  sampleSetFilePath,
  withProbeFileLock,
} from "./store";
import { packTarGzip, type TarFileEntry } from "./tar-ustar";
import {
  PROBE_IDS,
  type ModelPromptOverrides,
  type ProbeId,
  type ProbeSampleSet,
} from "./types";

export {
  computeBaselinePackageSha256,
  FINGERPRINT_BASELINE_KIND,
  FINGERPRINT_BASELINE_SCHEMA_VERSION,
  FingerprintBundleError,
  verifyBaselineBundle,
  type BundleArchiveErrorCode,
  type FingerprintBaselineManifest,
  type FingerprintBaselineProbeEntry,
  type VerifyBaselineOptions,
  type VerifyBaselineResult,
};

export interface ExportBaselineOptions {
  cli: CliKind;
  model: string;
  effort?: EffortLevel;
  probes?: readonly ProbeId[];
  leakGuard?: LeakGuard;
  modelPrompts?: ModelPromptOverrides;
  now?: Date;
}

export interface ExportBaselineResult {
  filename: string;
  buffer: Buffer;
  manifest: FingerprintBaselineManifest;
  totalValidValues: number;
}

export interface ImportBaselineOptions extends VerifyBaselineOptions {
  dryRun?: boolean;
  now?: Date;
}

export interface ImportBaselineResult {
  manifest: FingerprintBaselineManifest;
  importedProbes: ProbeId[];
  archivedProbes: ProbeId[];
  archivedFiles: string[];
  writtenFiles: string[];
  totalValidValues: number;
  totalAttempts: number;
}

async function resolveExportSampleSets(
  options: ExportBaselineOptions,
): Promise<{ sets: ProbeSampleSet[]; requestedEffort: EffortLevel }> {
  const probeFilter = options.probes && options.probes.length > 0 ? options.probes : PROBE_IDS;
  const preferredEffort = options.effort ?? "low";
  const directSets: ProbeSampleSet[] = [];
  for (const probe of probeFilter) {
    const s = await readSampleSet(options.cli, preferredEffort, options.model, probe);
    if (s && s.attempts.length > 0) directSets.push(s);
  }
  if (directSets.length > 0) {
    return { sets: directSets, requestedEffort: directSets[0]!.requestedEffort ?? preferredEffort };
  }
  const fallbackAll = await listAllSampleSets({ cli: options.cli, model: options.model, probes: probeFilter });
  if (fallbackAll.length === 0) {
    return { sets: [], requestedEffort: preferredEffort };
  }
  const detectedEffort = fallbackAll[0]!.requestedEffort ?? fallbackAll[0]!.appliedEffort;
  const matched = fallbackAll.filter((s) => (s.requestedEffort ?? s.appliedEffort) === detectedEffort);
  return { sets: matched, requestedEffort: detectedEffort };
}

function packProbeForExport(
  set: ProbeSampleSet,
  requestedEffort: EffortLevel,
  mtimeSec: number,
  options: ExportBaselineOptions,
): { entry: FingerprintBaselineProbeEntry; tarEntry: TarFileEntry; appliedEffort: EffortLevel } | null {
  const appliedEffort = set.appliedEffort;
  const finalSet: ProbeSampleSet = {
    ...set,
    requestedEffort,
    effortHonored: requestedEffort === appliedEffort,
    environment: formatEnvironmentId(options.cli, requestedEffort),
  };
  const counts = countQualifiedSampleSet(finalSet, options.modelPrompts);
  if (counts.validValues <= 0) return null;
  const jsonText = `${JSON.stringify(finalSet, null, 2)}\n`;
  assertNoSecretLeak(finalSet, jsonText, options.leakGuard);
  const data = Buffer.from(jsonText, "utf8");
  const file = `samples/${set.probe}.json` as const;
  return {
    appliedEffort,
    tarEntry: { name: file, data, mtimeSec },
    entry: {
      probe: set.probe,
      file,
      sha256: sha256Hex(data),
      byteLength: data.byteLength,
      totalAttempts: finalSet.attempts.length,
      validAttempts: counts.validAttempts,
      validValues: counts.validValues,
      codecId: counts.codecId,
    },
  };
}

export async function exportBaselineBundle(options: ExportBaselineOptions): Promise<ExportBaselineResult> {
  const { sets, requestedEffort } = await resolveExportSampleSets(options);
  const now = options.now ?? new Date();
  const mtimeSec = Math.floor(now.getTime() / 1000);
  const probeEntries: FingerprintBaselineProbeEntry[] = [];
  const tarSampleEntries: TarFileEntry[] = [];
  let appliedEffort: EffortLevel = requestedEffort;
  let totalValidValues = 0;

  for (const probeId of PROBE_IDS) {
    const set = sets.find((s) => s.probe === probeId);
    if (!set) continue;
    const packed = packProbeForExport(set, requestedEffort, mtimeSec, options);
    if (!packed) continue;
    appliedEffort = packed.appliedEffort;
    probeEntries.push(packed.entry);
    tarSampleEntries.push(packed.tarEntry);
    totalValidValues += packed.entry.validValues;
  }

  if (probeEntries.length === 0) {
    throw new FingerprintBundleError(
      5,
      "QUALIFICATION_ZERO_VALID_VALUES",
      `找不到 ${options.cli}/${options.model} (${requestedEffort}) 的可导出合格基准样本`,
    );
  }

  const headerFields: Omit<FingerprintBaselineManifest, "packageSha256"> = {
    schemaVersion: FINGERPRINT_BASELINE_SCHEMA_VERSION,
    kind: FINGERPRINT_BASELINE_KIND,
    exportedAt: now.toISOString(),
    cli: options.cli,
    model: options.model,
    environment: formatEnvironmentId(options.cli, requestedEffort),
    requestedEffort,
    appliedEffort,
    effortHonored: requestedEffort === appliedEffort,
    probes: probeEntries,
  };
  const manifest: FingerprintBaselineManifest = {
    ...headerFields,
    packageSha256: computeBaselinePackageSha256(headerFields),
  };
  const manifestBytes = Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  const buffer = packTarGzip([{ name: "manifest.json", data: manifestBytes, mtimeSec }, ...tarSampleEntries]);
  const filename = `pelican-fp-${options.cli}-${requestedEffort}-${sanitizeSegment(options.model)}.tar.gz`;
  return { filename, buffer, manifest, totalValidValues };
}

async function writeVerifiedProbeToDisk(
  manifest: FingerprintBaselineManifest,
  probeId: ProbeId,
  incoming: ProbeSampleSet,
  timestampCompact: string,
): Promise<{ archivedPath: string | null; writtenPath: string }> {
  const filePath = sampleSetFilePath(manifest.cli, manifest.requestedEffort, manifest.model, probeId);
  return withProbeFileLock(filePath, async () => {
    let archivedPath: string | null = null;
    const existing = await readSampleSetAt(filePath);
    if (existing !== null) {
      archivedPath = archiveSampleSetFilePath(
        manifest.cli,
        manifest.requestedEffort,
        manifest.model,
        probeId,
        timestampCompact,
      );
      await mkdir(dirname(archivedPath), { recursive: true });
      await rename(filePath, archivedPath);
    }
    await writeJsonPathAtomic(filePath, incoming);
    return { archivedPath, writtenPath: filePath };
  });
}

export async function importBaselineBundle(
  compressedBuffer: Buffer,
  options?: ImportBaselineOptions,
): Promise<ImportBaselineResult> {
  const { manifest, sampleSets, totalValidValues, totalAttempts } = verifyBaselineBundle(compressedBuffer, options);
  const importedProbes = manifest.probes.map((p) => p.probe);
  if (options?.dryRun) {
    return { manifest, importedProbes, archivedProbes: [], archivedFiles: [], writtenFiles: [], totalValidValues, totalAttempts };
  }

  const timestampCompact = formatArchiveTimestamp(options?.now ?? new Date());
  const archivedProbes: ProbeId[] = [];
  const archivedFiles: string[] = [];
  const writtenFiles: string[] = [];

  for (const probeId of PROBE_IDS) {
    const incoming = sampleSets.get(probeId);
    if (!incoming) continue;
    const { archivedPath, writtenPath } = await writeVerifiedProbeToDisk(manifest, probeId, incoming, timestampCompact);
    if (archivedPath) {
      archivedProbes.push(probeId);
      archivedFiles.push(archivedPath);
    }
    writtenFiles.push(writtenPath);
  }

  return { manifest, importedProbes, archivedProbes, archivedFiles, writtenFiles, totalValidValues, totalAttempts };
}
