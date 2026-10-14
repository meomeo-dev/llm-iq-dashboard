"use client";

import { useState } from "react";
import type { CapabilitySnapshot } from "@/capabilities/types";
import type { PromptSpec } from "@/core/prompt";
import type { CliKind, Target } from "@/core/types";
import type { RotationConfig } from "@/core/variables";
import { useI18n } from "@/i18n";
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
import { type EditableConfig, type ConfigEditorStatus } from "./config-editor-model";
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
      <ConfigEditorActions status={status} busy={busy} onSave={save} onRunNow={runNow} />
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
  const { locale } = useI18n();
  const isEn = locale === "en";
  return (
    <ConfigSection
      id="prompts"
      title={isEn ? "Prompts" : "提示词"}
      hint={
        isEn
          ? "The classic prompt is locked as a control baseline; variable prompts rotate subjects and scenes by period."
          : "经典版固定不变，作为对照；变量版按轮换周期更换主体与场景。"
      }
    >
      <PromptPicker
        builtins={builtinPrompts}
        custom={customPrompts}
        enabled={promptIds}
        onEnabled={(ids) => onPatchRun({ promptIds: ids })}
        onCustom={onPatchCustomPrompts}
      />
      <RotationForm value={rotation} onChange={(next) => onPatchRun({ rotation: next })} />
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
  const { locale } = useI18n();
  const isEn = locale === "en";
  return (
    <ConfigSection
      id="harness-guard"
      title={isEn ? "Harness Guard" : "直出约束"}
      hint={
        isEn
          ? "When enabled, appends this paragraph to every prompt to require direct SVG output and suppress built-in web search, code execution, and screenshot self-checks. Recorded in run.json to distinguish from unguarded rounds."
          : "开启后每条提示词末尾附上这段话，要求模型直接作答，抑制 CLI 工具自带的联网检索、跑代码自测与截图自检，让结果反映模型本身。附加的原文记进 run.json，与不加约束的轮次区分。"
      }
    >
      <HarnessGuardForm value={value} onChange={onChange} />
    </ConfigSection>
  );
}

function ProfileSection({
  draft,
  ...panel
}: { draft: EditableConfig } & Omit<ProfilePanelProps, "upstreamTypes" | "profiles" | "targets">) {
  const { locale } = useI18n();
  const isEn = locale === "en";
  return (
    <ConfigSection
      id="profiles"
      title={isEn ? "Upstream Profiles" : "上游 Profile"}
      hint={
        isEn
          ? "Third-party upstream profiles for codex, compared side-by-side with official login. Name, type, group, website, and multiplier are published; baseUrl and API key remain private."
          : "codex 经第三方上游调用的配置，与登录态并列对比。名字、类型、分组、官网、倍率随结果公开；接口地址与 API key 不公开。"
      }
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
  const { locale } = useI18n();
  const isEn = locale === "en";
  return (
    <ConfigSection
      id="matrix"
      title={isEn ? "Target Matrix" : "被测矩阵"}
      hint={isEn ? "Only effort levels supported by the selected model are listed." : "强度只列出该模型支持的档位。"}
    >
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
  const { locale } = useI18n();
  const isEn = locale === "en";
  return (
    <div className="actions">
      <button type="button" className="primary" onClick={onSave} disabled={busy}>
        {isEn ? "Save Config" : "保存配置"}
      </button>
      <button type="button" onClick={onRunNow} disabled={busy}>
        {isEn ? "Run a Round Now" : "立即跑一轮"}
      </button>
      {status.kind !== "idle" && <span className={`status ${status.kind}`}>{status.message}</span>}
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
  const { locale } = useI18n();
  const isEn = locale === "en";
  return (
    <ConfigSection
      id="schedule"
      title={isEn ? "Schedule" : "调度"}
      hint={
        isEn
          ? "Defines the cadence; whether a scheduled trigger runs is controlled by the Auto-Run toggle. Choose cron or interval (cron takes precedence); takes effect within 30s after saving without restart."
          : "这里只定节奏，到点是否执行看“自动任务”开关。cron 与间隔二选一，cron 优先；保存后 30 秒内生效，无需重启。"
      }
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
  const { locale } = useI18n();
  const isEn = locale === "en";
  return (
    <ConfigSection
      id="judge"
      title={isEn ? "Artwork Judging" : "作品评审"}
      hint={
        isEn
          ? "Evaluates prompts with rubrics (Animated Pelican) and tags artworks as Sharp / Degraded. Code layer uses zero quota; AI layer uses a cross-vendor judge CLI on contact sheets."
          : "有评分标准的题目（动态鹈鹕车）给作品贴智商在线 / 降智标签。代码层不花配额；AI 层由裁判 CLI 看联系图打分，走裁判的登录态与配额。"
      }
    >
      <JudgePanel value={judge} catalog={catalog} onChange={onChange} />
    </ConfigSection>
  );
}

function TimeoutSection({ run, onChange }: { run: EditableConfig["run"]; onChange: (run: EditableConfig["run"]) => void }) {
  const isEn = useI18n().locale === "en";
  return (
    <ConfigSection id="timeout" title={isEn ? "Execution & Timeouts" : "执行与超时"} hint={isEn ? "Per-CLI and per-effort timeout overrides." : "各家 CLI 的超时可单独设置。"}>
      <TimeoutForm run={run} onChange={(next) => onChange({ ...run, ...next })} />
    </ConfigSection>
  );
}
