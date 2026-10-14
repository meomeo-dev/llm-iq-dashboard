import type { PromptSpec } from "@/core/prompt";
import type { VariableMode, VariableSpec } from "@/core/variables";
import type { Locale } from "@/i18n";

export const MODES: readonly VariableMode[] = ["sequence", "shuffle", "random", "fixed"];

export const MODE_HINT: Record<VariableMode, string> = {
  sequence: "顺序轮换，游标持久化，N 轮内必定覆盖全部取值",
  shuffle: "洗牌后依次取：顺序随机，取完一遍之前不重复",
  random: "每轮随机取一个，可能连续撞上同一个值",
  fixed: "固定不变，用于钉住某个变量避免干扰对比",
};

export const MODE_HINT_EN: Record<VariableMode, string> = {
  sequence: "Round-robin rotation with persisted cursor; covers all values in N runs",
  shuffle: "Shuffle then step through: random order without repeats until exhausted",
  random: "Random value per run; may repeat consecutively",
  fixed: "Fixed value to pin a variable for controlled comparison",
};

export function getModeHint(mode: VariableMode, locale: Locale = "zh-CN"): string {
  return locale === "en" ? MODE_HINT_EN[mode] : MODE_HINT[mode];
}

/** 英文模式下内置候选池题组（24 组）的说明文案转为英文，不改动原始 template */
export function formatPromptTemplateDisplay(spec: PromptSpec, locale: Locale = "zh-CN"): string {
  if (locale === "en" && spec.candidates.length > 0 && spec.immutable) {
    return `${spec.label} — ${spec.candidates.length} rotating scene candidates. Shuffles one candidate per rotation cycle and sends its full prompt text verbatim.`;
  }
  return spec.template;
}

/** 生成不与现有条目冲突的 id */
export function uniquePromptId(taken: readonly string[]): string {
  for (let n = 1; ; n += 1) {
    const candidate = `custom-${n}`;
    if (!taken.includes(candidate)) return candidate;
  }
}

/** 切换勾选：至少保留一条，否则调度器空转 */
export function togglePromptId(enabled: readonly string[], id: string): string[] {
  if (enabled.includes(id)) {
    if (enabled.length === 1) return [...enabled];
    return enabled.filter((item) => item !== id);
  }
  return [...enabled, id];
}

export function createCustomPrompt(takenIds: readonly string[], locale: Locale = "zh-CN"): PromptSpec {
  return {
    id: uniquePromptId(takenIds),
    label: locale === "en" ? "Custom Prompt" : "自定义提示词",
    template: "Generate an SVG of a {{animal}} riding a bicycle",
    variables: [{ name: "animal", mode: "sequence", values: ["pelican", "capybara"] }],
    candidates: [],
    source: null,
    verified: false,
    immutable: false,
  };
}

export function updateCustomPromptAtIndex(
  custom: readonly PromptSpec[],
  index: number,
  next: PromptSpec,
): PromptSpec[] {
  return custom.map((spec, i) => (i === index ? next : spec));
}

export function removeCustomPromptAtIndex(
  custom: readonly PromptSpec[],
  index: number,
): PromptSpec[] {
  return custom.filter((_, i) => i !== index);
}

export function updateVariableAtIndex(
  variables: readonly VariableSpec[],
  index: number,
  next: VariableSpec,
): VariableSpec[] {
  return variables.map((v, i) => (i === index ? next : v));
}

export function removeVariableAtIndex(
  variables: readonly VariableSpec[],
  index: number,
): VariableSpec[] {
  return variables.filter((_, i) => i !== index);
}

export function createEmptyVariable(): VariableSpec {
  return { name: "", mode: "sequence", values: [] };
}

export function parseVariableValues(raw: string): string[] {
  return raw
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v !== "");
}
