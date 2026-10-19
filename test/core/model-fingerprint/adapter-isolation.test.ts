import assert from "node:assert/strict";
import { lstat, mkdir, mkdtemp, readFile, readlink, rm, utimes, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import { absorbEvent as absorbAgyEvent, buildAgyArgs } from "../../../src/adapters/agy";
import { buildClaudeArgs } from "../../../src/adapters/claude";
import {
  createDefaultCleanHome,
  renderCleanDefaultConfig,
  renderProfileConfig,
} from "../../../src/adapters/codex-profile-home";
import type { AgentRequest } from "../../../src/adapters/types";
import { parseFingerprintCliArgs, runModelFingerprintCli } from "../../../src/bin/model-fingerprint";
import type { AppConfig } from "../../../src/core/config";
import { buildConfigLeakGuard } from "../../../src/core/leak-guard";
import { planFingerprintStatus } from "../../../src/core/model-fingerprint/plan";
import { fingerprintWorkdir } from "../../../src/core/paths";
import { writeProfileKey } from "../../../src/core/profile-credentials";
import { launchFor } from "../../../src/core/runner";
import { pruneOrphanScratch } from "../../../src/core/scratch-cleanup";
import type { Target } from "../../../src/core/types";

function sampleTarget(overrides?: Partial<Target>): Target {
  return {
    id: "codex-gpt-5.4-high",
    label: "Codex GPT-5.4 High",
    cli: "codex",
    model: "gpt-5.4",
    effort: "high",
    timeoutMs: 30_000,
    enabled: true,
    extraArgs: [],
    ...overrides,
  };
}

function sampleAgentRequest(overrides?: Partial<AgentRequest>): AgentRequest {
  return {
    target: sampleTarget(),
    promptText: "Generate values",
    appliedEffort: "high",
    effortAdjustable: true,
    workdir: "/tmp/test-workdir",
    timeoutMs: 30_000,
    ...overrides,
  };
}

describe("CLI adapter isolation for model fingerprint", () => {
  it("appends --safe-mode and --no-session-persistence to claude only when fingerprint is true", () => {
    const normalArgs = buildClaudeArgs(
      sampleAgentRequest({
        target: sampleTarget({ id: "claude-opus", cli: "claude", model: "claude-opus-4-6" }),
      }),
    );
    assert.equal(normalArgs.includes("--safe-mode"), false);
    assert.equal(normalArgs.includes("--no-session-persistence"), false);

    const fpArgs = buildClaudeArgs(
      sampleAgentRequest({
        target: sampleTarget({ id: "claude-opus", cli: "claude", model: "claude-opus-4-6" }),
        fingerprint: true,
      }),
    );
    assert.equal(fpArgs.includes("--safe-mode"), true);
    assert.equal(fpArgs.includes("--no-session-persistence"), true);
    assert.equal(fpArgs.includes("--tools"), true);
    assert.equal(fpArgs[fpArgs.indexOf("--tools") + 1], "");
  });

  it("appends --disable-slash-commands and zero-tool prompt instruction to agy in fingerprint mode", async () => {
    const normalArgs = buildAgyArgs(
      sampleAgentRequest({
        target: sampleTarget({ id: "agy-gemini", cli: "agy", model: "gemini-2.5-pro" }),
        promptText: "Generate values\n[req:req-123]",
      }),
    );
    assert.equal(normalArgs.includes("--disable-slash-commands"), false);
    assert.equal(normalArgs[normalArgs.indexOf("--print") + 1], "Generate values\n[req:req-123]");

    const fpArgs = buildAgyArgs(
      sampleAgentRequest({
        target: sampleTarget({ id: "agy-gemini", cli: "agy", model: "gemini-2.5-pro" }),
        promptText: "Generate values\n[req:req-123]",
        fingerprint: true,
      }),
    );
    assert.equal(fpArgs.includes("--disable-slash-commands"), true);
    const injectedPrompt = fpArgs[fpArgs.indexOf("--print") + 1] ?? "";
    assert.equal(
      injectedPrompt,
      "Generate values\nDo not call any tools, run any commands, or write any files; reply inline with the <answer> block only.\n[req:req-123]",
    );

    const stream = {
      startedAt: new Date(),
      candidates: [] as Array<{ path: string; earlyRead: Promise<{ path: string; content: string } | null> | null }>,
      result: null,
      errors: [] as string[],
    };
    const writeEventLine = JSON.stringify({
      step_update: {
        step_type: "tool",
        state: "DONE",
        tool_name: "write_to_file",
        tool_info: {
          parameters: {
            TargetFile: "/tmp/non-existent-fingerprint-output.txt",
          },
        },
      },
    });
    absorbAgyEvent(stream, writeEventLine, true);
    assert.equal(stream.candidates.length, 1);
    const resolved = await stream.candidates[0]!.earlyRead;
    assert.deepEqual(resolved, {
      path: "/tmp/non-existent-fingerprint-output.txt",
      content: "",
    });
  });

  it("renders codex profile config with project_doc_max_bytes = 0 and history persistence = none", () => {
    const configToml = renderProfileConfig({
      name: "relay-1",
      baseUrl: "https://relay.example.com/v1",
      queryParams: {},
      apiKey: "test-key",
    });
    assert.equal(configToml.includes("project_doc_max_bytes = 0"), true);
    assert.equal(configToml.includes('[history]\npersistence = "none"'), true);

    const cleanDefault = renderCleanDefaultConfig();
    assert.equal(cleanDefault.includes("project_doc_max_bytes = 0"), true);
    assert.equal(cleanDefault.includes('[history]\npersistence = "none"'), true);
  });

  it("creates codex default clean home with symlinked auth.json when present and disposes cleanly", async () => {
    const fakeHostHome = await mkdtemp(join(tmpdir(), "pelican-test-host-home-"));
    try {
      const hostCodexDir = join(fakeHostHome, ".codex");
      await mkdir(hostCodexDir, { recursive: true });
      const hostAuthPath = join(hostCodexDir, "auth.json");
      await writeFile(hostAuthPath, '{"token":"dummy"}', "utf8");

      const cleanHome = await createDefaultCleanHome(fakeHostHome, {});
      try {
        assert.equal(cleanHome.env.CODEX_HOME, cleanHome.dir);
        assert.equal(cleanHome.env.HOME, cleanHome.dir);
        const toml = await readFile(join(cleanHome.dir, "config.toml"), "utf8");
        assert.equal(toml.includes("project_doc_max_bytes = 0"), true);

        const linkPath = join(cleanHome.dir, "auth.json");
        const statInfo = await lstat(linkPath);
        assert.equal(statInfo.isSymbolicLink(), true);
        const target = await readlink(linkPath);
        assert.equal(target, hostAuthPath);
      } finally {
        await cleanHome.dispose();
      }
    } finally {
      await rm(fakeHostHome, { recursive: true, force: true });
    }
  });

  it("preserves scratch/model-fingerprint during pruneOrphanScratch while cleaning expired run scratch dirs", async () => {
    const tempDataDir = await mkdtemp(join(tmpdir(), "pelican-test-scratch-"));
    const prevDataDir = process.env.PELICAN_DATA_DIR;
    process.env.PELICAN_DATA_DIR = tempDataDir;
    try {
      const fpDir = fingerprintWorkdir();
      const expiredRunDir = join(tempDataDir, "scratch", "20260101T000000Z");
      await mkdir(fpDir, { recursive: true });
      await mkdir(expiredRunDir, { recursive: true });

      const oldTime = new Date(Date.now() - 5 * 60 * 60 * 1000);
      await utimes(fpDir, oldTime, oldTime);
      await utimes(expiredRunDir, oldTime, oldTime);

      const logs: string[] = [];
      await pruneOrphanScratch((msg) => logs.push(msg));

      const fpStat = await lstat(fpDir);
      assert.equal(fpStat.isDirectory(), true);
      await assert.rejects(() => lstat(expiredRunDir));
      assert.equal(logs.some((line) => line.includes("20260101T000000Z")), true);
    } finally {
      if (prevDataDir === undefined) delete process.env.PELICAN_DATA_DIR;
      else process.env.PELICAN_DATA_DIR = prevDataDir;
      await rm(tempDataDir, { recursive: true, force: true });
    }
  });

  it("supports launchFor allowDisabled and buildConfigLeakGuard covering profile keys", async () => {
    const tempDataDir = await mkdtemp(join(tmpdir(), "pelican-test-profile-"));
    const prevDataDir = process.env.PELICAN_DATA_DIR;
    process.env.PELICAN_DATA_DIR = tempDataDir;
    try {
      // Synthetic canary string (>= 20 chars) for leak guard verification
      const fakeCanaryMarker = " SYNTH_TEST_CREDENTIAL_WINDOW_9876543210 ";
      await writeProfileKey("codex", "disabled-relay", fakeCanaryMarker.trim());

      const fakeConfig = {
        profiles: [
          {
            cli: "codex" as const,
            name: "disabled-relay",
            baseUrl: "https://relay.example.com/v1",
            enabled: false,
            queryParams: {},
          },
        ],
      } as unknown as AppConfig;

      const blocked = await launchFor(fakeConfig, "codex", "disabled-relay");
      assert.equal(typeof blocked, "string");
      assert.equal((blocked as string).includes("已停用"), true);

      const allowed = await launchFor(fakeConfig, "codex", "disabled-relay", { allowDisabled: true });
      assert.equal(typeof allowed, "object");
      if (typeof allowed !== "string") {
        assert.equal(allowed.name, "disabled-relay");
        assert.equal(allowed.apiKey, fakeCanaryMarker.trim());
      }

      const guard = await buildConfigLeakGuard(fakeConfig, {}, tempDataDir);
      assert.equal(guard.hits("output containing SYNTH_TEST_CREDENTIAL_WINDOW_9876543210 inside"), true);
      assert.equal(guard.hits("clean output without any credential"), false);
    } finally {
      if (prevDataDir === undefined) delete process.env.PELICAN_DATA_DIR;
      else process.env.PELICAN_DATA_DIR = prevDataDir;
      await rm(tempDataDir, { recursive: true, force: true });
    }
  });

  it("parses fingerprint CLI --help, --effort, --probe, and synthesizes ad-hoc status targets", async () => {
    const parsed = parseFingerprintCliArgs([
      "--",
      "check",
      "--cli=agy",
      "--model",
      "gemini-3.8-flash",
      "--effort",
      "low",
      "--probe",
      "uuid,seed",
      "--dry-run",
    ]);
    assert.equal(parsed.command, "check");
    assert.equal(parsed.cli, "agy");
    assert.equal(parsed.model, "gemini-3.8-flash");
    assert.equal(parsed.effort, "low");
    assert.deepEqual(parsed.probes, ["uuid", "seed"]);
    assert.equal(parsed.dryRun, true);

    assert.throws(() => parseFingerprintCliArgs(["fill", "--clii", "agy"]), /您是否想输入 --cli/);

    const adHocStatus = planFingerprintStatus({
      configuredReferences: [{ cli: "codex", model: "gpt-5.4" }],
      onDiskSampleSets: [],
      cliFilter: "agy",
      modelFilter: "gemini-3.8-flash",
      requestedProbes: ["uuid"],
      samplesPerProbe: 10,
    });
    assert.equal(adHocStatus.length, 1);
    assert.equal(adHocStatus[0]?.cli, "agy");
    assert.equal(adHocStatus[0]?.model, "gemini-3.8-flash");
    assert.equal(adHocStatus[0]?.probes.uuid?.validValues, 0);
    assert.equal(adHocStatus[0]?.probes.uuid?.targetValues, 10);

    const helpLines: string[] = [];
    await runModelFingerprintCli(["--", "status", "--help"], {
      loadConfig: async () => {
        throw new Error("should not load config on --help");
      },
      writeLine: (line) => helpLines.push(line),
    });
    assert.ok(helpLines.some((line) => line.includes("用法: pnpm fingerprint status")));

    const bareLines: string[] = [];
    await runModelFingerprintCli([], {
      loadConfig: async () => {
        throw new Error("should not load config on bare invocation");
      },
      writeLine: (line) => bareLines.push(line),
    });
    assert.ok(bareLines.some((line) => line.includes("用法: pnpm fingerprint <command>")));
  });
});
