/**
 * 国际化（i18n）基础类型、语言协商与模板插值工具。
 *
 * 支持 `en`（英文，默认回退）与 `zh-CN`（简体中文）双语，零外部依赖。
 */

export type Locale = "en" | "zh-CN";

export const SUPPORTED_LOCALES: readonly Locale[] = ["en", "zh-CN"];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_COOKIE = "pelican_locale";

export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "zh-CN";
}

function matchTagToLocale(tag: string): Locale | null {
  const normalized = tag.trim().toLowerCase();
  if (normalized === "") return null;
  if (normalized.startsWith("zh")) return "zh-CN";
  if (normalized.startsWith("en")) return "en";
  return null;
}

interface WeightedLang {
  tag: string;
  q: number;
  index: number;
}

function parseAcceptLanguage(header: string): WeightedLang[] {
  return header
    .split(",")
    .map((part, index) => {
      const [rawTag = "", ...params] = part.trim().split(";");
      let q = 1;
      for (const param of params) {
        const [k, v] = param.trim().split("=");
        if (k?.trim() === "q" && v !== undefined) {
          const parsed = Number.parseFloat(v.trim());
          if (Number.isFinite(parsed) && parsed >= 0 && parsed <= 1) q = parsed;
        }
      }
      return { tag: rawTag.trim(), q, index };
    })
    .filter((item) => item.tag !== "" && item.q > 0)
    .sort((a, b) => (b.q !== a.q ? b.q - a.q : a.index - b.index));
}

/**
 * 解析当前生效语种：
 * 1. 显式 Cookie / localStorage 值优先；
 * 2. 其次按 Accept-Language 权重匹配 zh* -> zh-CN、en* -> en；
 * 3. 均未命中时回退至 DEFAULT_LOCALE ("en")。
 */
export function resolveLocale(
  explicit?: string | null,
  acceptLanguage?: string | null,
): Locale {
  if (explicit) {
    if (isLocale(explicit)) return explicit;
    const matchedExplicit = matchTagToLocale(explicit);
    if (matchedExplicit !== null) return matchedExplicit;
  }
  if (acceptLanguage) {
    for (const item of parseAcceptLanguage(acceptLanguage)) {
      const matched = matchTagToLocale(item.tag);
      if (matched !== null) return matched;
    }
  }
  return DEFAULT_LOCALE;
}

/**
 * 将模板中的 `{key}` 占位符替换为对应参数值。
 */
export function formatText(
  template: string,
  params?: Record<string, string | number>,
): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (full, key: string) =>
    Object.prototype.hasOwnProperty.call(params, key) ? String(params[key]) : full,
  );
}
