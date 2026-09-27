/**
 * 给内联 SVG 的 id 加唯一前缀。
 *
 * 同一文档内 id 全局共享，`fill="url(#skyGrad)"` 解析到第一个同名元素；模型常用
 * 相同的 id 名，多张作品同时挂载时会串用彼此的渐变与滤镜。
 *
 * 先给每个 id 加前缀，再改写引用：`url(#x)` 形式的属性值、`href="#x"` 与 <style>
 * 中的 `url(#x)`；<style> 中以 `#x` 作选择器的写法不改写。逐个 id 精确匹配字符串，
 * 不用正则。
 */

let scopeCounter = 0;

/** 引用 id 的 url() 写法：无引号、单引号、双引号 */
const URL_FORMS = [(id: string) => `url(#${id})`, (id: string) => `url('#${id}')`, (id: string) => `url("#${id}")`];

const HREF_ATTRIBUTES = ["href", "xlink:href"];

export function scopeSvgIds(svg: SVGElement): SVGElement {
  scopeCounter += 1;
  const prefix = `pb${scopeCounter}-`;

  const renamed = new Map<string, string>();
  for (const element of svg.querySelectorAll("[id]")) {
    const scoped = `${prefix}${element.id}`;
    renamed.set(element.id, scoped);
    element.id = scoped;
  }
  if (renamed.size === 0) return svg;

  for (const element of [svg, ...svg.querySelectorAll("*")]) {
    rewriteAttributes(element, renamed);
    if (element.tagName.toLowerCase() === "style" && element.textContent !== null) {
      element.textContent = rewriteUrls(element.textContent, renamed);
    }
  }
  return svg;
}

function rewriteAttributes(element: Element, renamed: ReadonlyMap<string, string>): void {
  for (const attribute of [...element.attributes]) {
    if (HREF_ATTRIBUTES.includes(attribute.name)) {
      const target = renamed.get(attribute.value.slice(1));
      if (attribute.value.startsWith("#") && target !== undefined) {
        element.setAttribute(attribute.name, `#${target}`);
      }
      continue;
    }
    if (attribute.value.includes("url(")) {
      element.setAttribute(attribute.name, rewriteUrls(attribute.value, renamed));
    }
  }
}

function rewriteUrls(text: string, renamed: ReadonlyMap<string, string>): string {
  let result = text;
  for (const [original, scoped] of renamed) {
    for (const form of URL_FORMS) {
      result = result.split(form(original)).join(form(scoped));
    }
  }
  return result;
}
