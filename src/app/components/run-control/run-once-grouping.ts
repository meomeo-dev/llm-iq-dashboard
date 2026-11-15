import type { RunOptionsView } from "@/app/api/run/route";
import { BENCHMARK_2026_11_H1_IDS } from "@/core/prompt/bank/benchmarks/2026-11-h1/ids";

export type Target = RunOptionsView["targets"][number];
export type PromptOption = RunOptionsView["prompts"][number];

export interface ModelGroup {
  key: string;
  cli: string;
  model: string;
  targets: Target[];
}

export type GroupKey =
  | "经典基准"
  | "四大名著（文学与叙事构图）"
  | "世界地标（微缩景观）"
  | "2026-09"
  | "2026-10"
  | "2026-11-h1"
  | "自定义提示词";

export interface PromptGroup {
  name: string;
  items: PromptOption[];
}

const CLASSIC_PROMPT_IDS: ReadonlySet<string> = new Set([
  "classic-v1",
  "upgraded-v2",
  "animated-pelican-v1",
  "animated-armadillo-fishnet-mars-v1",
  "animated-lemur-scooter-front-v1",
]);

const SEPTEMBER_2026_PROMPT_IDS: ReadonlySet<string> = new Set([
  "animated-iso-vintage-pc-v1",
  "animated-iso-amber-crt-v1",
  "animated-iso-server-rack-v1",
  "animated-iso-camera-exploded-v1",
  "animated-human-hand-kinetic-v1",
  "animated-fish-cloud-amodal-v1",
  "animated-island-chest-containment-v1",
  "animated-tree-reader-occlusion-v1",
]);

const OCTOBER_2026_PROMPT_IDS: ReadonlySet<string> = new Set([
  "animated-jansen-walker-v1",
  "animated-jumping-spider-leap-v1",
  "animated-centipede-wave-gait-v1",
  "animated-open-differential-v1",
  "animated-ferris-leveling-v1",
  "animated-octopus-organ-v1",
  "animated-peacock-bicycle-v1",
  "animated-nautilus-spiral-v1",
]);

const EXCLUDED_PROMPT_PREFIXES = ["fe-", "vfx-"];
const EXCLUDED_PROMPT_IDS: ReadonlySet<string> = new Set([
  "clock-v1",
  "penrose-v1",
  "ice-water-v1",
  "four-stroke-engine-v1",
  "mobius-strip-v1",
  "cart-pole-v1",
  "cyber-cube-v1",
  "synthwave-drive-v1",
  "cyber-hud-v1",
  "black-hole-lensing-v1",
  "quantum-double-slit-v1",
  "ferrofluid-spikes-v1",
  "jwst-deployment-v1",
  "tokamak-plasma-v1",
  "gaa-nanosheet-v1",
  "crispr-cas9-rloop-v1",
  "pulsar-jet-v1",
  "black-hole-lensing",
  "quantum-double-slit",
  "ferrofluid-spikes",
  "jwst-deployment",
  "tokamak-plasma",
  "gaa-nanosheet",
  "crispr-cas9",
  "pulsar-jet",
]);

export function isPromptExcludedFromDisplay(id: string): boolean {
  if (EXCLUDED_PROMPT_IDS.has(id)) return true;
  return EXCLUDED_PROMPT_PREFIXES.some((prefix) => id.startsWith(prefix));
}

const NOVEMBER_2026_H1_PROMPT_IDS: ReadonlySet<string> = new Set(BENCHMARK_2026_11_H1_IDS);

export function classifyPrompt(p: PromptOption): GroupKey {
  if (CLASSIC_PROMPT_IDS.has(p.id)) return "经典基准";
  if (
    p.id.startsWith("shuihu") ||
    p.id.startsWith("xiyou") ||
    p.id.startsWith("sanguo") ||
    p.id.startsWith("honglou")
  ) {
    return "四大名著（文学与叙事构图）";
  }
  if (p.id.startsWith("landmarks-")) return "世界地标（微缩景观）";
  if (SEPTEMBER_2026_PROMPT_IDS.has(p.id)) return "2026-09";
  if (OCTOBER_2026_PROMPT_IDS.has(p.id)) return "2026-10";
  if (NOVEMBER_2026_H1_PROMPT_IDS.has(p.id)) return "2026-11-h1";
  return "自定义提示词";
}

export function groupPrompts(promptList: readonly PromptOption[]): PromptGroup[] {
  const groups: Record<GroupKey, PromptOption[]> = {
    "经典基准": [],
    "四大名著（文学与叙事构图）": [],
    "世界地标（微缩景观）": [],
    "2026-09": [],
    "2026-10": [],
    "2026-11-h1": [],
    "自定义提示词": [],
  };

  for (const p of promptList) {
    if (isPromptExcludedFromDisplay(p.id)) continue;
    groups[classifyPrompt(p)].push(p);
  }

  return Object.entries(groups)
    .filter(([_, items]) => items.length > 0)
    .map(([name, items]) => ({ name, items }));
}

/** 按配置顺序分组：同一 CLI · 模型的各强度相邻 */
export function groupByModel(targets: readonly Target[]): ModelGroup[] {
  const groups = new Map<string, ModelGroup>();
  for (const target of targets) {
    const key = `${target.cli}/${target.model}`;
    const group = groups.get(key) ?? { key, cli: target.cli, model: target.model, targets: [] };
    group.targets.push(target);
    groups.set(key, group);
  }
  return [...groups.values()];
}
