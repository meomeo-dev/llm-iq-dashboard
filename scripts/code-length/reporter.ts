/**
 * 报告格式化模块（中文控制台格式与 JSON 输出）。
 */

import type { LengthCheckReport, LengthViolation } from "./types";

function formatViolationItem(v: LengthViolation, index: number): string {
  const kind = v.type === "file" ? "[文件]" : `[函数 ${v.symbol}]`;
  const status = v.exempted ? `[已豁免: ${v.reason ?? ""}]` : "[超标违规]";
  const diff = v.lines - v.standardLimit;
  return `  ${index}. ${kind} ${v.file}：${v.lines} 行 (超出 ${diff} 行，硬上限 ${v.standardLimit} 行) ${status}`;
}

export function formatHumanReport(report: LengthCheckReport): string {
  const lines: string[] = [];
  lines.push("========================================");
  lines.push("           代码长度门禁检查报告");
  lines.push("========================================");
  lines.push(`扫描文件总数: ${report.totalFiles} 个`);
  lines.push(
    `超标总计: ${report.violations.length} 项 (未豁免: ${report.unexemptedViolations.length}，已豁免: ${report.exemptedViolations.length})`,
  );
  lines.push("");

  if (report.violations.length > 0) {
    lines.push("【超出量排序清单】");
    report.violations.forEach((v, idx) => {
      lines.push(formatViolationItem(v, idx + 1));
    });
    lines.push("");
  }

  if (report.expiredAllowlist.length > 0) {
    lines.push("【提示：以下豁免项已达标，建议从 allowlist 中移除】");
    for (const exp of report.expiredAllowlist) {
      const sym = exp.symbol ? ` -> ${exp.symbol}` : "";
      lines.push(
        `  - ${exp.path}${sym}: 当前 ${exp.actual} 行 <= 硬上限 ${exp.standardLimit} 行`,
      );
    }
    lines.push("");
  }

  lines.push("----------------------------------------");
  if (report.success) {
    lines.push("[通过] 长度门禁检查通过！所有超标项均在豁免清单内或已达标。");
  } else {
    lines.push(
      `[失败] 发现 ${report.unexemptedViolations.length} 项未豁免的超标代码，请按要求拆分！`,
    );
  }
  lines.push("========================================");

  return lines.join("\n");
}

export function formatJsonReport(report: LengthCheckReport): string {
  return JSON.stringify(report, null, 2);
}
