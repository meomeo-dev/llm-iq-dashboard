"use client";

import { useEffect, useRef, useState } from "react";
import { actionFetch } from "../action-fetch";
import type { RunOptionsView } from "@/app/api/run/route";
import type { ProgressView } from "@/core/progress";
import { useLiveProgress } from "../live-state/live-store";
import { Menu } from "../menu/Menu";
import { listEfforts } from "../timeline/moments";
import { RunForecast } from "./RunForecast";
import { resolveRunSelection, writeStoredSelection } from "./run-selection-store";
import { StopRunButton } from "./StopRunButton";
import { UnavailableNote } from "./UnavailableNote";

type Target = RunOptionsView["targets"][number];

interface RunOnceMenuProps {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
}

type Notice = { kind: "ok" | "error"; text: string } | null;

/**
 * “跑一次”：选范围（CLI · 模型 × 强度）与题目，发起一轮单次批任务。
 * 前端缓存（localStorage）记住用户的最后一次选择；
 * 首次进入/无缓存时默认模型全选，题目仅勾选“动态鹈鹕车”。
 */
let cachedRunOptions: RunOptionsView | null = null;
let prefetchPromise: Promise<RunOptionsView | { error: string }> | null = null;

/**
 * 提前预拉取单次执行选项，抹平首次打开时的网络往返与 Next.js 路由编译延迟。
 */
export async function prefetchRunOptions(): Promise<RunOptionsView | { error: string }> {
  if (cachedRunOptions !== null) return cachedRunOptions;
  if (prefetchPromise !== null) return prefetchPromise;
  prefetchPromise = fetchOptions().then((next) => {
    if (!("error" in next)) {
      cachedRunOptions = next;
    }
    prefetchPromise = null;
    return next;
  });
  return prefetchPromise;
}

/**
 * “跑一次”：选范围（CLI · 模型 × 强度）与题目，发起一轮单次批任务。
 * 前端缓存（localStorage）记住用户的最后一次选择；
 * 首次进入/无缓存时默认模型全选，题目仅勾选“动态鹈鹕车”。
 */
export function RunOnceMenu({ open, onToggle, onClose }: RunOnceMenuProps) {
  const [options, setOptions] = useState<RunOptionsView | null>(() => cachedRunOptions);
  const [targets, setTargets] = useState<ReadonlySet<string>>(() => {
    if (!cachedRunOptions) return new Set();
    const resolved = resolveRunSelection(cachedRunOptions, new Set(), new Set(), {});
    return resolved.targets;
  });
  const [prompts, setPrompts] = useState<ReadonlySet<string>>(() => {
    if (!cachedRunOptions) return new Set();
    const resolved = resolveRunSelection(cachedRunOptions, new Set(), new Set(), {});
    return resolved.prompts;
  });
  const [candidateOverrides, setCandidateOverrides] = useState<Record<string, string>>(() => {
    if (!cachedRunOptions) return {};
    const resolved = resolveRunSelection(cachedRunOptions, new Set(), new Set(), {});
    return resolved.candidateOverrides;
  });
  const [mobileTab, setMobileTab] = useState<"models" | "prompts">("models");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [startedRunId, setStartedRunId] = useState<string | null>(null);
  const activeRunId = useActiveRunId(options, startedRunId);

  const targetsRef = useRef<ReadonlySet<string>>(targets);
  targetsRef.current = targets;
  const promptsRef = useRef<ReadonlySet<string>>(prompts);
  promptsRef.current = prompts;
  const candidateOverridesRef = useRef<Record<string, string>>(candidateOverrides);
  candidateOverridesRef.current = candidateOverrides;

  const updateTargets = (next: ReadonlySet<string>): void => {
    targetsRef.current = next;
    setTargets(next);
    writeStoredSelection(next, promptsRef.current, candidateOverridesRef.current);
  };

  const updatePrompts = (next: ReadonlySet<string>): void => {
    promptsRef.current = next;
    setPrompts(next);
    writeStoredSelection(targetsRef.current, next, candidateOverridesRef.current);
  };

  const updateCandidateOverride = (promptId: string, candidateId: string): void => {
    const next = { ...candidateOverridesRef.current, [promptId]: candidateId };
    candidateOverridesRef.current = next;
    setCandidateOverrides(next);
    writeStoredSelection(targetsRef.current, promptsRef.current, next);
  };

  // 1. 组件挂载后立即在后台静默预取选项，使点击展开时无需经历数秒等待
  useEffect(() => {
    void prefetchRunOptions().then((next) => {
      if ("error" in next) return;
      setOptions((prev) => {
        if (prev === null) {
          const resolved = resolveRunSelection(next, targetsRef.current, promptsRef.current, candidateOverridesRef.current);
          targetsRef.current = resolved.targets;
          promptsRef.current = resolved.prompts;
          candidateOverridesRef.current = resolved.candidateOverrides;
          setTargets(resolved.targets);
          setPrompts(resolved.prompts);
          setCandidateOverrides(resolved.candidateOverrides);
          writeStoredSelection(resolved.targets, resolved.prompts, resolved.candidateOverrides);
        }
        return next;
      });
    });
  }, []);

  // 2. 每次面板打开时，在后台静默刷新活跃轮次与可用模型（stale-while-revalidate）
  useEffect(() => {
    if (!open) return;
    setNotice(null);
    void fetchOptions().then((next) => {
      if ("error" in next) {
        if (options === null) setNotice({ kind: "error", text: next.error });
        return;
      }
      cachedRunOptions = next;
      setOptions(next);
      const resolved = resolveRunSelection(next, targetsRef.current, promptsRef.current, candidateOverridesRef.current);
      targetsRef.current = resolved.targets;
      promptsRef.current = resolved.prompts;
      candidateOverridesRef.current = resolved.candidateOverrides;
      setTargets(resolved.targets);
      setPrompts(resolved.prompts);
      setCandidateOverrides(resolved.candidateOverrides);
      writeStoredSelection(resolved.targets, resolved.prompts, resolved.candidateOverrides);
    });
  }, [open]);

  const calls = targets.size * prompts.size;
  // 本面板发起的轮次在跑时只置灰按钮；被定时调度或其他页面的轮次占用时才提示
  const ownRunActive = activeRunId !== null && activeRunId === startedRunId;
  const stopping = useIsStopping(activeRunId);
  const start = async (): Promise<void> => {
    setBusy(true);
    const result = await postRun([...targets], [...prompts], candidateOverridesRef.current);
    setBusy(false);
    if ("error" in result) return setNotice({ kind: "error", text: result.error });
    setNotice({ kind: "ok", text: `已开始 ${result.runId}，共 ${result.calls} 次调用；进度见右侧执行状态` });
    // 本轮跑完前按钮置灰，避免重复发起得到 409
    setStartedRunId(result.runId);
  };

  return (
    <Menu label={<span className="run-once-label">▶ 跑一次</span>} align="right" panelClassName="run-once-panel" open={open} onToggle={onToggle} onClose={onClose}>
      {options === null && notice === null && <p className="run-empty">正在读取可选范围…</p>}
      {options !== null && (
        <>
          <div className="run-once-head-bar">
            <div
              className={`run-once-head-cell ${mobileTab === "models" ? "tab-active" : ""}`}
              onClick={() => setMobileTab("models")}
            >
              <PickerHead title="范围" picked={targets.size} all={options.targets.map((t) => t.id)} onPick={updateTargets} />
            </div>
            <div
              className={`run-once-head-cell ${mobileTab === "prompts" ? "tab-active" : ""}`}
              onClick={() => setMobileTab("prompts")}
            >
              <PickerHead title="题目" picked={prompts.size} all={options.prompts.map((p) => p.id)} onPick={updatePrompts} />
            </div>
            <button
              type="button"
              className="run-once-close"
              onClick={onClose}
              title="关闭"
              aria-label="关闭"
            >
              ✕
            </button>
          </div>
          <div className="run-once-body">
            <section className={`run-once-col run-once-col-models ${mobileTab === "models" ? "tab-visible" : ""}`}>
              <ModelRows targets={options.targets} picked={targets} onPick={updateTargets} />
              <UnavailableNote unavailable={options.unavailable} />
            </section>
            <section className={`run-once-col run-once-col-prompts ${mobileTab === "prompts" ? "tab-visible" : ""}`}>
              {groupPrompts(options.prompts).map((group) => (
                <div key={group.name} className="run-once-group">
                  <div className="run-once-group-header">{group.name}</div>
                  {group.items.map((prompt) => {
                    const hasCandidates = (prompt.candidates?.length ?? 0) > 0;
                    const isChecked = prompts.has(prompt.id);
                    return (
                      <div key={prompt.id} className="run-once-prompt-item">
                        <label className="menu-row">
                          <input type="checkbox" checked={isChecked} onChange={() => updatePrompts(toggled(prompts, [prompt.id]))} />
                          <span className="checkbox" aria-hidden="true" />
                          {/* 名字与 id 分两行：场景轮换题的名字截断后只能靠 id 区分 */}
                          <span className="menu-row-name run-once-prompt" title={prompt.label}>
                            {prompt.label}
                            <small>{prompt.id}</small>
                          </span>
                        </label>
                        {hasCandidates && isChecked && (
                          <div className="run-once-candidate-picker">
                            <select
                              id={`candidate-${prompt.id}`}
                              className="candidate-picker-select"
                              value={candidateOverrides[prompt.id] ?? ""}
                              onChange={(e) => updateCandidateOverride(prompt.id, e.target.value)}
                              aria-label={`${prompt.label} 指定场景`}
                            >
                              <option value="">随机 / 每日轮换（默认）</option>
                              {prompt.candidates!.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </section>
          </div>
        </>
      )}
      <footer className="run-once-foot">
        {options !== null && <RunForecast costs={options.costs} targetIds={[...targets]} promptCount={prompts.size} />}
        {notice !== null && <p className={`run-once-notice ${notice.kind}`}>{notice.text}</p>}
        {activeRunId !== null && !ownRunActive && <p className="run-once-notice error">轮次 {activeRunId} 仍在执行，跑完再发起</p>}
        {/* 可在此就地停止当前轮次 */}
        {activeRunId !== null && <StopRunButton runId={activeRunId} stopping={stopping} />}
        <button type="button" className="run-once-start" disabled={busy || calls === 0 || activeRunId !== null} onClick={() => void start()}>
          {busy ? "发起中…" : ownRunActive ? "本轮执行中…" : `开始（${calls} 次调用）`}
        </button>
      </footer>
    </Menu>
  );
}

/**
 * 正在执行的轮次（任一进程），以推送的进度为准。推送尚未带上刚发起的轮次时按本面板
 * 发起的轮次算；推送未连上时用打开面板时取到的值。
 */
function useActiveRunId(options: RunOptionsView | null, startedRunId: string | null): string | null {
  const progress = useLiveProgress();
  if (progress === null) return startedRunId ?? options?.activeRunId ?? null;
  const running = progress.find((run) => run.finishedAt === null && run.alive);
  if (running !== undefined) return running.runId;
  return startedRunId !== null && !hasReached(progress, startedRunId) ? startedRunId : null;
}

/** 这一轮是否已接受停止请求、正在收尾 */
function useIsStopping(runId: string | null): boolean {
  const progress = useLiveProgress();
  if (runId === null) return false;
  return progress?.some((run) => run.runId === runId && run.cancelledAt != null && run.finishedAt === null) === true;
}

/**
 * 推送的进度是否已含这一轮或更新的轮次。runId 字典序即时间序，这一轮被挤出
 * “最近几轮”时同样算已含，避免按钮一直锁定。
 */
function hasReached(progress: readonly ProgressView[], runId: string): boolean {
  return progress.some((run) => run.runId >= runId);
}

interface ModelGroup {
  key: string;
  cli: string;
  model: string;
  targets: Target[];
}

interface PickProps {
  picked: ReadonlySet<string>;
  onPick: (next: ReadonlySet<string>) => void;
}

/**
 * 范围清单：各行共用一套强度列（全部目标出现过的强度，按高低排），同一强度同列；
 * 某模型缺少的强度留空位。
 */
function ModelRows({ targets, picked, onPick }: PickProps & { targets: readonly Target[] }) {
  const efforts = listEfforts(targets);
  return (
    <div className="run-once-models" style={{ gridTemplateColumns: `minmax(140px, 1fr) repeat(${efforts.length}, auto)` }}>
      {groupByModel(targets).map((group) => (
        <ModelRow key={group.key} group={group} efforts={efforts} picked={picked} onPick={onPick} />
      ))}
    </div>
  );
}

/** 一行一个 CLI · 模型：点名字整行勾选 / 取消，右侧逐个强度单独勾 */
function ModelRow({ group, efforts, picked, onPick }: PickProps & { group: ModelGroup; efforts: readonly string[] }) {
  const ids = group.targets.map((target) => target.id);
  const pickedCount = ids.filter((id) => picked.has(id)).length;
  const toggleAll = (): void => onPick(pickedCount === ids.length ? without(picked, ids) : new Set([...picked, ...ids]));
  return (
    <div className="run-once-model">
      <label className="menu-row">
        <input type="checkbox" checked={pickedCount === ids.length} onChange={toggleAll} />
        <span className={pickedCount > 0 && pickedCount < ids.length ? "checkbox partial" : "checkbox"} aria-hidden="true" />
        <span className={`cli-mark cli-${group.cli}`} aria-hidden="true" />
        <span className="menu-row-name">{group.model}</span>
      </label>
      {group.targets.map((target) => (
        <button
          key={target.id}
          type="button"
          className="effort-chip"
          // 第 1 列是模型名，强度从第 2 列起按共用的强度顺序落位
          style={{ gridColumn: efforts.indexOf(target.effort) + 2 }}
          aria-pressed={picked.has(target.id)}
          title={target.label}
          onClick={() => onPick(toggled(picked, [target.id]))}
        >
          {target.effort}
        </button>
      ))}
    </div>
  );
}

function PickerHead({ title, picked, all, onPick }: { title: string; picked: number; all: string[]; onPick: (next: ReadonlySet<string>) => void }) {
  return (
    <div className="run-once-head">
      <b>{title}</b>
      <span className="menu-row-count">
        {picked}/{all.length}
      </span>
      <div className="check-bulk">
        <button type="button" onClick={() => onPick(new Set(all))} disabled={picked === all.length}>
          全选
        </button>
        <button type="button" onClick={() => onPick(new Set())} disabled={picked === 0}>
          清空
        </button>
      </div>
    </div>
  );
}

/** 按配置顺序分组：同一 CLI · 模型的各强度相邻 */
function groupByModel(targets: readonly Target[]): ModelGroup[] {
  const groups = new Map<string, ModelGroup>();
  for (const target of targets) {
    const key = `${target.cli}/${target.model}`;
    const group = groups.get(key) ?? { key, cli: target.cli, model: target.model, targets: [] };
    group.targets.push(target);
    groups.set(key, group);
  }
  return [...groups.values()];
}


function toggled(set: ReadonlySet<string>, ids: readonly string[]): ReadonlySet<string> {
  const next = new Set(set);
  for (const id of ids) {
    if (next.has(id)) next.delete(id);
    else next.add(id);
  }
  return next;
}

function without(set: ReadonlySet<string>, ids: readonly string[]): ReadonlySet<string> {
  return new Set([...set].filter((id) => !ids.includes(id)));
}

async function fetchOptions(): Promise<RunOptionsView | { error: string }> {
  try {
    const response = await actionFetch("/api/run");
    const body = (await response.json()) as RunOptionsView & { error?: string };
    return response.ok ? body : { error: body.error ?? "读取可选范围失败" };
  } catch (cause) {
    return { error: cause instanceof Error ? cause.message : String(cause) };
  }
}

async function postRun(
  targetIds: string[],
  promptIds: string[],
  candidateOverrides?: Record<string, string>,
): Promise<{ runId: string; calls: number } | { error: string }> {
  try {
    const payload: { targetIds: string[]; promptIds: string[]; candidateOverrides?: Record<string, string> } = {
      targetIds,
      promptIds,
    };
    if (candidateOverrides && Object.keys(candidateOverrides).length > 0) {
      payload.candidateOverrides = candidateOverrides;
    }
    const response = await actionFetch("/api/run", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = (await response.json()) as { runId?: string; calls?: number; error?: string };
    return response.ok ? { runId: body.runId ?? "", calls: body.calls ?? 0 } : { error: body.error ?? "发起失败" };
  } catch (cause) {
    return { error: cause instanceof Error ? cause.message : String(cause) };
  }
}

type PromptOption = RunOptionsView["prompts"][number];

type GroupKey =
  | "经典基准"
  | "四大名著（文学与叙事构图）"
  | "2026 前沿工程评测 (FE-1 ~ FE-8)"
  | "2026 前沿视觉特效 (VFX)"
  | "微观物理与前沿探索"
  | "自定义提示词";

interface PromptGroup {
  name: string;
  items: PromptOption[];
}

function groupPrompts(promptList: readonly PromptOption[]): PromptGroup[] {
  const groups: Record<GroupKey, PromptOption[]> = {
    "经典基准": [],
    "四大名著（文学与叙事构图）": [],
    "2026 前沿工程评测 (FE-1 ~ FE-8)": [],
    "2026 前沿视觉特效 (VFX)": [],
    "微观物理与前沿探索": [],
    "自定义提示词": [],
  };

  for (const p of promptList) {
    if (
      p.id === "classic-v1" ||
      p.id === "upgraded-v2" ||
      p.id === "animated-pelican-v1" ||
      p.id === "leijun-v1"
    ) {
      groups["经典基准"].push(p);
    } else if (
      p.id.startsWith("shuihu") ||
      p.id.startsWith("xiyou") ||
      p.id.startsWith("sanguo") ||
      p.id.startsWith("honglou")
    ) {
      groups["四大名著（文学与叙事构图）"].push(p);
    } else if (p.id.startsWith("fe-")) {
      groups["2026 前沿工程评测 (FE-1 ~ FE-8)"].push(p);
    } else if (p.id.startsWith("vfx-")) {
      groups["2026 前沿视觉特效 (VFX)"].push(p);
    } else if (
      [
        "clock-v1",
        "penrose-v1",
        "ice-water-v1",
        "four-stroke-engine-v1",
        "mobius-strip-v1",
        "cart-pole-v1",
        "cyber-cube-v1",
        "synthwave-drive-v1",
        "cyber-hud-v1",
        "black-hole-lensing-v1",
        "quantum-double-slit-v1",
        "ferrofluid-spikes-v1",
        "jwst-deployment-v1",
        "tokamak-plasma-v1",
        "gaa-nanosheet-v1",
        "crispr-cas9-rloop-v1",
        "pulsar-jet-v1",
        "black-hole-lensing",
        "quantum-double-slit",
        "ferrofluid-spikes",
        "jwst-deployment",
        "tokamak-plasma",
        "gaa-nanosheet",
        "crispr-cas9",
        "pulsar-jet",
      ].includes(p.id)
    ) {
      groups["微观物理与前沿探索"].push(p);
    } else {
      groups["自定义提示词"].push(p);
    }
  }

  return Object.entries(groups)
    .filter(([_, items]) => items.length > 0)
    .map(([name, items]) => ({ name, items }));
}

