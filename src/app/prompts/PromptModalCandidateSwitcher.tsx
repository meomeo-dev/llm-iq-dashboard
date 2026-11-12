import type { ReactElement } from "react";
import { handleTabNavigation } from "@/app/components/ui/tab-navigation";
import { formatText, useI18n } from "@/i18n";
import type { PromptCatalogItem } from "./prompts-page-model";

export function PromptModalCandidateSwitcher({
  item,
  activeCandidateId,
  onSelectCandidate,
  panelId,
}: {
  readonly item: PromptCatalogItem;
  readonly activeCandidateId: string | undefined;
  readonly onSelectCandidate: (candidateId: string) => void;
  readonly panelId: string;
}): ReactElement | null {
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
      <div className="prompts-modal-scene-grid" role="tablist"
        aria-label={formatText(pp.modalCandidateSectionTitle, { count: item.candidates.length })}
        onKeyDown={handleTabNavigation}>
        {item.candidates.map((cand) => {
          const isActive = cand.id === activeCandidateId;
          return (
            <button
              key={cand.id}
              type="button"
              role="tab"
              id={`${panelId}-${cand.id}`}
              aria-selected={isActive}
              aria-controls={panelId}
              tabIndex={isActive ? 0 : -1}
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
