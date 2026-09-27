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
  return (
    <form className="pair-card" onSubmit={(event) => void onSubmit(event)}>
      <label htmlFor="pair-code">配对码</label>
      <input
        id="pair-code"
        className="pair-code"
        value={code}
        onChange={(event) => onChangeCode(event.target.value)}
        placeholder="0000-0000-0000-0000-0000-0000-0000-0000"
        autoComplete="off"
        inputMode="numeric"
        spellCheck={false}
        required
      />
      <div className="actions">
        <button type="submit" disabled={status.kind === "busy"}>
          {status.kind === "busy" ? "配对中…" : "配对"}
        </button>
        {status.kind === "error" && <span className="pair-error">{status.message}</span>}
      </div>
    </form>
  );
}
