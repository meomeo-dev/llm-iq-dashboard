import type { LocalizedStandardEntry } from "../../../types";
import { SANGUO_CH001_012_ANIM_STANDARDS_EN } from "./ch001-012-anim-en";
import {
  SANGUO_CH001_012_LABELS_EN,
  SANGUO_CH001_012_STATIC_STANDARDS_EN,
} from "./ch001-012-en";
import { SANGUO_CH013_024_ANIM_STANDARDS_EN } from "./ch013-024-anim-en";
import {
  SANGUO_CH013_024_LABELS_EN,
  SANGUO_CH013_024_STATIC_STANDARDS_EN,
} from "./ch013-024-en";
import { SANGUO_CH025_036_ANIM_STANDARDS_EN } from "./ch025-036-anim-en";
import {
  SANGUO_CH025_036_LABELS_EN,
  SANGUO_CH025_036_STATIC_STANDARDS_EN,
} from "./ch025-036-en";
import { SANGUO_CH037_048_ANIM_STANDARDS_EN } from "./ch037-048-anim-en";
import {
  SANGUO_CH037_048_LABELS_EN,
  SANGUO_CH037_048_STATIC_STANDARDS_EN,
} from "./ch037-048-en";
import { SANGUO_CH049_060_ANIM_STANDARDS_EN } from "./ch049-060-anim-en";
import {
  SANGUO_CH049_060_LABELS_EN,
  SANGUO_CH049_060_STATIC_STANDARDS_EN,
} from "./ch049-060-en";
import { SANGUO_CH061_072_ANIM_STANDARDS_EN } from "./ch061-072-anim-en";
import {
  SANGUO_CH061_072_LABELS_EN,
  SANGUO_CH061_072_STATIC_STANDARDS_EN,
} from "./ch061-072-en";
import { SANGUO_CH073_084_ANIM_STANDARDS_EN } from "./ch073-084-anim-en";
import {
  SANGUO_CH073_084_LABELS_EN,
  SANGUO_CH073_084_STATIC_STANDARDS_EN,
} from "./ch073-084-en";
import { SANGUO_CH085_096_ANIM_STANDARDS_EN } from "./ch085-096-anim-en";
import {
  SANGUO_CH085_096_LABELS_EN,
  SANGUO_CH085_096_STATIC_STANDARDS_EN,
} from "./ch085-096-en";
import { SANGUO_CH097_108_ANIM_STANDARDS_EN } from "./ch097-108-anim-en";
import {
  SANGUO_CH097_108_LABELS_EN,
  SANGUO_CH097_108_STATIC_STANDARDS_EN,
} from "./ch097-108-en";
import { SANGUO_CH109_120_ANIM_STANDARDS_EN } from "./ch109-120-anim-en";
import {
  SANGUO_CH109_120_LABELS_EN,
  SANGUO_CH109_120_STATIC_STANDARDS_EN,
} from "./ch109-120-en";

export const SANGUO_SUITE_LABELS_EN: Readonly<Record<string, string>> = {
  "sanguo-v1": "Romance of the Three Kingdoms · Chapter Scenes",
  "sanguo-anim-v1": "Romance of the Three Kingdoms · Animated Chapter Scenes",
};

export const SANGUO_SUITE_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "sanguo-v1": {
    coreKey: "Romance of the Three Kingdoms Original-Text Episodes & Character Attire",
    groundTruth:
      "Faithfully depicts the original-text scene of the drawn chapter of Romance of the Three Kingdoms (e.g., the black ox and white horse at the Oath of the Peach Garden, Warming Wine and Discussing Heroes, Zhao Yun shielding A Dou at Changban, Borrowing Arrows with Straw Boats, Zhuge Liang playing the qin at the parapet in the Empty Fort Strategy); character appearance and attire follow the novel's descriptions without later opera or screen designs, and no gore is shown.",
    evaluationCriteria:
      "1. Iconic emblems: Objects named in the chapter's original text (the black ox and white horse, the Qinggang Sword, straw bundles catching arrows, incense and qin) are accurately represented; 2. Faction and atmosphere: Expressions, faction banners, and historical gravitas match the chapter's description.",
  },
  "sanguo-anim-v1": {
    coreKey: "Three Kingdoms Original-Text Scenes & Pure Inline Banner/Natural Animation",
    groundTruth:
      "Faithfully depicts the original-text scene and battlefield atmosphere of the drawn chapter of Romance of the Three Kingdoms with continuous, smooth inline SVG animation (billowing banners, flowing manes and tails with dust under hooves, fire and smoke, river mist and waves); one-time actions are held as a frozen moment, and XML is strictly well-formed.",
    evaluationCriteria:
      "1. Environmental motion: Banners, manes and tails, fire and smoke, and river mist and waves loop smoothly and naturally, with no figure drifting as a whole; 2. Period authenticity: Late-Han/Three-Kingdoms armor, weaponry, and architecture match historical lore; 3. XML compliance: Zero XML parse errors and zero <script> tags.",
  },
};

export const SANGUO_LABELS_EN: Readonly<Record<string, string>> = {
  ...SANGUO_CH001_012_LABELS_EN,
  ...SANGUO_CH013_024_LABELS_EN,
  ...SANGUO_CH025_036_LABELS_EN,
  ...SANGUO_CH037_048_LABELS_EN,
  ...SANGUO_CH049_060_LABELS_EN,
  ...SANGUO_CH061_072_LABELS_EN,
  ...SANGUO_CH073_084_LABELS_EN,
  ...SANGUO_CH085_096_LABELS_EN,
  ...SANGUO_CH097_108_LABELS_EN,
  ...SANGUO_CH109_120_LABELS_EN,
};

export const SANGUO_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  ...SANGUO_CH001_012_STATIC_STANDARDS_EN,
  ...SANGUO_CH001_012_ANIM_STANDARDS_EN,
  ...SANGUO_CH013_024_STATIC_STANDARDS_EN,
  ...SANGUO_CH013_024_ANIM_STANDARDS_EN,
  ...SANGUO_CH025_036_STATIC_STANDARDS_EN,
  ...SANGUO_CH025_036_ANIM_STANDARDS_EN,
  ...SANGUO_CH037_048_STATIC_STANDARDS_EN,
  ...SANGUO_CH037_048_ANIM_STANDARDS_EN,
  ...SANGUO_CH049_060_STATIC_STANDARDS_EN,
  ...SANGUO_CH049_060_ANIM_STANDARDS_EN,
  ...SANGUO_CH061_072_STATIC_STANDARDS_EN,
  ...SANGUO_CH061_072_ANIM_STANDARDS_EN,
  ...SANGUO_CH073_084_STATIC_STANDARDS_EN,
  ...SANGUO_CH073_084_ANIM_STANDARDS_EN,
  ...SANGUO_CH085_096_STATIC_STANDARDS_EN,
  ...SANGUO_CH085_096_ANIM_STANDARDS_EN,
  ...SANGUO_CH097_108_STATIC_STANDARDS_EN,
  ...SANGUO_CH097_108_ANIM_STANDARDS_EN,
  ...SANGUO_CH109_120_STATIC_STANDARDS_EN,
  ...SANGUO_CH109_120_ANIM_STANDARDS_EN,
};
