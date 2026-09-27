"use client";

import { listEfforts } from "../timeline/moments";
import { groupByModel, type ModelGroup, type Target } from "./run-once-grouping";
import { toggled, without } from "./run-once-selection-utils";

interface PickProps {
  picked: ReadonlySet<string>;
  onPick: (next: ReadonlySet<string>) => void;
}

/**
 * 范围清单：各行共用一套强度列（全部目标出现过的强度，按高低排），同一强度同列；
 * 某模型缺少的强度留空位。
 */
export function ModelRows({ targets, picked, onPick }: PickProps & { targets: readonly Target[] }) {
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
export function ModelRow({ group, efforts, picked, onPick }: PickProps & { group: ModelGroup; efforts: readonly string[] }) {
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
