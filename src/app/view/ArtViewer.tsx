"use client";

import type { ProfileView } from "@/core/profile-view";
import type { PromptStandard } from "@/core/prompt";
import type { DashboardCard } from "@/core/types";
import { SvgFrame } from "../components/card/SvgFrame";
import { ProfilesProvider } from "../components/profile/profiles-context";
import { ArtViewerHead } from "./ArtViewerHead";
import { ArtViewerFoot } from "./ArtViewerFoot";

/**
 * 单件作品查看页：顶部元信息，下方白底画布按比例放大净化后的作品。
 * “原始 SVG”链接指向 /art 路由，由其 CSP 沙箱响应头隔离。
 * 底部提供抽屉：原提示词与该题目的客观黄金标准（Ground Truth）及判断规则。
 */
export function ArtViewer({
  card,
  svg,
  standard,
  siblings = [],
  profiles = [],
  owner = false,
}: {
  card: DashboardCard;
  svg: string;
  standard?: PromptStandard | null;
  /** 同轮同模型同强度同题的作品（含当前），供上游切换 */
  siblings?: readonly DashboardCard[];
  profiles?: readonly ProfileView[];
  owner?: boolean;
}) {
  return (
    <ProfilesProvider value={{ profiles, owner }}>
      <div className="viewer">
        <ArtViewerHead card={card} siblings={siblings} />
        <main className="viewer-stage">
          <SvgFrame source={svg} className="viewer-frame" />
        </main>
        <ArtViewerFoot card={card} standard={standard} />
      </div>
    </ProfilesProvider>
  );
}
