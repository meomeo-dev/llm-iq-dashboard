export type UiRuleId =
  | "UI-00"
  | "UI-01"
  | "UI-02"
  | "UI-03a"
  | "UI-03b"
  | "UI-03c"
  | "UI-04a"
  | "UI-04b"
  | "UI-04c";

export interface UiViolation {
  rule: UiRuleId;
  file: string;
  line: number;
  message: string;
  snippet?: string;
}

export interface UiHygieneOptions {
  cwd: string;
  enforcedPaths?: readonly string[];
}

export interface UiHygieneReport {
  success: boolean;
  checkedFiles: number;
  enforcedPaths: readonly string[];
  violations: UiViolation[];
}

/**
 * 全仓门禁默认锁定范围：
 * - Phase 1 (WU-001)：锁定 tokens.css、globals.css 与 components/ui
 * - Phase 2 (WU-002)：扩展锁定 fingerprint/ 与 ModelFingerprintSection
 * - Phase 3B (WU-004)：锁定全仓 ["src/app"]
 */
export const DEFAULT_ENFORCED_PATHS: readonly string[] = ["src/app"];

