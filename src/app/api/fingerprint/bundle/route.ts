/**
 * 模型指纹基准样本包导出与导入路由（`GET / POST /api/fingerprint/bundle`）：
 * - GET：经所有者鉴权后导出指定 (cli, effort, model) 的 .tar.gz 基准样本包（含 manifest.json 与 SHA-256 签名）
 * - POST：经 requireOwnerAction 鉴权与活跃作业互斥检查后，执行 5 层防篡改/防泄漏/合格性重提取校验，
 *   将已有同名探针样本归档至 archive/ 后原子写入 samples/。
 */

import { NextResponse } from "next/server";
import { describeActiveWorkConflict, findActiveWork } from "@/core/active-work";
import { audit } from "@/core/auth/audit";
import { clientIp, requireOwner, requireOwnerAction } from "@/core/auth/guard";
import { loadConfig, resolveModelFingerprintConfig } from "@/core/config";
import { isReadonly } from "@/core/deploy-mode";
import { buildConfigLeakGuard } from "@/core/leak-guard";
import {
  exportBaselineBundle,
  FingerprintBundleError,
  importBaselineBundle,
} from "@/core/model-fingerprint/bundle";
import { findActiveFingerprintJob } from "@/core/model-fingerprint/job";
import { MAX_BUNDLE_COMPRESSED_BYTES } from "@/core/model-fingerprint/tar-ustar";
import { isProbeId, type ProbeId } from "@/core/model-fingerprint/types";
import { configPath } from "@/core/paths";
import { CLI_KINDS, EFFORT_LEVELS, type CliKind, type EffortLevel } from "@/core/types";

export const dynamic = "force-dynamic";

function isCliKind(value: unknown): value is CliKind {
  return typeof value === "string" && (CLI_KINDS as readonly string[]).includes(value);
}

function isEffortLevel(value: unknown): value is EffortLevel {
  return typeof value === "string" && (EFFORT_LEVELS as readonly string[]).includes(value);
}

function parseProbesParam(raw: string | null): ProbeId[] | undefined {
  if (!raw || !raw.trim()) return undefined;
  const items = raw.split(",").map((s) => s.trim()).filter((s) => s.length > 0);
  if (items.length === 0) return undefined;
  for (const item of items) {
    if (!isProbeId(item)) throw new Error(`未知探针类型：${item}`);
  }
  return items as ProbeId[];
}

async function readUploadedBundleBytes(request: Request): Promise<Buffer> {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_BUNDLE_COMPRESSED_BYTES + 65_536) {
    throw new FingerprintBundleError(1, "ARCHIVE_EMPTY_OR_OVERSIZE", "上传文件体积超过 10 MB 上限");
  }
  const contentType = (request.headers.get("content-type") ?? "").toLowerCase();
  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof Blob)) {
      throw new FingerprintBundleError(1, "ARCHIVE_EMPTY_OR_OVERSIZE", "表单须包含 file 文件字段");
    }
    if (file.size === 0 || file.size > MAX_BUNDLE_COMPRESSED_BYTES) {
      throw new FingerprintBundleError(1, "ARCHIVE_EMPTY_OR_OVERSIZE", "样本包体积须在 1 B 至 10 MB 之间");
    }
    return Buffer.from(await file.arrayBuffer());
  }
  const ab = await request.arrayBuffer();
  if (ab.byteLength === 0 || ab.byteLength > MAX_BUNDLE_COMPRESSED_BYTES) {
    throw new FingerprintBundleError(1, "ARCHIVE_EMPTY_OR_OVERSIZE", "样本包体积须在 1 B 至 10 MB 之间");
  }
  return Buffer.from(ab);
}

async function checkImportConflict(): Promise<string | null> {
  const activeJob = await findActiveFingerprintJob();
  if (activeJob !== null) {
    return `模型指纹作业（${activeJob.jobId}）正在运行，请等待完成或停止后再导入样本包`;
  }
  const activeWork = await findActiveWork();
  if (activeWork !== null) {
    return describeActiveWorkConflict(activeWork);
  }
  return null;
}

export async function GET(request: Request): Promise<Response> {
  if (isReadonly()) return NextResponse.json({ error: "只读部署" }, { status: 403 });
  const guard = await requireOwner(request);
  if (!guard.ok) return NextResponse.json({ error: guard.error }, { status: guard.status });

  const url = new URL(request.url);
  const cli = url.searchParams.get("cli");
  const model = url.searchParams.get("model")?.trim() ?? "";
  const effortParam = url.searchParams.get("effort")?.trim() || undefined;
  if (!isCliKind(cli) || !model) {
    return NextResponse.json({ error: "导出基准包须提供合法的 cli 与 model" }, { status: 400 });
  }
  if (effortParam !== undefined && !isEffortLevel(effortParam)) {
    return NextResponse.json({ error: `非法思考强度：${effortParam}` }, { status: 400 });
  }

  try {
    const probes = parseProbesParam(url.searchParams.get("probes"));
    const config = loadConfig(configPath());
    const fpCfg = resolveModelFingerprintConfig(config);
    const leakGuard = await buildConfigLeakGuard(config);
    const exported = await exportBaselineBundle({
      cli, model, effort: effortParam ?? fpCfg.effort, probes, leakGuard, modelPrompts: fpCfg.modelPrompts,
    });
    await audit({
      action: "fingerprint-bundle-export", outcome: "ok", deviceId: guard.owner.deviceId, ip: clientIp(request),
      detail: `${cli}/${model} (${exported.manifest.requestedEffort}) probes=${exported.manifest.probes.length} values=${exported.totalValidValues}`,
    });
    return new Response(new Uint8Array(exported.buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/gzip",
        "Content-Disposition": `attachment; filename="${exported.filename}"`,
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const status = err instanceof FingerprintBundleError && err.code === "QUALIFICATION_ZERO_VALID_VALUES" ? 404 : 400;
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status });
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  const guard = await requireOwnerAction(request, "fingerprint-bundle-import");
  if (!guard.ok) return NextResponse.json({ error: guard.error }, { status: guard.status });

  const conflictMsg = await checkImportConflict();
  if (conflictMsg !== null) return NextResponse.json({ error: conflictMsg }, { status: 409 });

  try {
    const compressed = await readUploadedBundleBytes(request);
    const config = loadConfig(configPath());
    const fpCfg = resolveModelFingerprintConfig(config);
    const leakGuard = await buildConfigLeakGuard(config);
    const result = await importBaselineBundle(compressed, { leakGuard, modelPrompts: fpCfg.modelPrompts });
    await audit({
      action: "fingerprint-bundle-import", outcome: "ok", deviceId: guard.owner.deviceId, ip: clientIp(request),
      detail: `${result.manifest.cli}/${result.manifest.model} (${result.manifest.requestedEffort}) probes=${result.importedProbes.join(",")} values=${result.totalValidValues}`,
    });
    return NextResponse.json({
      ok: true,
      cli: result.manifest.cli,
      model: result.manifest.model,
      requestedEffort: result.manifest.requestedEffort,
      appliedEffort: result.manifest.appliedEffort,
      importedProbes: result.importedProbes,
      archivedProbes: result.archivedProbes,
      totalValidValues: result.totalValidValues,
      totalAttempts: result.totalAttempts,
      effortMismatch: result.manifest.requestedEffort !== fpCfg.effort,
    });
  } catch (err) {
    await audit({
      action: "fingerprint-bundle-import", outcome: "error", deviceId: guard.owner.deviceId, ip: clientIp(request),
      detail: err instanceof Error ? err.message : String(err),
    });
    const code = err instanceof FingerprintBundleError ? err.code : undefined;
    const layer = err instanceof FingerprintBundleError ? err.layer : undefined;
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err), code, layer }, { status: 400 });
  }
}
