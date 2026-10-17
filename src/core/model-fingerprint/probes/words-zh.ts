/**
 * WordsZhProbe：8 个互异非叠字汉语双字名词连字符序列探针
 */

import type { CanonicalRejectionReason, ProbeFeatures } from "../types";
import { Probe, countDistinctChars } from "./base";
import { RegexPromptCodec } from "./codec";

const WORDS_ZH_CANDIDATE_REGEX =
  /(?<![\p{Script=Han}0-9a-zA-Z_-])(?<![\p{Script=Han}][ \t]*-[ \t]*)[\p{Script=Han}]{2}(?:[ \t]*-[ \t]*[\p{Script=Han}]{2}){7}(?![\p{Script=Han}0-9a-zA-Z_-])(?![ \t]*-[ \t]*[\p{Script=Han}])/gu;

const WORDS_ZH_CANONICAL_REGEX = /^\p{Unified_Ideograph}{2}(-\p{Unified_Ideograph}{2}){7}$/u;

function buildWordsZhPromptTemplate(valuesPerCall: number): string {
  return [
    `请生成 ${valuesPerCall} 组由连字符“-”拼接的 8 个互异双字汉语名词（古典园林、书房器物或自然草木题材）。`,
    "格式要求：",
    "- 每行严格由 8 个互异的双字汉语名词以英文连字符“-”拼接（共 16 个汉字、7 个连字符）。",
    "- 每个双字词的两个汉字必须不同（禁止叠字词、四字成语拆分或人名），整行 16 个汉字至少包含 10 个不同汉字。",
    `- 将全部 ${valuesPerCall} 行放入同一个 <answer>...</answer> 标签块内，每行 1 组。`,
    "- 只输出 <answer>...</answer> 标签块，不要输出任何解释、代码块标记或列表序号。",
  ].join("\n");
}

export class WordsZhProbe extends Probe {
  public readonly id = "words-zh" as const;

  public readonly defaultCodec = new RegexPromptCodec({
    id: "default",
    promptTemplate: buildWordsZhPromptTemplate,
    candidateRegex: WORDS_ZH_CANDIDATE_REGEX,
  });

  public constructor() {
    super();
    this.initDefaultCodec();
  }

  public validateCanonical(canonical: string): CanonicalRejectionReason | null {
    if (!WORDS_ZH_CANONICAL_REGEX.test(canonical)) {
      return "invalid_format";
    }
    const segments = canonical.split("-");
    if (new Set(segments).size !== 8) {
      return "duplicate_segments";
    }
    for (const word of segments) {
      const codePoints = Array.from(word);
      if (codePoints.length !== 2 || codePoints[0] === codePoints[1]) {
        return "duplicate_segments";
      }
    }
    const { chars } = this.extractFeatures(canonical);
    if (countDistinctChars(chars) < 10) {
      return "low_char_diversity";
    }
    return null;
  }

  public extractFeatures(canonical: string): ProbeFeatures {
    const segments = canonical.split("-");
    const chars = Array.from(segments.join(""));
    const bigrams = segments.flatMap((word) => {
      const [c1, c2] = Array.from(word);
      return c1 !== undefined && c2 !== undefined ? [`${c1}_`, `_${c2}`] : [];
    });
    return {
      chars,
      bigrams,
      segments,
    };
  }
}
