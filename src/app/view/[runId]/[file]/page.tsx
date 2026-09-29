import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { SESSION_COOKIE, verifySession } from "@/core/auth/session";
import { loadArt, loadCard, loadCardsBetween } from "@/core/data-source";
import { orderProfileNames, profileLabel, type ProfileView } from "@/core/profile-view";
import { resolvePromptStandard } from "@/core/prompt";
import { DEFAULT_PROFILE, type DashboardCard } from "@/core/types";
import { readDashboardSettings } from "../../../components/dashboard/dashboard-page-data";
import { ArtViewer } from "../../ArtViewer";
import "../../../components/card/cards.css";
import "../../../components/profile/profile.css";
import "../../viewer.css";

/** 产物由调度进程写入，且会按保留期删除：每次请求都重读 */
export const dynamic = "force-dynamic";

interface ViewPageProps {
  params: Promise<{ runId: string; file: string }>;
}

/** 单件作品的单独查看页：`/view/<runId>/<svgFile>`，作品占满窗口 */
export default async function ViewPage({ params }: ViewPageProps) {
  const { runId, file } = await params;
  const art = await loadArt(runId, file);
  if (art === null || art.svg === null) notFound();
  const standard = resolvePromptStandard(art.card.promptId, art.card.bindings);
  const { profiles } = readDashboardSettings();
  const owner = (await verifySession((await cookies()).get(SESSION_COOKIE)?.value)) !== null;
  const siblings = await loadSiblings(art.card, profiles);
  return <ArtViewer card={art.card} svg={art.svg} standard={standard} siblings={siblings} profiles={profiles} owner={owner} />;
}

/**
 * 同一轮、同模型、同强度、同题、抽出了 SVG 的作品（含当前），登录态在前、其余按配置顺序。
 * 只有登录态一件时返回它自己，切换条不出现。
 */
async function loadSiblings(card: DashboardCard, profiles: readonly ProfileView[]): Promise<DashboardCard[]> {
  const startedAt = new Date(card.runStartedAt);
  if (Number.isNaN(startedAt.getTime())) return [card];
  // 轮次按开始时刻取整到秒登记；前后各放一秒余量，再按 runId 精确过滤
  const around = await loadCardsBetween(new Date(startedAt.getTime() - 1000), new Date(startedAt.getTime() + 2000));
  const same = around.filter(
    (item) =>
      item.runId === card.runId && item.cli === card.cli && item.model === card.model &&
      item.effort === card.effort && item.promptId === card.promptId && item.svgFile !== null,
  );
  const order = orderProfileNames(same.map((item) => item.profile ?? DEFAULT_PROFILE), profiles);
  return same.sort((a, b) => order.indexOf(a.profile ?? DEFAULT_PROFILE) - order.indexOf(b.profile ?? DEFAULT_PROFILE));
}

export async function generateMetadata({ params }: ViewPageProps): Promise<Metadata> {
  const { runId, file } = await params;
  const card = await loadCard(runId, file);
  if (card === null) return { title: "作品不存在 · 鹈鹕自行车基准" };
  const scene = Object.values(card.bindings).join(" · ");
  // 经上游的目标显示名本就含上游名，标题改按 model · effort · 上游显示名 拼，避免重复
  const heading =
    card.profile === undefined
      ? card.label
      : `${card.model} · ${card.effort} · ${profileLabel(card.profile, readDashboardSettings().profiles)}`;
  return { title: [heading, scene].filter(Boolean).join(" · ") };
}
