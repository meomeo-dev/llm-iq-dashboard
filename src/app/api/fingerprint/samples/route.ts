/**
 * 样本集单格操作路由（`PATCH /api/fingerprint/samples`）：
 * 经 `requireOwnerAction` 鉴权（只读展台模式返回 403），在无活跃指纹作业时（有作业返回 409 Conflict）
 * 于 `withProbeFileLock` 保护下执行单条样本剔除（exclude）、恢复（include）或单探针归档重置（reset）。
 */

import { NextResponse } from "next/server";
import { readCachedCatalog } from "@/capabilities/catalog";
import { audit } from "@/core/auth/audit";
import { clientIp, requireOwnerAction } from "@/core/auth/guard";
import { loadConfig, resolveModelFingerprintConfig } from "@/core/config";
import { resolveFingerprintTarget } from "@/core/model-fingerprint/collect";
import { findActiveFingerprintJob } from "@/core/model-fingerprint/job";
import { computeProbeSampleGap } from "@/core/model-fingerprint/plan";
import { decodeSampleSetAttempts } from "@/core/model-fingerprint/self-test";
import {
  listAllSampleSets,
  mutateSampleSetFlags,
  readSampleSet,
  resetSampleSetToArchive,
} from "@/core/model-fingerprint/store";
import { isProbeId } from "@/core/model-fingerprint/types";
import { configPath } from "@/core/paths";
import { CLI_KINDS, type CliKind } from "@/core/types";

export const dynamic = "force-dynamic";

function isCliKind(value: unknown): value is CliKind {
  return typeof value === "string" && (CLI_KINDS as readonly string[]).includes(value);
}

function parseStringArray(raw: unknown): string[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const filtered = raw
    .filter((item): item is string => typeof item === "string")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  return filtered.length > 0 ? filtered : undefined;
}

interface SamplePatchParams {
  cli: CliKind;
  model: string;
  probe: import("@/core/model-fingerprint/types").ProbeId;
  exclude?: string[];
  include?: string[];
  reset: boolean;
}

async function executeSampleMutation(params: SamplePatchParams, deviceId: string, ip: string | null) {
  const config = loadConfig(configPath());
  const fpCfg = resolveModelFingerprintConfig(config);
  const catalog = await readCachedCatalog();
  const targetEffort = resolveFingerprintTarget(config, catalog, params.cli, params.model).requestedEffort;
  const primarySet = await readSampleSet(params.cli, targetEffort, params.model, params.probe);
  const existingList = primarySet
    ? [primarySet]
    : await listAllSampleSets({ cli: params.cli, appliedEffort: fpCfg.effort, model: params.model, probes: [params.probe] });
  const appliedEffort = existingList[0]?.requestedEffort ?? existingList[0]?.appliedEffort ?? targetEffort;

  const archivePath = params.reset
    ? await resetSampleSetToArchive({ cli: params.cli, appliedEffort, model: params.model, probe: params.probe })
    : null;
  if (params.exclude || params.include) {
    await mutateSampleSetFlags({
      cli: params.cli, appliedEffort, model: params.model, probe: params.probe,
      exclude: params.exclude, include: params.include,
    });
  }

  const updatedSet = await readSampleSet(params.cli, appliedEffort, params.model, params.probe);
  const gap = computeProbeSampleGap({
    cli: params.cli, model: params.model, probe: params.probe, sampleSet: updatedSet ?? undefined,
    samplesPerProbe: fpCfg.samplesPerProbe, samplesByProbe: fpCfg.samplesByProbe,
    valuesPerCheck: fpCfg.valuesPerCheck, valuesPerCheckByProbe: fpCfg.valuesPerCheckByProbe,
    maxCallsFactor: fpCfg.maxCallsFactor, overrides: fpCfg.modelPrompts,
  });
  const attempts = updatedSet
    ? decodeSampleSetAttempts(updatedSet, gap.targetValues, fpCfg.valuesPerCheck, fpCfg.modelPrompts, undefined, fpCfg.samplesByProbe, fpCfg.valuesPerCheckByProbe)
    : [];

  await audit({
    action: "fingerprint-samples", outcome: "ok", deviceId, ip,
    detail: `${params.cli}/${params.model}/${params.probe} reset=${String(params.reset)}`,
  });
  return { ok: true, cli: params.cli, model: params.model, probe: params.probe, archivePath, gap, attempts };
}

export async function PATCH(request: Request): Promise<NextResponse> {
  const guard = await requireOwnerAction(request, "fingerprint-samples");
  if (!guard.ok) return NextResponse.json({ error: guard.error }, { status: guard.status });

  const activeJob = await findActiveFingerprintJob();
  if (activeJob !== null) {
    return NextResponse.json(
      { error: `模型指纹作业（${activeJob.jobId}）正在运行，请等待完成或停止后再修改样本` },
      { status: 409 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "请求体须为合法 JSON" }, { status: 400 });
  }

  const cli = body.cli;
  const model = typeof body.model === "string" ? body.model.trim() : "";
  const probe = body.probe;
  if (!isCliKind(cli) || !model || typeof probe !== "string" || !isProbeId(probe)) {
    return NextResponse.json({ error: "须同时指定合法的 cli、model 与 probe" }, { status: 400 });
  }

  const exclude = parseStringArray(body.exclude);
  const include = parseStringArray(body.include);
  const reset = body.reset === true;
  if (!reset && !exclude && !include) {
    return NextResponse.json({ error: "须至少指定 exclude、include 或 reset 之一" }, { status: 400 });
  }

  try {
    const out = await executeSampleMutation(
      { cli, model, probe, exclude, include, reset },
      guard.owner.deviceId,
      clientIp(request),
    );
    return NextResponse.json(out);
  } catch (cause) {
    return NextResponse.json(
      { error: cause instanceof Error ? cause.message : String(cause) },
      { status: 500 },
    );
  }
}
