/**
 * 问答编解码器（PromptCodec）：将「如何生成提示词（buildPrompt）」与
 * 「如何从原始应答提取候选值（extractCandidates）」内聚在同一对象中。
 */

import { DEFAULT_VALUES_PER_CALL } from "../types";

export interface PromptCodec {
  readonly id: string;
  readonly valuesPerCall: number;
  buildPrompt(reqId: string): string;
  extractCandidates(rawText: string): string[];
}

export type PromptTemplateSource = string | ((valuesPerCall: number) => string);

export interface RegexPromptCodecOptions {
  id?: string;
  valuesPerCall?: number;
  promptTemplate: PromptTemplateSource;
  candidateRegex: RegExp;
}

const ANSWER_BLOCK_REGEX = /<answer\s*>((?:(?!<\/?answer\b)[\s\S])*?)<\/answer\s*>/gi;

function scanMatches(text: string, pattern: RegExp): string[] {
  const flags = pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`;
  const matcher = new RegExp(pattern.source, flags);
  const results: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = matcher.exec(text)) !== null) {
    if (match[0] !== "") {
      results.push(match[0]);
    }
    if (match.index === matcher.lastIndex) {
      matcher.lastIndex += 1;
    }
  }
  return results;
}

function renderTemplateText(source: PromptTemplateSource, valuesPerCall: number): string {
  if (typeof source === "function") {
    return source(valuesPerCall);
  }
  return source.replaceAll("{{VALUES_PER_CALL}}", String(valuesPerCall));
}

export class RegexPromptCodec implements PromptCodec {
  public readonly id: string;
  public readonly valuesPerCall: number;
  private readonly promptTemplate: PromptTemplateSource;
  private readonly candidateRegex: RegExp;

  public constructor(options: RegexPromptCodecOptions) {
    this.id = options.id ?? "default";
    this.valuesPerCall = options.valuesPerCall ?? DEFAULT_VALUES_PER_CALL;
    this.promptTemplate = options.promptTemplate;
    this.candidateRegex = options.candidateRegex;
  }

  public buildPrompt(reqId: string): string {
    const rendered = renderTemplateText(this.promptTemplate, this.valuesPerCall).trimEnd();
    if (rendered.includes("{{REQ_ID}}")) {
      return rendered.replaceAll("{{REQ_ID}}", reqId);
    }
    return `${rendered}\n[req:${reqId}]`;
  }

  public extractCandidates(rawText: string): string[] {
    if (rawText.trim() === "") return [];

    const nonEmptyBlocks: string[][] = [];
    const blockMatcher = new RegExp(ANSWER_BLOCK_REGEX.source, ANSWER_BLOCK_REGEX.flags);
    let blockMatch: RegExpExecArray | null;
    while ((blockMatch = blockMatcher.exec(rawText)) !== null) {
      const inner = blockMatch[1] ?? "";
      const candidates = scanMatches(inner, this.candidateRegex);
      if (candidates.length > 0) {
        nonEmptyBlocks.push(candidates);
      }
    }

    if (nonEmptyBlocks.length === 0) {
      return scanMatches(rawText, this.candidateRegex);
    }

    const lastBlock = nonEmptyBlocks[nonEmptyBlocks.length - 1]!;
    if (lastBlock.length >= 2 || this.valuesPerCall === 1) {
      return lastBlock;
    }

    return nonEmptyBlocks.slice(-this.valuesPerCall).flat();
  }

  public withPrompt(promptTemplate?: string, valuesPerCall?: number): RegexPromptCodec {
    const nextTemplate =
      promptTemplate !== undefined && promptTemplate.trim() !== ""
        ? promptTemplate
        : this.promptTemplate;
    const nextValuesPerCall =
      valuesPerCall !== undefined && Number.isInteger(valuesPerCall) && valuesPerCall >= 1
        ? valuesPerCall
        : this.valuesPerCall;
    return new RegexPromptCodec({
      id: this.id,
      valuesPerCall: nextValuesPerCall,
      promptTemplate: nextTemplate,
      candidateRegex: this.candidateRegex,
    });
  }
}
