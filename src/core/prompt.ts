/**
 * 提示词登记表（prompt registry），出处见 docs/benchmark-provenance.md。
 *
 * 内置条目分两类，均为 `immutable: true`（不带变量、不可编辑、不可被自定义条目覆盖）：
 * 1. Simon Willison 原文（classic-v1、upgraded-v2）：逐字照录，与外部公开数据对齐。
 * 2. 四大名著候选集（shuihu / xiyou / sanguo / honglou）：逐回名场面，
 *    每条是完整提示词，按轮换周期洗牌抽取。画面描述为本仓库自撰。
 *
 * 抽中的候选 id 与最终文本写入运行记录，同一候选下的结果彼此可比。改动任何内置
 * 条目的文本都会使既有结果失去可比性。
 */

export type {
  PromptCandidate,
  PromptStandard,
  PromptSpec,
  PromptLifecycle,
} from "./prompt/types";

export { promptLifecycle } from "./prompt/lifecycle";

export * from "./prompt/bank";

export {
  buildRegistry,
  listPrompts,
  resolvePrompt,
  resolvePromptStandard,
} from "./prompt/registry";

export * from "./prompt-schema";
