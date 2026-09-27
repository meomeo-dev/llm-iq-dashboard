/**
 * 宿主机上限（host ceiling）：由环境变量定义、配置文件与看板都改不了的硬边界。
 *
 * 配置里的预算只能低于上限；`extraArgs` 会原样拼进 CLI 命令行，默认不放行——
 * 能改配置的人不应因此获得改 CLI 权限开关的能力（见 docs/security/public-exposure-design.md §4.3）。
 */

import type { AppConfig } from "./config";

export const ENV_CEILING_PER_DAY_USD = "PELICAN_CEILING_PER_DAY_USD";
export const ENV_CEILING_PER_ROUND_USD = "PELICAN_CEILING_PER_ROUND_USD";
export const ENV_ALLOW_EXTRA_ARGS = "PELICAN_ALLOW_EXTRA_ARGS";

/** 环境变量子集；不用 NodeJS.ProcessEnv，避免 Next.js 把 NODE_ENV 声明为必填 */
export type Env = Readonly<Record<string, string | undefined>>;

export interface Ceiling {
  perDayUsd: number | null;
  perRoundUsd: number | null;
  /** 是否允许配置里的 targets[].extraArgs 生效 */
  allowExtraArgs: boolean;
}

export const NO_CEILING: Ceiling = { perDayUsd: null, perRoundUsd: null, allowExtraArgs: false };

/** 从环境变量读取上限；取值非法时抛错，不静默降级 */
export function readCeiling(env: Env = process.env): Ceiling {
  return {
    perDayUsd: positiveUsd(env, ENV_CEILING_PER_DAY_USD),
    perRoundUsd: positiveUsd(env, ENV_CEILING_PER_ROUND_USD),
    allowExtraArgs: isEnabled(env[ENV_ALLOW_EXTRA_ARGS]),
  };
}

/**
 * 把上限套到已校验的配置上：预算取配置与上限的较小者（配置未设则直接取上限）；
 * 未放行时任何目标带 extraArgs 都视为配置错误。
 */
export function applyCeiling(config: AppConfig, ceiling: Ceiling): AppConfig {
  if (!ceiling.allowExtraArgs) {
    const offenders = config.targets.filter((target) => target.extraArgs.length > 0).map((target) => target.id);
    if (offenders.length > 0) {
      throw new Error(
        `targets 的 extraArgs 未被宿主机放行（${offenders.join("、")}）：` +
          `移除该字段，或在宿主机设置 ${ENV_ALLOW_EXTRA_ARGS}=1`,
      );
    }
  }
  return {
    ...config,
    budget: {
      perDayUsd: lower(config.budget.perDayUsd, ceiling.perDayUsd),
      perRoundUsd: lower(config.budget.perRoundUsd, ceiling.perRoundUsd),
    },
  };
}

function lower(configured: number | null, ceiling: number | null): number | null {
  if (ceiling === null) return configured;
  if (configured === null) return ceiling;
  return Math.min(configured, ceiling);
}

function positiveUsd(env: Env, name: string): number | null {
  const raw = env[name];
  if (raw === undefined || raw.trim() === "") return null;
  const value = Number(raw);
  if (Number.isFinite(value) && value > 0) return value;
  throw new Error(`${name} 必须是正数（美元），当前为 ${raw}`);
}

function isEnabled(raw: string | undefined): boolean {
  if (raw === undefined) return false;
  const value = raw.trim().toLowerCase();
  return value === "1" || value === "true" || value === "yes";
}
