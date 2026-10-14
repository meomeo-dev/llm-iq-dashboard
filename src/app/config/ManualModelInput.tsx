import { CLI_KINDS, type CliKind } from "@/core/types";
import { useI18n } from "@/i18n";

export function ManualModelInput({
  manual,
  onChange,
  onAdd,
}: {
  manual: { cli: CliKind; model: string };
  onChange: (next: { cli: CliKind; model: string }) => void;
  onAdd: () => void;
}) {
  const { locale } = useI18n();
  const isEn = locale === "en";
  return (
    <div className="field-row manual-model">
      <span className="note">
        {isEn
          ? "claude does not expose a model-list command; enter new model IDs here to add them to the dropdown:"
          : "claude 没有模型列举命令，新模型可在此手填，之后会出现在下拉中："}
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
        placeholder={isEn ? "Model ID" : "模型标识"}
        onChange={(e) => onChange({ ...manual, model: e.target.value })}
      />
      <button type="button" onClick={onAdd}>
        {isEn ? "Add" : "添加"}
      </button>
    </div>
  );
}
