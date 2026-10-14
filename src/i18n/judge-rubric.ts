/**
 * 作品评审标准（G1–G5 闸门、C1–C9 判据、细节部位名、结论标签）的展示层双语映射。
 * 历史落盘 `.judge.json` 内保存中文 title/standard/subject，展示时按 ID/kind 动态回表。
 */

import type {
  CriterionResult,
  DetailKind,
  GateResult,
  Verdict,
} from "../core/judge/schema";
import type { Locale } from "./types";

interface LocalizedTextPair {
  title: string;
  standard: string;
}

const GATES_EN: Readonly<Record<string, LocalizedTextPair>> = {
  G1: {
    title: "Valid XML",
    standard: "Zero XML parser errors",
  },
  G2: {
    title: "Has Animation",
    standard: "Contains <animate*> elements, or <style> with both @keyframes and animation",
  },
  G3: {
    title: "Self-Contained & Script-Free",
    standard: "No <script>, <foreignObject>, external references, or embedded bitmaps",
  },
  G4: {
    title: "Visibly Moving",
    standard: "Maximum pairwise pixel difference across 8 sampled frames exceeds threshold",
  },
  G5: {
    title: "Stays Within Canvas",
    standard: "Content bounding box of every sampled frame stays within the SVG viewBox",
  },
};

const CRITERIA_EN: Readonly<Record<string, LocalizedTextPair>> = {
  C1: {
    title: "Wheels Rotate Around Axles",
    standard:
      "Front and rear wheels each rotate around their own axle center with no frame-to-frame drift; rotating around global (0,0) or another point scores 0",
  },
  C2: {
    title: "Crank Rotates Around Bottom Bracket",
    standard:
      "Crank and pedals rotate around the bottom bracket center with 180° phase offset between pedals; static crank or wrong pivot scores 0",
  },
  C3: {
    title: "Seamless Loop Playback",
    standard:
      'repeatCount="indefinite" or infinite with first and last frames aligned; single-shot playback or end-frame jump scores 0',
  },
  C4: {
    title: "Legs Synchronized With Crank",
    standard:
      "Leg animation period matches or is an integer multiple of crank period, and feet stay on the pedals across frames; static legs or detached feet score 0",
  },
  C5: {
    title: "Complete Bicycle Structure",
    standard:
      "Frame, handlebars, saddle, spoked wheels, pedals, and crank are present and recognizable; wheels-only or missing major components scores 0",
  },
  C6: {
    title: "Recognizable Pelican",
    standard:
      "Blind description identifies a pelican (long beak, gular pouch); mistaken for another bird or unrecognizable scores 0",
  },
  C7: {
    title: "Seated on Saddle, Feet on Pedals",
    standard:
      "Pelican sits on the saddle with both feet placed on the pedals; floating, detached from frame, or feet off pedals scores 0",
  },
  C8: {
    title: "Believable Pedaling Motion",
    standard:
      "Across 8 frames, leg extension and flexion track the pedal positions; legs and pedals moving independently scores 0",
  },
  C9: {
    title: "Wings Holding Handlebars",
    standard:
      "Pelican wings (forelimbs) reach and grip the handlebars in a riding posture; wings folded at sides, falling short, or missing handlebars scores 0",
  },
};

const DETAIL_SUBJECTS_EN: Readonly<Record<DetailKind, string>> = {
  pelican: "Pelican Body & Beak",
  head: "Pelican Head & Beak",
  crank: "Bottom Bracket, Crank & Pedals",
  saddle: "Saddle & Seating Contact",
  handlebar: "Handlebars & Wing Grip",
  "wheel-left": "Left Wheel & Hub",
  "wheel-right": "Right Wheel & Hub",
};

const VERDICT_LABELS: Readonly<Record<Locale, Readonly<Record<Verdict, string>>>> = {
  "zh-CN": {
    online: "智商在线",
    degraded: "疑似降智",
    pending: "待复核",
  },
  en: {
    online: "Sharp",
    degraded: "Degraded",
    pending: "Pending Review",
  },
};

/** 按语言转换 GateResult 的展示标题与标准说明 */
export function localizeGate(gate: GateResult, locale: Locale): GateResult {
  if (locale === "zh-CN") return gate;
  const en = GATES_EN[gate.id];
  if (!en) return gate;
  return {
    ...gate,
    title: en.title,
    standard: en.standard,
  };
}

/** 按语言转换 CriterionResult 的展示标题与标准说明 */
export function localizeCriterion(
  criterion: CriterionResult,
  locale: Locale,
): CriterionResult {
  if (locale === "zh-CN") return criterion;
  const en = CRITERIA_EN[criterion.id];
  if (!en) return criterion;
  return {
    ...criterion,
    title: en.title,
    standard: en.standard,
  };
}

/** 按语言转换细节联系表的部位名称 */
export function localizeDetailSubject(
  kind: DetailKind,
  fallback: string,
  locale: Locale,
): string {
  if (locale === "zh-CN") return fallback;
  return DETAIL_SUBJECTS_EN[kind] ?? fallback;
}

/** 按语言返回评审结论（online / degraded / pending）的展示文案 */
export function localizeVerdictLabel(verdict: Verdict, locale: Locale): string {
  return VERDICT_LABELS[locale][verdict] ?? verdict;
}
