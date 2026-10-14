import type { CapabilitySnapshot, ModelOption } from "@/capabilities/types";
import type { ProfileConfig } from "@/core/config";
import { CLI_KINDS, DEFAULT_PROFILE, type CliKind, type EffortLevel, type Target } from "@/core/types";
import { useI18n } from "@/i18n";
import {
  modelAfterProfileChange,
  profileChoices,
  profileModelOptions,
  profileSelectValue,
} from "./profile-panel-model";
import {
  findCapability,
  mergeModelChoices,
  effortChoices,
  firstModelId,
  sourceLabel,
} from "./target-table-model";

export interface TargetRowProps {
  target: Target;
  profiles: ProfileConfig[];
  catalog: CapabilitySnapshot;
  customModels: Partial<Record<CliKind, string[]>>;
  onChange: (changes: Partial<Target>) => void;
  onRemove: () => void;
}

export function TargetRow({
  target, profiles, catalog, customModels, onChange, onRemove,
}: TargetRowProps) {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const capability = findCapability(catalog, target.cli);
  const profile = profiles.find((item) => item.cli === target.cli && item.name === target.profile);
  // 非默认 profile 的模型来自它手填的清单；强度档仍按同名模型在登录态下的探测结果
  const models = profile === undefined
    ? mergeModelChoices(capability, customModels[target.cli] ?? [], target.model)
    : profileModelOptions(profile, target.model);
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
          onChange={(cli) => onChange({ cli, profile: undefined, model: firstModelId(catalog, cli) })}
        />
      </td>
      <td>
        <TargetProfileCell
          value={profileSelectValue(target)}
          choices={profileChoices(profiles, target.cli)}
          onChange={(name) => {
            const next = profiles.find((item) => item.cli === target.cli && item.name === name);
            const model = modelAfterProfileChange(catalog, next, target.cli, target.model);
            onChange({ profile: next?.name, model });
          }}
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
          placeholder={isEn ? "Auto-generated if empty" : "留空自动生成"}
          onChange={(e) => onChange({ label: e.target.value })}
        />
      </td>
      <td>
        <button type="button" className="danger" onClick={onRemove}>
          {isEn ? "Delete" : "删除"}
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

function TargetProfileCell({
  value,
  choices,
  onChange,
}: {
  value: string;
  choices: ProfileConfig[];
  onChange: (name: string) => void;
}) {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const defaultLabel = isEn ? "Official Login" : "登录态";
  if (choices.length === 0 && value === DEFAULT_PROFILE) return <span className="note">{defaultLabel}</span>;
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value={DEFAULT_PROFILE}>{defaultLabel}</option>
      {choices.map((choice) => (
        <option key={choice.name} value={choice.name}>
          {choice.label ?? choice.name}
          {choice.enabled ? "" : isEn ? " (disabled)" : "（已停用）"}
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
  const { locale } = useI18n();
  return (
    <select value={model} onChange={(e) => onChange(e.target.value)}>
      {models.map((option) => (
        <option key={option.id} value={option.id}>
          {option.id}
          {option.sources.length > 0 && `  · ${sourceLabel(option.sources[0]!, locale)}`}
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
  const { locale } = useI18n();
  const isEn = locale === "en";
  if (efforts.length === 0) {
    return (
      <span className="note" title={isEn ? "This model does not support adjusting reasoning effort" : "该模型不支持调节思考强度"}>
        {isEn ? "Fixed" : "不可调"}
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
  const { locale } = useI18n();
  return (
    <td>
      <input
        type="checkbox"
        checked={checked}
        aria-label={locale === "en" ? `Include ${label} in scheduled runs` : `${label} 进入定时任务`}
        onChange={(e) => onChange(e.target.checked)}
      />
    </td>
  );
}
