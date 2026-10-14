/**
 * 国际化（i18n）模块统一入口。
 */

export {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  SUPPORTED_LOCALES,
  formatText,
  isLocale,
  resolveLocale,
  type Locale,
} from "./types";

export {
  enMessages,
  getMessages,
  zhCNMessages,
  type CommonMessages,
  type ConfigMessages,
  type Messages,
  type PairMessages,
  type ToolbarMessages,
  type ViewerMessages,
} from "./messages";

export {
  I18nProvider,
  LanguageSwitch,
  useI18n,
  type I18nContextValue,
} from "./context";
