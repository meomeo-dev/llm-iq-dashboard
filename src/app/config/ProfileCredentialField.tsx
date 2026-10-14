import { useState } from "react";
import type { ProfileCredentialStatus } from "@/core/profile-credentials";
import { useI18n } from "@/i18n/context";
import type { CredentialOutcome } from "./use-profile-credentials";

/**
 * 单个 profile 的 API key 输入。输入框只写不读：已填时只显示填入时刻，
 * 输入内容提交成功后立即清空，不留在页面状态里。
 * 服务端只接受配置文件里已有的 profile（key 文件按名字存放），所以未保存的 profile
 * 点"保存 key"时先保存整份配置，再写 key。
 */
export function ProfileCredentialField({
  saved,
  status,
  onEnsureSaved,
  onSave,
  onDelete,
}: {
  /** profile 已写进配置文件 */
  saved: boolean;
  status: ProfileCredentialStatus | undefined;
  onEnsureSaved: () => Promise<boolean>;
  onSave: (apiKey: string) => Promise<CredentialOutcome>;
  onDelete: () => Promise<CredentialOutcome>;
}) {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  const run = async (action: () => Promise<CredentialOutcome>, done: string): Promise<void> => {
    setBusy(true);
    const outcome = await action();
    setBusy(false);
    setMessage(outcome.ok ? { kind: "ok", text: done } : { kind: "error", text: outcome.error });
    if (outcome.ok) setDraft("");
  };

  const saveKey = async (): Promise<CredentialOutcome> => {
    if (!saved && !(await onEnsureSaved())) {
      return {
        ok: false,
        error: isEn
          ? "Configuration save failed (see bottom action bar); API key was not written"
          : "配置没有保存成功（原因见底部操作栏），key 未写入",
      };
    }
    return onSave(draft);
  };

  const stateText =
    status === undefined
      ? isEn ? "Not set" : "未填"
      : `${isEn ? "Set" : "已填"} · ${new Date(status.updatedAt).toLocaleString()}`;
  const placeholderText =
    status === undefined
      ? isEn ? "Paste API key" : "粘贴 API key"
      : isEn ? "Paste new key to replace" : "粘贴新 key 以替换";
  const saveLabel = saved
    ? isEn ? "Save Key" : "保存 key"
    : isEn ? "Save Config & Write Key" : "保存配置并写入 key";

  return (
    <div className="profile-key">
      <label>
        API key
        <span className="profile-key-state">{stateText}</span>
        <input
          type="password"
          autoComplete="off"
          value={draft}
          placeholder={placeholderText}
          onChange={(e) => setDraft(e.target.value)}
        />
      </label>
      <div className="field-row">
        <button type="button" disabled={busy || draft.trim() === ""} onClick={() => run(saveKey, isEn ? "Saved" : "已保存")}>
          {saveLabel}
        </button>
        {status !== undefined && (
          <button type="button" className="danger" disabled={busy} onClick={() => run(onDelete, isEn ? "Deleted" : "已删除")}>
            {isEn ? "Delete Key" : "删除 key"}
          </button>
        )}
        {message !== null && <span className={`status ${message.kind}`}>{message.text}</span>}
      </div>
    </div>
  );
}
