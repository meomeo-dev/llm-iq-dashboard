/**
 * 题目与候选集客观参考标准（PromptStandard）的英文映射聚合入口与自定义题回退转换器。
 */

import type { PromptStandard } from "../../prompt/types";
import { STANDARDS_FE_PART1_EN } from "./standards-fe-part1-en";
import { STANDARDS_FE_PART2_EN } from "./standards-fe-part2-en";
import { STANDARDS_LANDMARKS_EN } from "./standards-landmarks-en";
import {
  type LocalizedStandardEntry,
  STANDARDS_SINGLE_EN,
} from "./standards-single-en";
import { STANDARDS_SUITES_EN } from "./standards-suites-en";
import { STANDARDS_VFX_PART1_EN } from "./standards-vfx-part1-en";
import { STANDARDS_VFX_PART2_EN } from "./standards-vfx-part2-en";

export type { LocalizedStandardEntry };

export const STANDARDS_EN: Readonly<
  Record<string, Omit<PromptStandard, "referenceSource">>
> = {
  ...STANDARDS_SINGLE_EN,
  ...STANDARDS_SUITES_EN,
  ...STANDARDS_LANDMARKS_EN,
  ...STANDARDS_FE_PART1_EN,
  ...STANDARDS_FE_PART2_EN,
  ...STANDARDS_VFX_PART1_EN,
  ...STANDARDS_VFX_PART2_EN,
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
