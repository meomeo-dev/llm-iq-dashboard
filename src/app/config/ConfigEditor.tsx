"use client";

import { useState } from "react";
import type { CapabilitySnapshot } from "@/capabilities/types";
import type { PromptSpec } from "@/core/prompt";
import { CapabilityPanel } from "./CapabilityPanel";
import { DataRepoSettingsSection } from "./DataRepoForm";
import { ModelFingerprintSection } from "./ModelFingerprintSection";
import type { ProfileCredentialTable } from "@/core/profile-credentials";
import { useProfileCredentials } from "./use-profile-credentials";
import { type EditableConfig } from "./config-editor-model";
import { useConfigEditor } from "./use-config-editor";
import {
  ConfigEditorActions,
  HarnessGuardSection,
  JudgeSection,
  MatrixSection,
  ProfileSection,
  PromptSection,
  ScheduleSection,
  TimeoutSection,
} from "./ConfigSectionShell";

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
  const [draft, setDraft] = useState<EditableConfig>(initialConfig);
  const [catalog, setCatalog] = useState(initialCatalog);
  const { status, save, runNow } = useConfigEditor(draft);
  const credentials = useProfileCredentials(initialCredentials);
  // 保存后页面刷新，initialConfig 随之更新：以它为准判断哪些 profile 已落盘
  const savedNames = new Set(initialConfig.profiles.map((profile) => profile.name));

  const patch = <K extends keyof EditableConfig>(key: K, value: EditableConfig[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const busy = status.kind === "busy";

  return (
    <div className="config">
      <CapabilityPanel catalog={catalog} onCatalog={setCatalog} disabled={busy} />
      <PromptSection
        builtinPrompts={builtinPrompts}
        customPrompts={draft.customPrompts}
        promptIds={draft.run.promptIds}
        rotation={draft.run.rotation}
        onPatchRun={(next) => patch("run", { ...draft.run, ...next })}
        onPatchCustomPrompts={(prompts) => patch("customPrompts", prompts)}
      />
      <HarnessGuardSection
        value={draft.run.harnessGuard}
        onChange={(harnessGuard) => patch("run", { ...draft.run, harnessGuard })}
      />
      <ProfileSection
        draft={draft}
        savedNames={savedNames}
        onEnsureSaved={save}
        credentials={credentials}
        onUpstreamTypes={(next) => patch("upstreamTypes", next)}
        onProfiles={(profiles, targets) =>
          setDraft((current) => ({ ...current, profiles, targets: targets ?? current.targets }))
        }
      />
      <MatrixSection
        targets={draft.targets}
        profiles={draft.profiles}
        catalog={catalog}
        customModels={draft.customModels}
        onTargets={(targets) => patch("targets", targets)}
        onCustomModels={(models) => patch("customModels", models)}
      />
      <ScheduleSection schedule={draft.schedule} onChange={(v) => patch("schedule", v)} />
      <TimeoutSection run={draft.run} onChange={(updated) => patch("run", updated)} />
      <JudgeSection judge={draft.judge} catalog={catalog} onChange={(v) => patch("judge", v)} />
      <ModelFingerprintSection
        value={draft.modelFingerprint}
        catalog={catalog}
        onChange={(v) => patch("modelFingerprint", v)}
      />
      <DataRepoSettingsSection value={draft.dataRepo} onChange={(v) => patch("dataRepo", v)} />
      <ConfigEditorActions status={status} busy={busy} onSave={save} onRunNow={runNow} />
    </div>
  );
}
