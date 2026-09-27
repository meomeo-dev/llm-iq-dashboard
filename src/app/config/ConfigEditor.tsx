"use client";

import { useState } from "react";
import { actionFetch } from "../components/action-fetch";
import { useRouter } from "next/navigation";
import type { CapabilitySnapshot } from "@/capabilities/types";
import type { PromptSpec } from "@/core/prompt";
import type { CliKind, EffortLevel, Target } from "@/core/types";
import type { RotationConfig } from "@/core/variables";
import { ScheduleForm, type ScheduleDraft } from "./ScheduleForm";
import { TargetTable } from "./TargetTable";
import { PromptPicker } from "./PromptPicker";
import { CapabilityPanel } from "./CapabilityPanel";
import { RotationForm } from "./RotationForm";
import { TimeoutForm } from "./TimeoutForm";

export interface EditableConfig {
  schedule: ScheduleDraft;
  run: {
    promptIds: string[];
    concurrency: number;
    defaultTimeoutMs: number;
    timeoutByCli: Partial<Record<CliKind, number>>;
    timeoutByEffort?: Partial<Record<EffortLevel, number>>;
    rotation: RotationConfig;
  };
  targets: Target[];
  customPrompts: PromptSpec[];
  customModels: Partial<Record<CliKind, string[]>>;
}

type Status =
  | { kind: "idle" }
  | { kind: "busy"; message: string }
  | { kind: "ok"; message: string }
  | { kind: "error"; message: string };

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
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const router = useRouter();

  const patch = <K extends keyof EditableConfig>(key: K, value: EditableConfig[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const save = async (): Promise<void> => {
    setStatus({ kind: "busy", message: "正在保存…" });
    try {
      const response = await actionFetch("/api/config", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          schedule: draft.schedule,
          run: draft.run,
          targets: draft.targets,
          prompts: draft.customPrompts,
          customModels: draft.customModels,
        }),
      });
      const body = (await response.json()) as { error?: string };

      if (!response.ok) {
        // 校验失败时配置文件未写入；错误信息原样展示
        setStatus({ kind: "error", message: body.error ?? "保存失败" });
        return;
      }
      setStatus({ kind: "ok", message: "已保存。调度器会在下一次触发前重新读取配置。" });
      router.refresh();
    } catch (cause) {
      setStatus({ kind: "error", message: describe(cause) });
    }
  };

  const runNow = async (): Promise<void> => {
    setStatus({ kind: "busy", message: "正在发起一轮…" });
    try {
      const response = await actionFetch("/api/run", { method: "POST" });
      const body = (await response.json()) as { error?: string; calls?: number };
      if (!response.ok) {
        setStatus({ kind: "error", message: body.error ?? "执行失败" });
        return;
      }
      // 接口发起后即返回，整轮在后台执行
      setStatus({ kind: "ok", message: `已开始，共 ${body.calls} 次调用；进度见首页执行状态。` });
    } catch (cause) {
      setStatus({ kind: "error", message: describe(cause) });
    }
  };

  const busy = status.kind === "busy";

  return (
    <div className="config">
      <CapabilityPanel catalog={catalog} onCatalog={setCatalog} disabled={busy} />

      <Section
        title="调度"
        hint="cron 与间隔二选一，cron 优先。改动保存后于下一个触发点生效。"
      >
        <ScheduleForm value={draft.schedule} onChange={(v) => patch("schedule", v)} />
      </Section>

      <Section
        title="提示词"
        hint="经典版固定不变，作为对照；变量版按轮换周期更换主体与场景。"
      >
        <PromptPicker
          builtins={builtinPrompts}
          custom={draft.customPrompts}
          enabled={draft.run.promptIds}
          onEnabled={(ids) => patch("run", { ...draft.run, promptIds: ids })}
          onCustom={(prompts) => patch("customPrompts", prompts)}
        />
        <RotationForm
          value={draft.run.rotation}
          onChange={(rotation) => patch("run", { ...draft.run, rotation })}
        />
      </Section>

      <Section
        title="被测矩阵"
        hint="强度只列出该模型支持的档位。"
      >
        <TargetTable
          targets={draft.targets}
          catalog={catalog}
          customModels={draft.customModels}
          onTargets={(targets) => patch("targets", targets)}
          onCustomModels={(models) => patch("customModels", models)}
        />
      </Section>

      <Section
        title="执行与超时"
        hint="各家 CLI 的超时可单独设置。"
      >
        <TimeoutForm
          run={draft.run}
          onChange={(run) => patch("run", { ...draft.run, ...run })}
        />
      </Section>

      <div className="actions">
        <button type="button" className="primary" onClick={save} disabled={busy}>
          保存配置
        </button>
        <button type="button" onClick={runNow} disabled={busy}>
          立即跑一轮
        </button>
        {status.kind !== "idle" && (
          <span className={`status ${status.kind}`}>{status.message}</span>
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <section className="config-section">
      <header>
        <h2>{title}</h2>
        <p>{hint}</p>
      </header>
      {children}
    </section>
  );
}

function describe(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause);
}
