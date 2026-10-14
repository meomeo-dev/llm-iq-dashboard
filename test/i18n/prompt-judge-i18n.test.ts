import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ANIMATED_PELICAN_RUBRIC, type DetailKind } from "../../src/core/judge/schema";
import { BUILTIN_PROMPTS, promptLifecycle } from "../../src/core/prompt";
import {
  localizeCandidateLabel,
  localizeCriterion,
  localizeDetailSubject,
  localizeGate,
  localizePromptGroupLabel,
  localizePromptLabel,
  localizePromptSpec,
  localizePromptStandard,
  localizeVerdictLabel,
} from "../../src/i18n";

const CJK_RE = /[\u4e00-\u9fff]/;

describe("prompt and judge metadata i18n (M2-03)", () => {
  it("localizes all 54 builtin prompts and 300 candidates into English and Chinese without mutating templates", () => {
    assert.equal(BUILTIN_PROMPTS.length, 54);
    let candidateCount = 0;

    for (const spec of BUILTIN_PROMPTS) {
      const originalTemplate = spec.template;
      const enLabel = localizePromptLabel(spec.id, spec.label, "en");
      const zhLabel = localizePromptLabel(spec.id, spec.label, "zh-CN");

      assert.ok(enLabel.length > 0, `empty English label for ${spec.id}`);
      assert.ok(zhLabel.length > 0, `empty Chinese label for ${spec.id}`);
      assert.equal(
        CJK_RE.test(enLabel),
        false,
        `expected English label for ${spec.id} to have no CJK characters, got: ${enLabel}`,
      );

      const localizedEn = localizePromptSpec(spec, "en");
      assert.equal(localizedEn.template, originalTemplate);
      assert.equal(localizedEn.id, spec.id);

      for (const c of spec.candidates ?? []) {
        candidateCount += 1;
        const originalText = c.text;
        const cEn = localizeCandidateLabel(c.id, c.label, "en", c.text);
        const cZh = localizeCandidateLabel(c.id, c.label, "zh-CN", c.text);
        assert.ok(cEn.length > 0, `empty English candidate label for ${c.id}`);
        assert.ok(cZh.length > 0, `empty Chinese candidate label for ${c.id}`);
        assert.equal(
          CJK_RE.test(cEn),
          false,
          `expected English candidate label for ${c.id} to have no CJK characters, got: ${cEn}`,
        );
        assert.equal(c.text, originalText);
      }
    }

    assert.equal(candidateCount, 300);
  });

  it("localizes prompt standards in both en and zh-CN", () => {
    for (const spec of BUILTIN_PROMPTS) {
      if (spec.standard) {
        const enStd = localizePromptStandard(spec.id, spec.standard, "en");
        const zhStd = localizePromptStandard(spec.id, spec.standard, "zh-CN");
        assert.ok(enStd && enStd.coreKey.length > 0);
        assert.ok(zhStd && zhStd.coreKey.length > 0);
      }
      for (const c of spec.candidates ?? []) {
        if (c.standard) {
          const enStd = localizePromptStandard(c.id, c.standard, "en");
          assert.ok(enStd && enStd.coreKey.length > 0);
        }
      }
    }
  });

  it("localizes promptLifecycle and group labels for en and zh-CN", () => {
    const spec = BUILTIN_PROMPTS[0]!;
    const now = new Date("2026-10-13T00:00:00Z");
    const lcEn = promptLifecycle(spec, now, "en");
    const lcZh = promptLifecycle(spec, now, "zh-CN");

    assert.ok(lcEn.originAgeText && lcEn.collectedAgeText);
    assert.ok(lcZh.originAgeText && lcZh.collectedAgeText);
    assert.match(lcEn.originAgeText, /ago/);
    assert.match(lcEn.collectedAgeText, /(ago|Added today)/);
    assert.equal(CJK_RE.test(lcEn.originAgeText), false);
    assert.equal(CJK_RE.test(lcEn.collectedAgeText), false);
    assert.equal(CJK_RE.test(lcZh.originAgeText), true);
    assert.equal(CJK_RE.test(lcZh.collectedAgeText), true);

    assert.equal(localizePromptGroupLabel("经典基准", "en"), "Classic Benchmarks");
    assert.equal(localizePromptGroupLabel("经典基准", "zh-CN"), "经典基准");
  });

  it("localizes G1-G5 gates, C1-C9 criteria, detail subjects, and verdict labels", () => {
    for (const g of ANIMATED_PELICAN_RUBRIC.gates) {
      const gateResult = { ...g, passed: true, evidence: "ok" };
      const enGate = localizeGate(gateResult, "en");
      const zhGate = localizeGate(gateResult, "zh-CN");
      assert.equal(CJK_RE.test(enGate.title), false, `CJK in gate title ${g.id}: ${enGate.title}`);
      assert.equal(CJK_RE.test(enGate.standard), false, `CJK in gate standard ${g.id}: ${enGate.standard}`);
      assert.equal(zhGate.title, g.title);
    }

    for (const c of ANIMATED_PELICAN_RUBRIC.criteria) {
      const critResult = { ...c, score: c.maxScore, reason: "ok" };
      const enCrit = localizeCriterion(critResult, "en");
      const zhCrit = localizeCriterion(critResult, "zh-CN");
      assert.equal(CJK_RE.test(enCrit.title), false, `CJK in criterion title ${c.id}: ${enCrit.title}`);
      assert.equal(CJK_RE.test(enCrit.standard), false, `CJK in criterion standard ${c.id}: ${enCrit.standard}`);
      assert.equal(zhCrit.title, c.title);
    }

    const detailKinds: DetailKind[] = [
      "pelican",
      "head",
      "crank",
      "saddle",
      "handlebar",
      "wheel-left",
      "wheel-right",
    ];
    for (const kind of detailKinds) {
      const enSubj = localizeDetailSubject(kind, "部位", "en");
      const zhSubj = localizeDetailSubject(kind, "部位", "zh-CN");
      assert.equal(CJK_RE.test(enSubj), false);
      assert.equal(zhSubj, "部位");
    }

    assert.equal(localizeVerdictLabel("online", "en"), "Sharp");
    assert.equal(localizeVerdictLabel("degraded", "en"), "Degraded");
    assert.equal(localizeVerdictLabel("pending", "en"), "Pending Review");
    assert.equal(localizeVerdictLabel("online", "zh-CN"), "智商在线");
  });
});
