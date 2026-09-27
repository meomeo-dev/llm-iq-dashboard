export function extractErrorMessage(body?: { error?: string } | null): string {
  return body?.error ?? "配对失败";
}

export function formatErrorMessage(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause);
}
