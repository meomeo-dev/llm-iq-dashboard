import type { LocalizedStandardEntry } from "../../../types";
import { HONGLOU_CH001_012_ANIM_STANDARDS_EN } from "./ch001-012-anim-en";
import {
  HONGLOU_CH001_012_LABELS_EN,
  HONGLOU_CH001_012_STATIC_STANDARDS_EN,
} from "./ch001-012-en";
import { HONGLOU_CH013_024_ANIM_STANDARDS_EN } from "./ch013-024-anim-en";
import {
  HONGLOU_CH013_024_LABELS_EN,
  HONGLOU_CH013_024_STATIC_STANDARDS_EN,
} from "./ch013-024-en";
import { HONGLOU_CH025_036_ANIM_STANDARDS_EN } from "./ch025-036-anim-en";
import {
  HONGLOU_CH025_036_LABELS_EN,
  HONGLOU_CH025_036_STATIC_STANDARDS_EN,
} from "./ch025-036-en";
import { HONGLOU_CH037_048_ANIM_STANDARDS_EN } from "./ch037-048-anim-en";
import {
  HONGLOU_CH037_048_LABELS_EN,
  HONGLOU_CH037_048_STATIC_STANDARDS_EN,
} from "./ch037-048-en";
import { HONGLOU_CH049_060_ANIM_STANDARDS_EN } from "./ch049-060-anim-en";
import {
  HONGLOU_CH049_060_LABELS_EN,
  HONGLOU_CH049_060_STATIC_STANDARDS_EN,
} from "./ch049-060-en";
import { HONGLOU_CH061_072_ANIM_STANDARDS_EN } from "./ch061-072-anim-en";
import {
  HONGLOU_CH061_072_LABELS_EN,
  HONGLOU_CH061_072_STATIC_STANDARDS_EN,
} from "./ch061-072-en";
import { HONGLOU_CH073_084_ANIM_STANDARDS_EN } from "./ch073-084-anim-en";
import {
  HONGLOU_CH073_084_LABELS_EN,
  HONGLOU_CH073_084_STATIC_STANDARDS_EN,
} from "./ch073-084-en";
import { HONGLOU_CH085_096_ANIM_STANDARDS_EN } from "./ch085-096-anim-en";
import {
  HONGLOU_CH085_096_LABELS_EN,
  HONGLOU_CH085_096_STATIC_STANDARDS_EN,
} from "./ch085-096-en";
import { HONGLOU_CH097_108_ANIM_STANDARDS_EN } from "./ch097-108-anim-en";
import {
  HONGLOU_CH097_108_LABELS_EN,
  HONGLOU_CH097_108_STATIC_STANDARDS_EN,
} from "./ch097-108-en";
import { HONGLOU_CH109_120_ANIM_STANDARDS_EN } from "./ch109-120-anim-en";
import {
  HONGLOU_CH109_120_LABELS_EN,
  HONGLOU_CH109_120_STATIC_STANDARDS_EN,
} from "./ch109-120-en";

export const HONGLOU_SUITE_LABELS_EN: Readonly<Record<string, string>> = {
  "honglou-v1": "Dream of the Red Chamber · Chapter Scenes",
  "honglou-anim-v1": "Dream of the Red Chamber · Animated Chapter Scenes",
};

export const HONGLOU_SUITE_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "honglou-v1": {
    coreKey: "Dream of the Red Chamber Classical Poetic Imagery & Refined Attire/Garden Aesthetics",
    groundTruth:
      "Faithfully depicts the poetic classical scene from Dream of the Red Chamber (e.g., Daiyu entering Rongguo Mansion, Daiyu burying fallen blossoms with hoe and silk pouch, Qingwen tearing folding fans, Granny Liu touring Grand View Garden, Baoqin standing in snow holding red plum blossoms) with refined classical palette.",
    evaluationCriteria:
      "1. Poetic details: Key symbolic props (flower-burial mound, folding fans, red plum cloak in snow, burning poems) are accurately rendered; 2. Classical grace: Architectural framing and character attire reflect Grand View Garden aesthetics.",
  },
  "honglou-anim-v1": {
    coreKey: "Dream of the Red Chamber Poetic Atmosphere & Pure Inline Petal/Snow/Breeze Animation",
    groundTruth:
      "Faithfully captures the poetic space of Grand View Garden with continuous, smooth inline SVG animation (drifting flower petals, fluttering butterflies, flickering candle flames, falling snow) and strictly well-formed XML.",
    evaluationCriteria:
      "1. Poetic particle & breeze motion: Drifting blossoms, snowflakes, and rising smoke move gently and seamlessly; 2. Classical aesthetics: Refined gongbi-inspired brushwork and classical costume silhouettes; 3. XML compliance: Zero XML parse errors and zero <script> tags.",
  },
};

export const HONGLOU_LABELS_EN: Readonly<Record<string, string>> = {
  ...HONGLOU_CH001_012_LABELS_EN,
  ...HONGLOU_CH013_024_LABELS_EN,
  ...HONGLOU_CH025_036_LABELS_EN,
  ...HONGLOU_CH037_048_LABELS_EN,
  ...HONGLOU_CH049_060_LABELS_EN,
  ...HONGLOU_CH061_072_LABELS_EN,
  ...HONGLOU_CH073_084_LABELS_EN,
  ...HONGLOU_CH085_096_LABELS_EN,
  ...HONGLOU_CH097_108_LABELS_EN,
  ...HONGLOU_CH109_120_LABELS_EN,
};

export const HONGLOU_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  ...HONGLOU_CH001_012_STATIC_STANDARDS_EN,
  ...HONGLOU_CH001_012_ANIM_STANDARDS_EN,
  ...HONGLOU_CH013_024_STATIC_STANDARDS_EN,
  ...HONGLOU_CH013_024_ANIM_STANDARDS_EN,
  ...HONGLOU_CH025_036_STATIC_STANDARDS_EN,
  ...HONGLOU_CH025_036_ANIM_STANDARDS_EN,
  ...HONGLOU_CH037_048_STATIC_STANDARDS_EN,
  ...HONGLOU_CH037_048_ANIM_STANDARDS_EN,
  ...HONGLOU_CH049_060_STATIC_STANDARDS_EN,
  ...HONGLOU_CH049_060_ANIM_STANDARDS_EN,
  ...HONGLOU_CH061_072_STATIC_STANDARDS_EN,
  ...HONGLOU_CH061_072_ANIM_STANDARDS_EN,
  ...HONGLOU_CH073_084_STATIC_STANDARDS_EN,
  ...HONGLOU_CH073_084_ANIM_STANDARDS_EN,
  ...HONGLOU_CH085_096_STATIC_STANDARDS_EN,
  ...HONGLOU_CH085_096_ANIM_STANDARDS_EN,
  ...HONGLOU_CH097_108_STATIC_STANDARDS_EN,
  ...HONGLOU_CH097_108_ANIM_STANDARDS_EN,
  ...HONGLOU_CH109_120_STATIC_STANDARDS_EN,
  ...HONGLOU_CH109_120_ANIM_STANDARDS_EN,
};
