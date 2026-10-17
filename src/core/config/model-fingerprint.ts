/**
 * modelFingerprint 配置段解析与默认值
 */

import {
  DEFAULT_CHECK_ATTEMPTS,
  DEFAULT_FINGERPRINT_CONCURRENCY,
  DEFAULT_FINGERPRINT_EFFORT,
  DEFAULT_MAX_CALLS_FACTOR,
  DEFAULT_SAMPLES_BY_PROBE,
  DEFAULT_SAMPLES_PER_PROBE,
  DEFAULT_TARGET_ACCURACY,
  DEFAULT_VALUES_PER_CHECK,
  MAX_FINGERPRINT_CONCURRENCY,
  MIN_SAMPLES_PER_PROBE,
  isProbeId,
  type FingerprintReferenceTarget,
  type ModelPromptOverride,
  type ModelPromptOverrides,
  type ProbeId,
} from "../model-fingerprint/types";
import { asRecord, isCliKind, isEffortLevel, optionalNumber, optionalString } from "./parsers-common";
import type { ModelFingerprintConfig } from "./types";

export const DEFAULT_MODEL_FINGERPRINT_CONFIG: ModelFingerprintConfig = {
  enabled: false,
  effort: DEFAULT_FINGERPRINT_EFFORT,
  samplesPerProbe: DEFAULT_SAMPLES_PER_PROBE,
  samplesByProbe: { ...DEFAULT_SAMPLES_BY_PROBE },
  probes: [],
  valuesPerCheck: DEFAULT_VALUES_PER_CHECK,
  checkAttempts: DEFAULT_CHECK_ATTEMPTS,
  targetAccuracy: DEFAULT_TARGET_ACCURACY,
  maxCallsFactor: DEFAULT_MAX_CALLS_FACTOR,
  concurrency: DEFAULT_FINGERPRINT_CONCURRENCY,
  references: [],
  modelPrompts: {},
};

export function resolveModelFingerprintConfig(
  config?: { modelFingerprint?: ModelFingerprintConfig },
): ModelFingerprintConfig {
  return config?.modelFingerprint ?? DEFAULT_MODEL_FINGERPRINT_CONFIG;
}

function parsePositiveInt(
  raw: unknown,
  fallback: number,
  min: number,
  max: number | null,
  field: string,
  errors: string[],
): number {
  if (raw === undefined) return fallback;
  const num = optionalNumber(raw);
  if (num === null || !Number.isInteger(num) || num < min || (max !== null && num > max)) {
    const range = max !== null ? `${min}–${max} 之间的整数` : `不少于 ${min} 的整数`;
    errors.push(`${field} 必须是 ${range}`);
    return fallback;
  }
  return num;
}

function parseProbesList(raw: unknown, errors: string[]): ProbeId[] {
  if (raw === undefined || raw === null) return [];
  if (!Array.isArray(raw)) {
    errors.push("modelFingerprint.probes 必须是探针 ID 数组");
    return [];
  }
  const seen = new Set<ProbeId>();
  const result: ProbeId[] = [];
  for (const item of raw) {
    const id = optionalString(item);
    if (id === null || !isProbeId(id)) {
      errors.push(`modelFingerprint.probes 含有未知探针：${String(item)}`);
      continue;
    }
    if (!seen.has(id)) {
      seen.add(id);
      result.push(id);
    }
  }
  return result;
}

function parseReferences(raw: unknown, errors: string[]): FingerprintReferenceTarget[] {
  if (raw === undefined || raw === null) return [];
  if (!Array.isArray(raw)) {
    errors.push("modelFingerprint.references 必须是数组");
    return [];
  }
  const seen = new Set<string>();
  const result: FingerprintReferenceTarget[] = [];
  for (let i = 0; i < raw.length; i += 1) {
    const entry = asRecord(raw[i]);
    const cli = optionalString(entry?.cli);
    const model = optionalString(entry?.model);
    if (!entry || !isCliKind(cli) || model === null) {
      errors.push(`modelFingerprint.references[${i}] 必须包含合法的 cli 与非空 model`);
      continue;
    }
    const key = `${cli}:${model}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push({ cli, model });
    }
  }
  return result;
}

function parsePromptOverrideEntry(
  raw: unknown,
  pathLabel: string,
  errors: string[],
): ModelPromptOverride | null {
  const node = asRecord(raw);
  if (node === null) {
    errors.push(`${pathLabel} 必须是映射`);
    return null;
  }
  const result: ModelPromptOverride = {};
  if (node.prompt !== undefined) {
    if (typeof node.prompt !== "string" || node.prompt.trim() === "") {
      errors.push(`${pathLabel}.prompt 必须是非空字符串`);
    } else {
      result.prompt = node.prompt;
    }
  }
  if (node.valuesPerCall !== undefined) {
    const vpc = optionalNumber(node.valuesPerCall);
    if (vpc === null || !Number.isInteger(vpc) || vpc < 1 || vpc > 50) {
      errors.push(`${pathLabel}.valuesPerCall 必须是 1–50 之间的整数`);
    } else {
      result.valuesPerCall = vpc;
    }
  }
  return result;
}

function isValidModelPromptKey(key: string): boolean {
  if (key === "") return false;
  if (!key.includes(":")) return true;
  const colonIdx = key.indexOf(":");
  const cliPart = key.slice(0, colonIdx);
  const modelPart = key.slice(colonIdx + 1).trim();
  return isCliKind(cliPart) && modelPart !== "";
}

function parseModelPrompts(raw: unknown, errors: string[]): ModelPromptOverrides {
  if (raw === undefined || raw === null) return {};
  const outer = asRecord(raw);
  if (outer === null) {
    errors.push("modelFingerprint.modelPrompts 必须是映射");
    return {};
  }
  const result: ModelPromptOverrides = {};
  for (const [modelKey, probeMapRaw] of Object.entries(outer)) {
    const trimmedKey = modelKey.trim();
    const probeMap = asRecord(probeMapRaw);
    if (!isValidModelPromptKey(trimmedKey) || probeMap === null) {
      errors.push(`modelFingerprint.modelPrompts["${modelKey}"] 必须是合法的模型键与探针覆盖映射`);
      continue;
    }
    const perProbe: Partial<Record<ProbeId, ModelPromptOverride>> = {};
    for (const [probeKey, overrideRaw] of Object.entries(probeMap)) {
      if (!isProbeId(probeKey)) {
        errors.push(`modelFingerprint.modelPrompts["${modelKey}"] 含有未知探针：${probeKey}`);
        continue;
      }
      const parsed = parsePromptOverrideEntry(
        overrideRaw,
        `modelFingerprint.modelPrompts["${modelKey}"].${probeKey}`,
        errors,
      );
      if (parsed !== null) perProbe[probeKey] = parsed;
    }
    result[trimmedKey] = perProbe;
  }
  return result;
}

function parseSamplesByProbe(
  raw: unknown,
  hasExplicitUniformSamples: boolean,
  errors: string[],
): Partial<Record<ProbeId, number>> {
  const base: Partial<Record<ProbeId, number>> = hasExplicitUniformSamples
    ? {}
    : { ...DEFAULT_SAMPLES_BY_PROBE };
  if (raw === undefined || raw === null) return base;
  const node = asRecord(raw);
  if (node === null) {
    errors.push("modelFingerprint.samplesByProbe 必须是映射");
    return base;
  }
  for (const [probeKey, countRaw] of Object.entries(node)) {
    if (!isProbeId(probeKey)) {
      errors.push(`modelFingerprint.samplesByProbe 含有未知探针：${probeKey}`);
      continue;
    }
    base[probeKey] = parsePositiveInt(
      countRaw,
      DEFAULT_SAMPLES_BY_PROBE[probeKey],
      MIN_SAMPLES_PER_PROBE,
      null,
      `modelFingerprint.samplesByProbe.${probeKey}`,
      errors,
    );
  }
  return base;
}

function parseTargetAccuracy(raw: unknown, errors: string[]): number {
  if (raw === undefined) return DEFAULT_TARGET_ACCURACY;
  const num = optionalNumber(raw);
  if (num === null || num <= 0.5 || num > 1) {
    errors.push("modelFingerprint.targetAccuracy 必须在 (0.5, 1] 区间内");
    return DEFAULT_TARGET_ACCURACY;
  }
  return num;
}

function parseEffortField(raw: unknown, errors: string[]): ModelFingerprintConfig["effort"] {
  if (raw === undefined || raw === null) return DEFAULT_FINGERPRINT_EFFORT;
  const effortStr = optionalString(raw);
  if (!isEffortLevel(effortStr)) {
    errors.push(`modelFingerprint.effort 无效：${String(raw)}`);
    return DEFAULT_FINGERPRINT_EFFORT;
  }
  return effortStr;
}

function cloneDefaultConfig(): ModelFingerprintConfig {
  return {
    ...DEFAULT_MODEL_FINGERPRINT_CONFIG,
    samplesByProbe: { ...DEFAULT_SAMPLES_BY_PROBE },
    probes: [],
    references: [],
    modelPrompts: {},
  };
}

function parseNumericFields(node: Record<string, unknown>, errors: string[]) {
  const samplesPerProbe = parsePositiveInt(
    node.samplesPerProbe, DEFAULT_SAMPLES_PER_PROBE, MIN_SAMPLES_PER_PROBE, null, "modelFingerprint.samplesPerProbe", errors,
  );
  const samplesByProbe = parseSamplesByProbe(node.samplesByProbe, node.samplesPerProbe !== undefined, errors);
  const byProbeVals = Object.values(samplesByProbe).filter((n): n is number => typeof n === "number");
  const minTarget = byProbeVals.length > 0 ? Math.min(samplesPerProbe, ...byProbeVals) : samplesPerProbe;
  return {
    samplesPerProbe,
    samplesByProbe,
    valuesPerCheck: parsePositiveInt(
      node.valuesPerCheck, DEFAULT_VALUES_PER_CHECK, 1, Math.floor(minTarget / 2), "modelFingerprint.valuesPerCheck", errors,
    ),
    checkAttempts: parsePositiveInt(
      node.checkAttempts, DEFAULT_CHECK_ATTEMPTS, 1, 20, "modelFingerprint.checkAttempts", errors,
    ),
    maxCallsFactor: parsePositiveInt(
      node.maxCallsFactor, DEFAULT_MAX_CALLS_FACTOR, 1, 20, "modelFingerprint.maxCallsFactor", errors,
    ),
    concurrency: parsePositiveInt(
      node.concurrency, DEFAULT_FINGERPRINT_CONCURRENCY, 1, MAX_FINGERPRINT_CONCURRENCY, "modelFingerprint.concurrency", errors,
    ),
  };
}

export function parseModelFingerprint(raw: unknown, errors: string[]): ModelFingerprintConfig {
  if (raw === undefined || raw === null) return cloneDefaultConfig();
  const node = asRecord(raw);
  if (node === null) {
    errors.push("modelFingerprint 必须是一个映射");
    return cloneDefaultConfig();
  }
  if (node.enabled !== undefined && typeof node.enabled !== "boolean") {
    errors.push("modelFingerprint.enabled 必须是布尔值");
  }
  const numeric = parseNumericFields(node, errors);
  return {
    enabled: node.enabled === true,
    effort: parseEffortField(node.effort, errors),
    ...numeric,
    probes: parseProbesList(node.probes, errors),
    targetAccuracy: parseTargetAccuracy(node.targetAccuracy, errors),
    references: parseReferences(node.references, errors),
    modelPrompts: parseModelPrompts(node.modelPrompts, errors),
  };
}
