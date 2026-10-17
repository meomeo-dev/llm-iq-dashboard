/**
 * WordsEnProbe：8 个互异小写英文单数名词连字符序列探针
 */

import type { CanonicalRejectionReason, ProbeFeatures } from "../types";
import { Probe, buildBigrams, countDistinctChars } from "./base";
import { RegexPromptCodec } from "./codec";

const WORDS_EN_CANDIDATE_REGEX =
  /(?<![0-9a-zA-Z_-])(?<![a-zA-Z][ \t]*-[ \t]*)[a-zA-Z]{3,12}(?:[ \t]*-[ \t]*[a-zA-Z]{3,12}){7}(?![0-9a-zA-Z_-])(?![ \t]*-[ \t]*[a-zA-Z])/g;

const WORDS_EN_CANONICAL_REGEX = /^[a-z]{3,12}(-[a-z]{3,12}){7}$/;

function buildWordsEnPromptTemplate(valuesPerCall: number): string {
  return [
    `Generate ${valuesPerCall} distinct hyphen-joined sequences of 8 English singular nouns related to estates, maritime navigation, architecture, or natural landscapes.`,
    "Requirements:",
    "- Each line must contain exactly 8 distinct lowercase English words (3 to 12 letters a-z per word) joined by single hyphens.",
    "- Each 8-word sequence must contain at least 10 distinct English letters.",
    `- Put all ${valuesPerCall} sequences inside a single <answer>...</answer> block, one sequence per line.`,
    "- Output only the <answer>...</answer> block with no explanation, markdown code fences, or numbering.",
  ].join("\n");
}

export class WordsEnProbe extends Probe {
  public readonly id = "words-en" as const;

  public readonly defaultCodec = new RegexPromptCodec({
    id: "default",
    promptTemplate: buildWordsEnPromptTemplate,
    candidateRegex: WORDS_EN_CANDIDATE_REGEX,
  });

  public constructor() {
    super();
    this.initDefaultCodec();
  }

  public validateCanonical(canonical: string): CanonicalRejectionReason | null {
    if (!WORDS_EN_CANONICAL_REGEX.test(canonical)) {
      return "invalid_format";
    }
    const segments = canonical.split("-");
    if (new Set(segments).size !== 8) {
      return "duplicate_segments";
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
    const bigrams = segments.flatMap((word) => buildBigrams(Array.from(word)));
    return {
      chars,
      bigrams,
      segments,
    };
  }
}
