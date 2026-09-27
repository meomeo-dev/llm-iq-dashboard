/**
 * 代码长度门禁类型定义。
 */

export interface FileThresholds {
  ts?: number;
  tsx?: number;
  css?: number;
  [ext: string]: number | undefined;
}

export interface FunctionThresholds {
  ts?: number;
  tsx?: number;
  [ext: string]: number | undefined;
}

export interface ThresholdsConfig {
  files: FileThresholds;
  functions: FunctionThresholds;
}

export interface AllowlistEntry {
  path: string;
  symbol?: string;
  limit: number;
  reason: string;
}

export interface CodeLengthPolicy {
  thresholds: ThresholdsConfig;
  include: string[];
  exclude: string[];
  allowlist: AllowlistEntry[];
}

export interface ASTFunctionInfo {
  name: string;
  startLine: number;
  endLine: number;
  lineCount: number;
}

export interface LengthViolation {
  type: "file" | "function";
  file: string;
  symbol?: string;
  lines: number;
  limit: number;
  standardLimit: number;
  excess: number;
  exempted: boolean;
  reason?: string;
}

export interface ExpiredAllowlistEntry {
  path: string;
  symbol?: string;
  limit: number;
  actual: number;
  standardLimit: number;
  reason: string;
}

export interface LengthCheckReport {
  totalFiles: number;
  violations: LengthViolation[];
  unexemptedViolations: LengthViolation[];
  exemptedViolations: LengthViolation[];
  expiredAllowlist: ExpiredAllowlistEntry[];
  success: boolean;
}
