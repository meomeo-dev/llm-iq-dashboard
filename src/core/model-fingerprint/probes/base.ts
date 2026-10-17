/**
 * 探针抽象基类（Probe）：统一领域标准值归一化（normalizeCanonical）、
 * 领域合法性与多样性校验（validateCanonical）、特征提取（extractFeatures）
 * 以及三级回退解码流水线（extractAttempt）。
 */

import {
  DEFAULT_SAMPLES_BY_PROBE,
  type AttemptExtractInput,
  type CanonicalRejectionReason,
  type CodecTarget,
  type ExtractionResult,
  type ModelPromptOverrides,
  type ProbeFeatures,
  type ProbeId,
  type RejectionReason,
} from "../types";
import { RegexPromptCodec, type PromptCodec } from "./codec";

export function buildBigrams(chars: readonly string[]): string[] {
  const bigrams: string[] = [];
  for (let i = 0; i + 1 < chars.length; i += 1) {
    bigrams.push(`${chars[i]!}${chars[i + 1]!}`);
  }
  return bigrams;
}

export function countDistinctChars(chars: readonly string[]): number {
  return new Set(chars).size;
}

export abstract class Probe {
  public abstract readonly id: ProbeId;
  public abstract readonly defaultCodec: RegexPromptCodec;

  public get defaultTargetSamples(): number {
    return DEFAULT_SAMPLES_BY_PROBE[this.id];
  }

  protected readonly codecs: Map<string, PromptCodec> = new Map();
  protected readonly modelCodecs: Map<string, PromptCodec> = new Map();

  protected initDefaultCodec(): void {
    this.codecs.set(this.defaultCodec.id, this.defaultCodec);
  }

  public registerCodec(codec: PromptCodec): this {
    this.codecs.set(codec.id, codec);
    return this;
  }

  public bindModelCodec(targetKey: string, codec: PromptCodec): this {
    this.codecs.set(codec.id, codec);
    this.modelCodecs.set(targetKey, codec);
    return this;
  }

  public getCodec(codecId: string): PromptCodec | undefined {
    this.ensureDefaultRegistered();
    return this.codecs.get(codecId);
  }

  public normalizeCanonical(candidate: string): string {
    return candidate
      .normalize("NFC")
      .trim()
      .replace(/[ \t]*-[ \t]*/g, "-")
      .toLowerCase();
  }

  public abstract validateCanonical(canonical: string): CanonicalRejectionReason | null;

  public abstract extractFeatures(canonical: string): ProbeFeatures;

  public resolveCodec(target: CodecTarget, overrides?: ModelPromptOverrides): PromptCodec {
    this.ensureDefaultRegistered();
    const compositeKey = `${target.cli}:${target.model}`;
    const baseCodec =
      this.modelCodecs.get(compositeKey) ??
      this.modelCodecs.get(target.model) ??
      this.defaultCodec;

    const override =
      overrides?.[compositeKey]?.[this.id] ?? overrides?.[target.model]?.[this.id];
    if (!override) return baseCodec;

    if (baseCodec instanceof RegexPromptCodec) {
      return baseCodec.withPrompt(override.prompt, override.valuesPerCall);
    }
    return baseCodec;
  }

  public extractAttempt(
    attempt: AttemptExtractInput,
    activeCodec?: PromptCodec,
  ): ExtractionResult {
    this.ensureDefaultRegistered();
    const chain = this.buildFallbackChain(attempt.codecId, activeCodec);
    const maxCount = Math.max(1, attempt.valuesPerCall);
    let firstCanonicalRejection: CanonicalRejectionReason | null = null;

    for (const codec of chain) {
      const effectiveCodec =
        codec instanceof RegexPromptCodec && codec.valuesPerCall !== maxCount
          ? codec.withPrompt(undefined, maxCount)
          : codec;
      const candidates = effectiveCodec.extractCandidates(attempt.rawText);
      if (candidates.length === 0) continue;

      const accepted: string[] = [];
      const seen = new Set<string>();
      for (const candidate of candidates) {
        const canonical = this.normalizeCanonical(candidate);
        const rejection = this.validateCanonical(canonical);
        if (rejection === null) {
          if (!seen.has(canonical)) {
            seen.add(canonical);
            accepted.push(canonical);
          }
        } else if (firstCanonicalRejection === null) {
          firstCanonicalRejection = rejection;
        }
      }

      if (accepted.length > 0) {
        return {
          values: accepted.slice(0, maxCount),
          matchedCodecId: codec.id,
          rejectionReason: null,
        };
      }
    }

    return {
      values: [],
      matchedCodecId: null,
      rejectionReason: this.resolveRejectionReason(attempt, firstCanonicalRejection),
    };
  }

  private ensureDefaultRegistered(): void {
    if (!this.codecs.has(this.defaultCodec.id)) {
      this.codecs.set(this.defaultCodec.id, this.defaultCodec);
    }
  }

  private buildFallbackChain(codecId?: string, activeCodec?: PromptCodec): PromptCodec[] {
    const targetId = codecId ?? "default";
    const tier1 =
      activeCodec && activeCodec.id === targetId ? activeCodec : this.codecs.get(targetId);
    const rawChain = [tier1, activeCodec, this.defaultCodec].filter(
      (c): c is PromptCodec => c !== undefined,
    );
    const deduplicated: PromptCodec[] = [];
    const seenIds = new Set<string>();
    for (const codec of rawChain) {
      if (!seenIds.has(codec.id)) {
        seenIds.add(codec.id);
        deduplicated.push(codec);
      }
    }
    return deduplicated;
  }

  private resolveRejectionReason(
    attempt: AttemptExtractInput,
    firstCanonicalRejection: CanonicalRejectionReason | null,
  ): RejectionReason {
    if (attempt.wroteFile === true) return "tool_write_instead_of_inline";
    if (attempt.rawText.trim() === "") return "empty_output";
    if (firstCanonicalRejection !== null) return firstCanonicalRejection;
    return "no_candidate";
  }
}
