#!/usr/bin/env tsx
/**
 * CLI 命令行工具：数据仓同步（sync-data）。
 *
 * 参数：
 *   --repo <path>  数据仓本地路径（缺省读取配置文件 dataRepo.path）
 *   --dry-run      演练模式，任何地方都不写入，仅输出报告
 *   --run <runId>  指定同步的 runId（可重复传入多次）
 *   --push               同步提交后执行 git push
 *   --confirm-published  执行 git fetch 并将已包含在远端的 exported 轮次确认为 published
 *   --json               以 JSON 格式输出结果报告
 *
 * 退出码：
 *   0：成功完成
 *   1：运行出错（配置错误、数据仓工作区不干净、Git 执行失败等）
 *   2：存在被拒绝发布的轮次或内容冲突
 */

import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { configPath } from "../core/paths";
import { loadConfig } from "../core/config";
import {
  confirmPublished,
  syncDataRepo,
  type ConfirmPublishedReport,
  type SyncReport,
} from "../core/sync/sync-orchestrator";

export interface ParsedArgs {
  repoPath?: string;
  dryRun: boolean;
  push: boolean;
  confirmPublished: boolean;
  json: boolean;
  runIds: string[];
}

export function parseCliArgs(args: readonly string[]): ParsedArgs {
  const result: ParsedArgs = {
    dryRun: false,
    push: false,
    confirmPublished: false,
    json: false,
    runIds: [],
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--repo") {
      const next = args[i + 1];
      if (next !== undefined) {
        i += 1;
        result.repoPath = resolve(process.cwd(), next);
      }
    } else if (arg === "--dry-run") {
      result.dryRun = true;
    } else if (arg === "--push") {
      result.push = true;
    } else if (arg === "--confirm-published") {
      result.confirmPublished = true;
    } else if (arg === "--json") {
      result.json = true;
    } else if (arg === "--run") {
      const next = args[i + 1];
      if (next !== undefined) {
        i += 1;
        result.runIds.push(next);
      }
    }
  }

  return result;
}

/** 格式化报告中被拒绝、被脱敏与冲突的异常轮次清单 */
function appendIssueSections(lines: string[], report: SyncReport): void {
  lines.push(`[拒绝发布] ${report.rejected.length} 轮`);
  for (const item of report.rejected) {
    lines.push(`  - ${item.runId}:`);
    for (const r of item.reasons) {
      lines.push(`      * ${r.file}: ${r.reason}`);
    }
  }
  lines.push("");

  lines.push(`[脱敏拦截] ${report.redactions.length} 轮包含脱敏作品`);
  for (const item of report.redactions) {
    lines.push(`  - ${item.runId}:`);
    for (const r of item.redactions) {
      lines.push(`      * ${r.file}: ${r.reason}`);
    }
  }
  lines.push("");

  lines.push(`[冲突] ${report.conflicts.length} 轮`);
  for (const id of report.conflicts) {
    lines.push(`  - ${id}: 目标仓已存在但内容不一致`);
  }
  lines.push("");
}

/** 格式化台账状态变化与 Git 提交结果 */
function appendLedgerAndGitSummary(lines: string[], report: SyncReport): void {
  lines.push("[台账状态变化]");
  lines.push(`  - 新标为 exported: ${report.ledgerTransitions.exported.length} 轮`);
  for (const id of report.ledgerTransitions.exported) {
    lines.push(`      * ${id}`);
  }
  lines.push(`  - 新标为 published: ${report.ledgerTransitions.published.length} 轮`);
  for (const id of report.ledgerTransitions.published) {
    lines.push(`      * ${id}`);
  }
  lines.push("");

  lines.push("----------------------------------------");
  lines.push(`Git 提交: ${report.commit ?? "(无新提交)"}`);
  lines.push(`远程推送: ${report.pushed ? "已推送并校验" : "未推送"}`);
  if (report.error) {
    lines.push(`错误信息: ${report.error}`);
  }
  lines.push("========================================");
}

function formatHumanReport(report: SyncReport, repoPath: string): string {
  const lines: string[] = [];
  lines.push("========================================");
  lines.push("           数据仓同步报告");
  lines.push("========================================");
  lines.push(`模式: ${report.dryRun ? "演练 (dry-run，零写入)" : "实际写入"}`);
  lines.push(`数据仓路径: ${repoPath}`);
  lines.push(`候选轮次总数: ${report.totalCandidates}`);
  lines.push("");

  lines.push(`[成功导出] ${report.exported.length} 轮`);
  for (const id of report.exported) {
    lines.push(`  - ${id}`);
  }
  lines.push("");

  lines.push(`[跳过未处理] ${report.skipped.length} 轮`);
  for (const item of report.skipped) {
    lines.push(`  - ${item.runId}: ${item.reason}`);
  }
  lines.push("");

  appendIssueSections(lines, report);
  appendLedgerAndGitSummary(lines, report);
  return lines.join("\n");
}

function formatHumanConfirmReport(
  report: ConfirmPublishedReport,
  repoPath: string,
): string {
  const lines: string[] = [];
  lines.push("========================================");
  lines.push("           数据仓发布确认报告");
  lines.push("========================================");
  lines.push(`模式: ${report.dryRun ? "演练 (dry-run，零写入)" : "实际确认"}`);
  lines.push(`数据仓路径: ${repoPath}`);
  lines.push(`上游分支: ${report.upstream ?? "(未检测到)"}`);
  lines.push("");

  const verb = report.dryRun ? "将被确认" : "新确认为 published";
  lines.push(`[发布确认] ${verb}: ${report.confirmed.length} 轮`);
  for (const id of report.confirmed) {
    lines.push(`  - ${id}`);
  }
  lines.push("========================================");

  return lines.join("\n");
}

/** 解析并确定目标数据仓本地路径 */
function resolveRepoPath(explicitPath?: string): string | null {
  if (explicitPath) return explicitPath;
  try {
    const config = loadConfig(configPath());
    if (config.dataRepo?.path) {
      return config.dataRepo.path;
    }
  } catch {
    // 忽略配置文件读取失败
  }
  return null;
}

/** 执行发布确认子流程 */
async function handleConfirmCli(
  repoPath: string,
  parsed: ParsedArgs,
  out: (msg: string) => void,
  err: (msg: string) => void,
): Promise<number> {
  try {
    const report = await confirmPublished({
      repoPath,
      runIds: parsed.runIds.length > 0 ? parsed.runIds : undefined,
      dryRun: parsed.dryRun,
    });
    if (parsed.json) {
      out(JSON.stringify(report, null, 2));
    } else {
      out(formatHumanConfirmReport(report, repoPath));
    }
    return 0;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    err(`发布确认失败：${msg}`);
    return 1;
  }
}

/** 执行数据同步子流程 */
async function handleSyncCli(
  repoPath: string,
  parsed: ParsedArgs,
  out: (msg: string) => void,
  err: (msg: string) => void,
): Promise<number> {
  try {
    const report = await syncDataRepo({
      repoPath,
      runIds: parsed.runIds.length > 0 ? parsed.runIds : undefined,
      dryRun: parsed.dryRun,
      push: parsed.push,
    });

    if (parsed.json) {
      out(JSON.stringify(report, null, 2));
    } else {
      out(formatHumanReport(report, repoPath));
    }

    if (report.rejected.length > 0 || report.conflicts.length > 0) {
      return 2;
    }
    return 0;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    err(`同步中断：${msg}`);
    return 1;
  }
}

export async function runSyncCli(
  args: readonly string[] = process.argv.slice(2),
  out: (msg: string) => void = console.log,
  err: (msg: string) => void = console.error,
): Promise<number> {
  const parsed = parseCliArgs(args);

  if (parsed.push && parsed.confirmPublished) {
    err("参数错误：--confirm-published 与 --push 互斥，不能同时使用");
    return 1;
  }

  const repoPath = resolveRepoPath(parsed.repoPath);
  if (!repoPath) {
    err("错误：未指定 --repo 且配置文件中未配置 dataRepo.path");
    return 1;
  }

  if (!existsSync(repoPath)) {
    err(`错误：目标数据仓路径不存在：${repoPath}`);
    return 1;
  }

  if (parsed.confirmPublished) {
    return handleConfirmCli(repoPath, parsed, out, err);
  }

  return handleSyncCli(repoPath, parsed, out, err);
}

// 直接以 CLI 执行时执行并返回对应退出码
if (process.argv[1]?.endsWith("sync-data.ts")) {
  runSyncCli().then((code) => {
    process.exit(code);
  });
}
