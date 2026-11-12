import type { LocalizedStandardEntry } from "../../../types";
import { SHUIHU_CH001_012_ANIM_STANDARDS_EN } from "./ch001-012-anim-en";
import {
  SHUIHU_CH001_012_LABELS_EN,
  SHUIHU_CH001_012_STATIC_STANDARDS_EN,
} from "./ch001-012-en";
import { SHUIHU_CH013_024_ANIM_STANDARDS_EN } from "./ch013-024-anim-en";
import {
  SHUIHU_CH013_024_LABELS_EN,
  SHUIHU_CH013_024_STATIC_STANDARDS_EN,
} from "./ch013-024-en";
import { SHUIHU_CH025_036_ANIM_STANDARDS_EN } from "./ch025-036-anim-en";
import {
  SHUIHU_CH025_036_LABELS_EN,
  SHUIHU_CH025_036_STATIC_STANDARDS_EN,
} from "./ch025-036-en";
import { SHUIHU_CH037_048_ANIM_STANDARDS_EN } from "./ch037-048-anim-en";
import {
  SHUIHU_CH037_048_LABELS_EN,
  SHUIHU_CH037_048_STATIC_STANDARDS_EN,
} from "./ch037-048-en";
import { SHUIHU_CH049_060_ANIM_STANDARDS_EN } from "./ch049-060-anim-en";
import {
  SHUIHU_CH049_060_LABELS_EN,
  SHUIHU_CH049_060_STATIC_STANDARDS_EN,
} from "./ch049-060-en";
import { SHUIHU_CH061_072_ANIM_STANDARDS_EN } from "./ch061-072-anim-en";
import {
  SHUIHU_CH061_072_LABELS_EN,
  SHUIHU_CH061_072_STATIC_STANDARDS_EN,
} from "./ch061-072-en";
import { SHUIHU_CH073_084_ANIM_STANDARDS_EN } from "./ch073-084-anim-en";
import {
  SHUIHU_CH073_084_LABELS_EN,
  SHUIHU_CH073_084_STATIC_STANDARDS_EN,
} from "./ch073-084-en";
import { SHUIHU_CH085_096_ANIM_STANDARDS_EN } from "./ch085-096-anim-en";
import {
  SHUIHU_CH085_096_LABELS_EN,
  SHUIHU_CH085_096_STATIC_STANDARDS_EN,
} from "./ch085-096-en";
import { SHUIHU_CH097_108_ANIM_STANDARDS_EN } from "./ch097-108-anim-en";
import {
  SHUIHU_CH097_108_LABELS_EN,
  SHUIHU_CH097_108_STATIC_STANDARDS_EN,
} from "./ch097-108-en";
import { SHUIHU_CH109_120_ANIM_STANDARDS_EN } from "./ch109-120-anim-en";
import {
  SHUIHU_CH109_120_LABELS_EN,
  SHUIHU_CH109_120_STATIC_STANDARDS_EN,
} from "./ch109-120-en";

export const SHUIHU_SUITE_LABELS_EN: Readonly<Record<string, string>> = {
  "shuihu-v1": "Water Margin · Chapter Scenes",
  "shuihu-anim-v1": "Water Margin · Animated Chapter Scenes",
};

export const SHUIHU_SUITE_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "shuihu-v1": {
    coreKey: "Water Margin Original-Text Episodes & Character Attire",
    groundTruth:
      "Faithfully depicts the original-text scene of the drawn chapter of Water Margin (e.g., uprooting the weeping willow, the Mountain Spirit Temple in the blizzard, capturing the birthday gifts by wit, fighting the tiger on Jingyang Ridge, the raid on the Jiangzhou execution ground, hearing the tide at Liuhe Temple); character appearance and attire follow the novel's description for that stage of the story without later opera or screen designs; fights are shown only at the moment before a blow, with no gore or nudity.",
    evaluationCriteria:
      "1. Plot moment and objects: The picture shows the moment in the chapter's original text, with accurate objects (e.g., the large stone by the door of the Mountain Spirit Temple, the broken half staff and white felt hat on Jingyang Ridge, the characters tattooed on an exile's face); 2. Character identity: Appearance and attire fit the Song-dynasty setting and the chapter's description, and named characters are recognizable.",
  },
  "shuihu-anim-v1": {
    coreKey: "Water Margin Original-Text Scenes & Pure Inline Environmental Animation",
    groundTruth:
      "Faithfully depicts the original-text scene of the drawn chapter of Water Margin with continuous, smooth inline SVG animation of things that move in reality (wind and snow, firelight and smoke, waves and reeds, banners, lamps and candles, willow branches); one-time actions are held as a frozen moment, figures do not drift as a whole, and XML is strictly well-formed.",
    evaluationCriteria:
      "1. Environmental motion: The listed animations loop smoothly and naturally, driven by SMIL or inline CSS; 2. Historical fidelity: Song-dynasty attire and weaponry match the chapter's description in the novel; 3. XML compliance: Zero XML parse errors, no duplicate attributes, and zero <script> tags.",
  },
};

export const SHUIHU_LABELS_EN: Readonly<Record<string, string>> = {
  ...SHUIHU_CH001_012_LABELS_EN,
  ...SHUIHU_CH013_024_LABELS_EN,
  ...SHUIHU_CH025_036_LABELS_EN,
  ...SHUIHU_CH037_048_LABELS_EN,
  ...SHUIHU_CH049_060_LABELS_EN,
  ...SHUIHU_CH061_072_LABELS_EN,
  ...SHUIHU_CH073_084_LABELS_EN,
  ...SHUIHU_CH085_096_LABELS_EN,
  ...SHUIHU_CH097_108_LABELS_EN,
  ...SHUIHU_CH109_120_LABELS_EN,
};

export const SHUIHU_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  ...SHUIHU_CH001_012_STATIC_STANDARDS_EN,
  ...SHUIHU_CH001_012_ANIM_STANDARDS_EN,
  ...SHUIHU_CH013_024_STATIC_STANDARDS_EN,
  ...SHUIHU_CH013_024_ANIM_STANDARDS_EN,
  ...SHUIHU_CH025_036_STATIC_STANDARDS_EN,
  ...SHUIHU_CH025_036_ANIM_STANDARDS_EN,
  ...SHUIHU_CH037_048_STATIC_STANDARDS_EN,
  ...SHUIHU_CH037_048_ANIM_STANDARDS_EN,
  ...SHUIHU_CH049_060_STATIC_STANDARDS_EN,
  ...SHUIHU_CH049_060_ANIM_STANDARDS_EN,
  ...SHUIHU_CH061_072_STATIC_STANDARDS_EN,
  ...SHUIHU_CH061_072_ANIM_STANDARDS_EN,
  ...SHUIHU_CH073_084_STATIC_STANDARDS_EN,
  ...SHUIHU_CH073_084_ANIM_STANDARDS_EN,
  ...SHUIHU_CH085_096_STATIC_STANDARDS_EN,
  ...SHUIHU_CH085_096_ANIM_STANDARDS_EN,
  ...SHUIHU_CH097_108_STATIC_STANDARDS_EN,
  ...SHUIHU_CH097_108_ANIM_STANDARDS_EN,
  ...SHUIHU_CH109_120_STATIC_STANDARDS_EN,
  ...SHUIHU_CH109_120_ANIM_STANDARDS_EN,
};
