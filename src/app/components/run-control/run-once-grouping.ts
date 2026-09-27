import type { RunOptionsView } from "@/app/api/run/route";

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
  | "2026 前沿工程评测 (FE-1 ~ FE-8)"
  | "2026 前沿视觉特效 (VFX)"
  | "微观物理与前沿探索"
  | "自定义提示词";

export interface PromptGroup {
  name: string;
  items: PromptOption[];
}

const MICROPHYSICS_PROMPT_IDS: ReadonlySet<string> = new Set([
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

const CLASSIC_PROMPT_IDS: ReadonlySet<string> = new Set([
  "classic-v1",
  "upgraded-v2",
  "animated-pelican-v1",
]);

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
  if (p.id.startsWith("fe-")) return "2026 前沿工程评测 (FE-1 ~ FE-8)";
  if (p.id.startsWith("vfx-")) return "2026 前沿视觉特效 (VFX)";
  if (MICROPHYSICS_PROMPT_IDS.has(p.id)) return "微观物理与前沿探索";
  return "自定义提示词";
}

export function groupPrompts(promptList: readonly PromptOption[]): PromptGroup[] {
  const groups: Record<GroupKey, PromptOption[]> = {
    "经典基准": [],
    "四大名著（文学与叙事构图）": [],
    "2026 前沿工程评测 (FE-1 ~ FE-8)": [],
    "2026 前沿视觉特效 (VFX)": [],
    "微观物理与前沿探索": [],
    "自定义提示词": [],
  };

  for (const p of promptList) {
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
