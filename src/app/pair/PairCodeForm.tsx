import { useEffect, useRef } from "react";
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
  const input = useRef<HTMLInputElement>(null);
  const hasError = status.kind === "error";

  useEffect(() => {
    if (status.kind === "error") input.current?.focus();
  }, [status]);

  return (
    <form className="pair-card" onSubmit={(event) => void onSubmit(event)}>
      <label htmlFor="pair-code" className="ui-label">
        {isEn ? "Pairing Code" : "配对码"}
      </label>
      <input
        ref={input}
        id="pair-code"
        className="ui-input pair-code"
        value={code}
        onChange={(event) => onChangeCode(event.target.value)}
        placeholder="0000-0000-0000-0000-0000-0000-0000-0000"
        autoComplete="off"
        inputMode="numeric"
        spellCheck={false}
        aria-invalid={hasError || undefined}
        aria-describedby={hasError ? "pair-code-error" : undefined}
        required
      />
      <div className="pair-actions">
        <Button type="submit" variant="primary" disabled={status.kind === "busy"}>
          {status.kind === "busy" ? (isEn ? "Pairing…" : "配对中…") : isEn ? "Pair" : "配对"}
        </Button>
        {status.kind === "error" && (
          <span id="pair-code-error" className="pair-error" role="alert">{status.message}</span>
        )}
      </div>
    </form>
  );
}
