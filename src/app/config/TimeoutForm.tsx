import { CLI_KINDS, type CliKind, type EffortLevel } from "@/core/types";
import { useI18n } from "@/i18n/context";
import {
  type RunDraft,
  getLowEfforts,
  getHighEfforts,
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
  const { locale } = useI18n();
  const isEn = locale === "en";
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
        badgeText={isEn ? "high and below" : "high 及以下档位"}
        noteText={isEn ? "Moderate reasoning time; 600s (10 min) recommended" : "思考耗时适中，建议 600 秒（10 分钟）"}
        items={getLowEfforts(locale)}
        currentEfforts={currentEfforts}
        onSetEffort={setEffort}
      />

      <TimeoutTierCard
        cardClassName="timeout-tier-card highlight-tier"
        badgeClassName="tier-badge high"
        badgeText={isEn ? "Above high (xhigh / max / ultra)" : "high 以上档位 (xhigh / max / ultra)"}
        noteText={
          isEn
            ? "Deep reasoning takes longer; 1800s (30 min) recommended to avoid premature timeouts"
            : "深度思考极其耗时，建议 1800 秒（30 分钟）避免被误判中断"
        }
        items={getHighEfforts(locale)}
        currentEfforts={currentEfforts}
        onSetEffort={setEffort}
      />

      <TimeoutCliRow run={run} onSetCli={setCli} />

      <p className="note">
        {isEn ? (
          <>
            Precedence: target timeoutMs &gt; per-effort timeout (run.timeoutByEffort) &gt; per-CLI
            timeout &gt; global default. Timeouts terminate the entire process group so no orphan
            processes keep consuming quota.
          </>
        ) : (
          <>
            优先级：单个目标的 timeoutMs &gt; 按强度的设置（run.timeoutByEffort）&gt; 该 CLI 的设置 &gt; 全局默认。超时会终止整个进程组，不会留下继续占用配额的孤儿进程。
          </>
        )}
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
  const { locale } = useI18n();
  const isEn = locale === "en";
  return (
    <div className="field-row">
      <label
        title={
          isEn
            ? "Per-model lanes: different models run in parallel, effort levels within the same model run serially"
            : "按模型分道：不同模型并行，同一模型的各强度串行"
        }
      >
        {isEn ? "Concurrent Models" : "同时在跑的模型数"}
        <input
          type="number"
          min={1}
          value={run.concurrency}
          onChange={(e) => onChange({ ...run, concurrency: Number(e.target.value) })}
        />
      </label>
      <label>
        {isEn ? "Global Default Timeout (s)" : "全局默认超时（秒）"}
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
  const { locale } = useI18n();
  const isEn = locale === "en";
  return (
    <>
      <div className="timeout-section-head" style={{ marginTop: 8 }}>
        <div className="timeout-section-title">
          <strong>{isEn ? "Per-CLI Timeout Override (s)" : "按 CLI 覆盖超时（秒）"}</strong>
          <span className="note">
            {isEn ? "Applies only when no effort-level timeout is set" : "仅在未指定该强度超时时生效"}
          </span>
        </div>
      </div>

      <div className="field-row">
        {CLI_KINDS.map((cli) => {
          const override = run.timeoutByCli[cli];
          return (
            <label key={cli}>
              {isEn ? `${cli} Default (s)` : `${cli} 默认（秒）`}
              <input
                type="number"
                min={1}
                value={formatSeconds(override)}
                placeholder={
                  isEn
                    ? `Default ${Math.round(run.defaultTimeoutMs / 1000)}`
                    : `默认 ${Math.round(run.defaultTimeoutMs / 1000)}`
                }
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
  const { locale } = useI18n();
  const isEn = locale === "en";
  return (
    <div className="timeout-section-head">
      <div className="timeout-section-title">
        <strong>{isEn ? "Timeout by Reasoning Effort" : "按思考强度分段超时"}</strong>
        <span className="note">
          {isEn
            ? "600s for ≤high, 1800s for >high (takes precedence over per-CLI and global default)"
            : "high 及以下 600 秒，high 以上 1800 秒（优先于 CLI 与默认超时）"}
        </span>
      </div>
      <button
        type="button"
        className="btn-preset"
        onClick={onApplyPreset}
      >
        {isEn
          ? "⚡ Apply Recommended Tiers (≤high 600s / >high 1800s)"
          : "⚡ 一键填充推荐分段（≤high 600s / >high 1800s）"}
      </button>
    </div>
  );
}
