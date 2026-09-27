/**
 * 在 Node 中为 svg-sanitize.ts 注入 jsdom 的 DOMParser 与 document 两个全局。
 * 选 jsdom 而非 happy-dom：后者解析 SVG 与 importNode 存在偏差，会让用例误判。
 */

import { JSDOM } from "jsdom";

export function installDom(): void {
  const { window } = new JSDOM("<!doctype html><html><body></body></html>");
  Object.assign(globalThis, { DOMParser: window.DOMParser, document: window.document });
}
