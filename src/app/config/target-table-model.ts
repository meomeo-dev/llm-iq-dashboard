import type {
  CapabilitySnapshot,
  CliCapability,
  ModelOption,
} from "@/capabilities/types";
import {
  buildTargetId,
  CLI_KINDS,
  EFFORT_LEVELS,
  type CliKind,
  type EffortLevel,
  type Target,
} from "@/core/types";

export const SOURCE_LABEL: Record<ModelOption["sources"][number], string> = {
  probe: "已探测",
  history: "已验证",
  custom: "自定义",
  builtin: "内置",
};

export function findCapability(
  catalog: CapabilitySnapshot,
  cli: CliKind,
): CliCapability | undefined {
  return catalog.clis.find((entry) => entry.cli === cli);
}

/** 下拉总是包含当前值，避免打开配置页时静默替换正在使用的模型 */
export function mergeModelChoices(
  capability: CliCapability | undefined,
  custom: readonly string[],
  current: string,
): ModelOption[] {
  const options = [...(capability?.models ?? [])];
  const known = new Set(options.map((option) => option.id));

  for (const id of [...custom, current]) {
    if (id === "" || known.has(id)) continue;
    known.add(id);
    options.push({
      id,
      displayName: id,
      cli: capability?.cli ?? "claude",
      sources: ["custom"],
      efforts: null,
      description: null,
    });
  }
  return options;
}

/**
 * 该模型可选的强度档。`efforts: []` 表示不可调（如 agy 的 claude-sonnet-4-6 报
 * "--effort is not supported"），返回空；无探测信息时返回完整刻度。
 */
export function effortChoices(
  capability: CliCapability | undefined,
  model: string,
): EffortLevel[] {
  const option = capability?.models.find((entry) => entry.id === model);
  if (option?.efforts !== undefined && option.efforts !== null) {
    return EFFORT_LEVELS.filter((level) => option.efforts!.includes(level));
  }

  const efforts = capability?.efforts;
  if (efforts === undefined || efforts.length === 0) return [...EFFORT_LEVELS];
  return EFFORT_LEVELS.filter((level) => efforts.includes(level));
}

export function firstModelId(catalog: CapabilitySnapshot, cli: CliKind): string {
  return findCapability(catalog, cli)?.models[0]?.id ?? "";
}

/** 按 (cli, profile, model, effort) 重算 id；与 core 共用 buildTargetId，保证与历史产物文件名一致 */
export function withIdentity(target: Target): Target {
  return { ...target, id: buildTargetId(target.cli, target.model, target.effort, target.profile) };
}

export function createDefaultTarget(catalog: CapabilitySnapshot): Target {
  const cli = CLI_KINDS[0] as CliKind;
  const model = firstModelId(catalog, cli);
  return withIdentity({
    id: "",
    cli,
    model,
    effort: "medium",
    label: "",
    timeoutMs: 900_000,
    extraArgs: [],
    enabled: true,
  });
}

export function updateTargetList(
  targets: readonly Target[],
  index: number,
  changes: Partial<Target>,
): Target[] {
  return targets.map((target, i) =>
    i === index ? withIdentity({ ...target, ...changes }) : target,
  );
}

export function removeTargetFromList(
  targets: readonly Target[],
  index: number,
): Target[] {
  return targets.filter((_, i) => i !== index);
}

export function appendCustomModel(
  customModels: Partial<Record<CliKind, string[]>>,
  cli: CliKind,
  rawModel: string,
): { next: Partial<Record<CliKind, string[]>>; added: boolean } {
  const model = rawModel.trim();
  if (model === "") return { next: customModels, added: false };
  const existing = customModels[cli] ?? [];
  if (existing.includes(model)) return { next: customModels, added: false };
  return {
    next: { ...customModels, [cli]: [...existing, model] },
    added: true,
  };
}
