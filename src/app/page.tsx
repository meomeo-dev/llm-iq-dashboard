import { cookies, headers } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/core/auth/session";
import { getRemoteNotice } from "@/core/data-source";
import { getDeployMode } from "@/core/deploy-mode";
import { DEFAULT_LOCALE, LOCALE_COOKIE, resolveLocale, type Locale } from "@/i18n";
import { CliStatusBanner } from "./components/cli-status/CliStatusBanner";
import { Dashboard } from "./components/Dashboard";
import { localizeRemoteNotice } from "./components/dashboard/dashboard-page-data";
import { loadDashboardWindow } from "./components/dashboard/dashboard-window";

/** 产物由其他进程写入，每次请求都重读，禁止构建期静态化 */
export const dynamic = "force-dynamic";

interface PageProps {
  /** day=YYYY-MM-DD：看板选中的日期（按浏览器所选时区）；缺省为今天 */
  searchParams: Promise<{ day?: string | string[] }>;
}

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

export default async function Page({ searchParams }: PageProps) {
  const { day } = await searchParams;
  const locale = await detectRequestLocale();
  const isEn = locale === "en";
  const { readonly, dataSource } = getDeployMode();
  const owner = (await verifySession((await cookies()).get(SESSION_COOKIE)?.value)) !== null;
  const isShowcase = readonly || dataSource === "remote";
  const dayKey = typeof day === "string" ? day : null;
  const { cards, runStarts, scheduleTimeZone, promptLabels, promptStandards, profiles, runsRevision } =
    await loadDashboardWindow(dayKey);

  const remoteNotice = getRemoteNotice();

  return (
    <div className="page">
      {/* 远程数据源提示或降级信息 */}
      {remoteNotice && (
        <aside className="cli-banner" role="status">
          <p>
            <b>{isEn ? "Data Notice: " : "数据提示："}</b>
            {localizeRemoteNotice(remoteNotice, locale)}
          </p>
        </aside>
      )}
      {/* CLI 登录状态与安装命令只给所有者看 */}
      {owner && <CliStatusBanner />}
      {/* 无记录时同样渲染完整看板，由时间线给出引导 */}
      <Dashboard
        owner={owner}
        readonly={readonly}
        remote={dataSource === "remote"}
        cards={cards}
        runStarts={runStarts}
        initialDay={dayKey}
        promptLabels={promptLabels}
        promptStandards={promptStandards}
        scheduleTimeZone={scheduleTimeZone}
        profiles={profiles}
        initialRunsRevision={runsRevision}
      />
    </div>
  );
}
