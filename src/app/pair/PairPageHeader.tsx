"use client";

import Link from "next/link";
import { LanguageSwitch, useI18n } from "@/i18n";

export function PairPageHeader({ command }: { command: string }) {
  const { locale, hasProvider } = useI18n();
  const isEn = locale === "en";
  return (
    <header className="masthead">
      <div>
        <h1>
          {isEn ? "Owner Sign-In" : "所有者登录"}
          <Link className="nav-link" href="/">
            {isEn ? "← Dashboard" : "← 看板"}
          </Link>
          {hasProvider && <LanguageSwitch />}
        </h1>
        <p className="prompt">
          {isEn ? (
            <>
              Run <code>{command}</code> on the host running the dashboard and paste the printed pairing code below.
            </>
          ) : (
            <>
              在运行看板的机器上执行 <code>{command}</code>，把打印出的配对码填到下面。
            </>
          )}
        </p>
      </div>
    </header>
  );
}
