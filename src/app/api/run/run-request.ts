import type { RunSelection } from "@/core/run-selection";

/**
 * 解析并校验手动单次运行请求体。
 *
 * 请求体为空时返回 null，由调用方按默认配置执行整轮。
 * 非空时必须满足 `{ targetIds: string[], promptIds: string[] }` 契约，
 * 可选带有 `candidateOverrides`。
 */
export function parseRunRequestBody(text: string): RunSelection | null {
  if (text.trim() === "") return null;
  const body = JSON.parse(text) as Partial<RunSelection>;
  if (!isStringArray(body.targetIds) || !isStringArray(body.promptIds)) {
    throw new Error("请求体须为 { targetIds: string[], promptIds: string[] }");
  }
  const candidateOverrides = parseCandidateOverrides(body.candidateOverrides);
  return {
    targetIds: body.targetIds,
    promptIds: body.promptIds,
    ...(candidateOverrides !== undefined ? { candidateOverrides } : {}),
  };
}

function parseCandidateOverrides(raw: unknown): Record<string, string> | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === "string" && value.trim() !== "") {
      result[key] = value.trim();
    }
  }
  return Object.keys(result).length > 0 ? result : undefined;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}
