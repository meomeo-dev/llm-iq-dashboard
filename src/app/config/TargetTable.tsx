import { useState } from "react";
import type { CapabilitySnapshot } from "@/capabilities/types";
import type { ProfileConfig } from "@/core/config";
import type { CliKind, Target } from "@/core/types";
import {
  createDefaultTarget,
  updateTargetList,
  removeTargetFromList,
  appendCustomModel,
} from "./target-table-model";
import { TargetRow } from "./TargetRow";
import { ManualModelInput } from "./ManualModelInput";

export interface TargetTableProps {
  targets: Target[];
  profiles: ProfileConfig[];
  catalog: CapabilitySnapshot;
  customModels: Partial<Record<CliKind, string[]>>;
  onTargets: (next: Target[]) => void;
  onCustomModels: (next: Partial<Record<CliKind, string[]>>) => void;
}

export function TargetTable({
  targets,
  profiles,
  catalog,
  customModels,
  onTargets,
  onCustomModels,
}: TargetTableProps) {
  const [manual, setManual] = useState({ cli: "claude" as CliKind, model: "" });

  const update = (index: number, changes: Partial<Target>): void => {
    onTargets(updateTargetList(targets, index, changes));
  };

  const addRow = (): void => {
    onTargets([...targets, createDefaultTarget(catalog)]);
  };

  const addCustomModel = (): void => {
    const { next, added } = appendCustomModel(customModels, manual.cli, manual.model);
    if (added) {
      onCustomModels(next);
    }
    setManual({ ...manual, model: "" });
  };

  return (
    <div className="stack">
      <div className="table-responsive">
        <table className="matrix">
          <TargetTableHeader />
          <TargetTableRows
            targets={targets}
            profiles={profiles}
            catalog={catalog}
            customModels={customModels}
            onUpdate={update}
            onRemove={(index) => onTargets(removeTargetFromList(targets, index))}
          />
        </table>
      </div>

      <div className="field-row">
        <button type="button" onClick={addRow}>
          + 增加一行
        </button>
      </div>

      <ManualModelInput
        manual={manual}
        onChange={setManual}
        onAdd={addCustomModel}
      />
    </div>
  );
}

function TargetTableHeader() {
  return (
    <thead>
      <tr>
        <th title="进入定时任务，也是“跑一次”的默认勾选；不勾的仍可在“跑一次”里手动选">定时</th>
        <th>CLI</th>
        <th title="经哪个上游调用；登录态即该 CLI 自己登录的账号">上游</th>
        <th>模型</th>
        <th>思考强度</th>
        <th>显示名</th>
        <th />
      </tr>
    </thead>
  );
}

function TargetTableRows({
  targets,
  profiles,
  catalog,
  customModels,
  onUpdate,
  onRemove,
}: {
  targets: Target[];
  profiles: ProfileConfig[];
  catalog: CapabilitySnapshot;
  customModels: Partial<Record<CliKind, string[]>>;
  onUpdate: (index: number, changes: Partial<Target>) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <tbody>
      {targets.map((target, index) => (
        <TargetRow
          key={`${target.id}-${index}`}
          target={target}
          profiles={profiles}
          catalog={catalog}
          customModels={customModels}
          onChange={(changes) => onUpdate(index, changes)}
          onRemove={() => onRemove(index)}
        />
      ))}
    </tbody>
  );
}
