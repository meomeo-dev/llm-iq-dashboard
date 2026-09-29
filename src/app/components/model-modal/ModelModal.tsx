"use client";

import { useState } from "react";
import { orderProfileNames } from "@/core/profile-view";
import type { PromptStandard } from "@/core/prompt";
import { PelicanCard } from "../card/PelicanCard";
import { useProfiles } from "../profile/profiles-context";
import { folderCell, upstreamOf } from "../timeline/effort-slots";
import type { Moment } from "../timeline/moments";
import type { Row } from "../timeline/rows";
import { ModelExportMenu } from "./ModelExportMenu";
import { ModelModalHeader } from "./ModelModalHeader";
import { ModelStandardPanel } from "./ModelStandardPanel";
import { ProfileMatrix } from "./ProfileMatrix";
import { useModalBehavior } from "./use-modal-behavior";

interface ModelModalProps {
  moment: Moment;
  row: Row;
  /** 当天出现的档位，按高低排；卡片按这个顺序排开 */
  efforts: readonly string[];
  timeZone: string;
  standard?: PromptStandard | null;
  onClose: () => void;
}

/**
 * 一个格子的完整结果：该模型在这一轮各强度的卡片并排排开。
 * 有多个上游时改为列 = 上游、行 = 强度的矩阵；只有一个上游时与引入上游之前相同。
 * 窗口定高，卡片在窗内滚动。
 */
export function ModelModal({ moment, row, efforts, timeZone, standard, onClose }: ModelModalProps) {
  const [showStandard, setShowStandard] = useState(false);
  const closeButton = useModalBehavior(onClose);
  const { profiles } = useProfiles();
  const cards = folderCell(moment, row, [], efforts, profiles)?.cards ?? [];
  const okCount = cards.filter((card) => card.status === "ok").length;
  const upstreams = orderProfileNames(cards.map(upstreamOf), profiles);

  return (
    <div className="modal-backdrop" onPointerDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="model-modal-title">
        <ModelModalHeader
          row={row}
          moment={moment}
          standard={standard}
          cardsCount={cards.length}
          okCount={okCount}
          upstreamCount={upstreams.length}
          actions={
            cards.length > 0 && (
              <ModelExportMenu moment={moment} row={row} cards={cards} upstreams={upstreams} efforts={efforts} timeZone={timeZone} />
            )
          }
          showStandard={showStandard}
          onToggleStandard={() => setShowStandard((prev) => !prev)}
          closeRef={closeButton}
          onClose={onClose}
        />
        {showStandard && standard && <ModelStandardPanel standard={standard} />}
        <div className="modal-body">
          {cards.length === 0 ? (
            <p className="modal-empty">这一格的结果已被筛选隐藏</p>
          ) : upstreams.length > 1 ? (
            <ProfileMatrix cards={cards} upstreams={upstreams} efforts={efforts} timeZone={timeZone} />
          ) : (
            <div className="card-grid">
              {cards.map((card) => (
                <PelicanCard key={`${card.targetId}/${card.promptId}`} card={card} timeZone={timeZone} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
