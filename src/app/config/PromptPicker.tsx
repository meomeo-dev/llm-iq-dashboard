import type { PromptSpec } from "@/core/prompt";
import { localizePromptSpec } from "@/core/prompts/i18n";
import { useI18n } from "@/i18n";
import {
  togglePromptId,
  createCustomPrompt,
  updateCustomPromptAtIndex,
  removeCustomPromptAtIndex,
  formatPromptTemplateDisplay,
} from "./prompt-picker-model";
import { CustomPromptEditor } from "./CustomPromptEditor";

export function PromptPicker({
  builtins,
  custom,
  enabled,
  onEnabled,
  onCustom,
}: {
  builtins: PromptSpec[];
  custom: PromptSpec[];
  enabled: string[];
  onEnabled: (ids: string[]) => void;
  onCustom: (prompts: PromptSpec[]) => void;
}) {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const all = [...builtins, ...custom];
  const toggle = (id: string) => onEnabled(togglePromptId(enabled, id));
  const addCustom = () => onCustom([...custom, createCustomPrompt(all.map((s) => s.id), locale)]);
  const updateCustom = (index: number, next: PromptSpec) =>
    onCustom(updateCustomPromptAtIndex(custom, index, next));
  const removeCustom = (index: number, specId: string) => {
    onCustom(removeCustomPromptAtIndex(custom, index));
    onEnabled(enabled.filter((id) => id !== specId));
  };

  return (
    <div className="stack">
      <div className="prompt-list">
        {all.map((spec) => (
          <PromptItem
            key={spec.id}
            spec={spec}
            checked={enabled.includes(spec.id)}
            onToggle={() => toggle(spec.id)}
          />
        ))}
      </div>

      {custom.map((spec, index) => (
        <CustomPromptEditor
          key={spec.id}
          spec={spec}
          onChange={(next) => updateCustom(index, next)}
          onRemove={() => removeCustom(index, spec.id)}
        />
      ))}

      <div className="field-row">
        <button type="button" onClick={addCustom}>
          {isEn ? "+ Add Custom Prompt" : "+ 新建自定义提示词"}
        </button>
      </div>
    </div>
  );
}

function PromptItemBadges({ spec, isEn }: { spec: PromptSpec; isEn: boolean }) {
  return (
    <>
      {spec.immutable && (
        <span className="badge lock">
          {spec.candidates.length > 0
            ? isEn ? "Built-in · Read-only" : "内置·不可编辑"
            : isEn ? "Anchor · Read-only" : "锚点·不可编辑"}
        </span>
      )}
      {spec.variables.length > 0 && (
        <span className="badge">
          {isEn ? `${spec.variables.length} variables` : `${spec.variables.length} 个变量`}
        </span>
      )}
      {spec.candidates.length > 0 && (
        <span className="badge">
          {isEn ? `${spec.candidates.length} candidates` : `${spec.candidates.length} 条候选`}
        </span>
      )}
      {spec.originDate && (
        <span
          className="badge"
          title={isEn ? `First appeared: ${spec.originDate}` : `首次出现时间：${spec.originDate}`}
        >
          {isEn ? `Origin: ${spec.originDate}` : `首发: ${spec.originDate}`}
        </span>
      )}
      {spec.registeredAt && (
        <span
          className="badge"
          title={isEn ? `Registered date: ${spec.registeredAt}` : `收录日期：${spec.registeredAt}`}
        >
          {isEn ? `Added: ${spec.registeredAt}` : `收录: ${spec.registeredAt}`}
        </span>
      )}
    </>
  );
}

function PromptItem({
  spec,
  checked,
  onToggle,
}: {
  spec: PromptSpec;
  checked: boolean;
  onToggle: () => void;
}) {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const displaySpec = isEn ? localizePromptSpec(spec, locale) : spec;
  return (
    <label className="prompt-item">
      <input type="checkbox" checked={checked} onChange={onToggle} />
      <div>
        <div className="prompt-head">
          <b>{displaySpec.label}</b>
          <code>{displaySpec.id}</code>
          <PromptItemBadges spec={displaySpec} isEn={isEn} />
        </div>
        <div className="prompt-template">{formatPromptTemplateDisplay(displaySpec, locale)}</div>
        {displaySpec.candidates.length > 0 && (
          <div className="prompt-candidates">
            {displaySpec.candidates.map((candidate) => candidate.label).join(" · ")}
          </div>
        )}
      </div>
    </label>
  );
}
