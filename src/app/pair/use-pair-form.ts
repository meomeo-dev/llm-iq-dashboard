import { useState } from "react";
import { useI18n, type Locale } from "@/i18n";
import { actionFetch } from "../components/action-fetch";
import type { PairFormStatus } from "./PairCodeForm";
import { extractErrorMessage, formatErrorMessage } from "./pair-form-model";

async function submitPairCode(code: string, returnTo: string, locale: Locale): Promise<string | null> {
  const res = await actionFetch("/api/pair", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ code }),
  });
  const body = (await res.json()) as { error?: string };
  if (!res.ok) return extractErrorMessage(body, locale);
  window.location.assign(returnTo);
  return null;
}

export function usePairForm(returnTo: string, signedInAs: string | null) {
  const { locale } = useI18n();
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<PairFormStatus>({ kind: "idle" });
  const [signedIn, setSignedIn] = useState(signedInAs);

  const submit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setStatus({ kind: "busy" });
    try {
      const error = await submitPairCode(code, returnTo, locale);
      setStatus(error ? { kind: "error", message: error } : { kind: "ok" });
    } catch (cause) {
      setStatus({ kind: "error", message: formatErrorMessage(cause) });
    }
  };

  const signOut = async (): Promise<void> => {
    const res = await actionFetch("/api/session", { method: "DELETE" });
    if (res.ok) setSignedIn(null);
  };

  return { code, setCode, status, signedIn, submit, signOut };
}
