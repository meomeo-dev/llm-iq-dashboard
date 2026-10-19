import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";
import { leakGuardFromText } from "../../../src/core/leak-guard";
import {
  computeBaselinePackageSha256,
  exportBaselineBundle,
  FINGERPRINT_BASELINE_KIND,
  FINGERPRINT_BASELINE_SCHEMA_VERSION,
  FingerprintBundleError,
  importBaselineBundle,
  verifyBaselineBundle,
  type FingerprintBaselineManifest,
} from "../../../src/core/model-fingerprint/bundle";
import {
  appendSampleAttempt,
  readSampleSet,
} from "../../../src/core/model-fingerprint/store";
import {
  packTarGzip,
  unpackTarGzip,
} from "../../../src/core/model-fingerprint/tar-ustar";
import type { ProbeAttempt } from "../../../src/core/model-fingerprint/types";

const SAMPLE_UUID_TEXT = `<answer>
a1b2c3d4-e5f6-4789-8abc-def012345678
12345678-9abc-4def-9012-3456789abcde
fedcba98-7654-4321-8fed-cba987654321
01234567-89ab-4cde-8f01-23456789abcd
89abcdef-0123-4567-989a-bcdef0123456
</answer>`;

const SAMPLE_NUMBER_TEXT = `<answer>
12345678901234
98765432109876
13579246801357
24680135792468
56789012345678
</answer>`;

function makeAttempt(reqId: string, rawText: string): ProbeAttempt {
  return {
    at: "2026-10-17T12:00:00.000Z",
    profile: "default",
    reqId,
    valuesPerCall: 5,
    outcome: "ok",
    rawText,
    durationMs: 420,
    usage: null,
    estimatedCostUsd: 0.001,
    cliVersion: "codex 0.1.0",
  };
}

describe("model-fingerprint baseline bundle export, 5-layer verification, and import", () => {
  let tempDataDir = "";
  const prevDataDir = process.env.PELICAN_DATA_DIR;

  beforeEach(async () => {
    tempDataDir = await mkdtemp(join(tmpdir(), "pelican-fp-bundle-test-"));
    process.env.PELICAN_DATA_DIR = tempDataDir;
  });

  afterEach(async () => {
    if (prevDataDir === undefined) {
      delete process.env.PELICAN_DATA_DIR;
    } else {
      process.env.PELICAN_DATA_DIR = prevDataDir;
    }
    if (tempDataDir) {
      await rm(tempDataDir, { recursive: true, force: true });
    }
  });

  it("exports a valid .tar.gz bundle and imports it into a clean directory with archive backup on overwrite", async () => {
    await appendSampleAttempt(
      {
        probe: "uuid",
        cli: "codex",
        model: "gpt-5.4",
        requestedEffort: "low",
        appliedEffort: "low",
        effortHonored: true,
      },
      makeAttempt("req00001", SAMPLE_UUID_TEXT),
    );
    await appendSampleAttempt(
      {
        probe: "number",
        cli: "codex",
        model: "gpt-5.4",
        requestedEffort: "low",
        appliedEffort: "low",
        effortHonored: true,
      },
      makeAttempt("req00002", SAMPLE_NUMBER_TEXT),
    );

    const exported = await exportBaselineBundle({
      cli: "codex",
      model: "gpt-5.4",
      effort: "low",
      now: new Date("2026-10-17T15:00:00.000Z"),
    });

    assert.equal(exported.filename, "pelican-fp-codex-low-gpt-5.4.tar.gz");
    assert.equal(exported.totalValidValues, 10);
    assert.equal(exported.manifest.probes.length, 2);

    const verified = verifyBaselineBundle(exported.buffer);
    assert.equal(verified.manifest.cli, "codex");
    assert.equal(verified.manifest.model, "gpt-5.4");
    assert.equal(verified.totalValidValues, 10);

    // Switch to a second clean data dir and import
    const secondDir = await mkdtemp(join(tmpdir(), "pelican-fp-bundle-dest-"));
    try {
      process.env.PELICAN_DATA_DIR = secondDir;
      const firstImport = await importBaselineBundle(exported.buffer);
      assert.deepEqual(firstImport.importedProbes, ["uuid", "number"]);
      assert.equal(firstImport.archivedProbes.length, 0);
      assert.equal(firstImport.totalValidValues, 10);

      const loadedUuid = await readSampleSet("codex", "low", "gpt-5.4", "uuid");
      assert.ok(loadedUuid);
      assert.equal(loadedUuid.attempts.length, 1);

      // Re-importing over existing samples archives existing probe files first
      const secondImport = await importBaselineBundle(exported.buffer, {
        now: new Date("2026-10-17T16:00:00.000Z"),
      });
      assert.deepEqual(secondImport.archivedProbes, ["uuid", "number"]);
      assert.equal(secondImport.archivedFiles.length, 2);
    } finally {
      await rm(secondDir, { recursive: true, force: true });
    }
  });

  it("Layer 1: rejects empty/corrupt archives, path traversal, and non-whitelisted tar entries", () => {
    assert.throws(
      () => verifyBaselineBundle(Buffer.alloc(0)),
      (err: unknown) => err instanceof FingerprintBundleError && err.code === "ARCHIVE_EMPTY_OR_OVERSIZE",
    );

    assert.throws(
      () => verifyBaselineBundle(Buffer.from("not-a-gzip-stream", "utf8")),
      (err: unknown) => err instanceof FingerprintBundleError && err.code === "ARCHIVE_GZIP_CORRUPT_OR_BOMB",
    );

    const traversalArchive = packTarGzip([
      { name: "manifest.json", data: Buffer.from("{}", "utf8") },
      { name: "../evil.json", data: Buffer.from("{}", "utf8") },
    ]);
    assert.throws(
      () => verifyBaselineBundle(traversalArchive),
      (err: unknown) =>
        err instanceof FingerprintBundleError && err.code === "ARCHIVE_PATH_TRAVERSAL_OR_FORBIDDEN_ENTRY",
    );

    const forbiddenArchive = packTarGzip([
      { name: "manifest.json", data: Buffer.from("{}", "utf8") },
      { name: "samples/unknown.json", data: Buffer.from("{}", "utf8") },
    ]);
    assert.throws(
      () => verifyBaselineBundle(forbiddenArchive),
      (err: unknown) =>
        err instanceof FingerprintBundleError && err.code === "ARCHIVE_PATH_TRAVERSAL_OR_FORBIDDEN_ENTRY",
    );
  });

  it("Layer 2 & Layer 3: detects manifest tampering (packageSha256) and 1-byte sample file tampering (sha256)", async () => {
    await appendSampleAttempt(
      {
        probe: "uuid",
        cli: "claude",
        model: "claude-sonnet-4-6",
        requestedEffort: "low",
        appliedEffort: "low",
        effortHonored: true,
      },
      makeAttempt("req00010", SAMPLE_UUID_TEXT),
    );
    const exported = await exportBaselineBundle({ cli: "claude", model: "claude-sonnet-4-6", effort: "low" });
    const entries = unpackTarGzip(exported.buffer);

    // Tamper manifest.json without recomputing packageSha256
    const manifestObj = JSON.parse(entries.get("manifest.json")!.toString("utf8")) as FingerprintBaselineManifest;
    const tamperedManifest = { ...manifestObj, model: "claude-opus-4-6" };
    const tamperedManifestArchive = packTarGzip([
      { name: "manifest.json", data: Buffer.from(JSON.stringify(tamperedManifest), "utf8") },
      { name: "samples/uuid.json", data: entries.get("samples/uuid.json")! },
    ]);
    assert.throws(
      () => verifyBaselineBundle(tamperedManifestArchive),
      (err: unknown) => err instanceof FingerprintBundleError && err.code === "MANIFEST_PACKAGE_HASH_MISMATCH",
    );

    // Tamper 1 byte inside samples/uuid.json (preserving byte length)
    const uuidBytes = Buffer.from(entries.get("samples/uuid.json")!);
    const idx = uuidBytes.indexOf("a1b2c3d4");
    uuidBytes[idx] = "b".charCodeAt(0);
    const tamperedFileArchive = packTarGzip([
      { name: "manifest.json", data: entries.get("manifest.json")! },
      { name: "samples/uuid.json", data: uuidBytes },
    ]);
    assert.throws(
      () => verifyBaselineBundle(tamperedFileArchive),
      (err: unknown) => err instanceof FingerprintBundleError && err.code === "PROBE_FILE_SHA256_MISMATCH",
    );
  });

  it("Layer 4 & Layer 5: blocks leaked credentials/paths and detects forged validValues even if hashes are recomputed", async () => {
    await appendSampleAttempt(
      {
        probe: "uuid",
        cli: "agy",
        model: "gemini-3-flash",
        requestedEffort: "low",
        appliedEffort: "low",
        effortHonored: true,
      },
      makeAttempt("req00020", SAMPLE_UUID_TEXT),
    );
    const exported = await exportBaselineBundle({ cli: "agy", model: "gemini-3-flash", effort: "low" });
    const entries = unpackTarGzip(exported.buffer);

    // Layer 5 test: Attacker inflates validValues from 5 to 50 AND recomputes packageSha256
    const manifest = JSON.parse(entries.get("manifest.json")!.toString("utf8")) as FingerprintBaselineManifest;
    const forgedProbes = manifest.probes.map((p) => ({ ...p, validValues: 50 }));
    const forgedHeader = { ...manifest, probes: forgedProbes };
    const forgedManifest: FingerprintBaselineManifest = {
      ...forgedHeader,
      packageSha256: computeBaselinePackageSha256(forgedHeader),
    };
    const forgedArchive = packTarGzip([
      { name: "manifest.json", data: Buffer.from(JSON.stringify(forgedManifest), "utf8") },
      { name: "samples/uuid.json", data: entries.get("samples/uuid.json")! },
    ]);
    assert.throws(
      () => verifyBaselineBundle(forgedArchive),
      (err: unknown) => err instanceof FingerprintBundleError && err.code === "QUALIFICATION_COUNT_MISMATCH",
    );

    // Layer 4 test: LeakGuard blocks credential token present in rawText
    const canaryVal = "my_super_secret_oauth_credential_token_9876543210";
    const guard = leakGuardFromText([canaryVal]);
    const uuidSample = JSON.parse(entries.get("samples/uuid.json")!.toString("utf8"));
    uuidSample.attempts[0].rawText = `${SAMPLE_UUID_TEXT}\n${canaryVal}`;
    const leakedBytes = Buffer.from(JSON.stringify(uuidSample), "utf8");
    const leakedSha = createHash("sha256").update(leakedBytes).digest("hex");
    const leakedProbes = manifest.probes.map((p) => ({
      ...p,
      sha256: leakedSha,
      byteLength: leakedBytes.byteLength,
    }));
    const leakedHeader = { ...manifest, probes: leakedProbes };
    const leakedManifest: FingerprintBaselineManifest = {
      ...leakedHeader,
      packageSha256: computeBaselinePackageSha256(leakedHeader),
    };
    const leakedArchive = packTarGzip([
      { name: "manifest.json", data: Buffer.from(JSON.stringify(leakedManifest), "utf8") },
      { name: "samples/uuid.json", data: leakedBytes },
    ]);
    assert.throws(
      () => verifyBaselineBundle(leakedArchive, { leakGuard: guard }),
      (err: unknown) => err instanceof FingerprintBundleError && err.code === "SAMPLE_SET_SECRET_LEAK_DETECTED",
    );
  });
});
