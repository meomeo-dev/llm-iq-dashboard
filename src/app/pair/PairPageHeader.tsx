"use client";

import { PageHeader } from "@/app/components/ui/PageHeader";
import { LanguageSwitch, useI18n } from "@/i18n";

export function PairPageHeader({ command }: { command: string }) {
  const { locale, hasProvider } = useI18n();
  const isEn = locale === "en";
  return (
    <PageHeader
      className="masthead"
      title={isEn ? "Owner Sign-In" : "所有者登录"}
      subtitle={
        isEn ? (
          <>
            Run <code>{command}</code> on the host running the dashboard and paste the printed pairing code below.
          </>
        ) : (
          <>
            在运行看板的机器上执行 <code>{command}</code>，把打印出的配对码填到下面。
          </>
        )
      }
      backHref="/"
      backLabel={isEn ? "← Dashboard" : "← 看板"}
      actionsSlot={hasProvider ? <LanguageSwitch /> : undefined}
    />
  );
}
