import { CLI_KINDS, type CliKind, type EffortLevel } from "@/core/types";
import {
  type RunDraft,
  LOW_EFFORTS,
  HIGH_EFFORTS,
  updateCliTimeout,
  updateEffortTimeout,
  applyRecommendedPresets,
  formatSeconds,
} from "./timeout-form-model";
import { TimeoutTierCard } from "./TimeoutTierCard";

export { type RunDraft };

/** 超时编辑表单：界面以秒呈现，配置中存毫秒 */
export function TimeoutForm({
  run,
  onChange,
}: {
  run: RunDraft;
  onChange: (next: RunDraft) => void;
}) {
  const setCli = (cli: CliKind, seconds: number | null): void => {
    onChange(updateCliTimeout(run, cli, seconds));
  };

  const setEffort = (effort: EffortLevel, seconds: number | null): void => {
    onChange(updateEffortTimeout(run, effort, seconds));
  };

  const currentEfforts = run.timeoutByEffort ?? {};

  return (
    <div className="stack">
      <TimeoutConcurrencyRow run={run} onChange={onChange} />

      <TimeoutTierHeader onApplyPreset={() => onChange(applyRecommendedPresets(run))} />

      <TimeoutTierCard
        cardClassName="timeout-tier-card"
        badgeClassName="tier-badge low"
        badgeText="high 及以下档位"
        noteText="思考耗时适中，建议 600 秒（10 分钟）"
        items={LOW_EFFORTS}
        currentEfforts={currentEfforts}
        onSetEffort={setEffort}
      />

      <TimeoutTierCard
        cardClassName="timeout-tier-card highlight-tier"
        badgeClassName="tier-badge high"
        badgeText="high 以上档位 (xhigh / max / ultra)"
        noteText="深度思考极其耗时，建议 1800 秒（30 分钟）避免被误判中断"
        items={HIGH_EFFORTS}
        currentEfforts={currentEfforts}
        onSetEffort={setEffort}
      />

      <TimeoutCliRow run={run} onSetCli={setCli} />

      <p className="note">
        优先级：单个目标的 timeoutMs &gt; 按强度的设置（run.timeoutByEffort）&gt; 该 CLI 的设置 &gt; 全局默认。超时会终止整个进程组，不会留下继续占用配额的孤儿进程。
      </p>
    </div>
  );
}

function TimeoutConcurrencyRow({
  run,
  onChange,
}: {
  run: RunDraft;
  onChange: (next: RunDraft) => void;
}) {
  return (
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
          value={formatSeconds(run.defaultTimeoutMs)}
          onChange={(e) =>
            onChange({ ...run, defaultTimeoutMs: Number(e.target.value) * 1000 })
          }
        />
      </label>
    </div>
  );
}

function TimeoutCliRow({
  run,
  onSetCli,
}: {
  run: RunDraft;
  onSetCli: (cli: CliKind, seconds: number | null) => void;
}) {
  return (
    <>
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
                value={formatSeconds(override)}
                placeholder={`默认 ${Math.round(run.defaultTimeoutMs / 1000)}`}
                onChange={(e) =>
                  onSetCli(
                    cli,
                    e.target.value.trim() === "" ? null : Number(e.target.value),
                  )
                }
              />
            </label>
          );
        })}
      </div>
    </>
  );
}

function TimeoutTierHeader({ onApplyPreset }: { onApplyPreset: () => void }) {
  return (
    <div className="timeout-section-head">
      <div className="timeout-section-title">
        <strong>按思考强度分段超时</strong>
        <span className="note">
          high 及以下 600 秒，high 以上 1800 秒（优先于 CLI 与默认超时）
        </span>
      </div>
      <button
        type="button"
        className="btn-preset"
        onClick={onApplyPreset}
      >
        ⚡ 一键填充推荐分段（≤high 600s / &gt;high 1800s）
      </button>
    </div>
  );
}
