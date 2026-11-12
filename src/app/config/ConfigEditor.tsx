"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/Button";
import type { CapabilitySnapshot } from "@/capabilities/types";
import type { PromptSpec } from "@/core/prompt";
import type { ProfileCredentialTable } from "@/core/profile-credentials";
import { useI18n } from "@/i18n";
import { CapabilityPanel } from "./CapabilityPanel";
import { ConfigSection } from "./ConfigSection";
import { DataRepoSettingsSection } from "./DataRepoForm";
import { HarnessGuardForm } from "./HarnessGuardForm";
import { JudgePanel } from "./JudgePanel";
import { ModelFingerprintSection } from "./ModelFingerprintSection";
import { ProfilePanel } from "./ProfilePanel";
import { PromptPicker } from "./PromptPicker";
import { RotationForm } from "./RotationForm";
import { ScheduleForm } from "./ScheduleForm";
import { TargetTable } from "./TargetTable";
import { TimeoutForm } from "./TimeoutForm";
import {
  getConfigSectionMeta,
  type ConfigEditorStatus,
  type EditableConfig,
} from "./config-editor-model";
import { useConfigEditor } from "./use-config-editor";
import { useProfileCredentials } from "./use-profile-credentials";

export { type EditableConfig };

export function ConfigEditor({
  initialConfig,
  builtinPrompts,
  initialCatalog,
  initialCredentials,
}: {
  initialConfig: EditableConfig;
  builtinPrompts: PromptSpec[];
  initialCatalog: CapabilitySnapshot;
  initialCredentials: ProfileCredentialTable;
}) {
  const isEn = useI18n().locale === "en";
  const [draft, setDraft] = useState<EditableConfig>(initialConfig);
  const [catalog, setCatalog] = useState(initialCatalog);
  const { status, save, runNow } = useConfigEditor(draft);
  const credentials = useProfileCredentials(initialCredentials);
  const savedNames = new Set(initialConfig.profiles.map((profile) => profile.name));
  const patch = <K extends keyof EditableConfig>(key: K, value: EditableConfig[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));
  const busy = status.kind === "busy";

  return (
    <div className="config">
      <CapabilityPanel catalog={catalog} onCatalog={setCatalog} disabled={busy} />
      <ConfigSection {...getConfigSectionMeta("prompts", isEn)}>
        <PromptPicker builtins={builtinPrompts} custom={draft.customPrompts} enabled={draft.run.promptIds}
          onEnabled={(promptIds) => patch("run", { ...draft.run, promptIds })} onCustom={(prompts) => patch("customPrompts", prompts)} />
        <RotationForm value={draft.run.rotation} onChange={(rotation) => patch("run", { ...draft.run, rotation })} />
      </ConfigSection>
      <ConfigSection {...getConfigSectionMeta("harness-guard", isEn)}>
        <HarnessGuardForm value={draft.run.harnessGuard} onChange={(harnessGuard) => patch("run", { ...draft.run, harnessGuard })} />
      </ConfigSection>
      <ConfigSection {...getConfigSectionMeta("profiles", isEn)}>
        <ProfilePanel upstreamTypes={draft.upstreamTypes} profiles={draft.profiles} targets={draft.targets} savedNames={savedNames}
          onEnsureSaved={save} credentials={credentials} onUpstreamTypes={(next) => patch("upstreamTypes", next)}
          onProfiles={(profiles, targets) => setDraft((current) => ({ ...current, profiles, targets: targets ?? current.targets }))} />
      </ConfigSection>
      <ConfigSection {...getConfigSectionMeta("matrix", isEn)}>
        <TargetTable targets={draft.targets} profiles={draft.profiles} catalog={catalog} customModels={draft.customModels}
          onTargets={(targets) => patch("targets", targets)} onCustomModels={(models) => patch("customModels", models)} />
      </ConfigSection>
      <ConfigSection {...getConfigSectionMeta("schedule", isEn)}>
        <ScheduleForm value={draft.schedule} onChange={(v) => patch("schedule", v)} />
      </ConfigSection>
      <ConfigSection {...getConfigSectionMeta("timeout", isEn)}>
        <TimeoutForm run={draft.run} onChange={(next) => patch("run", { ...draft.run, ...next })} />
      </ConfigSection>
      <ConfigSection {...getConfigSectionMeta("judge", isEn)}>
        <JudgePanel value={draft.judge} catalog={catalog} onChange={(v) => patch("judge", v)} />
      </ConfigSection>
      <ModelFingerprintSection value={draft.modelFingerprint} catalog={catalog} targets={draft.targets}
        profiles={draft.profiles} onChange={(v) => patch("modelFingerprint", v)} />
      <DataRepoSettingsSection value={draft.dataRepo} onChange={(v) => patch("dataRepo", v)} />
      <ConfigEditorActions status={status} busy={busy} onSave={save} onRunNow={runNow} />
    </div>
  );
}

function ConfigEditorActions({
  status,
  busy,
  onSave,
  onRunNow,
}: {
  status: ConfigEditorStatus;
  busy: boolean;
  onSave: () => Promise<boolean>;
  onRunNow: () => void;
}) {
  const isEn = useI18n().locale === "en";
  return (
    <div className="config-actions-bar">
      <Button variant="primary" touch onClick={onSave} disabled={busy}>
        {isEn ? "Save Config" : "保存配置"}
      </Button>
      <Button touch onClick={onRunNow} disabled={busy}>
        {isEn ? "Run a Round Now" : "立即跑一轮"}
      </Button>
      {status.kind !== "idle" && <span className={`status ${status.kind}`}>{status.message}</span>}
    </div>
  );
}
