/**
 * SeedProbe：seed_ 前缀加 16 位小写十六进制探针
 */

import type { CanonicalRejectionReason, ProbeFeatures } from "../types";
import { Probe, buildBigrams, countDistinctChars } from "./base";
import { RegexPromptCodec } from "./codec";

const SEED_CANDIDATE_REGEX =
  /(?<![0-9a-zA-Z_-])[sS][eE][eE][dD]_[0-9a-fA-F]{16}(?![0-9a-zA-Z_-])/g;

const SEED_CANONICAL_REGEX = /^seed_[0-9a-f]{16}$/;

function buildSeedPromptTemplate(valuesPerCall: number): string {
  return [
    `Generate ${valuesPerCall} distinct identifier strings starting with the prefix "seed_" followed by 16 lowercase hexadecimal characters.`,
    "Requirements:",
    "- Format: seed_ followed by exactly 16 lowercase hex characters (0-9, a-f).",
    "- The 16 hexadecimal characters of each string must contain at least 5 distinct hex characters.",
    `- Put all ${valuesPerCall} strings inside a single <answer>...</answer> block, one string per line.`,
    "- Output only the <answer>...</answer> block with no explanation, markdown code fences, or numbering.",
  ].join("\n");
}

export class SeedProbe extends Probe {
  public readonly id = "seed" as const;

  public readonly defaultCodec = new RegexPromptCodec({
    id: "default",
    promptTemplate: buildSeedPromptTemplate,
    candidateRegex: SEED_CANDIDATE_REGEX,
  });

  public constructor() {
    super();
    this.initDefaultCodec();
  }

  public validateCanonical(canonical: string): CanonicalRejectionReason | null {
    if (!SEED_CANONICAL_REGEX.test(canonical)) {
      return "invalid_format";
    }
    const { chars } = this.extractFeatures(canonical);
    if (countDistinctChars(chars) < 5) {
      return "low_char_diversity";
    }
    return null;
  }

  public extractFeatures(canonical: string): ProbeFeatures {
    const stripped = canonical.startsWith("seed_") ? canonical.slice(5) : canonical;
    const chars = Array.from(stripped);
    return {
      chars,
      bigrams: buildBigrams(chars),
    };
  }
}
