"use client";

import { useState } from "react";
import type { CapabilitySnapshot } from "@/capabilities/types";
import type { PromptSpec } from "@/core/prompt";
import type { CliKind, Target } from "@/core/types";
import type { RotationConfig } from "@/core/variables";
import { ScheduleForm } from "./ScheduleForm";
import { TargetTable } from "./TargetTable";
import { PromptPicker } from "./PromptPicker";
import { CapabilityPanel } from "./CapabilityPanel";
import { RotationForm } from "./RotationForm";
import { TimeoutForm } from "./TimeoutForm";
import { ConfigSection } from "./ConfigSection";
import {
  type EditableConfig,
  type ConfigEditorStatus,
} from "./config-editor-model";
import { useConfigEditor } from "./use-config-editor";

export { type EditableConfig };

export function ConfigEditor({
  initialConfig,
  builtinPrompts,
  initialCatalog,
}: {
  initialConfig: EditableConfig;
  builtinPrompts: PromptSpec[];
  initialCatalog: CapabilitySnapshot;
}) {
  const [draft, setDraft] = useState<EditableConfig>(initialConfig);
  const [catalog, setCatalog] = useState(initialCatalog);
  const { status, save, runNow } = useConfigEditor(draft);

  const patch = <K extends keyof EditableConfig>(key: K, value: EditableConfig[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const busy = status.kind === "busy";

  return (
    <div className="config">
      <CapabilityPanel catalog={catalog} onCatalog={setCatalog} disabled={busy} />

      <ScheduleSection
        schedule={draft.schedule}
        onChange={(v) => patch("schedule", v)}
      />

      <PromptSection
        builtinPrompts={builtinPrompts}
        customPrompts={draft.customPrompts}
        promptIds={draft.run.promptIds}
        rotation={draft.run.rotation}
        onPatchRun={(next) => patch("run", { ...draft.run, ...next })}
        onPatchCustomPrompts={(prompts) => patch("customPrompts", prompts)}
      />

      <MatrixSection
        targets={draft.targets}
        catalog={catalog}
        customModels={draft.customModels}
        onTargets={(targets) => patch("targets", targets)}
        onCustomModels={(models) => patch("customModels", models)}
      />

      <TimeoutSection
        run={draft.run}
        onChange={(updated) => patch("run", updated)}
      />

      <ConfigEditorActions
        status={status}
        busy={busy}
        onSave={save}
        onRunNow={runNow}
      />
    </div>
  );
}

function PromptSection({
  builtinPrompts,
  customPrompts,
  promptIds,
  rotation,
  onPatchRun,
  onPatchCustomPrompts,
}: {
  builtinPrompts: PromptSpec[];
  customPrompts: PromptSpec[];
  promptIds: string[];
  rotation: RotationConfig;
  onPatchRun: (patch: Partial<EditableConfig["run"]>) => void;
  onPatchCustomPrompts: (prompts: PromptSpec[]) => void;
}) {
  return (
    <ConfigSection
      title="提示词"
      hint="经典版固定不变，作为对照；变量版按轮换周期更换主体与场景。"
    >
      <PromptPicker
        builtins={builtinPrompts}
        custom={customPrompts}
        enabled={promptIds}
        onEnabled={(ids) => onPatchRun({ promptIds: ids })}
        onCustom={onPatchCustomPrompts}
      />
      <RotationForm
        value={rotation}
        onChange={(next) => onPatchRun({ rotation: next })}
      />
    </ConfigSection>
  );
}

function MatrixSection({
  targets,
  catalog,
  customModels,
  onTargets,
  onCustomModels,
}: {
  targets: Target[];
  catalog: CapabilitySnapshot;
  customModels: Partial<Record<CliKind, string[]>>;
  onTargets: (targets: Target[]) => void;
  onCustomModels: (models: Partial<Record<CliKind, string[]>>) => void;
}) {
  return (
    <ConfigSection title="被测矩阵" hint="强度只列出该模型支持的档位。">
      <TargetTable
        targets={targets}
        catalog={catalog}
        customModels={customModels}
        onTargets={onTargets}
        onCustomModels={onCustomModels}
      />
    </ConfigSection>
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
  onSave: () => void;
  onRunNow: () => void;
}) {
  return (
    <div className="actions">
      <button type="button" className="primary" onClick={onSave} disabled={busy}>
        保存配置
      </button>
      <button type="button" onClick={onRunNow} disabled={busy}>
        立即跑一轮
      </button>
      {status.kind !== "idle" && (
        <span className={`status ${status.kind}`}>{status.message}</span>
      )}
    </div>
  );
}

function ScheduleSection({
  schedule,
  onChange,
}: {
  schedule: EditableConfig["schedule"];
  onChange: (value: EditableConfig["schedule"]) => void;
}) {
  return (
    <ConfigSection
      title="调度"
      hint="这里只定节奏，到点是否执行看“自动任务”开关。cron 与间隔二选一，cron 优先；保存后 30 秒内生效，无需重启。"
    >
      <ScheduleForm value={schedule} onChange={onChange} />
    </ConfigSection>
  );
}

function TimeoutSection({
  run,
  onChange,
}: {
  run: EditableConfig["run"];
  onChange: (run: EditableConfig["run"]) => void;
}) {
  return (
    <ConfigSection
      title="执行与超时"
      hint="各家 CLI 的超时可单独设置。"
    >
      <TimeoutForm
        run={run}
        onChange={(next) => onChange({ ...run, ...next })}
      />
    </ConfigSection>
  );
}
