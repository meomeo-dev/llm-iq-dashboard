import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadArt, loadCard } from "@/core/data-source";
import { resolvePromptStandard } from "@/core/prompt";
import { ArtViewer } from "../../ArtViewer";
import "../../../components/card/cards.css";
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
  return <ArtViewer card={art.card} svg={art.svg} standard={standard} />;
}

export async function generateMetadata({ params }: ViewPageProps): Promise<Metadata> {
  const { runId, file } = await params;
  const card = await loadCard(runId, file);
  if (card === null) return { title: "作品不存在 · 鹈鹕自行车基准" };
  const scene = Object.values(card.bindings).join(" · ");
  return { title: [card.label, scene].filter(Boolean).join(" · ") };
}
