"use client";

import { PageHeader } from "@/app/components/ui/PageHeader";
import { LanguageSwitch, useI18n } from "@/i18n";

export function ConfigPageHeader({ path }: { path: string }) {
  const { locale, hasProvider } = useI18n();
  const isEn = locale === "en";
  return (
    <PageHeader
      className="masthead"
      title={isEn ? "Benchmark Configuration" : "基准配置"}
      subtitle={path}
      backHref="/"
      backLabel={isEn ? "← Dashboard" : "← 看板"}
      actionsSlot={hasProvider ? <LanguageSwitch /> : undefined}
    />
  );
}
