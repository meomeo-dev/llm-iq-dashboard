import type { Locale } from "@/i18n";

const PAIR_ERROR_MAP_EN: Record<string, string> = {
  "配对窗口未打开：先在宿主机执行 pnpm pair": "Pairing window is not open: run pnpm pair on the host first",
  "配对码已过期：重新执行 pnpm pair": "Pairing code has expired: run pnpm pair again",
  "配对码不匹配": "Pairing code does not match",
  "错误次数过多，配对窗口已关闭：重新执行 pnpm pair":
    "Too many failed attempts; pairing window is closed: run pnpm pair again",
  "尝试过于频繁，稍后再试": "Too many attempts; please try again later",
  "只读部署": "Read-only deployment",
  "请求体不是合法 JSON": "Request body is not valid JSON",
  "请求体须为 { code: string }": "Request body must be { code: string }",
};

function localizePairErrorEn(error: string): string {
  if (error in PAIR_ERROR_MAP_EN) return PAIR_ERROR_MAP_EN[error]!;
  if (error.startsWith("配对窗口未打开")) return "Pairing window is not open: run pnpm pair on the host first";
  if (error.startsWith("配对码已过期")) return "Pairing code has expired: run pnpm pair again";
  if (error.startsWith("错误次数过多")) {
    return "Too many failed attempts; pairing window is closed: run pnpm pair again";
  }
  if (error.startsWith("尝试过于频繁")) return "Too many attempts; please try again later";
  return error;
}

export function extractErrorMessage(body?: { error?: string } | null, locale: Locale = "zh-CN"): string {
  if (!body?.error) return locale === "en" ? "Pairing failed" : "配对失败";
  return locale === "en" ? localizePairErrorEn(body.error) : body.error;
}

export function formatErrorMessage(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause);
}
