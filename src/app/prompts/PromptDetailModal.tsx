"use client";

import React, { useEffect, useRef, useState } from "react";
import { ReferenceSourceDisplay } from "@/app/components/ReferenceSourceDisplay";
import { StandardCriteriaPanel } from "@/app/components/standard/StandardCriteriaPanel";
import { Modal } from "@/app/components/ui/Modal";
import { StatusPill } from "@/app/components/ui/StatusPill";
import { formatText, useI18n } from "@/i18n";
import { copyTextToClipboard } from "./PromptCard";
import { resolveCopyablePromptText, type PromptCatalogItem, type PromptRubricView } from "./prompts-page-model";

export interface PromptDetailModalProps {
  readonly item: PromptCatalogItem | null;
  readonly initialCandidateId?: string | null;
  readonly onClose: () => void;
}

function PromptModalCandidateSwitcher({
  item,
  activeCandidateId,
  onSelectCandidate,
}: {
  readonly item: PromptCatalogItem;
  readonly activeCandidateId: string | undefined;
  readonly onSelectCandidate: (candidateId: string) => void;
}): React.ReactElement | null {
  const { t } = useI18n();
  const pp = t.promptsPage;
  if (item.candidates.length === 0) return null;

  return (
    <section className="prompts-modal-section">
      <div className="prompts-modal-section-head">
        <h3 className="prompts-modal-section-title">
          {formatText(pp.modalCandidateSectionTitle, { count: item.candidates.length })}
        </h3>
        <span className="prompts-modal-hint">{pp.modalCandidatePickerHint}</span>
      </div>
      <div className="prompts-modal-scene-grid" role="tablist">
        {item.candidates.map((cand) => {
          const isActive = cand.id === activeCandidateId;
          return (
            <button
              key={cand.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`prompts-modal-scene-pill${isActive ? " is-active" : ""}`}
              onClick={() => onSelectCandidate(cand.id)}
            >
              <span className="prompts-modal-scene-id">#{cand.id}</span>
              <span className="prompts-modal-scene-label">{cand.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function PromptModalVariablesSection({ item }: { readonly item: PromptCatalogItem }): React.ReactElement | null {
  const { t } = useI18n();
  const pp = t.promptsPage;
  if (item.variables.length === 0) return null;

  return (
    <section className="prompts-modal-section">
      <h3 className="prompts-modal-section-title">{pp.modalVariablesSectionTitle}</h3>
      <div className="prompts-modal-var-list">
        {item.variables.map((v) => (
          <div key={v.name} className="prompts-modal-var-row">
            <code className="prompts-modal-var-name">{`{{${v.name}}}`}</code>
            <span className="prompts-modal-var-vals">{pp.modalVariableValuesLabel}{v.values.join(" · ")}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function PromptModalRubricSection({ rubric }: { readonly rubric: PromptRubricView | null }): React.ReactElement {
  const { t } = useI18n();
  const pp = t.promptsPage;
  if (!rubric) {
    return (
      <section className="prompts-modal-section">
        <h3 className="prompts-modal-section-title">
          {formatText(pp.modalRubricSectionTitle, { id: "—", version: 0 })}
        </h3>
        <p className="prompts-modal-empty-note">{pp.modalNoRubricHint}</p>
      </section>
    );
  }

  return (
    <section className="prompts-modal-section">
      <div className="prompts-modal-section-head">
        <h3 className="prompts-modal-section-title">
          {formatText(pp.modalRubricSectionTitle, { id: rubric.id, version: rubric.version })}
        </h3>
        <span className="prompts-modal-hint">
          {formatText(pp.modalRubricSummary, {
            codePoints: rubric.codePoints,
            aiPoints: rubric.aiPoints,
            gates: rubric.gates.length,
            criteria: rubric.criteria.length,
          })}
        </span>
      </div>

      <h4 className="prompts-modal-subhead">{pp.modalRubricGatesTitle}</h4>
      <div className="prompts-modal-rubric-grid">
        {rubric.gates.map((gate) => (
          <div key={gate.id} className="prompts-modal-rubric-card">
            <div className="prompts-modal-rubric-top">
              <StatusPill tone="warn">{gate.id}</StatusPill>
              <strong className="prompts-modal-rubric-label">{gate.title}</strong>
            </div>
            <p className="prompts-modal-rubric-desc">{gate.standard}</p>
          </div>
        ))}
      </div>

      <h4 className="prompts-modal-subhead">{pp.modalRubricCriteriaTitle}</h4>
      <div className="prompts-modal-rubric-grid">
        {rubric.criteria.map((c) => (
          <div key={c.id} className="prompts-modal-rubric-card">
            <div className="prompts-modal-rubric-top">
              <StatusPill tone={c.layer === "code" ? "ok" : "accent"}>{c.id}</StatusPill>
              <strong className="prompts-modal-rubric-label">{c.title}</strong>
              <span className="prompts-modal-rubric-meta">
                {c.layer === "code" ? pp.modalRubricLayerCode : pp.modalRubricLayerAi} ·{" "}
                {formatText(pp.modalRubricMaxPoints, { points: c.maxScore })}
              </span>
            </div>
            <p className="prompts-modal-rubric-desc">{c.standard}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PromptModalLifecycleSection({ item }: { readonly item: PromptCatalogItem }): React.ReactElement {
  const { t } = useI18n();
  const pp = t.promptsPage;
  const lc = item.lifecycle;
  const statusLabel =
    lc.status === "legacy" ? pp.lifecycleLegacyBadge : lc.status === "aging" ? pp.lifecycleAgingBadge : pp.lifecycleActiveBadge;

  return (
    <section className="prompts-modal-section">
      <h3 className="prompts-modal-section-title">{pp.modalLifecycleSectionTitle}</h3>
      <div className="prompts-modal-meta-row">
        <span className="prompts-modal-meta-chip">
          {formatText(pp.modalLifecycleStatusLabel, { status: statusLabel })}
        </span>
        {item.originDate && (
          <span className="prompts-modal-meta-chip">
            {formatText(pp.modalOriginDateLabel, { date: item.originDate })}
            {lc.originAgeText ? ` (${lc.originAgeText})` : ""}
          </span>
        )}
        {item.registeredAt && (
          <span className="prompts-modal-meta-chip">
            {formatText(pp.modalRegisteredAtLabel, { date: item.registeredAt })}
            {lc.collectedAgeText ? ` (${lc.collectedAgeText})` : ""}
          </span>
        )}
        {item.verified && <StatusPill tone="ok">{pp.modalVerifiedBadge}</StatusPill>}
      </div>
      {item.source && (
        <div className="prompts-modal-source-row">
          <span className="prompts-modal-source-label">{pp.modalSourceLabel}</span>
          <ReferenceSourceDisplay source={item.source} className="prompts-modal-source-link" />
        </div>
      )}
    </section>
  );
}

function PromptModalTextSection({
  item,
  copyText,
  activeSceneBadge,
}: {
  readonly item: PromptCatalogItem;
  readonly copyText: string;
  readonly activeSceneBadge: string | null;
}): React.ReactElement {
  const { t } = useI18n();
  const pp = t.promptsPage;
  return (
    <section className="prompts-modal-section">
      <div className="prompts-modal-section-head">
        <h3 className="prompts-modal-section-title">{pp.modalPromptTextSectionTitle}</h3>
        {activeSceneBadge && <code className="prompts-modal-scene-tag">{activeSceneBadge}</code>}
      </div>
      <pre className="prompts-modal-code">{copyText}</pre>
      {item.isSuite && item.template !== copyText && (
        <div className="prompts-modal-template-sub">
          <span className="prompts-modal-subhead">{pp.modalPromptTemplateLabel}</span>
          <pre className="prompts-modal-code prompts-modal-code--dim">{item.template}</pre>
        </div>
      )}
    </section>
  );
}

export function PromptDetailModal({
  item,
  initialCandidateId,
  onClose,
}: PromptDetailModalProps): React.ReactElement | null {
  const { t } = useI18n();
  const pp = t.promptsPage;
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | undefined>(
    initialCandidateId ?? undefined,
  );
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSelectedCandidateId(initialCandidateId ?? item?.candidates[0]?.id);
    setCopied(false);
  }, [item?.id, initialCandidateId]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  if (!item) return null;

  const activeCandidate =
    item.candidates.find((c) => c.id === selectedCandidateId) ?? item.candidates[0] ?? null;
  const activeStandard = activeCandidate?.standard ?? item.standard;
  const copyText = resolveCopyablePromptText(item, activeCandidate?.id);

  const handleCopy = () => {
    void copyTextToClipboard(copyText);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 1800);
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      size="lg"
      className="prompts-modal"
      bodyClassName="prompts-modal-body"
      title={`${pp.modalTitlePrefix} · ${item.label}`}
      subtitle={`${item.id} · ${item.groupLabel}`}
      headerActions={
        <button
          type="button"
          className={`ui-btn ui-btn-sm prompts-modal-copy-btn${copied ? " is-copied" : ""}`}
          onClick={handleCopy}
        >
          {copied ? `✓ ${pp.modalCopiedBadge}` : pp.modalCopyCurrentButton}
        </button>
      }
    >
      <PromptModalCandidateSwitcher
        item={item}
        activeCandidateId={activeCandidate?.id}
        onSelectCandidate={(candId) => { setSelectedCandidateId(candId); setCopied(false); }}
      />
      <PromptModalTextSection
        item={item}
        copyText={copyText}
        activeSceneBadge={activeCandidate ? `#${activeCandidate.id} · ${activeCandidate.label}` : null}
      />
      <PromptModalVariablesSection item={item} />
      <section className="prompts-modal-section">
        <h3 className="prompts-modal-section-title">{pp.modalStandardSectionTitle}</h3>
        {activeStandard ? (
          <StandardCriteriaPanel standard={activeStandard} />
        ) : (
          <p className="prompts-modal-empty-note">{pp.modalNoStandardHint}</p>
        )}
      </section>
      <PromptModalRubricSection rubric={item.rubric} />
      <PromptModalLifecycleSection item={item} />
    </Modal>
  );
}
