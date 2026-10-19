"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  resolveCopyablePromptText,
  type PromptCatalogItem,
} from "./prompts-page-model";
import { formatText, useI18n } from "@/i18n";

export interface PromptCardProps {
  readonly item: PromptCatalogItem;
  readonly onSelect: (item: PromptCatalogItem, candidateId?: string) => void;
}

const MAX_PREVIEW_CANDIDATES = 6;

function PromptCardBadges({ item }: { readonly item: PromptCatalogItem }): React.ReactElement {
  const { t } = useI18n();
  const pp = t.promptsPage;
  const lifecycleLabel =
    item.lifecycle.status === "legacy"
      ? pp.lifecycleLegacyBadge
      : item.lifecycle.status === "aging"
        ? pp.lifecycleAgingBadge
        : pp.lifecycleActiveBadge;

  return (
    <div className="prompts-card-badges">
      <span className="prompts-badge prompts-badge--group">{item.groupLabel}</span>
      <code className="prompts-id-code">{item.id}</code>
      {item.isLocked && (
        <span className="prompts-badge prompts-badge--accent">{pp.cardLockedBadge}</span>
      )}
      {item.isScheduled && !item.isArchived && (
        <span className="prompts-badge prompts-badge--ok">{pp.cardScheduledBadge}</span>
      )}
      {item.isAnimated ? (
        <span className="prompts-badge prompts-badge--warn">{pp.cardAnimatedBadge}</span>
      ) : (
        <span className="prompts-badge">{pp.cardStaticSvgBadge}</span>
      )}
      {item.rubric && (
        <span className="prompts-badge prompts-badge--accent">{pp.cardRubricBadge}</span>
      )}
      {item.isSuite && (
        <span className="prompts-badge">
          {formatText(pp.cardCandidateCountBadge, { count: item.candidateCount })}
        </span>
      )}
      {item.variableCount > 0 && (
        <span className="prompts-badge">
          {formatText(pp.cardVariablesBadge, { count: item.variableCount })}
        </span>
      )}
      {item.isArchived ? (
        <span className="prompts-badge prompts-badge--dim">{pp.cardArchivedBadge}</span>
      ) : (
        <span className="prompts-badge prompts-badge--dim">{lifecycleLabel}</span>
      )}
      {item.isCustom && (
        <span className="prompts-badge prompts-badge--accent">{pp.cardCustomBadge}</span>
      )}
    </div>
  );
}

function PromptCardScenes({
  item,
  onSelect,
}: PromptCardProps): React.ReactElement | null {
  const { t } = useI18n();
  const pp = t.promptsPage;
  if (!item.isSuite || item.candidates.length === 0) return null;
  const visible = item.candidates.slice(0, MAX_PREVIEW_CANDIDATES);
  const remaining = item.candidates.length - visible.length;

  return (
    <div className="prompts-card-scenes">
      {visible.map((cand) => (
        <button
          key={cand.id}
          type="button"
          className="prompts-scene-chip"
          title={`${cand.id}: ${cand.label}`}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(item, cand.id);
          }}
        >
          <span className="prompts-scene-id">{cand.id}</span>
          <span className="prompts-scene-label">{cand.label}</span>
        </button>
      ))}
      {remaining > 0 && (
        <span className="prompts-scene-more">
          {formatText(pp.cardMoreCandidatesBadge, { count: remaining })}
        </span>
      )}
    </div>
  );
}

export async function copyTextToClipboard(text: string): Promise<void> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fall back to hidden textarea below.
    }
  }
  if (typeof document !== "undefined") {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "true");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
    } finally {
      textarea.remove();
    }
  }
}

export function PromptCard({ item, onSelect }: PromptCardProps): React.ReactElement {
  const { t } = useI18n();
  const pp = t.promptsPage;
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const copyText = resolveCopyablePromptText(item);

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    void copyTextToClipboard(copyText);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 1800);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(item);
    }
  };

  return (
    <article
      role="listitem"
      tabIndex={0}
      className={`prompts-card${item.isArchived ? " is-archived" : ""}`}
      onClick={() => onSelect(item)}
      onKeyDown={handleKeyDown}
      aria-label={`${item.label} (${item.id})`}
    >
      <div className="prompts-card-head">
        <PromptCardBadges item={item} />
        <button
          type="button"
          className={`ui-btn ui-btn-sm prompts-copy-btn${copied ? " is-copied" : ""}`}
          title={pp.cardCopyPromptTitle}
          onClick={handleCopy}
        >
          {copied ? `✓ ${pp.cardCopiedBadge}` : pp.cardCopyPromptButton}
        </button>
      </div>

      <h2 className="prompts-card-title">{item.label}</h2>

      <div className="prompts-preview-box">
        <pre className="prompts-preview-code">{copyText}</pre>
      </div>

      <PromptCardScenes item={item} onSelect={onSelect} />

      {item.standard && (
        <div className="prompts-card-standard">
          <span className="prompts-card-standard-key">{pp.cardCoreKeyPrefix}</span>
          <span className="prompts-card-standard-val">{item.standard.coreKey}</span>
        </div>
      )}

      <div className="prompts-card-foot">
        <span className="prompts-card-age">
          {item.lifecycle.originAgeText ?? item.lifecycle.collectedAgeText ?? item.id}
        </span>
        <span className="prompts-card-detail-hint">{pp.cardViewDetailHint} →</span>
      </div>
    </article>
  );
}
