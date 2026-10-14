"use client";

import Link from "next/link";
import { LanguageSwitch, useI18n } from "@/i18n";

export function ConfigPageHeader({ path }: { path: string }) {
  const { locale, hasProvider } = useI18n();
  const isEn = locale === "en";
  return (
    <header className="masthead">
      <div>
        <h1>
          {isEn ? "Benchmark Configuration" : "基准配置"}
          <Link className="nav-link" href="/">
            {isEn ? "← Dashboard" : "← 看板"}
          </Link>
          {hasProvider && <LanguageSwitch />}
        </h1>
        <p className="prompt">{path}</p>
      </div>
    </header>
  );
}
