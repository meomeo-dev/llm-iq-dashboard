import { useState } from "react";
import type { ProfileConfig } from "@/core/config";
import { addUpstreamType, upstreamTypeInUse } from "./profile-panel-model";

/** 上游类型清单：profile 的 upstreamType 只能取其中之一；被 profile 使用中的不能删 */
export function UpstreamTypeEditor({
  types,
  profiles,
  onChange,
}: {
  types: readonly string[];
  profiles: readonly ProfileConfig[];
  onChange: (next: string[]) => void;
}) {
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);

  const add = (): void => {
    const result = addUpstreamType(types, draft);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setError(null);
    setDraft("");
    onChange(result.next);
  };

  return (
    <div className="upstream-types">
      <span className="note">上游类型</span>
      <ul className="upstream-type-list">
        {types.map((type) => {
          const inUse = upstreamTypeInUse(profiles, type);
          return (
            <li key={type} className="upstream-type-chip">
              {type}
              <button
                type="button"
                aria-label={`删除上游类型 ${type}`}
                disabled={inUse || types.length === 1}
                title={inUse ? "有 profile 正在使用" : undefined}
                onClick={() => onChange(types.filter((item) => item !== type))}
              >
                ×
              </button>
            </li>
          );
        })}
      </ul>
      <div className="field-row">
        <input
          type="text"
          value={draft}
          placeholder="新类型，如 chatgpt-pro-10x"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") add();
          }}
        />
        <button type="button" onClick={add} disabled={draft.trim() === ""}>
          添加
        </button>
        {error !== null && <span className="status error">{error}</span>}
      </div>
    </div>
  );
}
