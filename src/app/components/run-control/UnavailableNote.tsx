"use client";

import type { UnavailableCli } from "@/capabilities/callable-targets";

/**
 * 范围清单下的一行说明：哪几家 CLI 未安装或未登录，其模型暂不可选。登录方法见页首
 * 提示；登录后重新打开面板即可选。
 */
export function UnavailableNote({ unavailable }: { unavailable: readonly UnavailableCli[] }) {
  if (unavailable.length === 0) return null;
  const detail = unavailable.map((item) => item.detail).join("\n");
  const text = unavailable.map((item) => `${item.cli} ${item.state === "missing" ? "未安装" : "未登录"}`).join("，");
  return (
    <p className="run-once-unavailable" title={detail}>
      {text}，其模型暂不可选
    </p>
  );
}
