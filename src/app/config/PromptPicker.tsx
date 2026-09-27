import { useState } from "react";
import type { PromptSpec } from "@/core/prompt";
import type { VariableMode, VariableSpec } from "@/core/variables";

const MODES: readonly VariableMode[] = ["sequence", "shuffle", "random", "fixed"];

const MODE_HINT: Record<VariableMode, string> = {
  sequence: "顺序轮换，游标持久化，N 轮内必定覆盖全部取值",
  shuffle: "洗牌后依次取：顺序随机，取完一遍之前不重复",
  random: "每轮随机取一个，可能连续撞上同一个值",
  fixed: "固定不变，用于钉住某个变量避免干扰对比",
};

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

  const toggle = (id: string): void => {
    // 至少保留一条，否则调度器空转
    if (enabled.includes(id)) {
      if (enabled.length === 1) return;
      onEnabled(enabled.filter((item) => item !== id));
      return;
    }
    onEnabled([...enabled, id]);
  };

  const addCustom = (): void => {
    const id = uniqueId(all.map((spec) => spec.id));
    onCustom([
      ...custom,
      {
        id,
        label: "自定义提示词",
        template: "Generate an SVG of a {{animal}} riding a bicycle",
        variables: [{ name: "animal", mode: "sequence", values: ["pelican", "capybara"] }],
        candidates: [],
        source: null,
        verified: false,
        immutable: false,
      },
    ]);
  };

  const updateCustom = (index: number, next: PromptSpec): void => {
    onCustom(custom.map((spec, i) => (i === index ? next : spec)));
  };

  return (
    <div className="stack">
      <div className="prompt-list">
        {all.map((spec) => (
          <label key={spec.id} className="prompt-item">
            <input
              type="checkbox"
              checked={enabled.includes(spec.id)}
              onChange={() => toggle(spec.id)}
            />
            <div>
              <div className="prompt-head">
                <b>{spec.label}</b>
                <code>{spec.id}</code>
                {/* 原文条目是与外部结果对齐的锚点；候选集同样锁定，但不是锚点 */}
                {spec.immutable && (
                  <span className="badge lock">{spec.candidates.length > 0 ? "内置·不可编辑" : "锚点·不可编辑"}</span>
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
                <div className="prompt-candidates">{spec.candidates.map((candidate) => candidate.label).join(" · ")}</div>
              )}
            </div>
          </label>
        ))}
      </div>

      {custom.map((spec, index) => (
        <CustomPromptEditor
          key={spec.id}
          spec={spec}
          onChange={(next) => updateCustom(index, next)}
          onRemove={() => {
            onCustom(custom.filter((_, i) => i !== index));
            onEnabled(enabled.filter((id) => id !== spec.id));
          }}
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

function CustomPromptEditor({
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
    onChange({ ...spec, variables: variables.map((v, i) => (i === index ? next : v)) });
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

          {variables.map((variable, index) => (
            <div key={index} className="variable-row">
              <input
                type="text"
                value={variable.name}
                placeholder="变量名"
                onChange={(e) => setVariable(index, { ...variable, name: e.target.value })}
              />
              <select
                value={variable.mode}
                onChange={(e) =>
                  setVariable(index, { ...variable, mode: e.target.value as VariableMode })
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
                  setVariable(index, {
                    ...variable,
                    values: e.target.value
                      .split(",")
                      .map((v) => v.trim())
                      .filter((v) => v !== ""),
                  })
                }
              />
              <button
                type="button"
                className="danger"
                onClick={() =>
                  onChange({
                    ...spec,
                    variables: variables.filter((_, i) => i !== index),
                  })
                }
              >
                ×
              </button>
              <span className="note">{MODE_HINT[variable.mode]}</span>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              onChange({
                ...spec,
                variables: [...variables, { name: "", mode: "sequence", values: [] }],
              })
            }
          >
            + 增加变量
          </button>
        </div>
      )}
    </div>
  );
}

/** 生成不与现有条目冲突的 id */
function uniqueId(taken: readonly string[]): string {
  for (let n = 1; ; n += 1) {
    const candidate = `custom-${n}`;
    if (!taken.includes(candidate)) return candidate;
  }
}
