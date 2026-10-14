import { useState } from "react";
import { useI18n, type Locale } from "@/i18n";
import { parseModelList } from "./profile-panel-model";
import type { ModelSyncOutcome } from "./use-profile-credentials";

function syncButtonTitle(canSync: boolean, isEn: boolean): string {
  if (canSync) return isEn ? "Query upstream /models endpoint" : "请求上游的 /models 接口";
  return isEn ? "Save config and set API key first" : "先保存配置并填好 API key";
}

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
  onSync: (locale?: Locale) => Promise<ModelSyncOutcome>;
}) {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const [text, setText] = useState(models.join(", "));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  const sync = async (): Promise<void> => {
    setBusy(true);
    const outcome = await onSync(locale);
    setBusy(false);
    if (!outcome.ok) {
      setMessage({ kind: "error", text: outcome.error });
      return;
    }
    setText(outcome.models.join(", "));
    onChange(outcome.models);
    const okText = isEn
      ? `Upstream returned ${outcome.models.length} model(s); trim unneeded ones and save config`
      : `上游返回 ${outcome.models.length} 个模型，删掉不测的再保存配置`;
    setMessage({ kind: "ok", text: okText });
  };

  return (
    <div className="profile-wide profile-models">
      <label>
        {isEn ? "Models (comma or space separated)" : "模型（逗号或空格分隔）"}
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
        <button type="button" disabled={!canSync || busy} title={syncButtonTitle(canSync, isEn)} onClick={sync}>
          {busy ? (isEn ? "Syncing…" : "同步中…") : isEn ? "Sync from Upstream" : "从上游同步"}
        </button>
        {message !== null && <span className={`status ${message.kind}`}>{message.text}</span>}
      </div>
    </div>
  );
}
