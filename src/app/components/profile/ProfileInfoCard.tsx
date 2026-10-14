"use client";

import type { RefObject } from "react";
import type { ProfileView } from "@/core/profile-view";
import type { DashboardCard } from "@/core/types";
import { useI18n, type Locale } from "@/i18n";
import { formatCost, formatDuration } from "../card/card-format";
import { profileColor } from "./profile-color";

interface ProfileInfoCardProps {
  name: string;
  /** 配置里的上游；已删除、历史结果仍引用时为 null */
  profile: ProfileView | null;
  /** "本件"：弹窗里是该列该轮的调用，大图页是当前作品 */
  cards: readonly DashboardCard[];
  owner: boolean;
  closeRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
}

/**
 * 上游信息卡：这是哪家、什么套餐、几折，以及本件的耗时与成本。
 */
export function ProfileInfoCard({ name, profile, cards, owner, closeRef, onClose }: ProfileInfoCardProps) {
  const { locale, t } = useI18n();
  const isEn = locale === "en";
  const title = profile?.label ?? name;
  return (
    <div className="profile-card" role="dialog" aria-label={isEn ? `Profile ${title}` : `上游 ${title}`}>
      <header className="profile-card-head">
        <span className="profile-dot" style={{ background: profileColor(name) }} aria-hidden="true" />
        <b className="profile-card-title">{title}</b>
        <button
          type="button"
          className="profile-card-close"
          aria-label={t.common.actions.close}
          ref={closeRef}
          onClick={onClose}
        >
          ×
        </button>
      </header>
      {profile === null ? (
        <p className="profile-card-id">
          {name} · <span className="profile-card-gone">{isEn ? "No longer in config" : "配置中已不存在"}</span>
        </p>
      ) : (
        <ProfileFacts profile={profile} locale={locale} />
      )}
      {cards.map((card) => (
        <p key={`${card.runId}/${card.targetId}/${card.promptId}`} className="profile-card-work">
          {cards.length > 1 ? `${card.effort} ` : isEn ? "Item " : "本件 "}
          {isEn
            ? `Time ${formatDuration(card.durationMs)} · List ${formatCost(card.cost)}`
            : `耗时 ${formatDuration(card.durationMs)} · 官价 ${formatCost(card.cost)}`}
          {profile !== null &&
            card.cost.usd !== null &&
            (isEn
              ? ` · Net ${formatCost({ ...card.cost, usd: card.cost.usd * profile.multiplier })}`
              : ` · 折算 ${formatCost({ ...card.cost, usd: card.cost.usd * profile.multiplier })}`)}
          {card.judgeCost != null &&
            (isEn ? ` · Judge ${formatCost(card.judgeCost.cost)}` : ` · 裁判 ${formatCost(card.judgeCost.cost)}`)}
        </p>
      ))}
      {owner && (
        <a className="profile-card-edit" href="/config#profiles" target="_blank" rel="noopener">
          {isEn ? "Edit in Configuration ↗" : "在配置页编辑 ↗"}
        </a>
      )}
    </div>
  );
}

function ProfileFacts({ profile, locale }: { profile: ProfileView; locale: Locale }) {
  const isEn = locale === "en";
  const site = profile.website === null ? null : new URL(profile.website).host;
  return (
    <>
      <p className="profile-card-id">
        {profile.name} · {profile.upstreamType}
        {!profile.enabled && (isEn ? " · Disabled" : " · 已停用")}
      </p>
      <dl className="profile-card-facts">
        {profile.group !== null && (
          <>
            <dt>{isEn ? "Group" : "分组"}</dt>
            <dd>{profile.group}</dd>
          </>
        )}
        <dt>{isEn ? "Multiplier" : "倍率"}</dt>
        <dd>{isEn ? `× ${profile.multiplier} (list × multiplier)` : `× ${profile.multiplier}（官价 × 倍率）`}</dd>
        {site !== null && (
          <>
            <dt>{isEn ? "Website" : "官网"}</dt>
            <dd>
              <a href={profile.website ?? undefined} target="_blank" rel="noopener noreferrer">
                {site} ↗
              </a>
            </dd>
          </>
        )}
      </dl>
    </>
  );
}
