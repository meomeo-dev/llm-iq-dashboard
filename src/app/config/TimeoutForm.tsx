import { CLI_KINDS, type CliKind, type EffortLevel } from "@/core/types";

export interface RunDraft {
  promptIds: string[];
  concurrency: number;
  defaultTimeoutMs: number;
  timeoutByCli: Partial<Record<CliKind, number>>;
  timeoutByEffort?: Partial<Record<EffortLevel, number>>;
}

const LOW_EFFORTS: { level: EffortLevel; label: string; desc: string; defaultSec: number }[] = [
  { level: "low", label: "low (低)", desc: "轻度思考", defaultSec: 600 },
  { level: "medium", label: "medium (中)", desc: "标准思考", defaultSec: 600 },
  { level: "high", label: "high (高)", desc: "深度思考", defaultSec: 600 },
];

const HIGH_EFFORTS: { level: EffortLevel; label: string; desc: string; defaultSec: number }[] = [
  { level: "xhigh", label: "xhigh (极高)", desc: "强化深度思考", defaultSec: 1800 },
  { level: "max", label: "max (最大)", desc: "极限思考", defaultSec: 1800 },
  { level: "ultra", label: "ultra (超级)", desc: "极限超长思考", defaultSec: 1800 },
];

/** 超时编辑表单：界面以秒呈现，配置中存毫秒 */
export function TimeoutForm({
  run,
  onChange,
}: {
  run: RunDraft;
  onChange: (next: RunDraft) => void;
}) {
  const setCliTimeout = (cli: CliKind, seconds: number | null): void => {
    const next = { ...run.timeoutByCli };
    // 清空输入即删除该键，回落到全局默认
    if (seconds === null) delete next[cli];
    else next[cli] = seconds * 1000;
    onChange({ ...run, timeoutByCli: next });
  };

  const setEffortTimeout = (effort: EffortLevel, seconds: number | null): void => {
    const next = { ...(run.timeoutByEffort ?? {}) };
    if (seconds === null) delete next[effort];
    else next[effort] = seconds * 1000;
    onChange({ ...run, timeoutByEffort: next });
  };

  const applyRecommendedPresets = (): void => {
    const next: Partial<Record<EffortLevel, number>> = {
      low: 600_000,
      medium: 600_000,
      high: 600_000,
      xhigh: 1_800_000,
      max: 1_800_000,
      ultra: 1_800_000,
    };
    onChange({
      ...run,
      defaultTimeoutMs: 1_800_000,
      timeoutByEffort: next,
    });
  };

  const currentEfforts = run.timeoutByEffort ?? {};

  return (
    <div className="stack">
      <div className="field-row">
        <label title="按模型分道：不同模型并行，同一模型的各强度串行">
          同时在跑的模型数
          <input
            type="number"
            min={1}
            value={run.concurrency}
            onChange={(e) => onChange({ ...run, concurrency: Number(e.target.value) })}
          />
        </label>
        <label>
          全局默认超时（秒）
          <input
            type="number"
            min={1}
            value={Math.round(run.defaultTimeoutMs / 1000)}
            onChange={(e) =>
              onChange({ ...run, defaultTimeoutMs: Number(e.target.value) * 1000 })
            }
          />
        </label>
      </div>

      <div className="timeout-section-head">
        <div className="timeout-section-title">
          <strong>按思考强度分段超时</strong>
          <span className="note">high 及以下 600 秒，high 以上 1800 秒（优先于 CLI 与默认超时）</span>
        </div>
        <button type="button" className="btn-preset" onClick={applyRecommendedPresets}>
          ⚡ 一键填充推荐分段（≤high 600s / &gt;high 1800s）
        </button>
      </div>

      <div className="timeout-tier-card">
        <div className="tier-header">
          <span className="tier-badge low">high 及以下档位</span>
          <span className="note">思考耗时适中，建议 600 秒（10 分钟）</span>
        </div>
        <div className="field-row">
          {LOW_EFFORTS.map(({ level, label, desc, defaultSec }) => {
            const override = currentEfforts[level];
            return (
              <label key={level} title={desc}>
                {label} 超时（秒）
                <input
                  type="number"
                  min={1}
                  value={override === undefined ? "" : Math.round(override / 1000)}
                  placeholder={`推荐 ${defaultSec}`}
                  onChange={(e) =>
                    setEffortTimeout(
                      level,
                      e.target.value.trim() === "" ? null : Number(e.target.value),
                    )
                  }
                />
              </label>
            );
          })}
        </div>
      </div>

      <div className="timeout-tier-card highlight-tier">
        <div className="tier-header">
          <span className="tier-badge high">high 以上档位 (xhigh / max / ultra)</span>
          <span className="note">深度思考极其耗时，建议 1800 秒（30 分钟）避免被误判中断</span>
        </div>
        <div className="field-row">
          {HIGH_EFFORTS.map(({ level, label, desc, defaultSec }) => {
            const override = currentEfforts[level];
            return (
              <label key={level} title={desc}>
                {label} 超时（秒）
                <input
                  type="number"
                  min={1}
                  value={override === undefined ? "" : Math.round(override / 1000)}
                  placeholder={`推荐 ${defaultSec}`}
                  onChange={(e) =>
                    setEffortTimeout(
                      level,
                      e.target.value.trim() === "" ? null : Number(e.target.value),
                    )
                  }
                />
              </label>
            );
          })}
        </div>
      </div>

      <div className="timeout-section-head" style={{ marginTop: 8 }}>
        <div className="timeout-section-title">
          <strong>按 CLI 覆盖超时（秒）</strong>
          <span className="note">仅在未指定该强度超时时生效</span>
        </div>
      </div>

      <div className="field-row">
        {CLI_KINDS.map((cli) => {
          const override = run.timeoutByCli[cli];
          return (
            <label key={cli}>
              {cli} 默认（秒）
              <input
                type="number"
                min={1}
                value={override === undefined ? "" : Math.round(override / 1000)}
                placeholder={`默认 ${Math.round(run.defaultTimeoutMs / 1000)}`}
                onChange={(e) =>
                  setCliTimeout(
                    cli,
                    e.target.value.trim() === "" ? null : Number(e.target.value),
                  )
                }
              />
            </label>
          );
        })}
      </div>

      <p className="note">
        优先级：单个目标的 timeoutMs &gt; 按强度的设置（run.timeoutByEffort）&gt; 该 CLI 的设置 &gt; 全局默认。超时会终止整个进程组，不会留下继续占用配额的孤儿进程。
      </p>
    </div>
  );
}
