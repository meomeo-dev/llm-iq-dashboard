import { useState } from "react";
import { useI18n } from "@/i18n";
import { actionFetch } from "../components/action-fetch";
import type { CapabilitySnapshot } from "@/capabilities/types";
import { CliCapabilityCard } from "./CliCapabilityCard";

const SOURCE_HINT_ZH =
  "来源：已探测 = 从 CLI 读取；已验证 = 历史运行成功过；自定义 = 手动填写；内置 = 仓库默认值，可能过时";
const SOURCE_HINT_EN =
  "Sources: probed = read from CLI; verified = succeeded in historical runs; custom = manually added; builtin = repo fallback (may be outdated)";

export function CapabilityPanel({
  catalog,
  onCatalog,
  disabled,
}: {
  catalog: CapabilitySnapshot;
  onCatalog: (next: CapabilitySnapshot) => void;
  disabled: boolean;
}) {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async (): Promise<void> => {
    setBusy(true);
    setError(null);
    try {
      const response = await actionFetch("/api/capabilities", { method: "POST" });
      const body = (await response.json()) as CapabilitySnapshot & { error?: string };
      if (!response.ok) {
        setError(body.error ?? (isEn ? "Probe failed" : "探测失败"));
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
    <section id="capability" className="config-section capability">
      <header>
        <h2>{isEn ? "CLI Capabilities" : "CLI 能力目录"}</h2>
        <p>
          {isEn
            ? `Models and effort tiers probed from each CLI. ${SOURCE_HINT_EN}`
            : `模型与强度档位从各家 CLI 读取。${SOURCE_HINT_ZH}`}
        </p>
      </header>

      <div className="cli-cards">
        {catalog.clis.map((capability) => (
          <CliCapabilityCard key={capability.cli} capability={capability} />
        ))}
      </div>

      <div className="field-row">
        <button type="button" onClick={refresh} disabled={busy || disabled}>
          {busy ? (isEn ? "Probing…" : "正在探测…") : isEn ? "Re-probe" : "重新探测"}
        </button>
        {/* 服务端与浏览器时区不同，本地化时间的水合文本允许不一致 */}
        <span className="note" suppressHydrationWarning>
          {isEn
            ? `Last probed: ${new Date(catalog.probedAt).toLocaleString("en-US")}`
            : `上次探测：${new Date(catalog.probedAt).toLocaleString("zh-CN")}`}
        </span>
        {error !== null && <span className="status error">{error}</span>}
      </div>
    </section>
  );
}
