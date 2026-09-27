import { useState } from "react";
import type { PromptSpec } from "@/core/prompt";
import type { VariableMode, VariableSpec } from "@/core/variables";
import {
  MODES,
  MODE_HINT,
  updateVariableAtIndex,
  removeVariableAtIndex,
  createEmptyVariable,
  parseVariableValues,
} from "./prompt-picker-model";

export function CustomPromptEditor({
  spec,
  onChange,
  onRemove,
}: {
  spec: PromptSpec;
  onChange: (next: PromptSpec) => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(false);
  const variables = [...spec.variables];

  const setVariable = (index: number, next: VariableSpec): void => {
    onChange({ ...spec, variables: updateVariableAtIndex(variables, index, next) });
  };

  const removeVariable = (index: number): void => {
    onChange({ ...spec, variables: removeVariableAtIndex(variables, index) });
  };

  const addVariable = (): void => {
    onChange({ ...spec, variables: [...variables, createEmptyVariable()] });
  };

  return (
    <div className="custom-prompt">
      <div className="field-row">
        <button type="button" onClick={() => setOpen(!open)}>
          {open ? "▾" : "▸"} {spec.label}
        </button>
        <button type="button" className="danger" onClick={onRemove}>
          删除
        </button>
      </div>

      {open && (
        <div className="stack indented">
          <CustomPromptFields spec={spec} onChange={onChange} />

          {variables.map((variable, index) => (
            <VariableRow
              key={index}
              variable={variable}
              onChange={(next) => setVariable(index, next)}
              onRemove={() => removeVariable(index)}
            />
          ))}

          <button type="button" onClick={addVariable}>
            + 增加变量
          </button>
        </div>
      )}
    </div>
  );
}

function CustomPromptFields({
  spec,
  onChange,
}: {
  spec: PromptSpec;
  onChange: (next: PromptSpec) => void;
}) {
  return (
    <>
      <label>
        标识（id）
        <input
          type="text"
          value={spec.id}
          onChange={(e) => onChange({ ...spec, id: e.target.value })}
        />
      </label>
      <label>
        显示名
        <input
          type="text"
          value={spec.label}
          onChange={(e) => onChange({ ...spec, label: e.target.value })}
        />
      </label>
      <label>
        模板（用 {"{{变量名}}"} 占位）
        <textarea
          rows={3}
          value={spec.template}
          onChange={(e) => onChange({ ...spec, template: e.target.value })}
        />
      </label>
    </>
  );
}

function VariableRow({
  variable,
  onChange,
  onRemove,
}: {
  variable: VariableSpec;
  onChange: (next: VariableSpec) => void;
  onRemove: () => void;
}) {
  return (
    <div className="variable-row">
      <input
        type="text"
        value={variable.name}
        placeholder="变量名"
        onChange={(e) => onChange({ ...variable, name: e.target.value })}
      />
      <select
        value={variable.mode}
        onChange={(e) =>
          onChange({ ...variable, mode: e.target.value as VariableMode })
        }
      >
        {MODES.map((mode) => (
          <option key={mode} value={mode}>
            {mode}
          </option>
        ))}
      </select>
      <input
        type="text"
        value={variable.values.join(", ")}
        placeholder="取值，逗号分隔"
        onChange={(e) =>
          onChange({
            ...variable,
            values: parseVariableValues(e.target.value),
          })
        }
      />
      <button type="button" className="danger" onClick={onRemove}>
        ×
      </button>
      <span className="note">{MODE_HINT[variable.mode]}</span>
    </div>
  );
}
