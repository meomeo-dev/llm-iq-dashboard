import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/core/auth/session";
import { listRunStarts, loadCardsBetween, getRemoteNotice } from "@/core/data-source";
import { getDeployMode } from "@/core/deploy-mode";
import { CliStatusBanner } from "./components/cli-status/CliStatusBanner";
import { Dashboard } from "./components/Dashboard";
import {
  buildPromptStandards,
  cardWindow,
  readDashboardSettings,
  sortNewestFirst,
} from "./components/dashboard/dashboard-page-data";

/** 产物由其他进程写入，每次请求都重读，禁止构建期静态化 */
export const dynamic = "force-dynamic";

interface PageProps {
  /** day=YYYY-MM-DD：看板选中的日期（按浏览器所选时区）；缺省为今天 */
  searchParams: Promise<{ day?: string | string[] }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { day } = await searchParams;
  const { readonly, dataSource } = getDeployMode();
  const owner = (await verifySession((await cookies()).get(SESSION_COOKIE)?.value)) !== null;
  const isShowcase = readonly || dataSource === "remote";
  const dayKey = typeof day === "string" ? day : null;
  const runStarts = await listRunStarts();
  // 只读或远程展台下，未显式指定日期时默认按最新轮次所在日期拉取卡片，确保访客首屏不为空
  const effectiveDayKey =
    dayKey ?? (isShowcase && runStarts.length > 0 ? runStarts[0]?.slice(0, 10) ?? null : null);
  const range = cardWindow(effectiveDayKey, new Date());
  const cards = sortNewestFirst(await loadCardsBetween(range.from, range.to));

  const remoteNotice = getRemoteNotice();
  const { prompts, scheduleTimeZone, profiles } = readDashboardSettings();
  const promptLabels = Object.fromEntries(prompts.map((spec) => [spec.id, spec.label]));
  const promptStandards = buildPromptStandards(prompts);

  return (
    <div className="page">
      {/* 远程数据源提示或降级信息 */}
      {remoteNotice && (
        <aside className="cli-banner" role="status" style={{ borderLeftColor: "var(--warn)" }}>
          <p>
            <b>数据提示：</b>
            {remoteNotice}
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
      />
    </div>
  );
}
