import { useState } from "react";
import { actionFetch } from "../components/action-fetch";
import type { CapabilitySnapshot } from "@/capabilities/types";
import { CliCapabilityCard } from "./CliCapabilityCard";

const SOURCE_HINT =
  "来源：已探测 = 从 CLI 读取；已验证 = 历史运行成功过；自定义 = 手动填写；内置 = 仓库默认值，可能过时";

export function CapabilityPanel({
  catalog,
  onCatalog,
  disabled,
}: {
  catalog: CapabilitySnapshot;
  onCatalog: (next: CapabilitySnapshot) => void;
  disabled: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async (): Promise<void> => {
    setBusy(true);
    setError(null);
    try {
      const response = await actionFetch("/api/capabilities", { method: "POST" });
      const body = (await response.json()) as CapabilitySnapshot & { error?: string };
      if (!response.ok) {
        setError(body.error ?? "探测失败");
        return;
      }
      onCatalog(body);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="config-section capability">
      <header>
        <h2>CLI 能力目录</h2>
        <p>
          模型与强度档位从各家 CLI 读取。{SOURCE_HINT}
        </p>
      </header>

      <div className="cli-cards">
        {catalog.clis.map((capability) => (
          <CliCapabilityCard key={capability.cli} capability={capability} />
        ))}
      </div>

      <div className="field-row">
        <button type="button" onClick={refresh} disabled={busy || disabled}>
          {busy ? "正在探测…" : "重新探测"}
        </button>
        <span className="note">
          上次探测：{new Date(catalog.probedAt).toLocaleString("zh-CN")}
        </span>
        {error !== null && <span className="status error">{error}</span>}
      </div>
    </section>
  );
}
