import { useState } from "react";
import { parseModelList } from "./profile-panel-model";
import type { ModelSyncOutcome } from "./use-profile-credentials";

/**
 * profile 的模型清单：手填，或从上游 `/models` 同步后再删改。
 * 保留原始输入，逗号打到一半时不被解析结果回写覆盖。
 */
export function ProfileModelsField({
  models,
  canSync,
  onChange,
  onSync,
}: {
  models: string[];
  /** 已保存且已填 key 才能向上游拉清单 */
  canSync: boolean;
  onChange: (models: string[]) => void;
  onSync: () => Promise<ModelSyncOutcome>;
}) {
  const [text, setText] = useState(models.join(", "));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  const sync = async (): Promise<void> => {
    setBusy(true);
    const outcome = await onSync();
    setBusy(false);
    if (!outcome.ok) {
      setMessage({ kind: "error", text: outcome.error });
      return;
    }
    setText(outcome.models.join(", "));
    onChange(outcome.models);
    setMessage({ kind: "ok", text: `上游返回 ${outcome.models.length} 个模型，删掉不测的再保存配置` });
  };

  return (
    <div className="profile-wide profile-models">
      <label>
        模型（逗号或空格分隔）
        <textarea
          rows={2}
          value={text}
          placeholder="gpt-5.5, gpt-6-mini"
          onChange={(e) => {
            setText(e.target.value);
            onChange(parseModelList(e.target.value));
          }}
        />
      </label>
      <div className="field-row">
        <button
          type="button"
          disabled={!canSync || busy}
          title={canSync ? "请求上游的 /models 接口" : "先保存配置并填好 API key"}
          onClick={sync}
        >
          {busy ? "同步中…" : "从上游同步"}
        </button>
        {message !== null && <span className={`status ${message.kind}`}>{message.text}</span>}
      </div>
    </div>
  );
}
