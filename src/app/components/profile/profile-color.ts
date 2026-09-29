/** 上游名字散列到固定调色板：同一上游在首页、弹窗、大图页与导出图上颜色一致 */

export const PROFILE_PALETTE: readonly string[] = [
  "#f28b5b", "#5bb3f2", "#9b7bf2", "#5bd9a3", "#f2c94c", "#f25b8b", "#4cc9f0", "#c8a15b",
];

export function profileColor(name: string): string {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.codePointAt(0)!) >>> 0;
  return PROFILE_PALETTE[hash % PROFILE_PALETTE.length]!;
}
