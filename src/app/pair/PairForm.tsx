"use client";

import { useState } from "react";
import { actionFetch } from "../components/action-fetch";

type Status = { kind: "idle" } | { kind: "busy" } | { kind: "error"; message: string } | { kind: "ok" };

/** 配对码输入；已登录时改为显示当前设备与退出按钮 */
export function PairForm({ returnTo, signedInAs }: { returnTo: string; signedInAs: string | null }) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [signedIn, setSignedIn] = useState(signedInAs);

  const submit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setStatus({ kind: "busy" });
    try {
      const response = await actionFetch("/api/pair", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const body = (await response.json()) as { error?: string; device?: { name: string } };
      if (!response.ok) {
        setStatus({ kind: "error", message: body.error ?? "配对失败" });
        return;
      }
      setStatus({ kind: "ok" });
      window.location.assign(returnTo);
    } catch (cause) {
      setStatus({ kind: "error", message: cause instanceof Error ? cause.message : String(cause) });
    }
  };

  const signOut = async (): Promise<void> => {
    const response = await actionFetch("/api/session", { method: "DELETE" });
    if (response.ok) setSignedIn(null);
  };

  if (signedIn !== null) {
    return (
      <section className="pair-card">
        <p>
          本浏览器已作为 <b>{signedIn}</b> 登录。
        </p>
        <div className="actions">
          <a className="button" href={returnTo}>
            继续
          </a>
          <button type="button" onClick={() => void signOut()}>
            退出本设备
          </button>
        </div>
      </section>
    );
  }

  return (
    <form className="pair-card" onSubmit={(event) => void submit(event)}>
      <label htmlFor="pair-code">配对码</label>
      <input
        id="pair-code"
        className="pair-code"
        value={code}
        onChange={(event) => setCode(event.target.value)}
        placeholder="0000-0000-0000-0000-0000-0000-0000-0000"
        autoComplete="off"
        inputMode="numeric"
        spellCheck={false}
        required
      />
      <div className="actions">
        <button type="submit" disabled={status.kind === "busy"}>
          {status.kind === "busy" ? "配对中…" : "配对"}
        </button>
        {status.kind === "error" && <span className="pair-error">{status.message}</span>}
      </div>
    </form>
  );
}
