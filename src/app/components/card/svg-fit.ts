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

function readLength(value: string | null): number | null {
  if (value === null || value.trim().endsWith("%")) return null;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}
