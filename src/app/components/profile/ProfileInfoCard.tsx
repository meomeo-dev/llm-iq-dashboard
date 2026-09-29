"use client";

import type { RefObject } from "react";
import type { ProfileView } from "@/core/profile-view";
import type { DashboardCard } from "@/core/types";
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
 * 接口地址、查询参数、key 状态、模型清单都不放。
 */
export function ProfileInfoCard({ name, profile, cards, owner, closeRef, onClose }: ProfileInfoCardProps) {
  const title = profile?.label ?? name;
  return (
    <div className="profile-card" role="dialog" aria-label={`上游 ${title}`}>
      <header className="profile-card-head">
        <span className="profile-dot" style={{ background: profileColor(name) }} aria-hidden="true" />
        <b className="profile-card-title">{title}</b>
        <button type="button" className="profile-card-close" aria-label="关闭" ref={closeRef} onClick={onClose}>
          ×
        </button>
      </header>
      {profile === null ? (
        <p className="profile-card-id">
          {name} · <span className="profile-card-gone">配置中已不存在</span>
        </p>
      ) : (
        <ProfileFacts profile={profile} />
      )}
      {cards.map((card) => (
        <p key={`${card.runId}/${card.targetId}/${card.promptId}`} className="profile-card-work">
          {cards.length > 1 ? `${card.effort} ` : "本件 "}
          耗时 {formatDuration(card.durationMs)} · 官价 {formatCost(card.cost)}
          {profile !== null && card.cost.usd !== null && ` · 折算 ${formatCost({ ...card.cost, usd: card.cost.usd * profile.multiplier })}`}
        </p>
      ))}
      {owner && (
        <a className="profile-card-edit" href="/config#profiles" target="_blank" rel="noopener">
          在配置页编辑 ↗
        </a>
      )}
    </div>
  );
}

function ProfileFacts({ profile }: { profile: ProfileView }) {
  const site = profile.website === null ? null : new URL(profile.website).host;
  return (
    <>
      <p className="profile-card-id">
        {profile.name} · {profile.upstreamType}
        {!profile.enabled && " · 已停用"}
      </p>
      <dl className="profile-card-facts">
        {profile.group !== null && (
          <>
            <dt>分组</dt>
            <dd>{profile.group}</dd>
          </>
        )}
        <dt>倍率</dt>
        <dd>× {profile.multiplier}（官价 × 倍率）</dd>
        {site !== null && (
          <>
            <dt>官网</dt>
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
