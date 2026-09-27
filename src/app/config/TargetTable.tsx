import { useState } from "react";
import type { CapabilitySnapshot, CliCapability, ModelOption } from "@/capabilities/types";
import {
  buildTargetId,
  CLI_KINDS,
  EFFORT_LEVELS,
  type CliKind,
  type EffortLevel,
  type Target,
} from "@/core/types";

const SOURCE_LABEL: Record<ModelOption["sources"][number], string> = {
  probe: "已探测",
  history: "已验证",
  custom: "自定义",
  builtin: "内置",
};

export function TargetTable({
  targets,
  catalog,
  customModels,
  onTargets,
  onCustomModels,
}: {
  targets: Target[];
  catalog: CapabilitySnapshot;
  customModels: Partial<Record<CliKind, string[]>>;
  onTargets: (next: Target[]) => void;
  onCustomModels: (next: Partial<Record<CliKind, string[]>>) => void;
}) {
  const [manual, setManual] = useState({ cli: "claude" as CliKind, model: "" });

  const update = (index: number, changes: Partial<Target>): void => {
    onTargets(
      targets.map((target, i) =>
        i === index ? withIdentity({ ...target, ...changes }) : target,
      ),
    );
  };

  const addRow = (): void => {
    const cli = CLI_KINDS[0] as CliKind;
    const model = firstModelId(catalog, cli);
    onTargets([
      ...targets,
      withIdentity({
        id: "",
        cli,
        model,
        effort: "medium",
        label: "",
        timeoutMs: 900_000,
        extraArgs: [],
      }),
    ]);
  };

  const addCustomModel = (): void => {
    const model = manual.model.trim();
    if (model === "") return;
    const existing = customModels[manual.cli] ?? [];
    if (!existing.includes(model)) {
      onCustomModels({ ...customModels, [manual.cli]: [...existing, model] });
    }
    setManual({ ...manual, model: "" });
  };

  return (
    <div className="stack">
      <div className="table-responsive">
        <table className="matrix">
          <thead>
            <tr>
              <th>CLI</th>
              <th>模型</th>
              <th>思考强度</th>
              <th>显示名</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {targets.map((target, index) => (
              <TargetRow
                key={`${target.id}-${index}`}
                target={target}
                catalog={catalog}
                customModels={customModels}
                onChange={(changes) => update(index, changes)}
                onRemove={() => onTargets(targets.filter((_, i) => i !== index))}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="field-row">
        <button type="button" onClick={addRow}>
          + 增加一行
        </button>
      </div>

      <div className="field-row manual-model">
        <span className="note">
          claude 没有模型列举命令，新模型可在此手填，之后会出现在下拉中：
        </span>
        <select
          value={manual.cli}
          onChange={(e) => setManual({ ...manual, cli: e.target.value as CliKind })}
        >
          {CLI_KINDS.map((cli) => (
            <option key={cli} value={cli}>
              {cli}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={manual.model}
          placeholder="模型标识"
          onChange={(e) => setManual({ ...manual, model: e.target.value })}
        />
        <button type="button" onClick={addCustomModel}>
          添加
        </button>
      </div>
    </div>
  );
}

function TargetRow({
  target,
  catalog,
  customModels,
  onChange,
  onRemove,
}: {
  target: Target;
  catalog: CapabilitySnapshot;
  customModels: Partial<Record<CliKind, string[]>>;
  onChange: (changes: Partial<Target>) => void;
  onRemove: () => void;
}) {
  const capability = findCapability(catalog, target.cli);
  const models = mergeModelChoices(capability, customModels[target.cli] ?? [], target.model);
  // 档位取自该模型探测到的能力
  const efforts = effortChoices(capability, target.model);

  return (
    <tr>
      <td>
        <select
          value={target.cli}
          onChange={(e) => {
            const cli = e.target.value as CliKind;
            onChange({ cli, model: firstModelId(catalog, cli) });
          }}
        >
          {CLI_KINDS.map((cli) => (
            <option key={cli} value={cli}>
              {cli}
            </option>
          ))}
        </select>
      </td>
      <td>
        <select value={target.model} onChange={(e) => onChange({ model: e.target.value })}>
          {models.map((option) => (
            <option key={option.id} value={option.id}>
              {option.id}
              {option.sources.length > 0 && `  · ${SOURCE_LABEL[option.sources[0]!]}`}
            </option>
          ))}
        </select>
      </td>
      <td>
        {/* 模型不接受强度参数时不显示下拉 */}
        {efforts.length === 0 ? (
          <span className="note" title="该模型不支持调节思考强度">
            不可调
          </span>
        ) : (
          <select
            value={target.effort}
            onChange={(e) => onChange({ effort: e.target.value as EffortLevel })}
          >
            {efforts.map((effort) => (
              <option key={effort} value={effort}>
                {effort}
              </option>
            ))}
          </select>
        )}
      </td>
      <td>
        <input
          type="text"
          value={target.label}
          placeholder="留空自动生成"
          onChange={(e) => onChange({ label: e.target.value })}
        />
      </td>
      <td>
        <button type="button" className="danger" onClick={onRemove}>
          删除
        </button>
      </td>
    </tr>
  );
}

function findCapability(
  catalog: CapabilitySnapshot,
  cli: CliKind,
): CliCapability | undefined {
  return catalog.clis.find((entry) => entry.cli === cli);
}

/** 下拉总是包含当前值，避免打开配置页时静默替换正在使用的模型 */
function mergeModelChoices(
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
function effortChoices(
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

function firstModelId(catalog: CapabilitySnapshot, cli: CliKind): string {
  return findCapability(catalog, cli)?.models[0]?.id ?? "";
}

/** 按 (cli, model, effort) 重算 id；与 core 共用 buildTargetId，保证与历史产物文件名一致 */
function withIdentity(target: Target): Target {
  return { ...target, id: buildTargetId(target.cli, target.model, target.effort) };
}
