/**
 * 配置加载与校验入口（Facade）。配置定义调度节奏与被测矩阵（policy）；调用与落盘机制在
 * adapters/ 与 store.ts。校验尽早失败（fail fast），启动时一次报出全部问题。
 */

export type {
  DataRepoConfig,
  ScheduleConfig,
  ScheduleRhythm,
  RunConfig,
  RetentionConfig,
  AppConfig,
} from "./config/types";

export { hasRhythm } from "./config/types";
export { loadConfig } from "./config/loader";
