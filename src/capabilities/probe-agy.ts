/**
 * agy 能力探针。
 *
 * `agy models` 输出制表符分隔的两列：模型标识与显示名。CLI 级别的强度档位
 * 从 `--help` 解析；标识里带强度后缀的条目合并为一个基名模型。
 */

import { EFFORT_LEVELS, type CliKind, type EffortLevel } from "../core/types";
import { parseEffortsFromHelp } from "./help-effort";
import { runProbeCommand } from "./probe-command";
import type { CapabilityProbe, ProbedModel, ProbeResult } from "./types";

export const agyProbe: CapabilityProbe = {
  cli: "agy" as CliKind,

  async probe(): Promise<ProbeResult> {
    const [listing, help] = await Promise.all([
      runProbeCommand("agy", ["models"]),
      runProbeCommand("agy", ["--help"]),
    ]);

    if (!listing.ok && !help.ok) {
      return {
        available: false,
        models: [],
        efforts: [],
        notes: [listing.error ?? "agy 探测失败"],
      };
    }

    const notes: string[] = [];
    const models = listing.ok ? parseModelTable(listing.stdout) : [];
    if (!listing.ok) notes.push(listing.error ?? "模型列表读取失败");
    if (models.length === 0 && listing.ok) notes.push("agy models 未返回任何条目");

    const efforts = parseEffortsFromHelp(help.stdout);
    if (efforts.length === 0) notes.push("未能从 --help 解析出强度档位");

    return { available: true, models, efforts, notes };
  },
};

/**
 * 解析制表符分隔的模型表；没有制表符的行（如 “Fetching available models...”
 * 状态提示）跳过。
 */
function parseModelTable(stdout: string): ProbedModel[] {
  const rows: { id: string; displayName: string }[] = [];

  for (const line of stdout.split("\n")) {
    const tab = line.indexOf("\t");
    if (tab === -1) continue;

    const id = line.slice(0, tab).trim();
    if (id === "") continue;
    rows.push({ id, displayName: line.slice(tab + 1).trim() || id });
  }
  return collapseEffortSuffixes(rows);
}

/**
 * 把 `<base>-<effort>` 形式的条目合并成一个基名模型。
 *
 * `gemini-3.8-flash-low` / `-medium` / `-high` 是同一模型的三个档位；
 * CLI 会拒绝 `--model x-low --effort high` 这样的组合。没有强度后缀的条目
 * （如 `claude-sonnet-4-6`）原样保留。
 */
function collapseEffortSuffixes(
  rows: readonly { id: string; displayName: string }[],
): ProbedModel[] {
  const bases = new Map<string, { efforts: EffortLevel[]; displayName: string }>();
  const plain: ProbedModel[] = [];

  for (const row of rows) {
    const split = splitEffortSuffix(row.id);
    if (split === null) {
      plain.push({
        id: row.id,
        displayName: row.displayName,
        // 空数组表示不接受强度调节（agy 会报 "--effort is not supported for model"），
        // 区别于 null（未声明，回退 CLI 级别）
        efforts: [],
        description: null,
      });
      continue;
    }

    const entry = bases.get(split.base) ?? {
      efforts: [],
      // 去掉显示名末尾描述档位的 “(High)” 之类
      displayName: stripEffortLabel(row.displayName),
    };
    if (!entry.efforts.includes(split.effort)) entry.efforts.push(split.effort);
    bases.set(split.base, entry);
  }

  const collapsed: ProbedModel[] = [...bases].map(([base, entry]) => ({
    id: base,
    displayName: entry.displayName,
    efforts: EFFORT_LEVELS.filter((level) => entry.efforts.includes(level)),
    description: null,
  }));

  return [...collapsed, ...plain];
}

/** 拆出末尾的强度后缀；没有则返回 null */
function splitEffortSuffix(
  id: string,
): { base: string; effort: EffortLevel } | null {
  for (const effort of EFFORT_LEVELS) {
    const suffix = `-${effort}`;
    if (id.endsWith(suffix) && id.length > suffix.length) {
      return { base: id.slice(0, id.length - suffix.length), effort };
    }
  }
  return null;
}

/** 去掉显示名末尾描述档位的括号，如 “Gemini 3.8 Flash (High)” */
function stripEffortLabel(displayName: string): string {
  const open = displayName.lastIndexOf("(");
  if (open === -1 || !displayName.trimEnd().endsWith(")")) return displayName;

  const inner = displayName.slice(open + 1, displayName.lastIndexOf(")")).toLowerCase();
  const isEffortLabel = (EFFORT_LEVELS as readonly string[]).includes(inner);
  return isEffortLabel ? displayName.slice(0, open).trim() : displayName;
}
