"use client";

import React from "react";
import {
  DEFAULT_PROMPT_FILTER,
  type PromptCatalogStats,
  type PromptFeatureFilter,
  type PromptFilterState,
  type PromptScopeFilter,
} from "./prompts-page-model";
import { formatText, useI18n } from "@/i18n";

export interface PromptsFilterBarProps {
  readonly filter: PromptFilterState;
  readonly stats: PromptCatalogStats;
  readonly shownCount: number;
  readonly shownSceneCount: number;
  readonly onChangeFilter: (next: PromptFilterState) => void;
  readonly onResetFilter: () => void;
}

const FEATURE_KEYS: readonly PromptFeatureFilter[] = [
  "all",
  "suite",
  "animated",
  "standard",
  "rubric",
  "scheduled",
];

const SCOPE_KEYS: readonly PromptScopeFilter[] = ["active", "all", "archived"];

function PromptsTopSearchRow({
  filter,
  stats,
  shownCount,
  shownSceneCount,
  isDirty,
  onChangeFilter,
  onResetFilter,
}: PromptsFilterBarProps & { readonly isDirty: boolean }): React.ReactElement {
  const { t } = useI18n();
  const pp = t.promptsPage;
  const scopeLabels: Readonly<Record<PromptScopeFilter, string>> = {
    active: pp.filterScopeActive,
    all: pp.filterScopeAll,
    archived: `${pp.filterScopeArchived} (${stats.archivedPrompts})`,
  };

  return (
    <div className="prompts-toolbar-top">
      <div className="prompts-search-wrap">
        <input
          type="search"
          className="ui-input prompts-search-input"
          value={filter.query}
          placeholder={pp.searchPlaceholder}
          aria-label={pp.searchPlaceholder}
          onChange={(e) => onChangeFilter({ ...filter, query: e.target.value })}
        />
        {filter.query.length > 0 && (
          <button
            type="button"
            className="ui-btn ui-btn-sm ui-btn-ghost prompts-search-clear"
            title={pp.searchClearTitle}
            aria-label={pp.searchClearTitle}
            onClick={() => onChangeFilter({ ...filter, query: "" })}
          >
            ×
          </button>
        )}
      </div>
      <div className="prompts-scope-group" role="group" aria-label={pp.filterScopeLabel}>
        <span className="prompts-filter-label">{pp.filterScopeLabel}</span>
        <div className="prompts-pill-row">
          {SCOPE_KEYS.map((scope) => (
            <button
              key={scope}
              type="button"
              aria-pressed={filter.scope === scope}
              className={`prompts-pill${filter.scope === scope ? " is-active" : ""}`}
              onClick={() => onChangeFilter({ ...filter, scope, groupKey: "all" })}
            >
              {scopeLabels[scope]}
            </button>
          ))}
        </div>
      </div>
      <div className="prompts-result-meta">
        <span className="prompts-result-count">
          {formatText(pp.resultCountSummary, {
            shown: shownCount,
            total: stats.totalPrompts,
            shownCandidates: shownSceneCount,
          })}
        </span>
        {isDirty && (
          <button type="button" className="ui-btn ui-btn-sm prompts-reset-btn" onClick={onResetFilter}>
            {pp.filterResetButton}
          </button>
        )}
      </div>
    </div>
  );
}

export function PromptsFilterBar(props: PromptsFilterBarProps): React.ReactElement {
  const { filter, stats, onChangeFilter } = props;
  const { t } = useI18n();
  const pp = t.promptsPage;
  const isDirty =
    filter.query.trim() !== "" ||
    filter.groupKey !== DEFAULT_PROMPT_FILTER.groupKey ||
    filter.feature !== DEFAULT_PROMPT_FILTER.feature ||
    filter.scope !== DEFAULT_PROMPT_FILTER.scope;

  const featureLabels: Readonly<Record<PromptFeatureFilter, string>> = {
    all: pp.filterFeatureAll,
    suite: pp.filterFeatureSuite,
    animated: pp.filterFeatureAnimated,
    standard: pp.filterFeatureStandard,
    rubric: pp.filterFeatureRubric,
    scheduled: pp.filterFeatureScheduled,
  };

  return (
    <section className="prompts-toolbar" aria-label={pp.pageTitle}>
      <PromptsTopSearchRow {...props} isDirty={isDirty} />

      <div className="prompts-toolbar-row">
        <span className="prompts-filter-label">{pp.filterGroupLabel}</span>
        <div className="prompts-pill-row" role="group" aria-label={pp.filterGroupLabel}>
          <button
            type="button"
            aria-pressed={filter.groupKey === "all"}
            className={`prompts-pill${filter.groupKey === "all" ? " is-active" : ""}`}
            onClick={() => onChangeFilter({ ...filter, groupKey: "all" })}
          >
            {pp.filterGroupAll}
            <span className="prompts-pill-count">{stats.totalPrompts}</span>
          </button>
          {stats.groups.map((grp) => {
            const active = filter.groupKey === grp.key;
            return (
              <button
                key={grp.key}
                type="button"
                aria-pressed={active}
                className={`prompts-pill${active ? " is-active" : ""}`}
                onClick={() => onChangeFilter({ ...filter, groupKey: grp.key })}
              >
                {grp.label}
                <span className="prompts-pill-count">{grp.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="prompts-toolbar-row">
        <span className="prompts-filter-label">{pp.filterFeatureLabel}</span>
        <div className="prompts-pill-row" role="group" aria-label={pp.filterFeatureLabel}>
          {FEATURE_KEYS.map((feat) => {
            const active = filter.feature === feat;
            return (
              <button
                key={feat}
                type="button"
                aria-pressed={active}
                className={`prompts-chip${active ? " is-active" : ""}`}
                onClick={() => onChangeFilter({ ...filter, feature: feat })}
              >
                {featureLabels[feat]}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
