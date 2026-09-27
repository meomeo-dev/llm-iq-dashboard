/**
 * 能力目录的合并与缓存。
 *
 * 合并 probe / history / custom / builtin 四个来源（可信度依次降低，见
 * CapabilitySource），同一模型的来源标记全部保留。
 */

import { writeFile, readFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { dataRoot } from "../core/paths";
import { EFFORT_LEVELS, type CliKind, type EffortLevel } from "../core/types";
import { builtinModels } from "./builtin-models";
import { historyModels } from "./history-models";
import { agyProbe } from "./probe-agy";
import { claudeProbe } from "./probe-claude";
import { codexProbe } from "./probe-codex";
import type {
  CapabilityProbe,
  CapabilitySnapshot,
  CliCapability,
  ModelOption,
  ProbedModel,
  ProbeResult,
} from "./types";

const PROBES: readonly CapabilityProbe[] = [claudeProbe, codexProbe, agyProbe];

/** 改动 ModelOption / CliCapability 的语义时必须递增，见 CapabilitySnapshot.schemaVersion */
const CATALOG_SCHEMA_VERSION = 2;

/** 探测不到强度档位时的默认值：三家都至少支持这三档 */
const FALLBACK_EFFORTS: EffortLevel[] = ["low", "medium", "high"];

export function capabilityCachePath(): string {
  return join(dataRoot(), "capabilities.json");
}

/** 并行探测三家并写入缓存；某一家失败只影响它自己那一段 */
export async function refreshCatalog(
  customModels: Partial<Record<CliKind, string[]>> = {},
): Promise<CapabilitySnapshot> {
  const [results, history] = await Promise.all([
    Promise.all(PROBES.map(async (probe) => ({ cli: probe.cli, result: await probe.probe() }))),
    historyModels(),
  ]);

  const clis = results.map(({ cli, result }) =>
    buildCapability(cli, result, history.get(cli) ?? [], customModels[cli] ?? []),
  );

  const snapshot: CapabilitySnapshot = {
    schemaVersion: CATALOG_SCHEMA_VERSION,
    probedAt: new Date().toISOString(),
    clis,
  };
  await persist(snapshot);
  return snapshot;
}

/**
 * 读取上次探测的缓存；没有缓存或版本不符时返回 null，由调用方决定是否现场探测。
 * 缺字段的旧缓存会让调用逻辑静默走错分支，因此版本不符即丢弃。
 */
export async function readCachedCatalog(): Promise<CapabilitySnapshot | null> {
  try {
    const text = await readFile(capabilityCachePath(), "utf8");
    const parsed = JSON.parse(text) as Partial<CapabilitySnapshot>;
    if (parsed.schemaVersion !== CATALOG_SCHEMA_VERSION) return null;
    return parsed as CapabilitySnapshot;
  } catch {
    return null;
  }
}

function buildCapability(
  cli: CliKind,
  result: ProbeResult,
  fromHistory: readonly ProbedModel[],
  custom: readonly string[],
): CliCapability {
  const merged = new Map<string, ModelOption>();

  // 顺序即优先级：先落地的来源决定 displayName 与 efforts，后来者只追加来源标记
  absorb(merged, cli, result.models, "probe");
  absorb(merged, cli, fromHistory, "history");
  absorb(merged, cli, custom.map(toBareModel), "custom");
  absorb(merged, cli, builtinModels(cli), "builtin");

  const efforts = result.efforts.length > 0 ? result.efforts : FALLBACK_EFFORTS;
  const notes = [...result.notes];
  if (result.efforts.length === 0 && result.available) {
    notes.push(`强度档位回退到内置默认：${FALLBACK_EFFORTS.join(" / ")}`);
  }

  return {
    cli,
    available: result.available,
    models: [...merged.values()].sort(compareOptions),
    efforts,
    notes,
  };
}

function absorb(
  target: Map<string, ModelOption>,
  cli: CliKind,
  models: readonly ProbedModel[],
  source: ModelOption["sources"][number],
): void {
  for (const model of models) {
    if (model.id === "") continue;

    const existing = target.get(model.id);
    if (existing !== undefined) {
      if (!existing.sources.includes(source)) existing.sources.push(source);
      // 后来的来源只补空缺，不覆盖已有的更精确信息
      existing.efforts ??= model.efforts;
      existing.description ??= model.description;
      continue;
    }

    target.set(model.id, {
      id: model.id,
      displayName: model.displayName,
      cli,
      sources: [source],
      efforts: model.efforts,
      description: model.description,
    });
  }
}

function toBareModel(id: string): ProbedModel {
  return { id, displayName: id, efforts: null, description: null };
}

/** 按来源可信度排序：probe、history、custom、builtin */
function compareOptions(a: ModelOption, b: ModelOption): number {
  const rank = (option: ModelOption): number => {
    if (option.sources.includes("probe")) return 0;
    if (option.sources.includes("history")) return 1;
    if (option.sources.includes("custom")) return 2;
    return 3;
  };
  return rank(a) - rank(b) || a.id.localeCompare(b.id);
}

async function persist(snapshot: CapabilitySnapshot): Promise<void> {
  const path = capabilityCachePath();
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
}

/**
 * 某个模型可用的强度档：优先用模型自己的声明，否则回退到 CLI 级别。
 * 适配器据此折叠请求档位。
 */
export function effortsFor(
  snapshot: CapabilitySnapshot | null,
  cli: CliKind,
  model: string,
): EffortLevel[] {
  const option = lookupModel(snapshot, cli, model);
  const capability = snapshot?.clis.find((entry) => entry.cli === cli);
  if (capability === undefined) return [];

  const efforts = option?.efforts ?? capability.efforts;
  return EFFORT_LEVELS.filter((level) => efforts.includes(level));
}

/**
 * 该模型是否接受强度调节：efforts 为空数组表示不可调（如 agy 的 claude-sonnet-4-6
 * 会报 "--effort is not supported for model"）；null 表示未知，按可调处理，由 CLI 裁决。
 */
export function effortAdjustable(
  snapshot: CapabilitySnapshot | null,
  cli: CliKind,
  model: string,
): boolean {
  const efforts = lookupModel(snapshot, cli, model)?.efforts;
  return efforts === undefined || efforts === null || efforts.length > 0;
}

function lookupModel(
  snapshot: CapabilitySnapshot | null,
  cli: CliKind,
  model: string,
): ModelOption | undefined {
  return snapshot?.clis
    .find((entry) => entry.cli === cli)
    ?.models.find((entry) => entry.id === model);
}
