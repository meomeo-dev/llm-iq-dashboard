import test from "node:test";
import assert from "node:assert/strict";
import { extractErrorMessage, formatErrorMessage } from "@/app/pair/pair-form-model";

test("pair-form: initial status is idle", () => {
  const initialStatus = { kind: "idle" };
  assert.strictEqual(initialStatus.kind, "idle");
});

test("extractErrorMessage: extracts error or default", () => {
  assert.strictEqual(extractErrorMessage({ error: "口令无效" }), "口令无效");
  assert.strictEqual(extractErrorMessage({}), "配对失败");
  assert.strictEqual(extractErrorMessage(null), "配对失败");
});

test("formatErrorMessage: handles Error and string causes", () => {
  assert.strictEqual(formatErrorMessage(new Error("网络故障")), "网络故障");
  assert.strictEqual(formatErrorMessage("连接超时"), "连接超时");
});
