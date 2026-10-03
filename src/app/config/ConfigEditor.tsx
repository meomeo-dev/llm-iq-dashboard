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
import { HarnessGuardForm } from "./HarnessGuardForm";
import { JudgePanel } from "./JudgePanel";
import { DataRepoSettingsSection } from "./DataRepoForm";
import { ConfigSection } from "./ConfigSection";
import { ProfilePanel, type ProfilePanelProps } from "./ProfilePanel";
import type { ProfileCredentialTable } from "@/core/profile-credentials";
import { useProfileCredentials } from "./use-profile-credentials";
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

      <DataRepoSettingsSection value={draft.dataRepo} onChange={(v) => patch("dataRepo", v)} />

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
      id="prompts"
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

function HarnessGuardSection({
  value,
  onChange,
}: {
  value: EditableConfig["run"]["harnessGuard"];
  onChange: (value: EditableConfig["run"]["harnessGuard"]) => void;
}) {
  return (
    <ConfigSection
      id="harness-guard"
      title="直出约束"
      hint="开启后每条提示词末尾附上这段话，要求模型直接作答，抑制 CLI 工具自带的联网检索、跑代码自测与截图自检，让结果反映模型本身。附加的原文记进 run.json，与不加约束的轮次区分。"
    >
      <HarnessGuardForm value={value} onChange={onChange} />
    </ConfigSection>
  );
}

function ProfileSection({
  draft,
  ...panel
}: { draft: EditableConfig } & Omit<ProfilePanelProps, "upstreamTypes" | "profiles" | "targets">) {
  return (
    <ConfigSection
      id="profiles"
      title="上游 Profile"
      hint="codex 经第三方上游调用的配置，与登录态并列对比。名字、类型、分组、官网、倍率随结果公开；接口地址与 API key 不公开。"
    >
      <ProfilePanel upstreamTypes={draft.upstreamTypes} profiles={draft.profiles} targets={draft.targets} {...panel} />
    </ConfigSection>
  );
}

function MatrixSection({
  targets,
  profiles,
  catalog,
  customModels,
  onTargets,
  onCustomModels,
}: {
  targets: Target[];
  profiles: EditableConfig["profiles"];
  catalog: CapabilitySnapshot;
  customModels: Partial<Record<CliKind, string[]>>;
  onTargets: (targets: Target[]) => void;
  onCustomModels: (models: Partial<Record<CliKind, string[]>>) => void;
}) {
  return (
    <ConfigSection id="matrix" title="被测矩阵" hint="强度只列出该模型支持的档位。">
      <TargetTable
        targets={targets}
        profiles={profiles}
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
  onSave: () => Promise<boolean>;
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
      id="schedule"
      title="调度"
      hint="这里只定节奏，到点是否执行看“自动任务”开关。cron 与间隔二选一，cron 优先；保存后 30 秒内生效，无需重启。"
    >
      <ScheduleForm value={schedule} onChange={onChange} />
    </ConfigSection>
  );
}

function JudgeSection({
  judge,
  catalog,
  onChange,
}: {
  judge: EditableConfig["judge"];
  catalog: CapabilitySnapshot;
  onChange: (value: EditableConfig["judge"]) => void;
}) {
  return (
    <ConfigSection
      id="judge"
      title="作品评审"
      hint="有评分标准的题目（动态鹈鹕车）给作品贴智商在线 / 降智标签。代码层不花配额；AI 层由裁判 CLI 看联系图打分，走裁判的登录态与配额。"
    >
      <JudgePanel value={judge} catalog={catalog} onChange={onChange} />
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
      id="timeout"
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
