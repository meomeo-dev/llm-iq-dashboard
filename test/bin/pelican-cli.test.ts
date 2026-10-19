import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, describe, it } from "node:test";
import {
  parseJudgeBackfillOptions,
  runJudgeBackfillCli,
} from "../../scripts/judge-backfill";
import { pickOnboardClis, runOnboardCli } from "../../src/bin/onboard";
import { parsePairArgs, runPairCli } from "../../src/bin/pair";
import { runPelicanCli } from "../../src/bin/pelican";
import { parsePreflightArgs, runPreflightCli } from "../../src/bin/preflight";
import { parsePricingSyncArgs, runPricingSyncCli } from "../../src/bin/pricing-sync";
import { parseRunOnceArgs, runPelicanOnceCli } from "../../src/bin/run-once";
import { runRunnerCli } from "../../src/bin/runner";
import { runSchedulerCli } from "../../src/bin/scheduler";
import { runValidatePromptsCli } from "../../src/bin/validate-prompts";
import { loadConfig, type AppConfig } from "../../src/core/config";
import type { RunRecord } from "../../src/core/types";

const SAMPLE_CONFIG_YAML = `
run:
  promptIds: [classic-v1, landmarks-v1]
  defaultTimeoutMs: 60000
  timeoutByCli:
    agy: 90000
  timeoutByEffort:
    low: 45000
profiles:
  - { name: relay-off, cli: codex, upstreamType: compatible, baseUrl: "https://off.example/v1", enabled: false }
customModels:
  agy: [custom-agy-model]
targets:
  - { cli: claude, model: claude-sonnet-4-6, effort: medium }
  - { cli: codex, profile: relay-off, model: gpt-5, effort: low, enabled: false }
`;

let workdir = "";
let sampleConfig: AppConfig;

before(async () => {
  workdir = await mkdtemp(join(tmpdir(), "llm-iq-pelican-cli-"));
  const cfgPath = join(workdir, "pelican.config.yaml");
  await writeFile(cfgPath, SAMPLE_CONFIG_YAML, "utf8");
  sampleConfig = loadConfig(cfgPath);
});

after(async () => {
  if (workdir) {
    await rm(workdir, { recursive: true, force: true });
  }
});

function makeSampleConfig(): AppConfig {
  return structuredClone(sampleConfig);
}

describe("pelican unified CLI & run-once upgrades (WU-003)", () => {
  it("prints help and exits 0 with zero side effects across pelican and all subcommands", async () => {
    const out: string[] = [];
    await runPelicanCli([], { writeLine: (l) => out.push(l) });
    assert.ok(out.some((l) => l.includes("用法: pnpm pelican <command>")));

    const subcommands = [
      ["help", "run"],
      ["help", "fp", "fill"],
      ["-c", "/tmp/config.yaml", "help", "run"],
      ["-c", "/tmp/config.yaml", "run", "--help"],
      ["--config=/tmp/config.yaml", "fp:fill", "--help"],
      ["run", "--help"],
      ["run:once", "-h"],
      ["fp", "--help"],
      ["fingerprint:fill", "--help"],
      ["sync", "--help"],
      ["preflight", "--help"],
      ["onboard", "--help"],
      ["pair", "--help"],
      ["pricing", "--help"],
      ["prompts", "--help"],
      ["scheduler", "--help"],
      ["runner", "--help"],
    ];
    for (const argv of subcommands) {
      const lines: string[] = [];
      await runPelicanCli(argv, { writeLine: (l) => lines.push(l) });
      assert.ok(lines.some((l) => l.includes("用法:")), `Expected usage output for ${argv.join(" ")}`);
    }

    await assert.rejects(() => runPelicanCli(["judge"]), /历史作品评审回填命令（judge:backfill）已停用/);
    await assert.rejects(() => runPelicanCli(["judge:backfill", "--dry-run"]), /历史作品评审回填命令（judge:backfill）已停用/);
    await assert.rejects(() => runPelicanCli(["fp", "rescore", "chk-1"]), /模型指纹历史核验重算回填命令（rescore）已停用/);
    await assert.rejects(() => runPelicanCli(["fingerprint:rescore", "chk-1"]), /模型指纹历史核验重算回填命令（rescore）已停用/);
    await assert.rejects(() => runPelicanCli(["rnu"]), /您是否想输入 run/);
    await assert.rejects(() => runPelicanCli(["fp:stauts"]), /您是否想输入 fp:status/);
  });

  it("parses run-once flags and executes ad-hoc dry-run, active-work mutex, and full run summary", async () => {
    const parsed = parseRunOnceArgs([
      "--",
      "--cli=agy",
      "--declared",
      "gemini-3.8-flash",
      "--effort",
      "low,high",
      "--prompts",
      "classic-v1",
      "--candidate",
      "landmarks-v1=eiffel",
      "--dry-run",
      "-y",
    ]);
    assert.deepEqual(parsed.clis, ["agy"]);
    assert.deepEqual(parsed.models, ["gemini-3.8-flash"]);
    assert.deepEqual(parsed.efforts, ["low", "high"]);
    assert.deepEqual(parsed.promptIds, ["classic-v1"]);
    assert.deepEqual(parsed.candidates, ["landmarks-v1=eiffel"]);
    assert.equal(parsed.dryRun, true);
    assert.equal(parsed.yes, true);

    assert.throws(() => parseRunOnceArgs(["--clii", "agy"]), /您是否想输入 --cli/);

    const dryLines: string[] = [];
    let executed = false;
    await runPelicanOnceCli(
      ["--", "--model", "gemini-3.8-flash", "--effort", "low", "--prompt", "classic-v1", "--dry-run"],
      {
        loadConfig: () => makeSampleConfig(),
        loadCapabilityCatalog: async () => null,
        loadCostHistory: async () => ({ expected: new Map(), spentLastDayUsd: 0 }),
        findActiveWork: async () => ({ kind: "run", runId: "20261019T000000Z" }),
        executeRun: async () => {
          executed = true;
          throw new Error("should not execute on dry-run");
        },
        writeLine: (l) => dryLines.push(l),
      },
    );
    assert.equal(executed, false);
    assert.ok(dryLines.some((l) => l.includes("agy__gemini-3.8-flash__low")));
    assert.ok(dryLines.some((l) => l.includes("[dry-run]")));

    // Rejects --target bound to disabled profile
    await assert.rejects(
      () =>
        runPelicanOnceCli(["--target", "codex__gpt-5__low__relay-off", "--dry-run"], {
          loadConfig: () => makeSampleConfig(),
          loadCapabilityCatalog: async () => null,
          loadCostHistory: async () => ({ expected: new Map(), spentLastDayUsd: 0 }),
          writeLine: () => {},
        }),
      /上游 relay-off 已停用/,
    );

    // Active work conflict when not dry-run
    await assert.rejects(
      () =>
        runPelicanOnceCli(["--model", "gemini-3.8-flash", "--prompt", "classic-v1"], {
          loadConfig: () => makeSampleConfig(),
          loadCapabilityCatalog: async () => null,
          loadCostHistory: async () => ({ expected: new Map(), spentLastDayUsd: 0 }),
          findActiveWork: async () => ({ kind: "run", runId: "20261019T000000Z" }),
          writeLine: () => {},
        }),
      /20261019T000000Z/,
    );

    // Non-dry-run executes and prints post-run summary
    const runLines: string[] = [];
    await runPelicanOnceCli(["--model", "gemini-3.8-flash", "--prompt", "classic-v1"], {
      loadConfig: () => makeSampleConfig(),
      loadCapabilityCatalog: async () => null,
      loadCostHistory: async () => ({ expected: new Map(), spentLastDayUsd: 0 }),
      findActiveWork: async () => null,
      executeRun: async (cfg): Promise<RunRecord> => ({
        runId: "20261019T010000Z",
        prompts: [{ promptId: "classic-v1", text: "draw", bindings: {} }],
        startedAt: "2026-10-19T01:00:00.000Z",
        finishedAt: "2026-10-19T01:00:05.000Z",
        durationMs: 5000,
        trigger: "manual",
        inProgress: false,
        attempts: cfg.targets.map((t) => ({
          targetId: t.id,
          promptId: "classic-v1",
          cli: t.cli,
          model: t.model,
          effort: t.effort,
          appliedEffort: t.effort,
          effortHonored: true,
          label: t.label,
          status: "ok",
          svgFile: "out.svg",
          rawFile: null,
          startedAt: "2026-10-19T01:00:00.000Z",
          finishedAt: "2026-10-19T01:00:05.000Z",
          durationMs: 5000,
          svgBytes: 100,
          error: null,
          usage: {
            tokens: { input: 120, output: 340 },
            reasoningTokens: 0,
            serviceTier: "standard",
            reportedCostUsd: null,
          },
        })),
      }),
      writeLine: (l) => runLines.push(l),
    });
    assert.ok(runLines.some((l) => l.includes("✓ agy__gemini-3.8-flash__low [classic-v1]")));
    assert.ok(runLines.some((l) => l.includes("产物目录：")));
  });

  it("validates pair, preflight, onboard, pricing, prompts, scheduler, runner, and judge CLI flags", async () => {
    assert.deepEqual(parsePairArgs(["list"]), { kind: "list" });
    assert.deepEqual(parsePairArgs(["--list"]), { kind: "list" });
    assert.deepEqual(parsePairArgs(["revoke", "dev-1"]), { kind: "revoke", id: "dev-1" });
    assert.deepEqual(parsePairArgs(["--revoke", "dev-2"]), { kind: "revoke", id: "dev-2" });
    assert.deepEqual(parsePairArgs(["revoke-all"]), { kind: "revoke-all" });
    assert.deepEqual(parsePairArgs(["open", "--name=MacBook"]), { kind: "open", name: "MacBook" });
    assert.throws(() => parsePairArgs(["--list", "--revoke-all"]), /互斥/);
    assert.throws(() => parsePairArgs(["--list", "--name", "foo"]), /--name 仅适用于 open/);
    assert.throws(() => parsePairArgs(["--revoke", "   "]), /不能为空/);
    assert.throws(() => parsePairArgs(["--unknown"]), /未知选项/);

    assert.deepEqual(parsePreflightArgs(["--", "--cli", "agy,codex"]), { clis: ["agy", "codex"] });
    assert.throws(() => parsePreflightArgs(["--cli", "badcli"]), /无效的 --cli/);

    assert.deepEqual(pickOnboardClis(["--", "agy", "--cli", "claude"]), ["agy", "claude"]);
    assert.throws(() => pickOnboardClis(["--bad-flag"]), /未知选项/);

    assert.deepEqual(parsePricingSyncArgs(["sync", "--latest", "--soft"]), { latest: true, soft: true });
    assert.throws(() => parsePricingSyncArgs(["--bad"]), /未知选项/);

    const judgeOpts = parseJudgeBackfillOptions(["--", "--runs", "20261019T000000Z,20261019T010000Z", "--limit", "5", "--ai-only", "-y"]);
    assert.equal(judgeOpts.only, "20261019T000000Z");
    assert.deepEqual(judgeOpts.onlyList, ["20261019T000000Z", "20261019T010000Z"]);
    assert.equal(judgeOpts.limit, 5);
    assert.equal(judgeOpts.ai, "only");
    assert.equal(judgeOpts.yes, true);
    assert.throws(() => parseJudgeBackfillOptions(["--run", "   "]), /不能为空/);
    assert.throws(() => parseJudgeBackfillOptions(["--unknown-flag"]), /未知选项/);

    await assert.rejects(() => runPairCli(["--bad"]), /未知选项/);
    await assert.rejects(() => runPreflightCli(["--bad"]), /未知选项/);
    await assert.rejects(() => runOnboardCli(["--bad"]), /未知选项/);
    await assert.rejects(() => runPricingSyncCli(["--soft", "--bad"]), /未知选项/);
    await assert.rejects(() => runValidatePromptsCli(["--bad"]), /未知选项/);
    await assert.rejects(() => runSchedulerCli(["--bad"]), /未知选项/);
    await assert.rejects(() => runRunnerCli(["--bad"]), /未知选项/);
    await assert.rejects(() => runJudgeBackfillCli(["--bad"]), /历史作品评审回填命令（judge:backfill）已停用/);
  });
});
