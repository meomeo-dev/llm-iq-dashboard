import { Button } from "@/app/components/ui/Button";
import { useI18n } from "@/i18n";

export type PairFormStatus =
  | { kind: "idle" }
  | { kind: "busy" }
  | { kind: "error"; message: string }
  | { kind: "ok" };

export function PairCodeForm({
  code,
  status,
  onChangeCode,
  onSubmit,
}: {
  code: string;
  status: PairFormStatus;
  onChangeCode: (code: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
}) {
  const { locale } = useI18n();
  const isEn = locale === "en";
  return (
    <form className="pair-card" onSubmit={(event) => void onSubmit(event)}>
      <label htmlFor="pair-code" className="ui-label">
        {isEn ? "Pairing Code" : "配对码"}
      </label>
      <input
        id="pair-code"
        className="ui-input pair-code"
        value={code}
        onChange={(event) => onChangeCode(event.target.value)}
        placeholder="0000-0000-0000-0000-0000-0000-0000-0000"
        autoComplete="off"
        inputMode="numeric"
        spellCheck={false}
        required
      />
      <div className="pair-actions">
        <Button type="submit" variant="primary" disabled={status.kind === "busy"}>
          {status.kind === "busy" ? (isEn ? "Pairing…" : "配对中…") : isEn ? "Pair" : "配对"}
        </Button>
        {status.kind === "error" && <span className="pair-error">{status.message}</span>}
      </div>
    </form>
  );
}
