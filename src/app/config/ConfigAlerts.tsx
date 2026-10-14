"use client";

import { useI18n } from "@/i18n";

export function ConfigCatalogUnavailableAlert() {
  const { locale } = useI18n();
  const isEn = locale === "en";
  return (
    <main className="page">
      <div className="alert error">
        <strong>{isEn ? "Capability Catalog Not Probed Yet" : "能力目录尚未探测"}</strong>
        <p>
          {isEn
            ? "The runner has not responded yet. Verify the runner container is running (docker compose ps) and refresh shortly."
            : "执行器未响应。确认 runner 容器在运行（docker compose ps），稍后刷新。"}
        </p>
      </div>
    </main>
  );
}

export function ConfigLoadErrorAlert({ error }: { error: string }) {
  const { locale } = useI18n();
  const isEn = locale === "en";
  return (
    <div className="alert error">
      <strong>{isEn ? "Failed to Load Configuration" : "配置无法加载"}</strong>
      <pre>{error}</pre>
      <p>
        {isEn
          ? "Fix the configuration file directly and refresh; the UI will not overwrite a malformed config file."
          : "请直接修正该文件后刷新；界面不会在配置损坏时覆盖它。"}
      </p>
    </div>
  );
}
