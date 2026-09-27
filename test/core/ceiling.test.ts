/** 宿主机上限：预算取小、extraArgs 默认不放行 */

import assert from "node:assert/strict";
import { describe, test } from "node:test";
import type { AppConfig } from "@/core/config";
import { applyCeiling, NO_CEILING, readCeiling } from "@/core/ceiling";
import type { Target } from "@/core/types";

const target = (extraArgs: string[] = []): Target => ({
  id: "claude__claude-sonnet-5__low", cli: "claude", model: "claude-sonnet-5", effort: "low",
  label: "t", timeoutMs: 1000, extraArgs, enabled: true,
});

const config = (perDayUsd: number | null, perRoundUsd: number | null, targets: Target[]): AppConfig =>
  ({ budget: { perDayUsd, perRoundUsd }, targets }) as AppConfig;

describe("readCeiling", () => {
  test("缺省为无上限且不放行 extraArgs", () => {
    assert.deepEqual(readCeiling({}), NO_CEILING);
  });

  test("读取正数上限与放行开关；非法取值抛错", () => {
    const ceiling = readCeiling({
      PELICAN_CEILING_PER_DAY_USD: "50", PELICAN_CEILING_PER_ROUND_USD: "5.5", PELICAN_ALLOW_EXTRA_ARGS: "true",
    });
    assert.deepEqual(ceiling, { perDayUsd: 50, perRoundUsd: 5.5, allowExtraArgs: true });
    assert.throws(() => readCeiling({ PELICAN_CEILING_PER_DAY_USD: "-1" }), /PELICAN_CEILING_PER_DAY_USD/);
    assert.throws(() => readCeiling({ PELICAN_CEILING_PER_ROUND_USD: "abc" }), /PELICAN_CEILING_PER_ROUND_USD/);
  });
});

describe("applyCeiling", () => {
  test("预算取配置与上限的较小者；配置未设时直接取上限", () => {
    const applied = applyCeiling(config(100, null, [target()]), { perDayUsd: 40, perRoundUsd: 3, allowExtraArgs: false });
    assert.deepEqual(applied.budget, { perDayUsd: 40, perRoundUsd: 3 });
    const kept = applyCeiling(config(10, 1, [target()]), { perDayUsd: 40, perRoundUsd: null, allowExtraArgs: false });
    assert.deepEqual(kept.budget, { perDayUsd: 10, perRoundUsd: 1 });
  });

  test("未放行时带 extraArgs 的目标使配置失效；放行后原样通过", () => {
    const withArgs = config(null, null, [target(["--dangerously-skip-permissions"])]);
    assert.throws(() => applyCeiling(withArgs, NO_CEILING), /extraArgs 未被宿主机放行.*claude__claude-sonnet-5__low/);
    const applied = applyCeiling(withArgs, { ...NO_CEILING, allowExtraArgs: true });
    assert.deepEqual(applied.targets[0]?.extraArgs, ["--dangerously-skip-permissions"]);
  });
});
