"use client";

import type { CapabilitySnapshot } from "@/capabilities/types";
import type { JudgeConfig, JudgeModel } from "@/core/config/types";
import { CLI_KINDS, EFFORT_LEVELS, type CliKind, type EffortLevel } from "@/core/types";
import { judgeLabel, judgeRoutes, moveJudge } from "./judge-panel-model";

/** 作品评审（ACR-019 / ACR-020）：代码层开关、AI 层开关、裁判清单与超时 */
export function JudgePanel({
  value,
  catalog,
  onChange,
}: {
  value: JudgeConfig;
  catalog: CapabilitySnapshot;
  onChange: (next: JudgeConfig) => void;
}) {
  const patchAi = (changes: Partial<JudgeConfig["ai"]>): void =>
    onChange({ ...value, ai: { ...value.ai, ...changes } });
  const setJudge = (index: number, changes: Partial<JudgeModel>): void =>
    patchAi({ judges: value.ai.judges.map((item, i) => (i === index ? { ...item, ...changes } : item)) });

  return (
    <div className="stack">
      <label className="checkbox">
        <input type="checkbox" checked={value.enabled} onChange={(e) => onChange({ ...value, enabled: e.target.checked })} />
        评审有评分标准的题目（代码层：静态解析 + 无头 Chromium 渲染量测，不花配额；共 30 分，只能判「降智」）
      </label>
      <label className="checkbox">
        <input type="checkbox" checked={value.ai.enabled} disabled={!value.enabled} onChange={(e) => patchAi({ enabled: e.target.checked })} />
        AI 语义层：整轮结束后请裁判 CLI 看联系图给 C5–C8 打分（共 70 分，「智商在线」只能由它判定；真实消耗裁判的配额）
      </label>
      <div className="field-row">
        <label>
          单次裁判问答超时（秒）
          <input
            type="number"
            min={30}
            step={30}
            value={Math.round(value.ai.timeoutMs / 1000)}
            disabled={!value.enabled || !value.ai.enabled}
            onChange={(e) => patchAi({ timeoutMs: Math.max(1, Number(e.target.value) || 1) * 1000 })}
          />
        </label>
      </div>
      <JudgeTable
        judges={value.ai.judges}
        catalog={catalog}
        disabled={!value.enabled || !value.ai.enabled}
        onUpdate={setJudge}
        onRemove={(index) => patchAi({ judges: value.ai.judges.filter((_, i) => i !== index) })}
        onMove={(index, offset) => patchAi({ judges: moveJudge(value.ai.judges, index, offset) })}
        onAdd={() => patchAi({ judges: [...value.ai.judges, defaultJudge(catalog)] })}
      />
      <p className="note">
        裁判按清单顺序取第一个厂商与作品不同的（同厂商不能自评）；前一个调用失败（未登录、超时）时换下一个，
        都失败则作品保持「待复核」。用「上移 / 下移」决定谁优先。
      </p>
      {value.ai.judges.length > 0 && <JudgeRoutes judges={value.ai.judges} />}
    </div>
  );
}

/** 按当前顺序，每家作品依次交给谁评：首选在前，括号里是失败时的后备 */
function JudgeRoutes({ judges }: { judges: JudgeModel[] }) {
  return (
    <ul className="note judge-routes">
      {judgeRoutes(judges).map(({ subject, judges: route }) => (
        <li key={subject}>
          {subject} 的作品 → {route.length === 0
            ? <strong>没有可用裁判（只配了同厂商），保持「待复核」</strong>
            : <>
                <strong>{judgeLabel(route[0]!)}</strong>
                {route.length > 1 && <>（失败时依次换 {route.slice(1).map(judgeLabel).join("、")}）</>}
              </>}
        </li>
      ))}
    </ul>
  );
}

function defaultJudge(catalog: CapabilitySnapshot): JudgeModel {
  const cli: CliKind = "claude";
  return { cli, model: catalog.clis.find((c) => c.cli === cli)?.models[0]?.id ?? "", effort: "medium" };
}

function JudgeTable({
  judges,
  catalog,
  disabled,
  onUpdate,
  onRemove,
  onMove,
  onAdd,
}: {
  judges: JudgeModel[];
  catalog: CapabilitySnapshot;
  disabled: boolean;
  onUpdate: (index: number, changes: Partial<JudgeModel>) => void;
  onRemove: (index: number) => void;
  onMove: (index: number, offset: number) => void;
  onAdd: () => void;
}) {
  return (
    <div className="table-responsive">
      <table className="matrix">
        <thead>
          <tr><th>顺序</th><th>裁判 CLI</th><th>模型</th><th>思考强度</th><th /></tr>
        </thead>
        <tbody>
          {judges.length === 0 && (
            <tr><td colSpan={5} className="note">没有裁判：AI 层开着也不会评</td></tr>
          )}
          {judges.map((judge, index) => (
            <JudgeRow key={index} judge={judge} catalog={catalog} disabled={disabled}
              order={{ index, count: judges.length, onMove: (offset) => onMove(index, offset) }}
              onChange={(changes) => onUpdate(index, changes)} onRemove={() => onRemove(index)} />
          ))}
        </tbody>
      </table>
      <div className="field-row">
        <button type="button" onClick={onAdd} disabled={disabled}>添加裁判</button>
      </div>
    </div>
  );
}

function JudgeRow({
  judge,
  catalog,
  disabled,
  order,
  onChange,
  onRemove,
}: {
  judge: JudgeModel;
  catalog: CapabilitySnapshot;
  disabled: boolean;
  order: { index: number; count: number; onMove: (offset: number) => void };
  onChange: (changes: Partial<JudgeModel>) => void;
  onRemove: () => void;
}) {
  const known = catalog.clis.find((c) => c.cli === judge.cli)?.models.map((m) => m.id) ?? [];
  const listId = `judge-models-${judge.cli}`;
  return (
    <tr>
      <td className="judge-order">
        <span>{order.index + 1}</span>
        <button type="button" disabled={disabled || order.index === 0} onClick={() => order.onMove(-1)}
          title="上移：优先于前一个裁判" aria-label={`上移第 ${order.index + 1} 个裁判`}>上移</button>
        <button type="button" disabled={disabled || order.index === order.count - 1} onClick={() => order.onMove(1)}
          title="下移：让后一个裁判优先" aria-label={`下移第 ${order.index + 1} 个裁判`}>下移</button>
      </td>
      <td>
        <select value={judge.cli} disabled={disabled} onChange={(e) => onChange({ cli: e.target.value as CliKind })}>
          {CLI_KINDS.map((kind) => <option key={kind} value={kind}>{kind}</option>)}
        </select>
      </td>
      <td>
        <input type="text" list={listId} value={judge.model} disabled={disabled} placeholder="模型标识"
          onChange={(e) => onChange({ model: e.target.value.trim() })} />
        <datalist id={listId}>
          {known.map((id) => <option key={id} value={id} />)}
        </datalist>
      </td>
      <td>
        <select value={judge.effort} disabled={disabled} onChange={(e) => onChange({ effort: e.target.value as EffortLevel })}>
          {EFFORT_LEVELS.map((level) => <option key={level} value={level}>{level}</option>)}
        </select>
      </td>
      <td>
        <button type="button" className="danger" disabled={disabled} onClick={onRemove}>删除</button>
      </td>
    </tr>
  );
}
