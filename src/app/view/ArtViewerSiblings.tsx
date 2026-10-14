"use client";

import { useEffect } from "react";
import { profileLabel } from "@/core/profile-view";
import { DEFAULT_PROFILE, type DashboardCard } from "@/core/types";
import { useI18n } from "@/i18n";
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
  const { locale } = useI18n();
  const isEn = locale === "en";
  const index = siblings.findIndex((card) => card.targetId === current.targetId);
  const prev = index === -1 ? null : (siblings[index - 1] ?? null);
  const next = index === -1 ? null : (siblings[index + 1] ?? null);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.key === "ArrowLeft" ? prev : event.key === "ArrowRight" ? next : null;
      const href = target === null ? null : viewHref(target);
      if (href !== null) window.location.assign(href);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [prev, next]);
  useEffect(() => {
    document.querySelector('.viewer-sibling[aria-current="page"]')?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [current.targetId]);
  if (index === -1 || siblings.length < 2) return null;

  return (
    <nav className="viewer-siblings" aria-label={isEn ? "Switch profile in this round" : "同轮上游切换"}>
      <Arrow card={prev} label="←" title={isEn ? "Previous profile (←)" : "上一个上游（←）"} />
      <span className="viewer-siblings-list">
        {siblings.map((card) => {
          const name = upstreamOf(card);
          const displayLabel = profileLabel(name, profiles, locale);
          return (
            <a
              key={card.targetId}
              className="viewer-sibling"
              href={viewHref(card) ?? "#"}
              aria-current={card.targetId === current.targetId ? "page" : undefined}
              title={displayLabel}
            >
              {name !== DEFAULT_PROFILE && (
                <span className="profile-dot" style={{ background: profileColor(name) }} aria-hidden="true" />
              )}
              {displayLabel}
            </a>
          );
        })}
      </span>
      <Arrow card={next} label="→" title={isEn ? "Next profile (→)" : "下一个上游（→）"} />
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
