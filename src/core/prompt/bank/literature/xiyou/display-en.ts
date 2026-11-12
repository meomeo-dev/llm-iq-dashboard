import type { LocalizedStandardEntry } from "../../../types";
import { XIYOU_CH001_010_ANIM_STANDARDS_EN } from "./ch001-010-anim-en";
import {
  XIYOU_CH001_010_LABELS_EN,
  XIYOU_CH001_010_STATIC_STANDARDS_EN,
} from "./ch001-010-en";
import { XIYOU_CH011_020_ANIM_STANDARDS_EN } from "./ch011-020-anim-en";
import {
  XIYOU_CH011_020_LABELS_EN,
  XIYOU_CH011_020_STATIC_STANDARDS_EN,
} from "./ch011-020-en";
import { XIYOU_CH021_030_ANIM_STANDARDS_EN } from "./ch021-030-anim-en";
import {
  XIYOU_CH021_030_LABELS_EN,
  XIYOU_CH021_030_STATIC_STANDARDS_EN,
} from "./ch021-030-en";
import { XIYOU_CH031_040_ANIM_STANDARDS_EN } from "./ch031-040-anim-en";
import {
  XIYOU_CH031_040_LABELS_EN,
  XIYOU_CH031_040_STATIC_STANDARDS_EN,
} from "./ch031-040-en";
import { XIYOU_CH041_050_ANIM_STANDARDS_EN } from "./ch041-050-anim-en";
import {
  XIYOU_CH041_050_LABELS_EN,
  XIYOU_CH041_050_STATIC_STANDARDS_EN,
} from "./ch041-050-en";
import { XIYOU_CH051_060_ANIM_STANDARDS_EN } from "./ch051-060-anim-en";
import {
  XIYOU_CH051_060_LABELS_EN,
  XIYOU_CH051_060_STATIC_STANDARDS_EN,
} from "./ch051-060-en";
import { XIYOU_CH061_070_ANIM_STANDARDS_EN } from "./ch061-070-anim-en";
import {
  XIYOU_CH061_070_LABELS_EN,
  XIYOU_CH061_070_STATIC_STANDARDS_EN,
} from "./ch061-070-en";
import { XIYOU_CH071_080_ANIM_STANDARDS_EN } from "./ch071-080-anim-en";
import {
  XIYOU_CH071_080_LABELS_EN,
  XIYOU_CH071_080_STATIC_STANDARDS_EN,
} from "./ch071-080-en";
import { XIYOU_CH081_090_ANIM_STANDARDS_EN } from "./ch081-090-anim-en";
import {
  XIYOU_CH081_090_LABELS_EN,
  XIYOU_CH081_090_STATIC_STANDARDS_EN,
} from "./ch081-090-en";
import { XIYOU_CH091_100_ANIM_STANDARDS_EN } from "./ch091-100-anim-en";
import {
  XIYOU_CH091_100_LABELS_EN,
  XIYOU_CH091_100_STATIC_STANDARDS_EN,
} from "./ch091-100-en";

export const XIYOU_SUITE_LABELS_EN: Readonly<Record<string, string>> = {
  "xiyou-v1": "Journey to the West · Chapter Scenes",
  "xiyou-anim-v1": "Journey to the West · Animated Chapter Scenes",
};

export const XIYOU_SUITE_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "xiyou-v1": {
    coreKey: "Journey to the West Mythological Composition & Iconic Magical Artifacts",
    groundTruth:
      "Faithfully depicts the original-text scene of the drawn chapter of Journey to the West (e.g., the Stone Monkey entering Water-Curtain Cave, taking the Golden-Hooped Rod from the Dragon Palace, somersaulting in the Buddha's palm, the Corpse Demon tricking the Tang Monk three times, borrowing the Plantain Fan at the Flaming Mountains); character appearance and attire follow the novel's stages without later adaptation designs, with expressive characters and atmosphere.",
    evaluationCriteria:
      "1. Magical artifacts: Iconic treasures (Golden-Hooped Rod, Plantain Fan) are accurately represented; 2. Scene recognizability: The setting and character attire match the chapter's original text.",
  },
  "xiyou-anim-v1": {
    coreKey: "Journey to the West Mythological Artifact Aura & Pure Inline Transform/Motion Animation",
    groundTruth:
      "Faithfully depicts the original-text scene of the drawn chapter of Journey to the West and its magical artifacts and powers with continuous, smooth inline SVG animation (scaling Golden-Hooped Rod, billowing Samadhi flames, sweeping Plantain Fan gales) and strictly well-formed XML.",
    evaluationCriteria:
      "1. Magical VFX animation: Flowing divine auras, rolling flames, and artifact transformations animate smoothly; 2. Character iconography: Monkey King and celestial/demonic figures are clearly recognizable; 3. XML compliance: Zero XML parse errors and zero <script> tags.",
  },
};

export const XIYOU_LABELS_EN: Readonly<Record<string, string>> = {
  ...XIYOU_CH001_010_LABELS_EN,
  ...XIYOU_CH011_020_LABELS_EN,
  ...XIYOU_CH021_030_LABELS_EN,
  ...XIYOU_CH031_040_LABELS_EN,
  ...XIYOU_CH041_050_LABELS_EN,
  ...XIYOU_CH051_060_LABELS_EN,
  ...XIYOU_CH061_070_LABELS_EN,
  ...XIYOU_CH071_080_LABELS_EN,
  ...XIYOU_CH081_090_LABELS_EN,
  ...XIYOU_CH091_100_LABELS_EN,
};

export const XIYOU_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  ...XIYOU_CH001_010_STATIC_STANDARDS_EN,
  ...XIYOU_CH001_010_ANIM_STANDARDS_EN,
  ...XIYOU_CH011_020_STATIC_STANDARDS_EN,
  ...XIYOU_CH011_020_ANIM_STANDARDS_EN,
  ...XIYOU_CH021_030_STATIC_STANDARDS_EN,
  ...XIYOU_CH021_030_ANIM_STANDARDS_EN,
  ...XIYOU_CH031_040_STATIC_STANDARDS_EN,
  ...XIYOU_CH031_040_ANIM_STANDARDS_EN,
  ...XIYOU_CH041_050_STATIC_STANDARDS_EN,
  ...XIYOU_CH041_050_ANIM_STANDARDS_EN,
  ...XIYOU_CH051_060_STATIC_STANDARDS_EN,
  ...XIYOU_CH051_060_ANIM_STANDARDS_EN,
  ...XIYOU_CH061_070_STATIC_STANDARDS_EN,
  ...XIYOU_CH061_070_ANIM_STANDARDS_EN,
  ...XIYOU_CH071_080_STATIC_STANDARDS_EN,
  ...XIYOU_CH071_080_ANIM_STANDARDS_EN,
  ...XIYOU_CH081_090_STATIC_STANDARDS_EN,
  ...XIYOU_CH081_090_ANIM_STANDARDS_EN,
  ...XIYOU_CH091_100_STATIC_STANDARDS_EN,
  ...XIYOU_CH091_100_ANIM_STANDARDS_EN,
};
