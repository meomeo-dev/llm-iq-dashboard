"use client";

import type { UnavailableCli } from "@/capabilities/callable-targets";
import { useI18n } from "@/i18n";
import { localizeReadinessDetail } from "./run-once-profiles";

/**
 * 范围清单下的一行说明：哪几家 CLI 未安装或未登录，其模型暂不可选。登录方法见页首
 * 提示；登录后重新打开面板即可选。
 */
export function UnavailableNote({ unavailable }: { unavailable: readonly UnavailableCli[] }) {
  const { locale } = useI18n();
  const isEn = locale === "en";
  if (unavailable.length === 0) return null;
  const detail = unavailable.map((item) => localizeReadinessDetail(item.detail, locale)).join("\n");
  const text = unavailable
    .map((item) =>
      isEn
        ? `${item.cli} ${item.state === "missing" ? "not installed" : "not signed in"}`
        : `${item.cli} ${item.state === "missing" ? "未安装" : "未登录"}`,
    )
    .join(isEn ? ", " : "，");
  return (
    <p className="run-once-unavailable" title={detail}>
      {isEn ? `${text}; its models are currently unavailable` : `${text}，其模型暂不可选`}
    </p>
  );
}
