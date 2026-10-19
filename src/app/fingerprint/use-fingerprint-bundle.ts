"use client";

import { useState } from "react";
import { actionFetch } from "@/app/components/action-fetch";
import type { ProbeId } from "@/core/model-fingerprint/types";
import type { CliKind } from "@/core/types";

export interface BundleImportResponse {
  ok: boolean;
  cli: CliKind;
  model: string;
  requestedEffort: string;
  appliedEffort: string;
  importedProbes: ProbeId[];
  archivedProbes: ProbeId[];
  totalValidValues: number;
  totalAttempts: number;
  effortMismatch?: boolean;
}

export type BundleBannerState =
  | { kind: "ok"; data: BundleImportResponse }
  | { kind: "err"; message: string }
  | null;

export async function downloadFingerprintBundle(params: {
  cli: CliKind;
  model: string;
  effort: string;
}): Promise<void> {
  const qs = new URLSearchParams({ cli: params.cli, model: params.model, effort: params.effort });
  const res = await fetch(`/api/fingerprint/bundle?${qs.toString()}`, { cache: "no-store" });
  if (!res.ok) {
    const errData = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(errData.error ?? `HTTP ${res.status}`);
  }
  const cd = res.headers.get("content-disposition") ?? "";
  const match = /filename="?([^";]+)"?/i.exec(cd);
  const filename = match?.[1] ?? `pelican-fp-${params.cli}-${params.effort}-${params.model}.tar.gz`;
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function uploadFingerprintBundle(file: File): Promise<BundleImportResponse> {
  const res = await actionFetch("/api/fingerprint/bundle", {
    method: "POST",
    headers: { "Content-Type": "application/gzip" },
    body: file,
  });
  const data = (await res.json().catch(() => ({}))) as BundleImportResponse & { error?: string };
  if (!res.ok) {
    throw new Error(data.error ?? `HTTP ${res.status}`);
  }
  return data;
}

export function useMatrixBundleActions(onRefresh?: () => Promise<void> | void) {
  const [exportingKey, setExportingKey] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [banner, setBanner] = useState<BundleBannerState>(null);

  const exportRow = async (cli: CliKind, model: string, effort: string) => {
    const key = `${cli}:${model}`;
    setExportingKey(key);
    setBanner(null);
    try {
      await downloadFingerprintBundle({ cli, model, effort });
    } catch (err) {
      setBanner({ kind: "err", message: err instanceof Error ? err.message : String(err) });
    } finally {
      setExportingKey(null);
    }
  };

  const importFile = async (file: File) => {
    setImporting(true);
    setBanner(null);
    try {
      const data = await uploadFingerprintBundle(file);
      setBanner({ kind: "ok", data });
      await onRefresh?.();
    } catch (err) {
      setBanner({ kind: "err", message: err instanceof Error ? err.message : String(err) });
    } finally {
      setImporting(false);
    }
  };

  return { exportingKey, importing, banner, setBanner, exportRow, importFile };
}
