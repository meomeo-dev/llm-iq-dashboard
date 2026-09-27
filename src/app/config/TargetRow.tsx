import type { CapabilitySnapshot, ModelOption } from "@/capabilities/types";
import { CLI_KINDS, type CliKind, type EffortLevel, type Target } from "@/core/types";
import {
  findCapability,
  mergeModelChoices,
  effortChoices,
  firstModelId,
  SOURCE_LABEL,
} from "./target-table-model";

export interface TargetRowProps {
  target: Target;
  catalog: CapabilitySnapshot;
  customModels: Partial<Record<CliKind, string[]>>;
  onChange: (changes: Partial<Target>) => void;
  onRemove: () => void;
}

export function TargetRow({
  target,
  catalog,
  customModels,
  onChange,
  onRemove,
}: TargetRowProps) {
  const capability = findCapability(catalog, target.cli);
  const models = mergeModelChoices(capability, customModels[target.cli] ?? [], target.model);
  const efforts = effortChoices(capability, target.model);

  return (
    <tr className={target.enabled ? undefined : "row-unscheduled"}>
      <TargetEnableCell
        checked={target.enabled}
        label={target.label || target.id}
        onChange={(enabled) => onChange({ enabled })}
      />
      <td>
        <TargetCliCell
          cli={target.cli}
          onChange={(cli) => onChange({ cli, model: firstModelId(catalog, cli) })}
        />
      </td>
      <td>
        <TargetModelCell
          model={target.model}
          models={models}
          onChange={(model) => onChange({ model })}
        />
      </td>
      <td>
        <TargetEffortCell
          effort={target.effort}
          efforts={efforts}
          onChange={(effort) => onChange({ effort })}
        />
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

function TargetCliCell({
  cli,
  onChange,
}: {
  cli: CliKind;
  onChange: (cli: CliKind) => void;
}) {
  return (
    <select value={cli} onChange={(e) => onChange(e.target.value as CliKind)}>
      {CLI_KINDS.map((kind) => (
        <option key={kind} value={kind}>
          {kind}
        </option>
      ))}
    </select>
  );
}

function TargetModelCell({
  model,
  models,
  onChange,
}: {
  model: string;
  models: ModelOption[];
  onChange: (model: string) => void;
}) {
  return (
    <select value={model} onChange={(e) => onChange(e.target.value)}>
      {models.map((option) => (
        <option key={option.id} value={option.id}>
          {option.id}
          {option.sources.length > 0 && `  · ${SOURCE_LABEL[option.sources[0]!]}`}
        </option>
      ))}
    </select>
  );
}

function TargetEffortCell({
  effort,
  efforts,
  onChange,
}: {
  effort: EffortLevel;
  efforts: EffortLevel[];
  onChange: (effort: EffortLevel) => void;
}) {
  if (efforts.length === 0) {
    return (
      <span className="note" title="该模型不支持调节思考强度">
        不可调
      </span>
    );
  }
  return (
    <select
      value={effort}
      onChange={(e) => onChange(e.target.value as EffortLevel)}
    >
      {efforts.map((level) => (
        <option key={level} value={level}>
          {level}
        </option>
      ))}
    </select>
  );
}

function TargetEnableCell({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <td>
      <input
        type="checkbox"
        checked={checked}
        aria-label={`${label} 进入定时任务`}
        onChange={(e) => onChange(e.target.checked)}
      />
    </td>
  );
}
