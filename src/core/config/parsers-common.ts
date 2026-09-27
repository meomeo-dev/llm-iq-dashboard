/**
 * 配置解析基础类型守卫与标量转换
 */

import { CLI_KINDS, EFFORT_LEVELS, type CliKind, type EffortLevel } from "../types";

export function asRecord(value: unknown): Record<string, unknown> | null {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

export function optionalString(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

export function optionalNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function isCliKind(value: string | null): value is CliKind {
  return value !== null && (CLI_KINDS as readonly string[]).includes(value);
}

export function isEffortLevel(value: string | null): value is EffortLevel {
  return value !== null && (EFFORT_LEVELS as readonly string[]).includes(value);
}
