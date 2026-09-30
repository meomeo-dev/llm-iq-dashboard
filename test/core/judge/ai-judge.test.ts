/** AI 语义层：裁判挑选、准入、回答解析与并分（不调用 CLI） */

import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { aiEligible, applyAiResults, carryAiResults, pickJudges } from "@/core/judge/ai-judge";
import { blindPrompt, judgePrompt, parseJudgeReply } from "@/core/judge/ai-prompt";
import { ANIMATED_PELICAN_RUBRIC, type ContactSheet } from "@/core/judge/schema";
import { judgeStatic } from "@/core/judge/static-judge";

const subject = {
  runId: "20260930T000000Z", attemptKey: "k", promptId: "animated-pelican-v1",
  cli: "codex", model: "m", effort: "high", svgFile: "k.svg",
};
const GOOD = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <g id="rear" transform="translate(100 200)"><circle r="40"/>
    <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="2s" repeatCount="indefinite" additive="sum"/></g>
  <g id="front" transform="translate(300 200)"><circle r="40"/>
    <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="2s" repeatCount="indefinite" additive="sum"/></g>
  <g id="crank"><circle cx="200" cy="190" r="12"/>
    <animateTransform attributeName="transform" type="rotate" from="0 200 190" to="360 200 190" dur="1s" repeatCount="indefinite"/></g>
  <g id="leg"><path d="M0 0"><animate attributeName="d" values="M0 0;M0 5" dur="1s" repeatCount="indefinite"/></path></g>
</svg>`;
const sheet: ContactSheet = {
  file: "k.sheet.png", layout: "row", frameCount: 8, frameSize: 320, periodMs: 2000,
  sampleTimesMs: [0, 250, 500, 750, 1000, 1250, 1500, 1750],
  details: [{ kind: "crank", subject: "脚踏与脚", file: "k.sheet.crank.png", region: { x: 0, y: 0, width: 100, height: 100 }, zoom: 4, criteria: ["C2", "C4", "C7"] }],
};
const config = { enabled: true, timeoutMs: 1000, judges: [
  { cli: "codex" as const, model: "gpt-5.5", effort: "medium" as const },
  { cli: "claude" as const, model: "claude-sonnet-5-5", effort: "medium" as const },
] };
const usage = { tokens: { input: 40000, output: 8000 }, reasoningTokens: 7000, serviceTier: "standard" as const, reportedCostUsd: null };
const actor = { id: "claude/claude-sonnet-5-5@medium", judgedAt: "2026-09-30T00:00:02Z", durationMs: 1, rawFile: "k.judge-ai.txt", usage, asks: 2 };

describe("AI 层", () => {
  test("裁判厂商须与作品不同：codex 作品跳过 codex 裁判，其余按配置顺序备选", () => {
    assert.deepEqual(pickJudges(config, "codex").map((j) => j.cli), ["claude"]);
    assert.deepEqual(pickJudges(config, "agy").map((j) => j.cli), ["codex", "claude"]);
    assert.deepEqual(pickJudges({ ...config, judges: [config.judges[0]!] }, "codex"), []);
  });

  test("准入：闸门未过、已判定、没联系表都不进 AI 层", () => {
    const base = judgeStatic({ source: GOOD, subject, rubric: ANIMATED_PELICAN_RUBRIC });
    assert.match(aiEligible(base) ?? "", /没有联系表/);
    assert.equal(aiEligible({ ...base, contactSheet: sheet }), null);
    const broken = judgeStatic({ source: "<svg", subject, rubric: ANIMATED_PELICAN_RUBRIC });
    assert.match(aiEligible(broken) ?? "", /闸门/);
  });

  test("提示词：盲描述不提题目；判定提示列出图片清单与 C5–C8 口径", () => {
    assert.doesNotMatch(blindPrompt(sheet), /鹈鹕|自行车/);
    const prompt = judgePrompt("画一只鹈鹕骑车", sheet, ANIMATED_PELICAN_RUBRIC);
    assert.match(prompt, /k\.sheet\.crank\.png/);
    assert.match(prompt, /C8「踩踏动作可信」满分 20/);
    assert.doesNotMatch(prompt, /C4「/);
  });

  test("解析：取回答里的 JSON，分数夹到范围内，缺项或缺理由即失败", () => {
    const text = "好的，结果如下：\n```json\n{\"criteria\":[{\"id\":\"C5\",\"score\":12,\"reason\":\"第 1 帧车架齐全\"},{\"id\":\"C6\",\"score\":99,\"reason\":\"长喙\"},{\"id\":\"C7\",\"score\":-3,\"reason\":\"悬空\"},{\"id\":\"C8\",\"score\":\"14.6\",\"reason\":\"3–6 帧腿随脚踏\"}]}\n```";
    const parsed = parseJudgeReply(text, ANIMATED_PELICAN_RUBRIC);
    assert.ok(parsed.ok);
    assert.deepEqual(parsed.scores.map((s) => s.score), [12, 15, 0, 15]);
    assert.equal(parseJudgeReply("没有 json", ANIMATED_PELICAN_RUBRIC).ok, false);
    assert.equal(parseJudgeReply("{\"criteria\":[{\"id\":\"C5\",\"score\":1,\"reason\":\"x\"}]}", ANIMATED_PELICAN_RUBRIC).ok, false);
    assert.equal(parseJudgeReply("{\"criteria\":[{\"id\":\"C5\",\"score\":1},{\"id\":\"C6\",\"score\":1,\"reason\":\"a\"},{\"id\":\"C7\",\"score\":1,\"reason\":\"a\"},{\"id\":\"C8\",\"score\":1,\"reason\":\"a\"}]}", ANIMATED_PELICAN_RUBRIC).ok, false);
  });

  test("并分：AI 分填进 C5–C8，总分与结论重算；盲描述没认出鹈鹕时 C6 上限减半", () => {
    const base = { ...judgeStatic({ source: GOOD, subject, rubric: ANIMATED_PELICAN_RUBRIC }), contactSheet: sheet };
    const scores = [
      { id: "C5", score: 15, reason: "齐全" }, { id: "C6", score: 15, reason: "长喙" },
      { id: "C7", score: 18, reason: "坐稳" }, { id: "C8", score: 16, reason: "跟随" },
    ];
    const online = applyAiResults(base, ANIMATED_PELICAN_RUBRIC, scores, "一只鹈鹕在骑自行车", actor);
    assert.equal(online.total.verdict, "online");
    assert.equal(online.total.score, base.total.score + 64);
    assert.equal(online.judges.at(-1)?.kind, "ai");
    assert.deepEqual(online.judges.at(-1)?.usage, usage);
    assert.equal(online.judges.at(-1)?.asks, 2);
    assert.equal(online.blindDescription, "一只鹈鹕在骑自行车");
    const blind = applyAiResults(base, ANIMATED_PELICAN_RUBRIC, scores, "一只鸭子在骑车", actor);
    assert.equal(blind.criteria.find((c) => c.id === "C6")?.score, 7);
    assert.match(blind.criteria.find((c) => c.id === "C6")?.reason ?? "", /上限减半/);
  });

  test("重跑代码层：同版本下带上旧记录的 AI 分与裁判；版本不同或没有 AI 分时不带", () => {
    const base = { ...judgeStatic({ source: GOOD, subject, rubric: ANIMATED_PELICAN_RUBRIC }), contactSheet: sheet };
    const scores = [
      { id: "C5", score: 15, reason: "齐全" }, { id: "C6", score: 15, reason: "长喙" },
      { id: "C7", score: 18, reason: "坐稳" }, { id: "C8", score: 16, reason: "跟随" },
    ];
    const judged = applyAiResults(base, ANIMATED_PELICAN_RUBRIC, scores, "一只鹈鹕在骑自行车", actor);
    const fresh = judgeStatic({ source: GOOD, subject, rubric: ANIMATED_PELICAN_RUBRIC });
    const carried = carryAiResults(fresh, judged);
    assert.equal(carried.total.verdict, "online");
    assert.equal(carried.total.score, judged.total.score);
    assert.deepEqual(carried.judges.map((j) => j.kind), ["code", "ai"]);
    assert.equal(carried.blindDescription, "一只鹈鹕在骑自行车");
    assert.equal(carryAiResults(fresh, null), fresh);
    assert.equal(carryAiResults(fresh, base), fresh);
    const older = { ...judged, rubric: { ...judged.rubric, version: 2 } };
    assert.equal(carryAiResults(fresh, older).total.verdict, "pending");
  });
});
