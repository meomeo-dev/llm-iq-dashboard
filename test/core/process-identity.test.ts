/**
 * 跨进程认定进程：pid 加启动标记。容器重启后 pid 会重新分配，只看 pid 会把同号的
 * 无关进程误认为上一个容器登记的调度器。
 */

import assert from "node:assert/strict";
import { test } from "node:test";
import { isProcessAlive, parseStartTime, processStartMark } from "@/core/process-identity";

test("从 /proc/<pid>/stat 取第 22 字段 starttime；进程名可含空格与括号", () => {
  const fields = Array.from({ length: 50 }, (_, index) => String(index + 3));
  assert.equal(parseStartTime(`42 (node) ${fields.join(" ")}`), "22");
  assert.equal(parseStartTime(`42 (tsx (worker) x) ${fields.join(" ")}`), "22");
  assert.equal(parseStartTime("garbage"), null);
});

test("pid 活着但启动标记对不上时视为另一个进程", () => {
  const mark = processStartMark(process.pid);
  assert.equal(isProcessAlive(process.pid), true);
  assert.equal(isProcessAlive(process.pid, mark), true);
  // 非 Linux 无 /proc，标记为 null，只能比对 pid，跳过此断言
  if (mark !== null) assert.equal(isProcessAlive(process.pid, `${mark}0`), false);
});

test("不存在的 pid 视为不在", () => {
  // 2^22 以上的 pid 在 macOS / Linux 默认配置下不会被分配
  assert.equal(isProcessAlive(2 ** 22 + 12345), false);
});
