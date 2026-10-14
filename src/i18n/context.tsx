"use client";

/**
 * 全局客户端语言上下文（I18nProvider）与语言切换按钮（LanguageSwitch）。
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getMessages, type Messages } from "./messages";
import {
  DEFAULT_LOCALE,
  formatText,
  isLocale,
  LOCALE_COOKIE,
  resolveLocale,
  type Locale,
} from "./types";

export interface I18nContextValue {
  locale: Locale;
  setLocale: (next: Locale) => void;
  toggleLocale: () => void;
  t: Messages;
  format: (template: string, params?: Record<string, string | number>) => string;
  hasProvider: boolean;
}

const I18nContext = createContext<I18nContextValue>({
  locale: "zh-CN",
  setLocale: () => {},
  toggleLocale: () => {},
  t: getMessages("zh-CN"),
  format: formatText,
  hasProvider: false,
});

function readClientStoredLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(LOCALE_COOKIE);
    if (isLocale(stored)) return stored;
  } catch {
    // 忽略隐私模式 localStorage 异常
  }
  const cookieMatch = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${LOCALE_COOKIE}=`));
  if (cookieMatch) {
    const raw = decodeURIComponent(cookieMatch.slice(LOCALE_COOKIE.length + 1));
    if (isLocale(raw)) return raw;
  }
  return null;
}

function syncDocumentTitle(locale: Locale): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  const { common } = getMessages(locale);
  const path = window.location.pathname;
  if (path.startsWith("/config")) {
    document.title = common.configPageTitle;
  } else if (path.startsWith("/pair")) {
    document.title = common.pairPageTitle;
  } else if (path.startsWith("/view/")) {
    document.title =
      locale === "en"
        ? document.title
            .replace(/^作品不存在 · 鹈鹕自行车基准$/, "Artwork Not Found · Pelican Benchmark")
            .replace(/· 鹈鹕自行车基准$/, "· Pelican Benchmark")
        : document.title
            .replace(/^Artwork Not Found · Pelican Benchmark$/, "作品不存在 · 鹈鹕自行车基准")
            .replace(/· Pelican Benchmark$/, "· 鹈鹕自行车基准");
  } else {
    document.title = common.siteTitle;
  }
}

function persistClientLocale(locale: Locale): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCALE_COOKIE, locale);
  } catch {
    // 忽略隐私模式 localStorage 异常
  }
  document.cookie = `${LOCALE_COOKIE}=${encodeURIComponent(locale)}; path=/; max-age=31536000; SameSite=Lax`;
  document.documentElement.lang = locale;
  syncDocumentTitle(locale);
}

export function I18nProvider({
  initialLocale = DEFAULT_LOCALE,
  children,
}: {
  initialLocale?: Locale;
  children: ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    const effective = readClientStoredLocale() ?? resolveLocale(null, navigator.language);
    if (effective !== locale) setLocaleState(effective);
    persistClientLocale(effective);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    persistClientLocale(next);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === "zh-CN" ? "en" : "zh-CN");
  }, [locale, setLocale]);

  const value = useMemo<I18nContextValue>(
    () => ({ locale, setLocale, toggleLocale, t: getMessages(locale), format: formatText, hasProvider: true }),
    [locale, setLocale, toggleLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  return useContext(I18nContext);
}

export function LanguageSwitch({ className }: { className?: string }) {
  const { locale, toggleLocale, t } = useI18n();
  const cls = className ? `lang-switch ${className}` : "lang-switch";
  return (
    <button
      type="button"
      className={cls}
      onClick={toggleLocale}
      title={t.common.languageSwitchTitle}
      aria-label={t.common.languageSwitchTitle}
      data-locale={locale}
    >
      {t.common.languageSwitchLabel}
    </button>
  );
}
