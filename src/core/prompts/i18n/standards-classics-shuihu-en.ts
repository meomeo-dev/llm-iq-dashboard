/**
 * 《水浒传》逐回候选的英文标签与英文评判标准汇总，分卷文件在 classics-shuihu/ 下，
 * 每卷对应一批逐回考证的回目，由中文题库逐条翻译。
 */

import type { LocalizedStandardEntry } from "./standards-single-en";
import {
  SHUIHU_CH001_012_LABELS_EN,
  SHUIHU_CH001_012_STANDARDS_EN,
} from "./classics-shuihu/ch001-012-en";
import {
  SHUIHU_CH013_024_LABELS_EN,
  SHUIHU_CH013_024_STANDARDS_EN,
} from "./classics-shuihu/ch013-024-en";

/** 静态候选 id → 英文标签；动态候选由 localizeCandidateLabel 追加 “(Animated)” */
export const SHUIHU_LABELS_EN: Readonly<Record<string, string>> = {
  ...SHUIHU_CH001_012_LABELS_EN,
  ...SHUIHU_CH013_024_LABELS_EN,
};

/** 静态与动态候选 id → 英文评判标准 */
export const SHUIHU_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  ...SHUIHU_CH001_012_STANDARDS_EN,
  ...SHUIHU_CH013_024_STANDARDS_EN,
};
