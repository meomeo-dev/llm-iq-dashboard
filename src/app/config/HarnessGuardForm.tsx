"use client";

import { DEFAULT_HARNESS_GUARD_TEXT, type HarnessGuardConfig } from "@/core/config/types";

/** 直出约束：开关 + 附加原文；原文可按客户要求改成别的语言或措辞，一键恢复缺省英文 */
export function HarnessGuardForm({
  value,
  onChange,
}: {
  value: HarnessGuardConfig;
  onChange: (next: HarnessGuardConfig) => void;
}) {
  const isDefault = value.text.trim() === DEFAULT_HARNESS_GUARD_TEXT;
  return (
    <div className="stack">
      <label className="checkbox">
        <input type="checkbox" checked={value.enabled} onChange={(e) => onChange({ ...value, enabled: e.target.checked })} />
        在每条提示词末尾附上直出约束（另起一段；题目原文本身不改，classic-v1 仍逐字保留）
      </label>
      <label className="harness-guard-text">
        附加的原文
        <textarea
          rows={4}
          value={value.text}
          disabled={!value.enabled}
          placeholder={DEFAULT_HARNESS_GUARD_TEXT}
          onChange={(e) => onChange({ ...value, text: e.target.value })}
        />
      </label>
      <div className="field-row">
        <button type="button" disabled={!value.enabled || isDefault} onClick={() => onChange({ ...value, text: DEFAULT_HARNESS_GUARD_TEXT })}>
          恢复缺省英文
        </button>
        {value.enabled && value.text.trim() === "" && <span className="note">原文为空时保存会按缺省英文写入</span>}
      </div>
    </div>
  );
}
