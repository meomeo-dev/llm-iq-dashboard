"use client";

import { Fragment, type CSSProperties } from "react";
import { DEFAULT_PROFILE, type DashboardCard } from "@/core/types";
import { PelicanCard } from "../card/PelicanCard";
import { ProfileName } from "../profile/ProfileName";
import { upstreamOf } from "../timeline/effort-slots";

interface ProfileMatrixProps {
  /** 这一格的全部结果 */
  cards: readonly DashboardCard[];
  /** 列：登录态在前，其余按配置顺序 */
  upstreams: readonly string[];
  /** 当天出现的档位，按高低排；只画有结果的行 */
  efforts: readonly string[];
  timeZone: string;
}

/** 矩阵有结果的行（强度），按档位高低 */
export function matrixEfforts(cards: readonly DashboardCard[], efforts: readonly string[]): string[] {
  return efforts.filter((effort) => cards.some((card) => card.effort === effort));
}

/**
 * 多上游的对比布局：列 = 上游、行 = 强度，同一行的作品等宽并排。
 * 列标题是上游名，点开信息卡；登录态列标题不可点。
 */
export function ProfileMatrix({ cards, upstreams, efforts, timeZone }: ProfileMatrixProps) {
  const style = { "--upstream-count": upstreams.length } as CSSProperties;
  const columnCards = (name: string): DashboardCard[] => cards.filter((card) => upstreamOf(card) === name);
  return (
    <div className="profile-matrix" style={style}>
      <div className="profile-matrix-corner" />
      {upstreams.map((name) => (
        <div key={name} className="profile-matrix-col">
          {name === DEFAULT_PROFILE ? (
            <span className="profile-matrix-login">登录态</span>
          ) : (
            <ProfileName name={name} cards={columnCards(name)} />
          )}
        </div>
      ))}
      {matrixEfforts(cards, efforts).map((effort) => (
        <Fragment key={effort}>
          <div className="profile-matrix-row">{effort}</div>
          {upstreams.map((name) => {
            const card = cards.find((item) => item.effort === effort && upstreamOf(item) === name);
            if (card === undefined) return <div key={name} className="profile-matrix-empty" title={`${effort}：未运行`}>—</div>;
            return <PelicanCard key={name} card={card} timeZone={timeZone} />;
          })}
        </Fragment>
      ))}
    </div>
  );
}
