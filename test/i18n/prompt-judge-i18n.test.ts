import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ANIMATED_PELICAN_RUBRIC, type DetailKind } from "../../src/core/judge/schema";
import { BUILTIN_PROMPTS, ARCHIVED_PROMPTS, promptLifecycle } from "../../src/core/prompt";
import { FRONTIER_INDIVIDUAL_PROMPT_MAP } from "../../src/core/prompts";
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
  it("localizes all builtin prompts, candidates, and 140 frontier specs into English and Chinese without mutating templates", () => {
    assert.equal(BUILTIN_PROMPTS.length, 23);
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
        const cEnWithText = localizeCandidateLabel(c.id, c.label, "en", c.text);
        const cEnNoText = localizeCandidateLabel(c.id, c.label, "en");
        const cEnFromRawLabel = localizeCandidateLabel(c.label, c.label, "en");
        const cZh = localizeCandidateLabel(c.id, c.label, "zh-CN", c.text);
        assert.ok(cEnWithText.length > 0, `empty English candidate label for ${c.id}`);
        assert.ok(cZh.length > 0, `empty Chinese candidate label for ${c.id}`);
        assert.equal(
          CJK_RE.test(cEnWithText),
          false,
          `expected English candidate label for ${c.id} to have no CJK characters, got: ${cEnWithText}`,
        );
        assert.equal(
          CJK_RE.test(cEnNoText),
          false,
          `expected English candidate label (without text) for ${c.id} to have no CJK characters, got: ${cEnNoText}`,
        );
        assert.equal(
          CJK_RE.test(cEnFromRawLabel),
          false,
          `expected English candidate label (from raw Chinese label) for ${c.id} to have no CJK characters, got: ${cEnFromRawLabel}`,
        );
        assert.equal(c.text, originalText);
      }
    }

    assert.equal(candidateCount, 160);

    let archivedCandidateCount = 0;
    for (const spec of ARCHIVED_PROMPTS) {
      archivedCandidateCount += spec.candidates?.length ?? 0;
    }
    assert.equal(archivedCandidateCount, 140);
    assert.equal(candidateCount + archivedCandidateCount, 300);

    const frontierEntries = [...FRONTIER_INDIVIDUAL_PROMPT_MAP.entries()];
    assert.equal(frontierEntries.length, 140);
    for (const [id, spec] of frontierEntries) {
      const en = localizePromptSpec(spec, "en");
      assert.equal(CJK_RE.test(en.label), false, `CJK in frontier label ${id}: ${en.label}`);
    }
  });

  it("localizes prompt and candidate standards in both en and zh-CN with zero CJK in en", () => {
    for (const spec of BUILTIN_PROMPTS) {
      if (spec.standard) {
        const enStd = localizePromptStandard(spec.id, spec.standard, "en");
        const zhStd = localizePromptStandard(spec.id, spec.standard, "zh-CN");
        assert.ok(enStd && enStd.coreKey.length > 0);
        assert.ok(zhStd && zhStd.coreKey.length > 0);
        assert.equal(CJK_RE.test(enStd.coreKey), false, `CJK in coreKey for ${spec.id}`);
        assert.equal(CJK_RE.test(enStd.groundTruth), false, `CJK in groundTruth for ${spec.id}`);
        assert.equal(
          CJK_RE.test(enStd.evaluationCriteria),
          false,
          `CJK in evaluationCriteria for ${spec.id}`,
        );
        assert.notEqual(
          enStd.groundTruth,
          enStd.evaluationCriteria,
          `groundTruth and evaluationCriteria should be distinct for ${spec.id}`,
        );
      }
      for (const c of spec.candidates ?? []) {
        const stdSource = c.standard ?? spec.standard;
        if (stdSource) {
          const enStdById = localizePromptStandard(c.id, stdSource, "en");
          const enStdByLabel = localizePromptStandard(c.label, stdSource, "en");
          for (const [tag, s] of [
            ["id", enStdById],
            ["label", enStdByLabel],
          ] as const) {
            assert.ok(s && s.coreKey.length > 0);
            assert.equal(CJK_RE.test(s.coreKey), false, `CJK in cand(${tag}) coreKey ${c.id}`);
            assert.equal(
              CJK_RE.test(s.groundTruth),
              false,
              `CJK in cand(${tag}) groundTruth ${c.id}`,
            );
            assert.equal(
              CJK_RE.test(s.evaluationCriteria),
              false,
              `CJK in cand(${tag}) evaluationCriteria ${c.id}`,
            );
          }
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

  it("localizes G1-G5 gates, C1-C9 criteria, deterministic evidence/reasons, detail subjects, and verdict labels", () => {
    const sampleEvidences = [
      "XML 解析无错误",
      "SMIL 动画 4 个，CSS 动画 1 个",
      "无脚本、外部引用与位图",
      "8 帧里 7 帧与首帧不同；最大帧差 MAE 0.0420 >= 0.002；旋转/变换节点 3 个",
      "5 个部件全程在画布内",
    ];
    for (let i = 0; i < ANIMATED_PELICAN_RUBRIC.gates.length; i += 1) {
      const g = ANIMATED_PELICAN_RUBRIC.gates[i]!;
      const gateResult = {
        ...g,
        passed: true,
        evidence: sampleEvidences[i] ?? "XML 解析无错误",
      };
      const enGate = localizeGate(gateResult, "en");
      const zhGate = localizeGate(gateResult, "zh-CN");
      assert.equal(CJK_RE.test(enGate.title), false, `CJK in gate title ${g.id}: ${enGate.title}`);
      assert.equal(
        CJK_RE.test(enGate.standard),
        false,
        `CJK in gate standard ${g.id}: ${enGate.standard}`,
      );
      assert.equal(
        CJK_RE.test(enGate.evidence),
        false,
        `CJK in gate evidence ${g.id}: ${enGate.evidence}`,
      );
      assert.equal(zhGate.title, g.title);
    }

    for (const c of ANIMATED_PELICAN_RUBRIC.criteria) {
      const critResult = {
        ...c,
        score: c.maxScore,
        reason: "3 个旋转动画都是 indefinite / infinite；渲染：t=2000ms 各部件回到首帧位置，循环闭合（盲描述未认出鹈鹕，上限减半为 6）",
      };
      const enCrit = localizeCriterion(critResult, "en");
      const zhCrit = localizeCriterion(critResult, "zh-CN");
      assert.equal(
        CJK_RE.test(enCrit.title),
        false,
        `CJK in criterion title ${c.id}: ${enCrit.title}`,
      );
      assert.equal(
        CJK_RE.test(enCrit.standard),
        false,
        `CJK in criterion standard ${c.id}: ${enCrit.standard}`,
      );
      assert.equal(
        CJK_RE.test(enCrit.reason ?? ""),
        false,
        `CJK in criterion reason ${c.id}: ${enCrit.reason}`,
      );
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
