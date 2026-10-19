"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useStoredTimeZone } from "@/app/components/timeline/use-stored-time-zone";
import { listTimeZones } from "@/app/components/timeline/zoned-time";
import { WorkspaceToolbar } from "@/app/components/toolbar/WorkspaceToolbar";
import type { PromptSpec } from "@/core/prompt";
import { formatText, useI18n } from "@/i18n";
import { PromptCard } from "./PromptCard";
import { PromptDetailModal } from "./PromptDetailModal";
import { PromptsFilterBar } from "./PromptsFilterBar";
import {
  DEFAULT_PROMPT_FILTER,
  buildPromptCatalog,
  computePromptCatalogStats,
  filterPromptCatalog,
  type PromptCatalogItem,
  type PromptFilterState,
} from "./prompts-page-model";

export interface PromptsGalleryPageProps {
  readonly owner?: boolean;
  readonly readonly?: boolean;
  readonly prompts?: readonly PromptSpec[];
  readonly scheduledPromptIds?: readonly string[];
  readonly defaultTimeZone?: string;
}

export interface SelectedPromptState {
  readonly item: PromptCatalogItem;
  readonly candidateId: string | null;
}

function usePromptsGalleryController({
  prompts,
  scheduledPromptIds,
  defaultTimeZone = "Asia/Shanghai",
}: Pick<PromptsGalleryPageProps, "prompts" | "scheduledPromptIds" | "defaultTimeZone">) {
  const { locale } = useI18n();
  const [storedTz, setStoredTz] = useStoredTimeZone();
  const timeZone = storedTz ?? defaultTimeZone;
  const timeZones = useMemo(() => listTimeZones(null, locale), [locale]);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const toggleMenu = useCallback(
    (id: string) => setOpenMenu((prev) => (prev === id ? null : id)),
    [],
  );
  const [filter, setFilter] = useState<PromptFilterState>(DEFAULT_PROMPT_FILTER);
  const [selectedPrompt, setSelectedPrompt] = useState<SelectedPromptState | null>(null);

  const catalog = useMemo(
    () => buildPromptCatalog({ locale, prompts, scheduledPromptIds }),
    [locale, prompts, scheduledPromptIds],
  );
  const stats = useMemo(
    () => computePromptCatalogStats(catalog, filter.scope),
    [catalog, filter.scope],
  );
  const filtered = useMemo(
    () => filterPromptCatalog(catalog, filter),
    [catalog, filter],
  );
  const shownSceneCount = useMemo(
    () =>
      filtered.reduce(
        (sum, item) => sum + (item.candidateCount > 0 ? item.candidateCount : 1),
        0,
      ),
    [filtered],
  );
  const handleSelectPrompt = useCallback(
    (item: PromptCatalogItem, candidateId?: string) => {
      setSelectedPrompt({
        item,
        candidateId: candidateId ?? item.candidates[0]?.id ?? null,
      });
    },
    [],
  );

  return {
    timeZone,
    timeZones,
    setStoredTz,
    openMenu,
    setOpenMenu,
    toggleMenu,
    filter,
    setFilter,
    selectedPrompt,
    setSelectedPrompt,
    catalog,
    stats,
    filtered,
    shownSceneCount,
    handleSelectPrompt,
  };
}

function PromptsGalleryResults({
  items,
  onSelect,
  onReset,
}: {
  readonly items: readonly PromptCatalogItem[];
  readonly onSelect: (item: PromptCatalogItem, candidateId?: string) => void;
  readonly onReset: () => void;
}): React.ReactElement {
  const { t } = useI18n();
  const pp = t.promptsPage;
  if (items.length === 0) {
    return (
      <div className="prompts-empty" role="status">
        <h2 className="prompts-empty-title">{pp.emptyFilterTitle}</h2>
        <p className="prompts-empty-hint">{pp.emptyFilterHint}</p>
        <button type="button" className="ui-btn ui-btn-sm" onClick={onReset}>
          {pp.filterResetButton}
        </button>
      </div>
    );
  }
  return (
    <div className="prompts-masonry" role="list">
      {items.map((item) => (
        <PromptCard key={item.id} item={item} onSelect={onSelect} />
      ))}
    </div>
  );
}

export function PromptsGalleryPage({
  owner = true,
  readonly = false,
  prompts,
  scheduledPromptIds,
  defaultTimeZone = "Asia/Shanghai",
}: PromptsGalleryPageProps): React.ReactElement {
  const { t } = useI18n();
  const pp = t.promptsPage;
  const ctrl = usePromptsGalleryController({ prompts, scheduledPromptIds, defaultTimeZone });

  return (
    <div className="page">
      <div className="workspace prompts-workspace">
        <WorkspaceToolbar
          activePage="prompts"
          pageTitle={pp.pageTitle}
          owner={owner}
          readonly={readonly}
          timeZone={ctrl.timeZone}
          timeZones={ctrl.timeZones}
          onPickTimeZone={ctrl.setStoredTz}
          onJumpToNow={() => {}}
          openMenu={ctrl.openMenu}
          onToggleMenu={ctrl.toggleMenu}
          onCloseMenus={() => ctrl.setOpenMenu(null)}
          configHref="/config#prompts"
          pairHref="/pair?next=%2Fprompts"
          centerSlot={
            <div className="toolbar-center">
              <div className="toolbar-stack stats" title={pp.pageSubtitle}>
                <span className="stat-primary">{pp.pageTitle}</span>
                <span className="stat-secondary">
                  {formatText(pp.statsSummary, {
                    total: ctrl.stats.totalPrompts,
                    candidates: ctrl.stats.totalScenes,
                    rubrics: ctrl.stats.rubricPrompts,
                  })}
                </span>
              </div>
            </div>
          }
        />

        <PromptsFilterBar
          filter={ctrl.filter}
          stats={ctrl.stats}
          shownCount={ctrl.filtered.length}
          shownSceneCount={ctrl.shownSceneCount}
          onChangeFilter={ctrl.setFilter}
          onResetFilter={() => ctrl.setFilter(DEFAULT_PROMPT_FILTER)}
        />

        <PromptsGalleryResults
          items={ctrl.filtered}
          onSelect={ctrl.handleSelectPrompt}
          onReset={() => ctrl.setFilter(DEFAULT_PROMPT_FILTER)}
        />
      </div>
      <PromptDetailModal
        item={
          ctrl.selectedPrompt
            ? (ctrl.catalog.find((p) => p.id === ctrl.selectedPrompt?.item.id) ??
              ctrl.selectedPrompt.item)
            : null
        }
        initialCandidateId={ctrl.selectedPrompt?.candidateId}
        onClose={() => ctrl.setSelectedPrompt(null)}
      />
    </div>
  );
}
