/** 内置题库的英文标题索引与双语标题提取。 */

import type { Locale } from "../../../i18n/types";
import {
  HONGLOU_LABELS_EN,
  HONGLOU_SUITE_LABELS_EN,
} from "../bank/literature/honglou/display-en";
import {
  SANGUO_LABELS_EN,
  SANGUO_SUITE_LABELS_EN,
} from "../bank/literature/sanguo/display-en";
import {
  SHUIHU_LABELS_EN,
  SHUIHU_SUITE_LABELS_EN,
} from "../bank/literature/shuihu/display-en";
import {
  XIYOU_LABELS_EN,
  XIYOU_SUITE_LABELS_EN,
} from "../bank/literature/xiyou/display-en";
import { PELICAN_LABELS_EN } from "../bank/benchmarks/pelican/display-en";
import { FOUNDATIONS_LABELS_EN } from "../bank/engineering/foundations/display-en";
import {
  LANDMARK_SLUGS_EN,
  LANDMARK_SUITE_LABELS_EN,
} from "../bank/landmarks/display-en";
import { FE_AI_LABELS_EN } from "../bank/engineering/fe-ai/display-en";
import { FE_SEMI_LABELS_EN } from "../bank/engineering/fe-semi/display-en";
import { FE_QUANTUM_LABELS_EN } from "../bank/engineering/fe-quantum/display-en";
import { FE_BIO_LABELS_EN } from "../bank/engineering/fe-bio/display-en";
import { FE_ENERGY_LABELS_EN } from "../bank/engineering/fe-energy/display-en";
import { FE_AERO_LABELS_EN } from "../bank/engineering/fe-aero/display-en";
import { FE_META_LABELS_EN } from "../bank/engineering/fe-meta/display-en";
import { FE_NEURO_LABELS_EN } from "../bank/engineering/fe-neuro/display-en";
import { VFX_SIM_LABELS_EN } from "../bank/visual-effects/vfx-sim/display-en";
import { VFX_OPTICS_LABELS_EN } from "../bank/visual-effects/vfx-optics/display-en";
import { VFX_GEOM_LABELS_EN } from "../bank/visual-effects/vfx-geom/display-en";
import { VFX_SCIVIS_LABELS_EN } from "../bank/visual-effects/vfx-scivis/display-en";
import { VFX_MOTION_LABELS_EN } from "../bank/visual-effects/vfx-motion/display-en";
import { VFX_SYS_LABELS_EN } from "../bank/visual-effects/vfx-sys/display-en";

export { LANDMARK_SLUGS_EN };

export const PROMPT_LABELS_EN: Readonly<Record<string, string>> = {
  ...HONGLOU_SUITE_LABELS_EN,
  ...SANGUO_SUITE_LABELS_EN,
  ...SHUIHU_SUITE_LABELS_EN,
  ...XIYOU_SUITE_LABELS_EN,
  ...PELICAN_LABELS_EN,
  ...FOUNDATIONS_LABELS_EN,
  ...LANDMARK_SUITE_LABELS_EN,
  ...FE_AI_LABELS_EN,
  ...FE_SEMI_LABELS_EN,
  ...FE_QUANTUM_LABELS_EN,
  ...FE_BIO_LABELS_EN,
  ...FE_ENERGY_LABELS_EN,
  ...FE_AERO_LABELS_EN,
  ...FE_META_LABELS_EN,
  ...FE_NEURO_LABELS_EN,
  ...VFX_SIM_LABELS_EN,
  ...VFX_OPTICS_LABELS_EN,
  ...VFX_GEOM_LABELS_EN,
  ...VFX_SCIVIS_LABELS_EN,
  ...VFX_MOTION_LABELS_EN,
  ...VFX_SYS_LABELS_EN,
};

/** 动态版候选的英文标题由 localizeCandidateLabel 追加 Animated 标记。 */
export const CLASSICS_CANDIDATES_EN: Readonly<Record<string, string>> = {
  ...SHUIHU_LABELS_EN,
  ...XIYOU_LABELS_EN,
  ...SANGUO_LABELS_EN,
  ...HONGLOU_LABELS_EN,
};

/**
 * 从 `中文名 (English Name)` 或 `中文名（English Name）` 格式中提取指定语言标题。
 */
export function splitParenthesizedLabel(
  rawLabel: string,
  locale: Locale,
): string | null {
  const trimmed = rawLabel.trim();
  const lastChar = trimmed[trimmed.length - 1];
  if (lastChar !== ")" && lastChar !== "）") return null;
  let depth = 0;
  let openIdx = -1;
  for (let i = trimmed.length - 1; i >= 0; i -= 1) {
    const ch = trimmed[i];
    if (ch === ")" || ch === "）") {
      depth += 1;
    } else if (ch === "(" || ch === "（") {
      depth -= 1;
      if (depth === 0) {
        openIdx = i;
        break;
      }
    }
  }
  if (openIdx <= 0) return null;
  const zhPart = trimmed.slice(0, openIdx).trim();
  const enPart = trimmed.slice(openIdx + 1, trimmed.length - 1).trim();
  if (
    !zhPart ||
    !enPart.includes(" ") ||
    !/^[A-Za-z0-9]/.test(enPart) ||
    /[\u4e00-\u9fff]/.test(enPart)
  ) {
    return null;
  }
  return locale === "en" ? enPart : zhPart;
}

/**
 * 从 FE/VFX 候选题面原文首句提取英文技术标题。
 */
export function extractEnglishFromPromptText(text?: string): string | null {
  if (!text) return null;
  const m = text.match(
    /^Generate an SVG technical visualization of (.+?) (?:using|as) /,
  );
  return m?.[1]?.trim() ?? null;
}
