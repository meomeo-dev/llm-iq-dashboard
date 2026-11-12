/** 内置题库英文标准索引与自定义题目的展示回退。 */

import type { LocalizedStandardEntry } from "../types";
import { PELICAN_STANDARDS_EN } from "../bank/benchmarks/pelican/display-en";
import { SEPTEMBER_STANDARDS_EN } from "../bank/benchmarks/2026-09/display-en";
import { FOUNDATIONS_STANDARDS_EN } from "../bank/engineering/foundations/display-en";
import { ENGINEERING_SINGLE_STANDARDS_EN } from "../bank/engineering/single/display-en";
import {
  FRONTIER_VISUAL_STANDARDS_EN,
} from "../bank/engineering/frontier-visual/display-en";
import {
  HONGLOU_SUITE_STANDARDS_EN,
  HONGLOU_STANDARDS_EN,
} from "../bank/literature/honglou/display-en";
import {
  SANGUO_SUITE_STANDARDS_EN,
  SANGUO_STANDARDS_EN,
} from "../bank/literature/sanguo/display-en";
import {
  SHUIHU_SUITE_STANDARDS_EN,
  SHUIHU_STANDARDS_EN,
} from "../bank/literature/shuihu/display-en";
import {
  XIYOU_SUITE_STANDARDS_EN,
  XIYOU_STANDARDS_EN,
} from "../bank/literature/xiyou/display-en";
import {
  LANDMARK_SUITE_STANDARDS_EN,
  STANDARDS_LANDMARKS_EN,
} from "../bank/landmarks/display-en";
import { FE_AI_STANDARDS_EN } from "../bank/engineering/fe-ai/display-en";
import { FE_SEMI_STANDARDS_EN } from "../bank/engineering/fe-semi/display-en";
import { FE_QUANTUM_STANDARDS_EN } from "../bank/engineering/fe-quantum/display-en";
import { FE_BIO_STANDARDS_EN } from "../bank/engineering/fe-bio/display-en";
import { FE_ENERGY_STANDARDS_EN } from "../bank/engineering/fe-energy/display-en";
import { FE_AERO_STANDARDS_EN } from "../bank/engineering/fe-aero/display-en";
import { FE_META_STANDARDS_EN } from "../bank/engineering/fe-meta/display-en";
import { FE_NEURO_STANDARDS_EN } from "../bank/engineering/fe-neuro/display-en";
import { VFX_SIM_STANDARDS_EN } from "../bank/visual-effects/vfx-sim/display-en";
import { VFX_OPTICS_STANDARDS_EN } from "../bank/visual-effects/vfx-optics/display-en";
import { VFX_GEOM_STANDARDS_EN } from "../bank/visual-effects/vfx-geom/display-en";
import { VFX_SCIVIS_STANDARDS_EN } from "../bank/visual-effects/vfx-scivis/display-en";
import { VFX_MOTION_STANDARDS_EN } from "../bank/visual-effects/vfx-motion/display-en";
import { VFX_SYS_STANDARDS_EN } from "../bank/visual-effects/vfx-sys/display-en";

export const STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  ...PELICAN_STANDARDS_EN,
  ...SEPTEMBER_STANDARDS_EN,
  ...FOUNDATIONS_STANDARDS_EN,
  ...ENGINEERING_SINGLE_STANDARDS_EN,
  ...FRONTIER_VISUAL_STANDARDS_EN,
  ...HONGLOU_SUITE_STANDARDS_EN,
  ...HONGLOU_STANDARDS_EN,
  ...SANGUO_SUITE_STANDARDS_EN,
  ...SANGUO_STANDARDS_EN,
  ...SHUIHU_SUITE_STANDARDS_EN,
  ...SHUIHU_STANDARDS_EN,
  ...XIYOU_SUITE_STANDARDS_EN,
  ...XIYOU_STANDARDS_EN,
  ...LANDMARK_SUITE_STANDARDS_EN,
  ...STANDARDS_LANDMARKS_EN,
  ...FE_AI_STANDARDS_EN,
  ...FE_SEMI_STANDARDS_EN,
  ...FE_QUANTUM_STANDARDS_EN,
  ...FE_BIO_STANDARDS_EN,
  ...FE_ENERGY_STANDARDS_EN,
  ...FE_AERO_STANDARDS_EN,
  ...FE_META_STANDARDS_EN,
  ...FE_NEURO_STANDARDS_EN,
  ...VFX_SIM_STANDARDS_EN,
  ...VFX_OPTICS_STANDARDS_EN,
  ...VFX_GEOM_STANDARDS_EN,
  ...VFX_SCIVIS_STANDARDS_EN,
  ...VFX_MOTION_STANDARDS_EN,
  ...VFX_SYS_STANDARDS_EN,
};

const PHRASE_REPLACEMENTS: ReadonlyArray<readonly [RegExp, string]> = [
  [/核心考点与鉴别维度/g, "Core Dimension & Discriminators"],
  [/一票否决/g, "automatic veto"],
  [/纯静态死图/g, "static non-animated output"],
  [/严禁任何 script 脚本/g, "strictly zero <script> tags"],
  [/首尾无缝对接/g, "seamless loop closure"],
  [/有效动量/g, "effective motion amplitude"],
  [/语法错误/g, "XML syntax errors"],
];

/**
 * 对未收录进内置英文表的自定义题目标准做安全回退转换。
 */
export function translateTechnicalTextToEn(
  text: string,
  englishTitle?: string,
): string {
  let out = text;
  for (const [pattern, replacement] of PHRASE_REPLACEMENTS) {
    out = out.replace(pattern, replacement);
  }
  if (/[\u4e00-\u9fff]/.test(out) && englishTitle) {
    const formulas = out.match(/\$\$[\s\S]+?\$\$|\$[^$]+\$/g) ?? [];
    if (formulas.length > 0) {
      return `${englishTitle} — Quantitative invariants: ${formulas.join(" ; ")}`;
    }
  }
  return out;
}
