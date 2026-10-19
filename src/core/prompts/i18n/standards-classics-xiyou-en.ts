/**
 * 《西游记》逐回候选的英文标签与英文评判标准汇总，分卷文件在 classics-xiyou/ 下，
 * 每卷对应一批逐回考证的回目，由中文题库逐条翻译。
 */

import type { LocalizedStandardEntry } from "./standards-single-en";
import {
  XIYOU_CH001_020_LABELS_EN,
  XIYOU_CH001_020_STANDARDS_EN,
} from "./classics-xiyou/ch001-020-en";
import {
  XIYOU_CH021_040_LABELS_EN,
  XIYOU_CH021_040_STANDARDS_EN,
} from "./classics-xiyou/ch021-040-en";
import {
  XIYOU_CH041_060_LABELS_EN,
  XIYOU_CH041_060_STANDARDS_EN,
} from "./classics-xiyou/ch041-060-en";
import {
  XIYOU_CH061_080_LABELS_EN,
  XIYOU_CH061_080_STANDARDS_EN,
} from "./classics-xiyou/ch061-080-en";
import {
  XIYOU_CH081_100_LABELS_EN,
  XIYOU_CH081_100_STANDARDS_EN,
} from "./classics-xiyou/ch081-100-en";

/** 静态候选 id → 英文标签；动态候选由 localizeCandidateLabel 追加 “(Animated)” */
export const XIYOU_LABELS_EN: Readonly<Record<string, string>> = {
  ...XIYOU_CH001_020_LABELS_EN,
  ...XIYOU_CH021_040_LABELS_EN,
  ...XIYOU_CH041_060_LABELS_EN,
  ...XIYOU_CH061_080_LABELS_EN,
  ...XIYOU_CH081_100_LABELS_EN,
};

/** 静态与动态候选 id → 英文评判标准 */
export const XIYOU_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  ...XIYOU_CH001_020_STANDARDS_EN,
  ...XIYOU_CH021_040_STANDARDS_EN,
  ...XIYOU_CH041_060_STANDARDS_EN,
  ...XIYOU_CH061_080_STANDARDS_EN,
  ...XIYOU_CH081_100_STANDARDS_EN,
};
