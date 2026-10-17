import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  PROBES,
  PaletteProbe,
  RegexPromptCodec,
  WordsZhProbe,
  getProbe,
  listProbes,
  type PromptCodec,
} from "../../../src/core/model-fingerprint/probes";
import {
  DEFAULT_SAMPLES_BY_PROBE,
  PROBE_IDS,
  resolveProbeTargetSamples,
} from "../../../src/core/model-fingerprint/types";

describe("model-fingerprint probes: registry & default prompts", () => {
  it("registers all 6 probes and builds prompts without leaking valid examples", () => {
    const all = listProbes();
    assert.equal(all.length, 6);
    for (const id of PROBE_IDS) {
      const probe = getProbe(id);
      assert.equal(probe.id, id);
      assert.equal(probe.defaultTargetSamples, DEFAULT_SAMPLES_BY_PROBE[id]);
      assert.equal(probe.defaultCodec.id, "default");
      assert.equal(probe.defaultCodec.valuesPerCall, 5);
      const prompt = probe.defaultCodec.buildPrompt("req-99");
      assert.ok(prompt.endsWith("\n[req:req-99]"));
      assert.ok(prompt.includes("<answer>...</answer>"));
      const selfExtract = probe.extractAttempt({
        rawText: prompt,
        valuesPerCall: 5,
      });
      assert.deepEqual(selfExtract.values, []);
    }
    assert.equal(resolveProbeTargetSamples("words-zh"), 80);
    assert.equal(resolveProbeTargetSamples("words-zh", { samplesByProbe: { "words-zh": 65 } }), 65);
    assert.equal(resolveProbeTargetSamples("words-zh", { samplesPerProbe: 30 }), 30);
  });
});

describe("model-fingerprint probes: canonical validation & feature extraction", () => {
  it("validates and extracts features for uuid, number, and seed", () => {
    const uuidSample = ["550e8400", "e29b", "41d4", "a716", "446655440000"].join("-");
    assert.equal(PROBES.uuid.validateCanonical(uuidSample), null);
    assert.equal(PROBES.uuid.validateCanonical("not-a-uuid"), "invalid_format");
    const uuidFeat = PROBES.uuid.extractFeatures(uuidSample);
    assert.equal(uuidFeat.chars.length, 32);
    assert.equal(uuidFeat.bigrams.length, 31);
    assert.equal(uuidFeat.segments, undefined);

    const numSample = "135792468013";
    assert.equal(PROBES.number.validateCanonical(numSample), null);
    assert.equal(PROBES.number.validateCanonical("013579246801"), "invalid_format");
    assert.equal(PROBES.number.validateCanonical("111111111111"), "low_char_diversity");
    const numFeat = PROBES.number.extractFeatures(numSample);
    assert.equal(numFeat.chars.length, 12);
    assert.equal(numFeat.bigrams.length, 11);

    const seedSample = "seed_a1b2c3d4e5f60718";
    assert.equal(PROBES.seed.validateCanonical(seedSample), null);
    assert.equal(PROBES.seed.validateCanonical("seed_aaaaaaaaaaaaaaaa"), "low_char_diversity");
    const seedFeat = PROBES.seed.extractFeatures(seedSample);
    assert.equal(seedFeat.chars.length, 16);
    assert.equal(seedFeat.bigrams.length, 15);
  });

  it("validates and extracts features for palette, words-en, and words-zh", () => {
    const paletteVal = "#1a2b3c-#4d5e6f-#708192-#a3b4c5-#d6e7f8";
    assert.equal(PROBES.palette.validateCanonical(paletteVal), null);
    assert.equal(
      PROBES.palette.validateCanonical("#1a2b3c-#1a2b3c-#708192-#a3b4c5-#d6e7f8"),
      "duplicate_segments",
    );
    assert.equal(
      PROBES.palette.validateCanonical("#111111-#111112-#111121-#111211-#112111"),
      "low_char_diversity",
    );
    const palFeat = PROBES.palette.extractFeatures(paletteVal);
    assert.equal(palFeat.chars.length, 30);
    assert.equal(palFeat.bigrams.length, 25);
    assert.ok(!palFeat.bigrams.includes("c4"));
    assert.deepEqual(palFeat.segments, ["#000", "#111", "#122", "#223", "#333"]);

    const wordsEnVal = "river-cloud-stone-flame-frost-grain-bloom-drift";
    assert.equal(PROBES["words-en"].validateCanonical(wordsEnVal), null);
    assert.equal(
      PROBES["words-en"].validateCanonical("river-river-stone-flame-frost-grain-bloom-drift"),
      "duplicate_segments",
    );
    const enFeat = PROBES["words-en"].extractFeatures(wordsEnVal);
    assert.equal(enFeat.segments?.length, 8);
    assert.equal(enFeat.bigrams.length, 32);
    assert.ok(!enFeat.bigrams.includes("rc"));
    assert.ok(!enFeat.chars.includes("-"));

    const wordsZhVal = "青苔-远山-微风-石桥-暮色-松影-竹露-溪流";
    assert.equal(PROBES["words-zh"].validateCanonical(wordsZhVal), null);
    assert.equal(
      PROBES["words-zh"].validateCanonical("星星-远山-微风-石桥-暮色-松影-竹露-溪流"),
      "duplicate_segments",
    );
    assert.equal(
      PROBES["words-zh"].validateCanonical("青苔-远山-微风-石桥-暮色-松影-竹露"),
      "invalid_format",
    );
    const zhFeat = PROBES["words-zh"].extractFeatures(wordsZhVal);
    assert.equal(zhFeat.chars.length, 16);
    assert.equal(zhFeat.bigrams.length, 16);
    assert.deepEqual(zhFeat.bigrams.slice(0, 4), ["青_", "_苔", "远_", "_山"]);
    assert.equal(zhFeat.segments?.length, 8);
  });
});

describe("model-fingerprint probes: extraction, rejection reasons & fallback", () => {
  it("extracts <answer> lines, deduplicates within call, and respects attempt.valuesPerCall", () => {
    const n1 = "135792468013";
    const n2 = "246801357924";
    const n3 = "987654321098";
    const rawText = [
      "Thinking...",
      "<answer>",
      `1. \`${n1}\``,
      `2. ${n1}`,
      `- ${n2}`,
      `* ${n3}`,
      "</answer>",
    ].join("\n");
    const res = PROBES.number.extractAttempt({ rawText, valuesPerCall: 2 });
    assert.deepEqual(res.values, [n1, n2]);
    assert.equal(res.matchedCodecId, "default");
    assert.equal(res.rejectionReason, null);
  });

  it("handles fallback extraction when <answer> is absent and rejects over-long numbers", () => {
    const n1 = "135792468013";
    const n2 = "246801357924";
    const cleanFallback = PROBES.number.extractAttempt({
      rawText: `${n1}\n${n2}`,
      valuesPerCall: 2,
    });
    assert.deepEqual(cleanFallback.values, [n1, n2]);

    const overLongFallback = PROBES.number.extractAttempt({
      rawText: "12345678901234567890",
      valuesPerCall: 1,
    });
    assert.deepEqual(overLongFallback.values, []);
    assert.equal(overLongFallback.rejectionReason, "no_candidate");
  });

  it("classifies all 6 rejection reasons accurately", () => {
    assert.equal(
      PROBES.uuid.extractAttempt({
        rawText: "wrote file",
        valuesPerCall: 1,
        wroteFile: true,
      }).rejectionReason,
      "tool_write_instead_of_inline",
    );
    assert.equal(
      PROBES.uuid.extractAttempt({ rawText: "   \n  ", valuesPerCall: 1 }).rejectionReason,
      "empty_output",
    );
    const nonV4Uuid = ["550e8400", "e29b", "11d4", "a716", "446655440000"].join("-");
    assert.equal(
      PROBES.uuid.extractAttempt({
        rawText: `<answer>\n${nonV4Uuid}\n</answer>`,
        valuesPerCall: 1,
      }).rejectionReason,
      "invalid_format",
    );
    assert.equal(
      PROBES.palette.extractAttempt({
        rawText: "<answer>\n#1a2b3c-#1a2b3c-#708192-#a3b4c5-#d6e7f8\n</answer>",
        valuesPerCall: 1,
      }).rejectionReason,
      "duplicate_segments",
    );
    assert.equal(
      PROBES.seed.extractAttempt({
        rawText: "<answer>\nseed_aaaaaaaaaaaaaaaa\n</answer>",
        valuesPerCall: 1,
      }).rejectionReason,
      "low_char_diversity",
    );
  });

  it("resolves modelPrompts overrides and executes 3-tier codec fallback across Stage 1 & 2", () => {
    const probe = new WordsZhProbe();
    const jsonCodec: PromptCodec = {
      id: "words-zh-json",
      valuesPerCall: 1,
      buildPrompt: (reqId) => `JSON words for ${reqId}`,
      extractCandidates: (raw) => {
        const line = raw.split("\n")[0] ?? "";
        try {
          const parsed = JSON.parse(line) as { groups?: string[][] };
          return (parsed.groups ?? []).map((g) => g.join("-"));
        } catch {
          return [];
        }
      },
    };
    probe.bindModelCodec("codex:custom-model", jsonCodec);

    const brokenJsonWithAnswerFallback = [
      '{"groups": [["星星","远山","微风","石桥","暮色","松影","竹露","溪流"]]}',
      "<answer>",
      "青苔-远山-微风-石桥-暮色-松影-竹露-溪流",
      "</answer>",
    ].join("\n");

    const res = probe.extractAttempt({
      rawText: brokenJsonWithAnswerFallback,
      valuesPerCall: 1,
      codecId: "words-zh-json",
    });
    assert.deepEqual(res.values, ["青苔-远山-微风-石桥-暮色-松影-竹露-溪流"]);
    assert.equal(res.matchedCodecId, "default");

    const palProbe = new PaletteProbe();
    const resolved = palProbe.resolveCodec(
      { cli: "claude", model: "claude-opus-4-6" },
      {
        "claude-opus-4-6": {
          palette: { prompt: "Custom {{REQ_ID}} ({{VALUES_PER_CALL}})", valuesPerCall: 3 },
        },
      },
    );
    assert.equal(resolved.valuesPerCall, 3);
    assert.equal(resolved.buildPrompt("r1"), "Custom r1 (3)");
    assert.ok(resolved instanceof RegexPromptCodec);

    const unknownCodecRes = probe.extractAttempt(
      {
        rawText: '{"groups": [["青苔","远山","微风","石桥","暮色","松影","竹露","溪流"]]}',
        valuesPerCall: 1,
        codecId: "non-existent-codec",
      },
      jsonCodec,
    );
    assert.equal(unknownCodecRes.matchedCodecId, "words-zh-json");
    assert.deepEqual(unknownCodecRes.values, ["青苔-远山-微风-石桥-暮色-松影-竹露-溪流"]);

    const multiAnswerRes = PROBES.seed.extractAttempt({
      rawText: "<answer>seed_0123456789abcdef</answer>\n<answer>seed_fedcba9876543210</answer>",
      valuesPerCall: 2,
    });
    assert.equal(multiAnswerRes.values.length, 2);

    assert.equal(
      PROBES.uuid.extractAttempt({ rawText: "", valuesPerCall: 1, wroteFile: true }).rejectionReason,
      "tool_write_instead_of_inline",
    );
  });
});
