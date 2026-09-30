/**
 * AI 语义层的提示词与回答解析（ACR-020）。两次提问：先盲描述（只给帧序联系表，不提题目），
 * 再按 C5–C8 逐项判定（给全部联系表、题目原文与口径，要求只回 JSON）。
 */

import type { ContactSheet, CriterionSpec, RubricSpec } from "./schema";

export const AI_PROMPT_VERSION = 1;

/** 盲描述回答的存档长度上限 */
const BLIND_MAX_CHARS = 600;

export function blindPrompt(sheet: ContactSheet): string {
  return [
    `当前目录里有一张图片 ${sheet.file}：一行 ${sheet.frameCount} 帧，是同一段动画按时间顺序取的样，帧与帧之间有灰色间隔，每帧左上角标了帧号。`,
    "请用读文件工具按上面的文件名直接读取这张图片（不要运行任何命令、不要列目录），然后用一两句话描述画面的主体是什么、在做什么动作。只描述你看到的，不要猜测题目，不要输出其他内容。",
  ].join("\n");
}

/** 逐项判定：题目原文、联系表清单、各标准的口径与分值，回答限定为 JSON */
export function judgePrompt(promptText: string, sheet: ContactSheet, rubric: RubricSpec): string {
  const criteria = aiCriteria(rubric);
  const manifest = [
    `- ${sheet.file}：帧序联系表，一行 ${sheet.frameCount} 帧整幅画面，取样时刻 ${sheet.sampleTimesMs.join(" / ")} ms`,
    ...sheet.details.map((d) => `- ${d.file}：「${d.subject}」细节联系表，放大 ${d.zoom} 倍，与帧序表同帧号；主要服务 ${d.criteria.join("、")}`),
  ];
  const standards = criteria.map((c) => `- ${c.id}「${c.title}」满分 ${c.maxScore}：${c.standard}`);
  const example = `{"criteria":[${criteria.map((c) => `{"id":"${c.id}","score":<0 到 ${c.maxScore} 的整数>,"reason":"<一句话，引用帧号或部位>"}`).join(",")}]}`;
  return [
    "你是评审。当前目录里的图片是一件 SVG 动画作品的联系表，请用读文件工具按下面清单里的文件名逐张读取（不要运行任何命令、不要列目录），再按标准逐项打分。",
    "",
    "题目原文：",
    promptText,
    "",
    "图片清单：",
    ...manifest,
    "",
    "评分标准（每项独立打分，分数是 0 到满分之间的整数；口径里写了零分情形）：",
    ...standards,
    "",
    "回答只输出一个 JSON 对象，不要 Markdown 代码块、不要解释，格式如下：",
    example,
  ].join("\n");
}

export function aiCriteria(rubric: RubricSpec): CriterionSpec[] {
  return rubric.criteria.filter((c) => c.source === "ai");
}

export interface AiScore {
  id: string;
  score: number;
  reason: string;
}

export type ParsedJudgement = { ok: true; scores: AiScore[] } | { ok: false; reason: string };

/** 从回答里取出第一个 JSON 对象；每条标准都要有整数分与理由，分数夹在 0 与满分之间 */
export function parseJudgeReply(text: string, rubric: RubricSpec): ParsedJudgement {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) return { ok: false, reason: "回答里没有 JSON 对象" };
  let parsed: unknown;
  try {
    parsed = JSON.parse(text.slice(start, end + 1));
  } catch (cause) {
    return { ok: false, reason: `JSON 解析失败：${cause instanceof Error ? cause.message : String(cause)}` };
  }
  const items = (parsed as { criteria?: unknown }).criteria;
  if (!Array.isArray(items)) return { ok: false, reason: "缺少 criteria 数组" };
  const scores: AiScore[] = [];
  for (const spec of aiCriteria(rubric)) {
    const item = items.find((entry) => (entry as { id?: unknown })?.id === spec.id) as { score?: unknown; reason?: unknown } | undefined;
    if (!item) return { ok: false, reason: `缺少 ${spec.id}` };
    const raw = typeof item.score === "number" ? item.score : Number(item.score);
    if (!Number.isFinite(raw)) return { ok: false, reason: `${spec.id} 的 score 不是数字` };
    const reason = typeof item.reason === "string" ? item.reason.trim() : "";
    if (reason === "") return { ok: false, reason: `${spec.id} 缺少 reason` };
    scores.push({ id: spec.id, score: Math.min(spec.maxScore, Math.max(0, Math.round(raw))), reason });
  }
  return { ok: true, scores };
}

export function trimBlindDescription(text: string): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  return cleaned.length > BLIND_MAX_CHARS ? `${cleaned.slice(0, BLIND_MAX_CHARS)}…` : cleaned;
}

const PELICAN_WORDS = /鹈鹕|pelican|喙|beak|喉囊|pouch/i;

/** 盲描述里没认出鹈鹕或长喙鸟时，C6 上限减半 */
export function blindRecognizedPelican(description: string): boolean {
  return PELICAN_WORDS.test(description);
}
