import { CLI_KINDS, type CliKind } from "@/core/types";

export function ManualModelInput({
  manual,
  onChange,
  onAdd,
}: {
  manual: { cli: CliKind; model: string };
  onChange: (next: { cli: CliKind; model: string }) => void;
  onAdd: () => void;
}) {
  return (
    <div className="field-row manual-model">
      <span className="note">
        claude 没有模型列举命令，新模型可在此手填，之后会出现在下拉中：
      </span>
      <select
        value={manual.cli}
        onChange={(e) => onChange({ ...manual, cli: e.target.value as CliKind })}
      >
        {CLI_KINDS.map((cli) => (
          <option key={cli} value={cli}>
            {cli}
          </option>
        ))}
      </select>
      <input
        type="text"
        value={manual.model}
        placeholder="模型标识"
        onChange={(e) => onChange({ ...manual, model: e.target.value })}
      />
      <button type="button" onClick={onAdd}>
        添加
      </button>
    </div>
  );
}
