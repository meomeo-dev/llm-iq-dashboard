import assert from "node:assert/strict";
import { test } from "node:test";
import {
  canonicalizeFlag,
  confirmOrAbort,
  consumeFlagValue,
  damerauLevenshtein,
  expandEqualsTokens,
  extractGlobalPathFlags,
  formatCliError,
  hasHelpFlag,
  normalizeMultiValueFlag,
  resolveModelAndDeclared,
  stripPnpmSeparators,
  suggestClosestMatch,
} from "@/bin/cli-args";

test("stripPnpmSeparators: strips '--' at any index in argv", () => {
  assert.deepEqual(stripPnpmSeparators(["--", "status", "--", "--cli", "agy", "--"]), [
    "status",
    "--cli",
    "agy",
  ]);
});

test("hasHelpFlag: detects --help, -h, and leading help even after value or global path flags", () => {
  assert.equal(hasHelpFlag(["--help"]), true);
  assert.equal(hasHelpFlag(["--", "-h"]), true);
  assert.equal(hasHelpFlag(["help", "run"]), true);
  assert.equal(hasHelpFlag(["-c", "/tmp/c.yaml", "help", "run"]), true);
  assert.equal(hasHelpFlag(["--cli", "-h"]), true);
  assert.equal(hasHelpFlag(["status", "--cli", "agy"]), false);
});

test("expandEqualsTokens: splits --flag=value and -c=value while preserving internal '=' in values", () => {
  assert.deepEqual(
    expandEqualsTokens([
      "-c=/tmp/c.yaml",
      "--cli=agy",
      "--candidate=xiyou-v1=sun",
      "--candidate",
      "sanguo-v1=zhuge",
    ]),
    [
      "-c",
      "/tmp/c.yaml",
      "--cli",
      "agy",
      "--candidate",
      "xiyou-v1=sun",
      "--candidate",
      "sanguo-v1=zhuge",
    ],
  );
});

test("canonicalizeFlag & normalizeMultiValueFlag: normalizes singular/plural aliases and CSV/repeated values", () => {
  assert.equal(canonicalizeFlag("--probes"), "--probe");
  assert.equal(canonicalizeFlag("--prompts"), "--prompt");
  assert.equal(canonicalizeFlag("--models"), "--model");
  assert.equal(canonicalizeFlag("--targets"), "--target");
  assert.equal(canonicalizeFlag("--only"), "--run");
  assert.equal(canonicalizeFlag("-y"), "--yes");
  assert.equal(canonicalizeFlag("-c"), "--config");

  let acc = normalizeMultiValueFlag(undefined, "uuid,seed", "--probe");
  acc = normalizeMultiValueFlag(acc, "seed,palette", "--probe");
  assert.deepEqual(acc, ["uuid", "seed", "palette"]);

  assert.throws(() => normalizeMultiValueFlag(undefined, " , ", "--probe"), /不能为空/);
});

test("resolveModelAndDeclared: accepts identical sets (regardless of order) and rejects conflicting sets", () => {
  assert.deepEqual(resolveModelAndDeclared(["m1"], undefined), ["m1"]);
  assert.deepEqual(resolveModelAndDeclared(undefined, ["m2"]), ["m2"]);
  assert.deepEqual(resolveModelAndDeclared(["m1", "m2"], ["m2", "m1"]), ["m1", "m2"]);
  assert.throws(() => resolveModelAndDeclared(["m1"], ["m2"]), /取值冲突/);
});

test("extractGlobalPathFlags: extracts --config/-c and --data-dir into env, rejects -d, and stays side-effect-free on --help", () => {
  const env: Record<string, string | undefined> = {};
  const rest = extractGlobalPathFlags(
    ["--", "-c=/tmp/c.yaml", "--data-dir=/tmp/data", "--cli", "agy"],
    env,
  );
  assert.deepEqual(rest, ["--cli", "agy"]);
  assert.equal(env.PELICAN_CONFIG, "/tmp/c.yaml");
  assert.equal(env.PELICAN_DATA_DIR, "/tmp/data");

  assert.throws(() => extractGlobalPathFlags(["-d", "/tmp/data"], {}), /未知选项：-d/);

  const helpEnv: Record<string, string | undefined> = {};
  assert.deepEqual(extractGlobalPathFlags(["--config", "--help"], helpEnv), ["--help"]);
  assert.deepEqual(extractGlobalPathFlags(["-d", "-h"], helpEnv), ["-h"]);
  assert.deepEqual(extractGlobalPathFlags(["-c", "/tmp/c.yaml", "--help"], helpEnv), ["--help"]);
  assert.equal(helpEnv.PELICAN_CONFIG, undefined);
});

test("consumeFlagValue: throws when value is missing or is an option flag, but allows negative numbers", () => {
  assert.equal(consumeFlagValue(["--cli", "agy"], 0, "--cli"), "agy");
  assert.equal(consumeFlagValue(["--count", "-1"], 0, "--count"), "-1");
  assert.throws(() => consumeFlagValue(["--cli"], 0, "--cli"), /缺少取值/);
  assert.throws(() => consumeFlagValue(["--cli", "--model"], 0, "--cli"), /缺少取值/);
  assert.throws(() => consumeFlagValue(["--cli", "-h"], 0, "--cli"), /缺少取值/);
});

test("damerauLevenshtein & suggestClosestMatch: suggests closest flag for typos and transpositions", () => {
  assert.equal(damerauLevenshtein("--proflie", "--profile"), 1);
  const candidates = ["--cli", "--model", "--effort", "--profile", "--prompt", "--dry-run"];
  assert.equal(suggestClosestMatch("--proflie", candidates), "--profile");
  assert.equal(suggestClosestMatch("--effrot", candidates), "--effort");
  assert.equal(suggestClosestMatch("--totally-unrelated-flag", candidates), null);

  const errMsg = formatCliError("--effrot", candidates, "pnpm run:once -- --help");
  assert.match(errMsg, /未知选项：--effrot/);
  assert.match(errMsg, /--effort/);
  assert.match(errMsg, /pnpm run:once -- --help/);
});

test("confirmOrAbort: prioritizes --yes, then customConfirm DI, and fails fast in non-TTY", async () => {
  const prevExitCode = process.exitCode;
  try {
    process.exitCode = 0;
    assert.equal(await confirmOrAbort("确认？", { yes: true, isInteractive: false }), true);
    assert.equal(process.exitCode, 0);

    let prompted = "";
    const okFromCustom = await confirmOrAbort("继续采样？", {
      isInteractive: false,
      customConfirm: async (p) => {
        prompted = p;
        return true;
      },
    });
    assert.equal(okFromCustom, true);
    assert.equal(prompted, "继续采样？");

    const infos: string[] = [];
    const cancelledFromCustom = await confirmOrAbort("继续采样？", {
      isInteractive: false,
      customConfirm: async () => false,
      writeInfo: (line) => infos.push(line),
    });
    assert.equal(cancelledFromCustom, false);
    assert.equal(process.exitCode, 1);
    assert.match(infos.join("\n"), /已取消执行/);

    process.exitCode = 0;
    const errors: string[] = [];
    const nonTtyResult = await confirmOrAbort("继续？", {
      isInteractive: false,
      nonTtyHint: "pnpm fingerprint fill --yes",
      writeError: (line) => errors.push(line),
    });
    assert.equal(nonTtyResult, false);
    assert.equal(process.exitCode, 1);
    assert.match(errors.join("\n"), /非交互终端（non-TTY）/);
    assert.match(errors.join("\n"), /--yes/);
  } finally {
    process.exitCode = prevExitCode;
  }
});
