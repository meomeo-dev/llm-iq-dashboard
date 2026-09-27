import type { PromptSpec } from "@/core/prompt";
import {
  togglePromptId,
  createCustomPrompt,
  updateCustomPromptAtIndex,
  removeCustomPromptAtIndex,
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
  const all = [...builtins, ...custom];
  const toggle = (id: string) => onEnabled(togglePromptId(enabled, id));
  const addCustom = () => onCustom([...custom, createCustomPrompt(all.map((s) => s.id))]);
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
          + 新建自定义提示词
        </button>
      </div>
    </div>
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
  return (
    <label className="prompt-item">
      <input type="checkbox" checked={checked} onChange={onToggle} />
      <div>
        <div className="prompt-head">
          <b>{spec.label}</b>
          <code>{spec.id}</code>
          {spec.immutable && (
            <span className="badge lock">
              {spec.candidates.length > 0 ? "内置·不可编辑" : "锚点·不可编辑"}
            </span>
          )}
          {spec.variables.length > 0 && (
            <span className="badge">{spec.variables.length} 个变量</span>
          )}
          {spec.candidates.length > 0 && (
            <span className="badge">{spec.candidates.length} 条候选</span>
          )}
          {spec.originDate && (
            <span className="badge" title={`首次出现时间：${spec.originDate}`}>
              首发: {spec.originDate}
            </span>
          )}
          {spec.registeredAt && (
            <span className="badge" title={`收录日期：${spec.registeredAt}`}>
              收录: {spec.registeredAt}
            </span>
          )}
        </div>
        <div className="prompt-template">{spec.template}</div>
        {spec.candidates.length > 0 && (
          <div className="prompt-candidates">
            {spec.candidates.map((candidate) => candidate.label).join(" · ")}
          </div>
        )}
      </div>
    </label>
  );
}
