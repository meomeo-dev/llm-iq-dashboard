import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import {
  DEFAULT_LOCALE,
  getMessages,
  I18nProvider,
  LOCALE_COOKIE,
  resolveLocale,
  type Locale,
} from "../i18n";
import "./globals.css";

async function detectRequestLocale(): Promise<Locale> {
  try {
    const cookieStore = await cookies();
    const explicit = cookieStore.get(LOCALE_COOKIE)?.value ?? null;
    const headerStore = await headers();
    const acceptLanguage = headerStore.get("accept-language");
    return resolveLocale(explicit, acceptLanguage);
  } catch {
    return DEFAULT_LOCALE;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await detectRequestLocale();
  const { common } = getMessages(locale);
  return {
    title: common.siteTitle,
    description: common.siteDescription,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await detectRequestLocale();
  return (
    // 主题类浏览器扩展会在水合前改写 <html> 的属性；suppressHydrationWarning
    // 只忽略该元素自身的属性差异，子树不受影响。
    <html lang={locale} suppressHydrationWarning>
      <body>
        <I18nProvider initialLocale={locale}>{children}</I18nProvider>
      </body>
    </html>
  );
}
