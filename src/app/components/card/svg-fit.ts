/**
 * 让 SVG 随框缩放：缺 viewBox 时按 width / height 补出，再把显示尺寸交给框。
 * 百分比尺寸推不出坐标系，保持原样。
 */
export function fitToFrame(svg: SVGElement): SVGElement {
  if (!svg.hasAttribute("viewBox")) {
    const width = readLength(svg.getAttribute("width"));
    const height = readLength(svg.getAttribute("height"));
    if (width !== null && height !== null) {
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    }
  }
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  if (!svg.hasAttribute("preserveAspectRatio")) {
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  }
  return svg;
}

/** viewBox 的宽高；取值不合法或宽高非正时返回 null */
export function viewBoxSize(viewBox: string | null): { width: number; height: number } | null {
  if (viewBox === null) return null;
  const parts = viewBox.trim().split(/[\s,]+/).map(Number);
  if (parts.length !== 4 || !parts.every(Number.isFinite)) return null;
  const [, , width = 0, height = 0] = parts;
  return width > 0 && height > 0 ? { width, height } : null;
}

function readLength(value: string | null): number | null {
  if (value === null || value.trim().endsWith("%")) return null;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}
