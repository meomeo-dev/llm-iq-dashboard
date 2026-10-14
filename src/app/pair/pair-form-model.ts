import type { Locale } from "@/i18n/types";

export function extractErrorMessage(body?: { error?: string } | null, locale: Locale = "zh-CN"): string {
  return body?.error ?? (locale === "en" ? "Pairing failed" : "配对失败");
}

export function formatErrorMessage(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause);
}
