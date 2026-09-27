/**
 * Codex 能力探针。
 *
 * `codex debug models` 输出 JSON 模型目录，逐模型声明支持的思考强度档。
 */

import { EFFORT_LEVELS, type CliKind, type EffortLevel } from "../core/types";
import { runProbeCommand } from "./probe-command";
import type { CapabilityProbe, ProbedModel, ProbeResult } from "./types";

/** 目录里还有仅供内部调用的条目，只收 CLI 认为该列出来的 */
const VISIBLE = "list";

export const codexProbe: CapabilityProbe = {
  cli: "codex" as CliKind,

  async probe(): Promise<ProbeResult> {
    const output = await runProbeCommand("codex", ["debug", "models"]);
    if (!output.ok) {
      return { available: false, models: [], efforts: [], notes: [output.error ?? "探测失败"] };
    }

    const notes: string[] = [];
    const models = parseCatalog(output.stdout, notes);

    // codex 的强度逐模型声明，CLI 级别的档位取各模型的并集
    const efforts = unionEfforts(models);
    return { available: true, models, efforts, notes };
  },
};

function parseCatalog(stdout: string, notes: string[]): ProbedModel[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(stdout);
  } catch (cause) {
    notes.push(`模型目录不是合法 JSON：${(cause as Error).message}`);
    return [];
  }

  const entries = readEntries(parsed);
  if (entries === null) {
    notes.push("模型目录缺少 models 数组");
    return [];
  }

  return entries.filter(isVisible).map(toProbedModel);
}

function readEntries(parsed: unknown): Record<string, unknown>[] | null {
  if (parsed === null || typeof parsed !== "object") return null;
  const models = (parsed as Record<string, unknown>).models;
  if (!Array.isArray(models)) return null;
  return models.filter(
    (item): item is Record<string, unknown> =>
      item !== null && typeof item === "object" && !Array.isArray(item),
  );
}

/** visibility 字段缺失时按可见处理，避免漏掉能用的模型 */
function isVisible(entry: Record<string, unknown>): boolean {
  const visibility = entry.visibility;
  return typeof visibility !== "string" || visibility === VISIBLE;
}

function toProbedModel(entry: Record<string, unknown>): ProbedModel {
  const id = typeof entry.slug === "string" ? entry.slug : "";
  return {
    id,
    displayName: typeof entry.display_name === "string" ? entry.display_name : id,
    efforts: readSupportedEfforts(entry),
    description: typeof entry.description === "string" ? entry.description : null,
  };
}

/**
 * 读取 supported_reasoning_levels，只保留 EFFORT_LEVELS 中已登记的档位；
 * 一个都没有时返回 null。
 */
function readSupportedEfforts(entry: Record<string, unknown>): EffortLevel[] | null {
  const levels = entry.supported_reasoning_levels;
  if (!Array.isArray(levels)) return null;

  const efforts = levels
    .map((level) => readEffortName(level))
    .filter((name): name is EffortLevel =>
      name !== null && (EFFORT_LEVELS as readonly string[]).includes(name),
    );
  return efforts.length > 0 ? efforts : null;
}

/** 条目可能是 `{effort, description}` 对象，也可能退化成纯字符串 */
function readEffortName(level: unknown): string | null {
  if (typeof level === "string") return level.toLowerCase();
  if (level === null || typeof level !== "object") return null;
  const effort = (level as Record<string, unknown>).effort;
  return typeof effort === "string" ? effort.toLowerCase() : null;
}

function unionEfforts(models: readonly ProbedModel[]): EffortLevel[] {
  const seen = new Set<EffortLevel>();
  for (const model of models) {
    for (const effort of model.efforts ?? []) seen.add(effort);
  }
  return EFFORT_LEVELS.filter((level) => seen.has(level));
}
