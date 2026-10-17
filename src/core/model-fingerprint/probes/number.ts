/**
 * NumberProbe：12–18 位无前导零十进制正整数探针
 */

import type { CanonicalRejectionReason, ProbeFeatures } from "../types";
import { Probe, buildBigrams, countDistinctChars } from "./base";
import { RegexPromptCodec } from "./codec";

const NUMBER_CANDIDATE_REGEX =
  /(?<![0-9a-zA-Z._+-])[1-9][0-9]{11,17}(?![0-9a-zA-Z_+-])(?!\.[0-9])/g;

const NUMBER_CANONICAL_REGEX = /^[1-9][0-9]{11,17}$/;

function buildNumberPromptTemplate(valuesPerCall: number): string {
  return [
    `Generate ${valuesPerCall} distinct positive decimal integers, each having 12 to 18 digits with no leading zero.`,
    "Requirements:",
    "- Each integer must consist solely of digits 0-9 (first digit 1-9), with no commas, spaces, underscores, or decimal points.",
    "- Each integer must contain at least 5 distinct decimal digits.",
    `- Put all ${valuesPerCall} integers inside a single <answer>...</answer> block, one integer per line.`,
    "- Output only the <answer>...</answer> block with no explanation, markdown code fences, or numbering.",
  ].join("\n");
}

export class NumberProbe extends Probe {
  public readonly id = "number" as const;

  public readonly defaultCodec = new RegexPromptCodec({
    id: "default",
    promptTemplate: buildNumberPromptTemplate,
    candidateRegex: NUMBER_CANDIDATE_REGEX,
  });

  public constructor() {
    super();
    this.initDefaultCodec();
  }

  public validateCanonical(canonical: string): CanonicalRejectionReason | null {
    if (!NUMBER_CANONICAL_REGEX.test(canonical)) {
      return "invalid_format";
    }
    const { chars } = this.extractFeatures(canonical);
    if (countDistinctChars(chars) < 5) {
      return "low_char_diversity";
    }
    return null;
  }

  public extractFeatures(canonical: string): ProbeFeatures {
    const chars = Array.from(canonical);
    return {
      chars,
      bigrams: buildBigrams(chars),
    };
  }
}
