import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import { SESSION_COOKIE, verifySession } from "@/core/auth/session";
import { commandHint } from "@/core/command-hint";
import { isReadonly } from "@/core/deploy-mode";
import { DEFAULT_LOCALE, getMessages, LOCALE_COOKIE, resolveLocale } from "@/i18n";
import { PairForm } from "./PairForm";
import { PairPageHeader } from "./PairPageHeader";
import "./pair.css";

/** 会话状态每次请求都要重读 */
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const cookieStore = await cookies();
    const headerStore = await headers();
    const locale = resolveLocale(
      cookieStore.get(LOCALE_COOKIE)?.value ?? null,
      headerStore.get("accept-language"),
    );
    return { title: getMessages(locale).common.pairPageTitle };
  } catch {
    return { title: getMessages(DEFAULT_LOCALE).common.pairPageTitle };
  }
}

interface PageProps {
  /** next=/config：配对成功后回到的页面，只接受站内路径 */
  searchParams: Promise<{ next?: string | string[] }>;
}

export default async function PairPage({ searchParams }: PageProps) {
  if (isReadonly()) notFound();
  const { next } = await searchParams;
  const returnTo = typeof next === "string" && next.startsWith("/") && !next.startsWith("//") ? next : "/";
  const owner = await verifySession((await cookies()).get(SESSION_COOKIE)?.value);

  return (
    <main className="page pair-page">
      <PairPageHeader command={commandHint("pnpm pair")} />
      <PairForm returnTo={returnTo} signedInAs={owner?.deviceName ?? null} />
    </main>
  );
}
