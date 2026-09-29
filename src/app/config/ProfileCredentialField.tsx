import { useState } from "react";
import type { ProfileCredentialStatus } from "@/core/profile-credentials";
import type { CredentialOutcome } from "./use-profile-credentials";

/**
 * 单个 profile 的 API key 输入。输入框只写不读：已填时只显示填入时刻，
 * 输入内容提交成功后立即清空，不留在页面状态里。
 */
export function ProfileCredentialField({
  saved,
  status,
  onSave,
  onDelete,
}: {
  /** profile 已写进配置文件；未保存的 profile 还没有 key 文件名，不能填 */
  saved: boolean;
  status: ProfileCredentialStatus | undefined;
  onSave: (apiKey: string) => Promise<CredentialOutcome>;
  onDelete: () => Promise<CredentialOutcome>;
}) {
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

  if (!saved) {
    return <p className="note profile-key-hint">API key：先点页面底部"保存配置"，再回来填写。</p>;
  }

  return (
    <div className="profile-key">
      <label>
        API key
        <span className="profile-key-state">
          {status === undefined ? "未填" : `已填 · ${new Date(status.updatedAt).toLocaleString()}`}
        </span>
        <input
          type="password"
          autoComplete="off"
          value={draft}
          placeholder={status === undefined ? "粘贴 API key" : "粘贴新 key 以替换"}
          onChange={(e) => setDraft(e.target.value)}
        />
      </label>
      <div className="field-row">
        <button type="button" disabled={busy || draft.trim() === ""} onClick={() => run(() => onSave(draft), "已保存")}>
          保存 key
        </button>
        {status !== undefined && (
          <button type="button" className="danger" disabled={busy} onClick={() => run(onDelete, "已删除")}>
            删除 key
          </button>
        )}
        {message !== null && <span className={`status ${message.kind}`}>{message.text}</span>}
      </div>
    </div>
  );
}
