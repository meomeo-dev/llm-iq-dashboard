/**
 * 聚合全部业务域的双语字典。
 */

import type { Locale } from "../types";
import { enCommon, zhCNCommon, type CommonMessages } from "./common";
import { enConfig, zhCNConfig, type ConfigMessages } from "./config";
import { enPair, zhCNPair, type PairMessages } from "./pair";
import { enToolbar, zhCNToolbar, type ToolbarMessages } from "./toolbar";
import { enViewer, zhCNViewer, type ViewerMessages } from "./viewer";

export type {
  CommonMessages,
  ToolbarMessages,
  ViewerMessages,
  ConfigMessages,
  PairMessages,
};

export interface Messages {
  common: CommonMessages;
  toolbar: ToolbarMessages;
  viewer: ViewerMessages;
  config: ConfigMessages;
  pair: PairMessages;
}

export const zhCNMessages: Messages = {
  common: zhCNCommon,
  toolbar: zhCNToolbar,
  viewer: zhCNViewer,
  config: zhCNConfig,
  pair: zhCNPair,
};

export const enMessages: Messages = {
  common: enCommon,
  toolbar: enToolbar,
  viewer: enViewer,
  config: enConfig,
  pair: enPair,
};

export function getMessages(locale: Locale): Messages {
  return locale === "zh-CN" ? zhCNMessages : enMessages;
}
