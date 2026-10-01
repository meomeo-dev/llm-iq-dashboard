/**
 * AI 层的定位阶段（ACR-021）：裁判看首帧整幅画面给出四类部位的像素框，程序经根元素的屏幕矩阵换算到
 * viewBox，按 ACR-019 的造框规则重切 8 帧细节表，替换代码层几何推断的表。任何一步失败都退回原表。
 */

import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { runDir } from "../paths";
import { locatePrompt, parseLocateReply, type LocateKind, type PixelBox } from "./ai-prompt";
import { squarePlan, type DetailPlan } from "./contact-sheet";
import { captureLocateFrame, recaptureDetails, type LocateFrame } from "./render-judge";
import type { Matrix2D } from "./render-page";
import type { ContactSheetDetail, Judgement } from "./schema";

/** 给裁判看的首帧边长：比联系表的 320 大一倍，小部位的框才给得准 */
export const LOCATE_FRAME_SIZE = 640;

/** 裁判框外扩多少再切：框是「刚好框住」，留点边读图才看得出部位与周围的关系 */
const LOCATE_MARGIN = 1.15;

/** 四类部位的表名与服务标准，与 contact-sheet.ts 的 detailPlans 一致 */
const LOCATE_PLAN: Record<LocateKind, { subject: string; criteria: string[] }> = {
  pelican: { subject: "鹈鹕整体", criteria: ["C6", "C7", "C8"] },
  head: { subject: "头与喙", criteria: ["C6"] },
  crank: { subject: "脚踏与脚", criteria: ["C2", "C4", "C7"] },
  saddle: { subject: "座垫与臀", criteria: ["C7"] },
};

/** 清单顺序：与代码层一致，车轮殿后 */
const KIND_ORDER = ["pelican", "head", "crank", "saddle", "wheel-left", "wheel-right"] as const;

/** 定位阶段要用的提问能力：由 ai-judge 的 JudgeAsker 提供 */
export interface LocateAsker {
  workdir: string;
  ask(promptText: string, readableFiles: string[]): Promise<{ text: string; error: string | null; timedOut: boolean }>;
}

export type LocateOutcome = { ok: true; judgement: Judgement } | { ok: false; reason: string };

/** 截首帧 → 问框 → 换算 → 重切；成功时返回换了细节表清单的记录 */
export async function relocateDetails(judgement: Judgement, asker: LocateAsker): Promise<LocateOutcome> {
  const { runId, attemptKey, svgFile } = judgement.subject;
  if (!judgement.contactSheet) return { ok: false, reason: "没有帧序表" };
  const source = await readFile(join(runDir(runId), svgFile), "utf8");
  const captured = await captureLocateFrame(source, LOCATE_FRAME_SIZE);
  if (!captured.ok) return { ok: false, reason: `首帧截图失败：${captured.reason}` };
  const file = `${attemptKey}.frame1.png`;
  await writeFile(join(asker.workdir, file), captured.frame.png);
  const reply = await asker.ask(locatePrompt(file, LOCATE_FRAME_SIZE), [file]);
  if (reply.error || reply.timedOut) return { ok: false, reason: `定位调用失败：${reply.error ?? "超时"}` };
  const parsed = parseLocateReply(reply.text, LOCATE_FRAME_SIZE);
  if (!parsed.ok) return { ok: false, reason: `定位回答解析失败：${parsed.reason}` };
  const plans = locatedPlans(judgement.contactSheet.details, parsed.boxes, captured.frame);
  const recut = await recaptureDetails(source, judgement, plans);
  if (!recut.ok) return { ok: false, reason: `重切细节表失败：${recut.reason}` };
  return { ok: true, judgement: { ...judgement, contactSheet: { ...judgement.contactSheet, details: recut.details } } };
}

/**
 * 把裁判给的像素框换算成取景框并并进清单：裁判给了的类别替换代码层的框并标 locatedBy = ai，
 * 没给的保留原表（含车轮）；按固定类别顺序排。
 */
export function locatedPlans(
  existing: readonly ContactSheetDetail[], boxes: Partial<Record<LocateKind, PixelBox>>, frame: Pick<LocateFrame, "stage" | "matrix">,
): DetailPlan[] {
  const { stage, matrix } = frame;
  const shortSide = Math.min(stage.viewBox.width, stage.viewBox.height);
  const byKind = new Map<string, DetailPlan>();
  for (const detail of existing) {
    const { file: _file, ...plan } = detail;
    byKind.set(detail.kind, { ...plan, locatedBy: plan.locatedBy ?? "code" });
  }
  for (const kind of Object.keys(boxes) as LocateKind[]) {
    const box = pixelBoxToUser(boxes[kind]!, matrix);
    const center = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    const wanted = Math.max(box.width, box.height) * LOCATE_MARGIN;
    const spec = LOCATE_PLAN[kind];
    byKind.set(kind, { ...squarePlan(kind, spec.subject, center, wanted, shortSide, stage, spec.criteria), locatedBy: "ai" });
  }
  return KIND_ORDER.flatMap((kind) => byKind.get(kind) ?? []);
}

/** 像素框经屏幕矩阵的逆换算回用户坐标；矩阵可能带旋转，所以四角都换算再取包围盒 */
export function pixelBoxToUser(box: PixelBox, matrix: Matrix2D): PixelBox {
  const inverse = invert(matrix);
  const corners = [
    [box.x, box.y], [box.x + box.width, box.y], [box.x, box.y + box.height], [box.x + box.width, box.y + box.height],
  ].map(([px, py]) => applyMatrix(inverse, px!, py!));
  const xs = corners.map((p) => p.x);
  const ys = corners.map((p) => p.y);
  // 取两位小数：矩阵求逆带浮点误差，记录里的取景框不该写成 199.99999999999994
  return {
    x: round2(Math.min(...xs)), y: round2(Math.min(...ys)),
    width: round2(Math.max(...xs) - Math.min(...xs)), height: round2(Math.max(...ys) - Math.min(...ys)),
  };
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function invert([a, b, c, d, e, f]: Matrix2D): Matrix2D {
  const det = a * d - b * c;
  return [d / det, -b / det, -c / det, a / det, (c * f - d * e) / det, (b * e - a * f) / det];
}

function applyMatrix([a, b, c, d, e, f]: Matrix2D, x: number, y: number): { x: number; y: number } {
  return { x: a * x + c * y + e, y: b * x + d * y + f };
}
