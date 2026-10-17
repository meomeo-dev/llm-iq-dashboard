/**
 * UuidProbe：小写 RFC 4122 v4 UUID 探针
 */

import type { CanonicalRejectionReason, ProbeFeatures } from "../types";
import { Probe, buildBigrams, countDistinctChars } from "./base";
import { RegexPromptCodec } from "./codec";

const UUID_CANDIDATE_REGEX =
  /(?<![0-9a-zA-Z_-])[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}(?![0-9a-zA-Z_-])/g;

const UUID_CANONICAL_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

function buildUuidPromptTemplate(valuesPerCall: number): string {
  return [
    `Generate ${valuesPerCall} distinct lowercase RFC 4122 version 4 UUID strings.`,
    "Requirements:",
    "- Format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx where x is a lowercase hex digit (0-9, a-f) and y is one of 8, 9, a, or b.",
    "- Each UUID must contain at least 8 distinct hexadecimal characters.",
    `- Put all ${valuesPerCall} UUIDs inside a single <answer>...</answer> block, one UUID per line.`,
    "- Output only the <answer>...</answer> block with no explanation, markdown code fences, or numbering.",
  ].join("\n");
}

export class UuidProbe extends Probe {
  public readonly id = "uuid" as const;

  public readonly defaultCodec = new RegexPromptCodec({
    id: "default",
    promptTemplate: buildUuidPromptTemplate,
    candidateRegex: UUID_CANDIDATE_REGEX,
  });

  public constructor() {
    super();
    this.initDefaultCodec();
  }

  public validateCanonical(canonical: string): CanonicalRejectionReason | null {
    if (!UUID_CANONICAL_REGEX.test(canonical)) {
      return "invalid_format";
    }
    const { chars } = this.extractFeatures(canonical);
    if (countDistinctChars(chars) < 8) {
      return "low_char_diversity";
    }
    return null;
  }

  public extractFeatures(canonical: string): ProbeFeatures {
    const stripped = canonical.replaceAll("-", "");
    const chars = Array.from(stripped);
    return {
      chars,
      bigrams: buildBigrams(chars),
    };
  }
}
