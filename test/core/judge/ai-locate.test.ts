/** 定位阶段（ACR-021）：提示词、像素框解析、矩阵换算与取景框清单合并（不调用 CLI、不开浏览器） */

import assert from "node:assert/strict";
import { test } from "node:test";
import { locatedPlans, pixelBoxToUser } from "@/core/judge/ai-locate";
import { locatePrompt, parseLocateReply } from "@/core/judge/ai-prompt";
import type { ContactSheetDetail } from "@/core/judge/schema";

test("locatePrompt：给文件名与尺寸、列五类部位、禁止跑命令、只要 JSON", () => {
  const prompt = locatePrompt("k.frame1.png", 640);
  assert.match(prompt, /k\.frame1\.png/);
  assert.match(prompt, /640×640/);
  assert.match(prompt, /不要运行任何命令/);
  for (const kind of ["pelican", "head", "saddle", "crank", "handlebar"]) assert.match(prompt, new RegExp(`"kind":"${kind}"`));
  assert.doesNotMatch(prompt, /wheel/);
});

test("parseLocateReply：取 JSON、只认清单里的类别、框夹到图内、过小丢弃、一个都没有即失败", () => {
  const text = '好的：```json\n{"parts":[{"kind":"saddle","box":[300,200,40,30]},{"kind":"wheel-left","box":[0,0,50,50]},{"kind":"head","box":[600,-20,100,60]},{"kind":"crank","box":[10,10,2,2]},{"kind":"pelican","box":["200","100","150","220"]}]}\n```';
  const parsed = parseLocateReply(text, 640);
  assert.ok(parsed.ok);
  assert.deepEqual(parsed.boxes.saddle, { x: 300, y: 200, width: 40, height: 30 });
  assert.deepEqual(parsed.boxes.head, { x: 600, y: 0, width: 40, height: 40 }, "超出右边与上边的部分裁掉");
  assert.equal(parsed.boxes.crank, undefined, "2 像素的框当没找到");
  assert.deepEqual(parsed.boxes.pelican, { x: 200, y: 100, width: 150, height: 220 }, "字符串数字也认");
  assert.equal("wheel-left" in parsed.boxes, false);
  assert.equal(parseLocateReply('{"parts":[]}', 640).ok, false);
  assert.equal(parseLocateReply("没有", 640).ok, false);
});

test("pixelBoxToUser：按屏幕矩阵的逆换算，含 meet 居中留白的平移", () => {
  // viewBox 0 0 800 400 画在 640×640 里：缩放 0.8，纵向留白 (640 − 320) / 2 = 160
  const matrix: [number, number, number, number, number, number] = [0.8, 0, 0, 0.8, 0, 160];
  assert.deepEqual(pixelBoxToUser({ x: 80, y: 240, width: 160, height: 80 }, matrix), { x: 100, y: 100, width: 200, height: 100 });
});

test("locatedPlans：裁判给的类别换成 ai 框并外扩 15%、不小于短边 1/5；没给的保留代码层的表；翅与车把只有裁判给了才有；按固定顺序排", () => {
  const code = (kind: ContactSheetDetail["kind"], subject: string): ContactSheetDetail => ({
    kind, subject, file: `k.sheet.${kind}.png`, region: { x: 0, y: 0, width: 100, height: 100 }, zoom: 8, criteria: ["C7"],
  });
  const existing = [code("pelican", "鹈鹕整体"), code("crank", "脚踏与脚"), code("saddle", "座垫与臀"), code("wheel-left", "左轮"), code("wheel-right", "右轮")];
  const frame = { stage: { viewBox: { x: 0, y: 0, width: 800, height: 400 } }, matrix: [0.8, 0, 0, 0.8, 0, 160] as [number, number, number, number, number, number] };
  const plans = locatedPlans(existing, { saddle: { x: 80, y: 240, width: 160, height: 80 }, head: { x: 400, y: 200, width: 16, height: 16 }, handlebar: { x: 500, y: 180, width: 60, height: 40 } }, frame);
  assert.deepEqual(plans.map((p) => `${p.kind}:${p.locatedBy}`), ["pelican:code", "head:ai", "crank:code", "saddle:ai", "handlebar:ai", "wheel-left:code", "wheel-right:code"]);
  assert.deepEqual(plans.find((p) => p.kind === "handlebar")?.criteria, ["C5", "C9"]);
  assert.equal(locatedPlans(existing, { saddle: { x: 80, y: 240, width: 160, height: 80 } }, frame).some((p) => p.kind === "handlebar"), false);
  const saddle = plans.find((p) => p.kind === "saddle")!;
  assert.deepEqual(saddle.region, { x: 85, y: 35, width: 230, height: 230 }, "中心 (200,150)，边长 200 × 1.15");
  assert.equal(saddle.zoom, 3.5);
  assert.deepEqual(saddle.criteria, ["C7"]);
  const head = plans.find((p) => p.kind === "head")!;
  assert.equal(head.region.width, 80, "20 像素换算成 20 用户单位，不小于短边 400 的 1/5");
  assert.equal("file" in saddle, false, "清单项不带文件名，重切后才有");
});
