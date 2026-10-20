/**
 * 《三国演义》逐回候选的英文标签与英文评判标准汇总，分卷文件在 classics-sanguo/ 下，
 * 每卷对应一批逐回考证的回目，由中文题库逐条翻译。
 */

import type { LocalizedStandardEntry } from "./standards-single-en";
import {
  SANGUO_CH001_012_LABELS_EN,
  SANGUO_CH001_012_STANDARDS_EN,
} from "./classics-sanguo/ch001-012-en";
import {
  SANGUO_CH013_024_LABELS_EN,
  SANGUO_CH013_024_STANDARDS_EN,
} from "./classics-sanguo/ch013-024-en";
import {
  SANGUO_CH025_036_LABELS_EN,
  SANGUO_CH025_036_STANDARDS_EN,
} from "./classics-sanguo/ch025-036-en";
import {
  SANGUO_CH037_048_LABELS_EN,
  SANGUO_CH037_048_STANDARDS_EN,
} from "./classics-sanguo/ch037-048-en";
import {
  SANGUO_CH049_060_LABELS_EN,
  SANGUO_CH049_060_STANDARDS_EN,
} from "./classics-sanguo/ch049-060-en";
import {
  SANGUO_CH061_072_LABELS_EN,
  SANGUO_CH061_072_STANDARDS_EN,
} from "./classics-sanguo/ch061-072-en";
import {
  SANGUO_CH073_084_LABELS_EN,
  SANGUO_CH073_084_STANDARDS_EN,
} from "./classics-sanguo/ch073-084-en";
import {
  SANGUO_CH085_096_LABELS_EN,
  SANGUO_CH085_096_STANDARDS_EN,
} from "./classics-sanguo/ch085-096-en";

/** 静态候选 id → 英文标签；动态候选由 localizeCandidateLabel 追加 “(Animated)” */
export const SANGUO_LABELS_EN: Readonly<Record<string, string>> = {
  ...SANGUO_CH001_012_LABELS_EN,
  ...SANGUO_CH013_024_LABELS_EN,
  ...SANGUO_CH025_036_LABELS_EN,
  ...SANGUO_CH037_048_LABELS_EN,
  ...SANGUO_CH049_060_LABELS_EN,
  ...SANGUO_CH061_072_LABELS_EN,
  ...SANGUO_CH073_084_LABELS_EN,
  ...SANGUO_CH085_096_LABELS_EN,
};

/** 静态与动态候选 id → 英文评判标准 */
export const SANGUO_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  ...SANGUO_CH001_012_STANDARDS_EN,
  ...SANGUO_CH013_024_STANDARDS_EN,
  ...SANGUO_CH025_036_STANDARDS_EN,
  ...SANGUO_CH037_048_STANDARDS_EN,
  ...SANGUO_CH049_060_STANDARDS_EN,
  ...SANGUO_CH061_072_STANDARDS_EN,
  ...SANGUO_CH073_084_STANDARDS_EN,
  ...SANGUO_CH085_096_STANDARDS_EN,
};
