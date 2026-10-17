/**
 * PaletteProbe：5 个互异小写 #rrggbb 十六进制配色串探针
 */

import type { CanonicalRejectionReason, ProbeFeatures } from "../types";
import { Probe, buildBigrams, countDistinctChars } from "./base";
import { RegexPromptCodec } from "./codec";

const PALETTE_CANDIDATE_REGEX =
  /(?<![0-9a-zA-Z_#-])(?<!#[0-9a-zA-Z]*[ \t]*-[ \t]*)#[0-9a-fA-F]{6}(?:[ \t]*-[ \t]*#[0-9a-fA-F]{6}){4}(?![0-9a-zA-Z_#-])(?![ \t]*-[ \t]*#)/g;

const PALETTE_CANONICAL_REGEX = /^#[0-9a-f]{6}(-#[0-9a-f]{6}){4}$/;

function buildPalettePromptTemplate(valuesPerCall: number): string {
  return [
    `Generate ${valuesPerCall} distinct 5-color hexadecimal palette strings.`,
    "Requirements:",
    "- Each palette line must consist of exactly 5 distinct lowercase 6-digit hex colors joined by hyphens (#rrggbb-#rrggbb-#rrggbb-#rrggbb-#rrggbb).",
    "- Every individual color must use at least 2 distinct hex digits (do not use single-character repeats like all zeros or all f's), and the 5-color line must contain at least 6 distinct hex digits overall.",
    `- Put all ${valuesPerCall} palette lines inside a single <answer>...</answer> block, one palette line per line.`,
    "- Output only the <answer>...</answer> block with no explanation, markdown code fences, or numbering.",
  ].join("\n");
}

export class PaletteProbe extends Probe {
  public readonly id = "palette" as const;

  public readonly defaultCodec = new RegexPromptCodec({
    id: "default",
    promptTemplate: buildPalettePromptTemplate,
    candidateRegex: PALETTE_CANDIDATE_REGEX,
  });

  public constructor() {
    super();
    this.initDefaultCodec();
  }

  public validateCanonical(canonical: string): CanonicalRejectionReason | null {
    if (!PALETTE_CANONICAL_REGEX.test(canonical)) {
      return "invalid_format";
    }
    const segments = canonical.split("-");
    if (new Set(segments).size !== 5) {
      return "duplicate_segments";
    }
    for (const segment of segments) {
      const hexChars = Array.from(segment.slice(1));
      if (countDistinctChars(hexChars) < 2) {
        return "low_char_diversity";
      }
    }
    const { chars } = this.extractFeatures(canonical);
    if (countDistinctChars(chars) < 6) {
      return "low_char_diversity";
    }
    return null;
  }

  public extractFeatures(canonical: string): ProbeFeatures {
    const rawColors = canonical.split("-");
    const quantizeChannel = (hexDigit: string): string =>
      (Number.parseInt(hexDigit, 16) >> 2).toString(16);
    const segments = rawColors.map((seg) =>
      seg.length === 7
        ? `#${quantizeChannel(seg[1]!)}${quantizeChannel(seg[3]!)}${quantizeChannel(seg[5]!)}`
        : seg,
    );
    const hexColors = rawColors.map((seg) => (seg.startsWith("#") ? seg.slice(1) : seg));
    const chars = Array.from(hexColors.join(""));
    const bigrams = hexColors.flatMap((hex) => buildBigrams(Array.from(hex)));
    return {
      chars,
      bigrams,
      segments,
    };
  }
}
