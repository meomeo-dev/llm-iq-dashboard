"use client";

import { Button } from "@/app/components/ui/Button";
import type { CapabilitySnapshot } from "@/capabilities/types";
import {
  DEFAULT_MODEL_FINGERPRINT_CONFIG,
  deriveReferencesFromTargets,
} from "@/core/config/model-fingerprint";
import type { ModelFingerprintConfig, ProfileConfig } from "@/core/config/types";
import {
  DEFAULT_SAMPLES_BY_PROBE,
  PROBE_IDS,
  resolveProbeTargetSamples,
  type FingerprintReferenceTarget,
  type ProbeId,
} from "@/core/model-fingerprint/types";
import { EFFORT_LEVELS, type EffortLevel, type Target } from "@/core/types";
import { formatText, useI18n } from "@/i18n";
import { ConfigSection } from "./ConfigSection";

export function ModelFingerprintSection({
  value,
  targets,
  profiles,
  onChange,
}: {
  value?: ModelFingerprintConfig;
  catalog?: CapabilitySnapshot;
  targets?: readonly Target[];
  profiles?: readonly ProfileConfig[];
  onChange: (next: ModelFingerprintConfig) => void;
}) {
  const { t } = useI18n();
  const rawDraft = value ?? DEFAULT_MODEL_FINGERPRINT_CONFIG;
  const draft = rawDraft.probes.length === 0 ? { ...rawDraft, probes: [...PROBE_IDS] } : rawDraft;
  return (
    <ConfigSection
      id="model-fingerprint"
      title={t.config.sections.modelFingerprintTitle}
      hint={t.config.sections.modelFingerprintDesc}
    >
      <ModelFingerprintForm
        value={draft}
        targets={targets}
        profiles={profiles}
        onChange={(next) => onChange({ ...next, references: [] })}
      />
    </ConfigSection>
  );
}

export function ModelFingerprintForm({
  value,
  targets,
  profiles,
  onChange,
}: {
  value: ModelFingerprintConfig;
  catalog?: CapabilitySnapshot;
  targets?: readonly Target[];
  profiles?: readonly ProfileConfig[];
  onChange: (next: ModelFingerprintConfig) => void;
}) {
  const { t } = useI18n();
  const fp = t.fingerprint;
  const set = <K extends keyof ModelFingerprintConfig>(key: K, next: ModelFingerprintConfig[K]) =>
    onChange({ ...value, [key]: next });

  const toggleProbe = (probeId: ProbeId, checked: boolean) => {
    const current = new Set(value.probes);
    if (checked) current.add(probeId);
    else if (current.size > 1) current.delete(probeId);
    set("probes", PROBE_IDS.filter((id) => current.has(id)));
  };

  const sharedModels =
    targets && targets.length > 0 ? deriveReferencesFromTargets(targets) : value.references;

  return (
    <div className="stack">
      <div className="field-row config-fp-row-between">
        <label className="ui-check-row">
          <input
            type="checkbox"
            checked={value.enabled}
            onChange={(e) => set("enabled", e.target.checked)}
          />
          {fp.configSection.enabledLabel}
        </label>
        <a href="/fingerprint" className="secondary-link">
          {fp.configSection.openFingerprintConsole}
        </a>
      </div>
      <FingerprintNumericFields value={value} onChange={onChange} />
      <FingerprintProbeTargetsEditor value={value} onChange={onChange} />
      <div className="stack config-fp-block">
        <span className="config-fp-sublabel">{fp.configSection.probesLabel}</span>
        <div className="config-fp-probes-grid">
          {PROBE_IDS.map((probeId) => (
            <label key={probeId} className="ui-check-row" title={fp.probes[probeId].desc}>
              <input
                type="checkbox"
                checked={value.probes.includes(probeId)}
                disabled={!value.enabled}
                onChange={(e) => toggleProbe(probeId, e.target.checked)}
              />
              <span>
                <code>{probeId}</code> · {fp.probes[probeId].label}
              </span>
            </label>
          ))}
        </div>
      </div>
      <FingerprintSharedSourcesSummary models={sharedModels} profiles={profiles ?? []} />
    </div>
  );
}

function NumericInputField(props: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  disabled: boolean;
  onChange: (num: number) => void;
}) {
  return (
    <label className="ui-field config-fp-field-label">
      <span className="config-fp-field-text">{props.label}</span>
      <input
        type="number"
        className="ui-input"
        min={props.min}
        max={props.max}
        step={props.step}
        value={props.value}
        disabled={props.disabled}
        onChange={(e) => props.onChange(Number(e.target.value))}
      />
    </label>
  );
}

function FingerprintNumericFields({
  value,
  onChange,
}: {
  value: ModelFingerprintConfig;
  onChange: (next: ModelFingerprintConfig) => void;
}) {
  const { t } = useI18n();
  const cs = t.fingerprint.configSection;
  const disabled = !value.enabled;
  const minProbeTarget = Math.min(
    ...PROBE_IDS.map((probeId) => resolveProbeTargetSamples(probeId, value)),
  );
  const maxCheck = Math.max(1, Math.floor(minProbeTarget / 2));
  const set = <K extends keyof ModelFingerprintConfig>(key: K, next: ModelFingerprintConfig[K]) =>
    onChange({ ...value, [key]: next });

  return (
    <div className="config-fp-numeric-grid">
      <label className="ui-field config-fp-field-label">
        <span>{cs.effortLabel}</span>
        <select className="ui-select" value={value.effort} disabled={disabled} onChange={(e) => set("effort", e.target.value as EffortLevel)}>
          {EFFORT_LEVELS.map((ef) => (
            <option key={ef} value={ef}>{ef}</option>
          ))}
        </select>
      </label>
      <NumericInputField label={cs.valuesPerCheckLabel} min={1} max={maxCheck} value={value.valuesPerCheck} disabled={disabled} onChange={(raw) => set("valuesPerCheck", Math.min(maxCheck, Math.max(1, raw || 1)))} />
      <NumericInputField label={cs.checkAttemptsLabel} min={1} max={20} value={value.checkAttempts} disabled={disabled} onChange={(raw) => set("checkAttempts", Math.min(20, Math.max(1, raw || 3)))} />
      <NumericInputField label={cs.targetAccuracyLabel} min={0.51} max={1} step={0.01} value={value.targetAccuracy} disabled={disabled} onChange={(raw) => set("targetAccuracy", Math.min(1, Math.max(0.51, raw || 0.95)))} />
      <NumericInputField label={cs.maxCallsFactorLabel} min={1} max={20} value={value.maxCallsFactor} disabled={disabled} onChange={(raw) => set("maxCallsFactor", Math.min(20, Math.max(1, raw || 3)))} />
      <NumericInputField label={cs.concurrencyLabel} min={1} max={20} value={value.concurrency} disabled={disabled} onChange={(raw) => set("concurrency", Math.min(20, Math.max(1, raw || 5)))} />
    </div>
  );
}

function FingerprintProbeTargetsEditor({
  value,
  onChange,
}: {
  value: ModelFingerprintConfig;
  onChange: (next: ModelFingerprintConfig) => void;
}) {
  const { t } = useI18n();
  const fp = t.fingerprint;
  const cs = fp.configSection;
  const disabled = !value.enabled;

  const updateProbeTarget = (probeId: ProbeId, nextCount: number) => {
    const sanitized = Math.max(10, Math.min(500, Math.round(nextCount || DEFAULT_SAMPLES_BY_PROBE[probeId])));
    const nextByProbe: Partial<Record<ProbeId, number>> = { ...(value.samplesByProbe ?? {}), [probeId]: sanitized };
    const minTarget = Math.min(...PROBE_IDS.map((id) => resolveProbeTargetSamples(id, { ...value, samplesByProbe: nextByProbe })));
    onChange({
      ...value,
      samplesByProbe: nextByProbe,
      valuesPerCheck: Math.min(value.valuesPerCheck, Math.max(1, Math.floor(minTarget / 2))),
    });
  };

  return (
    <div className="stack config-fp-block-bordered">
      <div className="field-row config-fp-row-between">
        <span className="config-fp-sublabel">{cs.samplesByProbeTitle}</span>
        <Button
          size="sm"
          disabled={disabled}
          onClick={() =>
            onChange({
              ...value,
              samplesPerProbe: DEFAULT_MODEL_FINGERPRINT_CONFIG.samplesPerProbe,
              samplesByProbe: { ...DEFAULT_SAMPLES_BY_PROBE },
            })
          }
        >
          {cs.resetDefaultSamplesBtn}
        </Button>
      </div>
      <div className="config-fp-targets-grid">
        {PROBE_IDS.map((probeId) => (
          <NumericInputField
            key={probeId}
            label={`${probeId} · ${fp.probes[probeId].label}`}
            min={10}
            max={500}
            value={resolveProbeTargetSamples(probeId, value)}
            disabled={disabled}
            onChange={(raw) => updateProbeTarget(probeId, raw)}
          />
        ))}
      </div>
    </div>
  );
}

function FingerprintSharedSourcesSummary({
  models,
  profiles,
}: {
  models: readonly FingerprintReferenceTarget[];
  profiles: readonly ProfileConfig[];
}) {
  const { t } = useI18n();
  const cs = t.fingerprint.configSection;
  return (
    <div className="stack config-fp-block-bordered">
      <div className="field-row config-fp-row-between">
        <span className="config-fp-sublabel">{cs.referencesTitle}</span>
        <div className="field-row config-fp-links-row">
          <a href="#matrix" className="secondary-link">{cs.manageMatrixLink}</a>
          <a href="#profiles" className="secondary-link">{cs.manageProfilesLink}</a>
        </div>
      </div>
      <p className="note config-fp-note">
        {formatText(cs.sharedMatrixHint, { modelCount: models.length, profileCount: profiles.length })}
      </p>
      {models.length > 0 && (
        <div className="field-row config-fp-chips-row">
          {models.map((ref) => (
            <code key={`${ref.cli}:${ref.model}`} className="config-fp-model-chip fp-model-chip">
              {ref.cli}/{ref.model}
            </code>
          ))}
        </div>
      )}
    </div>
  );
}
