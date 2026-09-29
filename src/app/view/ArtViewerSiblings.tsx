"use client";

import { useEffect } from "react";
import { profileLabel } from "@/core/profile-view";
import { DEFAULT_PROFILE, type DashboardCard } from "@/core/types";
import { viewHref } from "../components/card/card-format";
import { profileColor } from "../components/profile/profile-color";
import { useProfiles } from "../components/profile/profiles-context";
import { upstreamOf } from "../components/timeline/effort-slots";

interface ArtViewerSiblingsProps {
  current: DashboardCard;
  /** 同一轮、同模型、同强度、同题的全部作品（含当前），登录态在前、其余按配置顺序 */
  siblings: readonly DashboardCard[];
}

/** 同轮上游切换条：左右箭头或 ← → 键切到相邻上游的作品，当前项高亮 */
export function ArtViewerSiblings({ current, siblings }: ArtViewerSiblingsProps) {
  const { profiles } = useProfiles();
  const index = siblings.findIndex((card) => card.targetId === current.targetId);
  // 当前作品不在清单里（载入窗口没覆盖到这一轮）时不提供切换
  const prev = index === -1 ? null : (siblings[index - 1] ?? null);
  const next = index === -1 ? null : (siblings[index + 1] ?? null);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.key === "ArrowLeft" ? prev : event.key === "ArrowRight" ? next : null;
      const href = target === null ? null : viewHref(target);
      // 整页跳转：作品由服务端按 runId 与文件名载入，无需保留客户端状态
      if (href !== null) window.location.assign(href);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [prev, next]);
  if (index === -1 || siblings.length < 2) return null;

  return (
    <nav className="viewer-siblings" aria-label="同轮上游切换">
      <Arrow card={prev} label="←" title="上一个上游（←）" />
      <span className="viewer-siblings-list">
        {siblings.map((card) => {
          const name = upstreamOf(card);
          return (
            <a
              key={card.targetId}
              className="viewer-sibling"
              href={viewHref(card) ?? "#"}
              aria-current={card.targetId === current.targetId ? "page" : undefined}
              title={profileLabel(name, profiles)}
            >
              {name !== DEFAULT_PROFILE && <span className="profile-dot" style={{ background: profileColor(name) }} aria-hidden="true" />}
              {profileLabel(name, profiles)}
            </a>
          );
        })}
      </span>
      <Arrow card={next} label="→" title="下一个上游（→）" />
    </nav>
  );
}

function Arrow({ card, label, title }: { card: DashboardCard | null; label: string; title: string }) {
  const href = card === null ? null : viewHref(card);
  return (
    <a className="viewer-siblings-arrow" href={href ?? "#"} aria-disabled={href === null} title={title}>
      {label}
    </a>
  );
}
