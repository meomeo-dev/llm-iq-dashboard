/**
 * jsdom 29 不带类型声明，@types/jsdom 只有 28 与 30 两条线；此处只声明评审静态层与测试用到的最小面。
 * 放在 src/ 下：容器镜像不含 test/，而 src/core/judge 在生产构建里就要用它。
 * 退出条件：本机与 CI 的 Node ≥ 22.22.2 后改装 jsdom 30 + @types/jsdom 30，删除本文件。
 */
declare module "jsdom" {
  export class JSDOM {
    constructor(html?: string);
    readonly window: Window & typeof globalThis;
  }
}
