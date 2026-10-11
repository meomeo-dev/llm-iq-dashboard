/**
 * 把净化后的作品挂进宿主元素的 shadow root，并按 viewBox 比例定盒子尺寸。
 *
 * 样式隔离：内联 SVG 的 <style> 对整个文档生效。一件作品写的
 * `path { vector-effect: non-scaling-stroke }` 会让同页其他作品的描边不随缩放变细，
 * 缩略图里线条按原始粗细画出、整件作品走样；同名的类、@keyframes 也会互相覆盖。
 * shadow root 把作品样式限定在自身子树内，看板样式也进不到作品里。
 *
 * 作品的 `:root` 规则在独立文档里指向作品根元素，内联时指向看板的 <html>；进入
 * shadow root 后 `:root` 匹配不到任何元素，改写为 `:host`，在其上声明的 CSS 变量
 * 经继承照常生效。`@property` 在 shadow root 里不生效（Chrome 只认文档级注册），
 * 这类规则另放进文档 <head>、随作品卸载移除；注册本就是文档全局的，与内联挂载时一致。
 *
 * 裁切：SVG 只按视口（即元素盒子）裁切，不按 viewBox 裁切。盒子与 viewBox 比例不同时，
 * 画在 viewBox 外的内容会露在留白里。有 viewBox 时把盒子定成 viewBox 的比例、按
 * contain 放进框内，框的内容区尺寸经容器查询单位取得（框须声明 container-type: size）。
 */

import { viewBoxSize } from "./svg-fit";

/** 挂载作品；返回卸载时要调用的清理函数（移除提到文档级的 @property 规则） */
export function mountInShadow(host: HTMLElement, svg: SVGElement): () => void {
  const root = host.shadowRoot ?? host.attachShadow({ mode: "open" });
  rewriteRootSelectors(svg);
  sizeToViewBox(svg);
  root.replaceChildren(svg);
  return hoistPropertyRules(svg);
}

/** 须在作品挂进 shadow root 之后调用：<style> 进入文档才有解析好的 sheet */
function hoistPropertyRules(svg: SVGElement): () => void {
  const rules = [...svg.querySelectorAll("style")]
    // 未实现 SVG 样式表的环境（如 jsdom）里 sheet 为 undefined，按无规则处理
    .flatMap((style) => [...(style.sheet?.cssRules ?? [])])
    .map((rule) => rule.cssText)
    .filter((text) => text.startsWith("@property"));
  if (rules.length === 0) return () => {};
  const hoisted = document.createElement("style");
  hoisted.textContent = rules.join("\n");
  document.head.appendChild(hoisted);
  return () => hoisted.remove();
}

function rewriteRootSelectors(svg: SVGElement): void {
  for (const style of svg.querySelectorAll("style")) {
    const text = style.textContent;
    if (text !== null && text.includes(":root")) {
      style.textContent = text.split(":root").join(":host");
    }
  }
}

function sizeToViewBox(svg: SVGElement): void {
  svg.style.setProperty("display", "block");
  const size = viewBoxSize(svg.getAttribute("viewBox"));
  if (size === null) {
    // 推不出比例时铺满框，与 preserveAspectRatio 配合等比缩放，但不裁到 viewBox
    svg.style.setProperty("width", "100%");
    svg.style.setProperty("height", "100%");
    return;
  }
  const ratio = size.width / size.height;
  svg.style.setProperty("width", `min(100cqw, 100cqh * ${ratio})`);
  svg.style.setProperty("height", `min(100cqh, 100cqw / ${ratio})`);
}
