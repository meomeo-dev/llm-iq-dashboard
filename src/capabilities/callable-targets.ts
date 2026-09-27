/**
 * 可调用的目标 = 配置里的目标 ∩ 当前能调用的 CLI。
 *
 * 配置不随 CLI 的安装或登录状态改动，可选范围按就绪缓存现算：missing / signed-out
 * 的 CLI 的目标不列出。缓存里没有记录的 CLI 视为可调用，每轮发起前另有现场预检。
 */

import type { CliKind } from "../core/types";
import { blocksCalls } from "./readiness";
import type { ReadinessSnapshot } from "./readiness-cache";

export interface UnavailableCli {
  cli: CliKind;
  /** 被拦下的原因类别：没装或没登录 */
  state: "missing" | "signed-out";
  /** 配置里属于这家 CLI、未列出的目标数 */
  targets: number;
  /** 就绪检查给出的原因，含安装或登录命令 */
  detail: string;
}

export interface CallableSplit<T> {
  callable: T[];
  unavailable: UnavailableCli[];
}

export function splitByReadiness<T extends { cli: CliKind }>(
  targets: readonly T[],
  snapshot: ReadinessSnapshot,
): CallableSplit<T> {
  const callable: T[] = [];
  const hidden = new Map<CliKind, UnavailableCli>();
  for (const target of targets) {
    const record = snapshot[target.cli];
    if (record === undefined || !blocksCalls(record)) {
      callable.push(target);
      continue;
    }
    const state = record.state === "missing" ? "missing" : "signed-out";
    const entry = hidden.get(target.cli) ?? { cli: target.cli, state, targets: 0, detail: record.detail ?? "" };
    entry.targets += 1;
    hidden.set(target.cli, entry);
  }
  return { callable, unavailable: [...hidden.values()] };
}
