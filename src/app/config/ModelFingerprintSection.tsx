"use client";

import type { CapabilitySnapshot } from "@/capabilities/types";
import { DEFAULT_MODEL_FINGERPRINT_CONFIG } from "@/core/config/model-fingerprint";
import type { ModelFingerprintConfig } from "@/core/config/types";
import {
  DEFAULT_SAMPLES_BY_PROBE,
  PROBE_IDS,
  resolveProbeTargetSamples,
  type FingerprintReferenceTarget,
  type ProbeId,
} from "@/core/model-fingerprint/types";
import { CLI_KINDS, EFFORT_LEVELS, type CliKind, type EffortLevel } from "@/core/types";
import { useI18n } from "@/i18n";
import { ConfigSection } from "./ConfigSection";

export function ModelFingerprintSection({
  value,
  catalog,
  onChange,
}: {
  value?: ModelFingerprintConfig;
  catalog: CapabilitySnapshot;
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
      <ModelFingerprintForm value={draft} catalog={catalog} onChange={onChange} />
    </ConfigSection>
  );
}

export function ModelFingerprintForm({
  value,
  catalog,
  onChange,
}: {
  value: ModelFingerprintConfig;
  catalog: CapabilitySnapshot;
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

  return (
    <div className="stack">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <label className="checkbox">
          <input type="checkbox" checked={value.enabled} onChange={(e) => set("enabled", e.target.checked)} />
          {fp.configSection.enabledLabel}
        </label>
        <a href="/fingerprint" className="secondary-link">
          {fp.configSection.openFingerprintConsole}
        </a>
      </div>
      <FingerprintNumericFields value={value} onChange={onChange} />
      <FingerprintProbeTargetsEditor value={value} onChange={onChange} />
      <div className="stack">
        <span>{fp.configSection.probesLabel}</span>
        <div className="row" style={{ flexWrap: "wrap", gap: "12px" }}>
          {PROBE_IDS.map((probeId) => (
            <label key={probeId} className="checkbox" title={fp.probes[probeId].desc}>
              <input
                type="checkbox"
                checked={value.probes.includes(probeId)}
                disabled={!value.enabled}
                onChange={(e) => toggleProbe(probeId, e.target.checked)}
              />
              <code>{probeId}</code> · {fp.probes[probeId].label}
            </label>
          ))}
        </div>
      </div>
      <FingerprintReferencesEditor
        references={value.references}
        catalog={catalog}
        disabled={!value.enabled}
        onChange={(refs) => set("references", refs)}
      />
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
    <label>
      {props.label}
      <input
        type="number"
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
    <div
      className="grid-fields"
      style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}
    >
      <label>
        {cs.effortLabel}
        <select value={value.effort} disabled={disabled} onChange={(e) => set("effort", e.target.value as EffortLevel)}>
          {EFFORT_LEVELS.map((ef) => (
            <option key={ef} value={ef}>{ef}</option>
          ))}
        </select>
      </label>
      <NumericInputField
        label={cs.samplesPerProbeLabel} min={10} max={500} value={value.samplesPerProbe} disabled={disabled}
        onChange={(raw) => {
          const nextSamples = Math.max(10, raw || 20);
          onChange({ ...value, samplesPerProbe: nextSamples, valuesPerCheck: Math.min(value.valuesPerCheck, Math.max(1, Math.floor(nextSamples / 2))) });
        }}
      />
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
    const nextByProbe: Partial<Record<ProbeId, number>> = {
      ...(value.samplesByProbe ?? {}),
      [probeId]: sanitized,
    };
    const minTarget = Math.min(
      ...PROBE_IDS.map((id) => resolveProbeTargetSamples(id, { ...value, samplesByProbe: nextByProbe })),
    );
    onChange({
      ...value,
      samplesByProbe: nextByProbe,
      valuesPerCheck: Math.min(value.valuesPerCheck, Math.max(1, Math.floor(minTarget / 2))),
    });
  };

  return (
    <div className="stack">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <span>{cs.samplesByProbeTitle}</span>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange({ ...value, samplesByProbe: { ...DEFAULT_SAMPLES_BY_PROBE } })}
        >
          {cs.resetDefaultSamplesBtn}
        </button>
      </div>
      <div
        className="grid-fields"
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "10px" }}
      >
        {PROBE_IDS.map((probeId) => (
          <NumericInputField
            key={probeId}
            label={`${probeId} (${fp.probes[probeId].label})`}
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

function FingerprintReferencesEditor({
  references,
  catalog,
  disabled,
  onChange,
}: {
  references: FingerprintReferenceTarget[];
  catalog: CapabilitySnapshot;
  disabled: boolean;
  onChange: (next: FingerprintReferenceTarget[]) => void;
}) {
  const { t } = useI18n();
  const cs = t.fingerprint.configSection;
  const updateRow = (idx: number, patch: Partial<FingerprintReferenceTarget>) =>
    onChange(references.map((item, i) => (i === idx ? { ...item, ...patch } : item)));

  const addRow = () => {
    const entry = catalog.clis.find((c) => c.cli === "codex");
    const firstModel = entry?.models[0]?.id ?? "gpt-5.4";
    onChange([...references, { cli: "codex", model: firstModel }]);
  };

  return (
    <div className="stack">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <span>{cs.referencesTitle}</span>
        <button type="button" onClick={addRow} disabled={disabled}>+ {cs.addReferenceBtn}</button>
      </div>
      {references.map((ref, idx) => (
        <div key={`${idx}-${ref.cli}`} className="row" style={{ gap: "8px", alignItems: "center" }}>
          <select value={ref.cli} disabled={disabled} onChange={(e) => updateRow(idx, { cli: e.target.value as CliKind })}>
            {CLI_KINDS.map((cli) => (
              <option key={cli} value={cli}>{cli}</option>
            ))}
          </select>
          <input
            type="text"
            value={ref.model}
            disabled={disabled}
            placeholder="model-id"
            onChange={(e) => updateRow(idx, { model: e.target.value })}
            style={{ flex: 1 }}
          />
          <button type="button" disabled={disabled} onClick={() => onChange(references.filter((_, i) => i !== idx))}>
            {cs.removeReferenceBtn}
          </button>
        </div>
      ))}
    </div>
  );
}
