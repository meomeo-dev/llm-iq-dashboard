/**
 * 模型指纹看板 API（`GET /api/fingerprint`、`POST /api/fingerprint`）：
 * - GET：经 `requireOwner` 鉴权（只读展台模式返回 403），返回基准样本矩阵、单格样本解码详情、
 *   活跃作业、核验历史、自检报告与补齐预检计划；
 * - POST：经 `requireOwnerAction` 鉴权，支持 `action: "fill" | "check" | "plan" | "rescore" | "cancel"`，
 *   与 CLI 参数完全对齐，采集/核验前检查 `findActiveWork()` 双向互斥，分容器模式下经 `enqueueRequest` 转发。
 */

import { NextResponse } from "next/server";
import { listProfileOptions } from "@/app/api/run/run-options";
import { readCachedCatalog } from "@/capabilities/catalog";
import { describeActiveWorkConflict, findActiveWork } from "@/core/active-work";
import { audit } from "@/core/auth/audit";
import { clientIp, requireOwner, requireOwnerAction } from "@/core/auth/guard";
import { loadConfig, resolveModelFingerprintConfig, type AppConfig } from "@/core/config";
import { isReadonly } from "@/core/deploy-mode";
import { executeFingerprintCheckBatch, executeFingerprintFill, rescoreCheckRecord, resolveFingerprintTarget } from "@/core/model-fingerprint/collect";
import {
  listCachedCheckRecords,
  listCachedSampleSets,
  resolveDashboardBaseline,
} from "@/core/model-fingerprint/baseline-cache";
import { computeTargetFallbackCost } from "@/core/model-fingerprint/cost";
import { findActiveFingerprintJob, requestFingerprintJobCancel } from "@/core/model-fingerprint/job";
import { aggregateVerificationCheckPlans, computeProbeSampleGap, planFingerprintStatus, planReferenceFill, planVerificationCheck, resolveSelectedProbes } from "@/core/model-fingerprint/plan";
import { buildSelfTestReport, decodeSampleSetAttempts } from "@/core/model-fingerprint/self-test";
import { buildSampleSetsByKeyMap, buildSampleSetsByModelMap, listAllSampleSets, listCheckRecords, readCheckRecord, readSampleSet } from "@/core/model-fingerprint/store";
import { isProbeId, type ProbeId, type ProbeSampleSet } from "@/core/model-fingerprint/types";
import { configPath } from "@/core/paths";
import { readCredentialStatus } from "@/core/profile-credentials";
import { toProfileView } from "@/core/profile-view";
import { enqueueRequest, waitForRequest, type FingerprintCheckRequestPayload, type FingerprintFillRequestPayload } from "@/core/requests";
import { launchFor } from "@/core/runner";
import { externalRunner } from "@/core/runner-link";
import { CLI_KINDS, DEFAULT_PROFILE, type CliKind } from "@/core/types";

export const dynamic = "force-dynamic";

const FLAG = Symbol.for("pelican.fingerprintJobInFlight");
const RUNNER_START_TIMEOUT_MS = 60_000;
const SAFE_ID_RE = /^[A-Za-z0-9._-]+$/;

interface FlagHolder {
  [FLAG]?: boolean;
}

function isCliKind(value: unknown): value is CliKind {
  return typeof value === "string" && (CLI_KINDS as readonly string[]).includes(value);
}

function parseProbesInput(raw: unknown): ProbeId[] | undefined {
  if (raw === undefined || raw === null) return undefined;
  const list = Array.isArray(raw) ? raw.filter((x): x is string => typeof x === "string") : typeof raw === "string" ? raw.split(",") : [];
  const trimmed = list.map((s) => s.trim()).filter((s) => s.length > 0);
  if (trimmed.length === 0) return undefined;
  for (const item of trimmed) {
    if (!isProbeId(item)) throw new Error(`未知探针类型：${item}`);
  }
  return trimmed as ProbeId[];
}

function parseStringList(raw: unknown): string[] | undefined {
  if (raw === undefined || raw === null) return undefined;
  const list = Array.isArray(raw) ? raw.filter((x): x is string => typeof x === "string") : typeof raw === "string" ? raw.split(",") : [];
  const trimmed = list.map((s) => s.trim()).filter((s) => s.length > 0);
  return trimmed.length > 0 ? trimmed : undefined;
}

function parseCountInput(raw: unknown): number | undefined {
  if (raw === undefined || raw === null) return undefined;
  if (typeof raw !== "number" || !Number.isInteger(raw) || raw < 0) throw new Error("count 必须为非负整数");
  return raw;
}

async function findSampleSetForTarget(config: AppConfig, cli: CliKind, model: string, probe: ProbeId): Promise<ProbeSampleSet | null> {
  const fpCfg = resolveModelFingerprintConfig(config);
  const primary = await readSampleSet(cli, fpCfg.effort, model, probe);
  if (primary !== null && primary.attempts.length > 0) return primary;
  const existing = await listAllSampleSets({ cli, appliedEffort: fpCfg.effort, model, probes: [probe] });
  return existing[0] ?? primary;
}

function parseSampleDetailTarget(url: URL): { cli: string | null; model: string; probe: string | null } {
  const compact = url.searchParams.get("sampleDetail")?.trim() ?? "";
  if (compact) {
    const first = compact.indexOf(":");
    const last = compact.lastIndexOf(":");
    if (first > 0 && last > first + 1) {
      return { cli: compact.slice(0, first), model: compact.slice(first + 1, last), probe: compact.slice(last + 1) };
    }
  }
  return { cli: url.searchParams.get("cli"), model: url.searchParams.get("model")?.trim() ?? "", probe: url.searchParams.get("probe") };
}

async function handleSampleDetailGet(config: AppConfig, url: URL): Promise<NextResponse> {
  const { cli, model, probe } = parseSampleDetailTarget(url);
  if (!isCliKind(cli) || !model || !probe || !isProbeId(probe)) {
    return NextResponse.json({ error: "查询单格样本须提供合法的 cli、model 与 probe" }, { status: 400 });
  }
  const fpCfg = resolveModelFingerprintConfig(config);
  const [sampleSet, cliSets] = await Promise.all([
    findSampleSetForTarget(config, cli, model, probe),
    listCachedSampleSets({ cli, appliedEffort: fpCfg.effort }),
  ]);
  const fallbackCost = computeTargetFallbackCost(cliSets, cli, model);
  const gap = computeProbeSampleGap({
    cli, model, probe, sampleSet: sampleSet ?? undefined,
    samplesPerProbe: fpCfg.samplesPerProbe, samplesByProbe: fpCfg.samplesByProbe,
    valuesPerCheck: fpCfg.valuesPerCheck, valuesPerCheckByProbe: fpCfg.valuesPerCheckByProbe,
    maxCallsFactor: fpCfg.maxCallsFactor, overrides: fpCfg.modelPrompts, fallbackUnitCostUsd: fallbackCost,
  });
  const attempts = sampleSet
    ? decodeSampleSetAttempts(sampleSet, gap.targetValues, fpCfg.valuesPerCheck, fpCfg.modelPrompts, undefined, fpCfg.samplesByProbe, fpCfg.valuesPerCheckByProbe)
    : [];
  return NextResponse.json({ cli, model, probe, gap, attempts });
}

function buildSelfTestsByCli(config: AppConfig, allSets: readonly ProbeSampleSet[]) {
  const fpCfg = resolveModelFingerprintConfig(config);
  const probes = resolveSelectedProbes(undefined, fpCfg.probes);
  const byCli: Record<string, ReturnType<typeof buildSelfTestReport>> = {};
  for (const cli of CLI_KINDS) {
    const cliSets = allSets.filter((s) => s.cli === cli);
    if (cliSets.length === 0) continue;
    byCli[cli] = buildSelfTestReport({
      sampleSetsByModel: buildSampleSetsByModelMap(cliSets), probes,
      samplesPerProbe: fpCfg.samplesPerProbe, samplesByProbe: fpCfg.samplesByProbe,
      valuesPerCheck: fpCfg.valuesPerCheck, valuesPerCheckByProbe: fpCfg.valuesPerCheckByProbe,
      targetAccuracy: fpCfg.targetAccuracy, overrides: fpCfg.modelPrompts,
    });
  }
  const firstCli = Object.keys(byCli)[0];
  const primary = firstCli ? byCli[firstCli]! : buildSelfTestReport({
    sampleSetsByModel: new Map(), probes,
    samplesPerProbe: fpCfg.samplesPerProbe, samplesByProbe: fpCfg.samplesByProbe,
    valuesPerCheck: fpCfg.valuesPerCheck, valuesPerCheckByProbe: fpCfg.valuesPerCheckByProbe,
    targetAccuracy: fpCfg.targetAccuracy, overrides: fpCfg.modelPrompts,
  });
  return { selfTest: primary, selfTestByCli: byCli };
}

async function buildDashboardSnapshot(config: AppConfig): Promise<NextResponse> {
  const fpCfg = resolveModelFingerprintConfig(config);
  const [allSets, activeJob, activeWork, checks, credentials] = await Promise.all([
    listCachedSampleSets({ appliedEffort: fpCfg.effort }),
    findActiveFingerprintJob(), findActiveWork(), listCachedCheckRecords(50), readCredentialStatus(),
  ]);
  const { matrix, fillPlan, selfTest, selfTestByCli } = resolveDashboardBaseline(fpCfg, allSets);
  const profiles = listProfileOptions(config, credentials).map((opt, idx) => ({
    ...(config.profiles[idx] ? toProfileView(config.profiles[idx]!) : {}),
    ...opt,
  }));
  return NextResponse.json({
    modelFingerprint: fpCfg,
    defaultTimeZone: config.schedule.timezone,
    profiles,
    matrix,
    fillPlan,
    selfTest,
    selfTestByCli,
    activeJob,
    activeWork,
    checks,
  });
}

export async function GET(request: Request): Promise<NextResponse> {
  if (isReadonly()) return NextResponse.json({ error: "只读部署" }, { status: 403 });
  const guard = await requireOwner(request);
  if (!guard.ok) return NextResponse.json({ error: guard.error }, { status: guard.status });

  try {
    const config = loadConfig(configPath());
    const url = new URL(request.url);
    const checkId = url.searchParams.get("checkId")?.trim();
    if (checkId) {
      if (!SAFE_ID_RE.test(checkId)) return NextResponse.json({ error: "非法的 checkId" }, { status: 400 });
      const found = await readCheckRecord(checkId);
      if (found === null) return NextResponse.json({ error: `找不到核验记录：${checkId}` }, { status: 404 });
      return NextResponse.json({ record: found.record });
    }
    if (url.searchParams.has("probe") || url.searchParams.has("sampleDetail")) {
      return await handleSampleDetailGet(config, url);
    }
    return await buildDashboardSnapshot(config);
  } catch (cause) {
    return NextResponse.json({ error: describe(cause) }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  const guard = await requireOwnerAction(request, "fingerprint");
  if (!guard.ok) return NextResponse.json({ error: guard.error }, { status: guard.status });
  const who = { deviceId: guard.owner.deviceId, ip: clientIp(request) };

  let body: Record<string, unknown>;
  try {
    const raw = await request.text();
    body = raw.trim() === "" ? {} : (JSON.parse(raw) as Record<string, unknown>);
  } catch {
    return NextResponse.json({ error: "请求体须为合法 JSON" }, { status: 400 });
  }

  try {
    const config = loadConfig(configPath());
    const action = typeof body.action === "string" ? body.action : "";
    if (action === "plan" || ((action === "fill" || action === "check") && body.dryRun === true)) {
      return await handlePlanPost(config, body);
    }
    if (action === "self-test") return await handleSelfTestPost(config, body);
    if (action === "rescore") return await handleRescorePost(config, body, who);
    if (action === "cancel") return await handleCancelPost(body, who);
    if (action === "fill") return await handleFillPost(config, body, who);
    if (action === "check") return await handleCheckPost(config, body, who);
    return NextResponse.json({ error: `未知操作 action：${String(body.action ?? "")}` }, { status: 400 });
  } catch (cause) {
    return NextResponse.json({ error: describe(cause) }, { status: 400 });
  }
}

async function handleSelfTestPost(config: AppConfig, body: Record<string, unknown>): Promise<NextResponse> {
  const fpCfg = resolveModelFingerprintConfig(config);
  const cliFilter = body.cli !== undefined && body.cli !== "" ? (isCliKind(body.cli) ? body.cli : undefined) : undefined;
  if (body.cli !== undefined && body.cli !== "" && cliFilter === undefined) throw new Error(`未知 CLI：${String(body.cli)}`);
  const modelFilter = typeof body.model === "string" && body.model.trim() !== "" ? body.model.trim() : undefined;
  const probes = parseProbesInput(body.probes);
  const allSets = await listAllSampleSets({ cli: cliFilter, appliedEffort: fpCfg.effort, probes });
  const { selfTest, selfTestByCli } = buildSelfTestsByCli(config, allSets);
  return NextResponse.json({ ok: true, modelFilter: modelFilter ?? null, selfTest, selfTestByCli });
}

async function handleCheckPlanPost(config: AppConfig, body: Record<string, unknown>, probes: ProbeId[] | undefined, allSets: ProbeSampleSet[]): Promise<NextResponse> {
  const rawTargets = Array.isArray(body.targets) && body.targets.length > 0
    ? body.targets.filter((x): x is Record<string, unknown> => typeof x === "object" && x !== null)
    : [body];
  const fpCfg = resolveModelFingerprintConfig(config);
  const catalog = await readCachedCatalog();
  const plans = rawTargets.map((item) => {
    const cli = item.cli ?? body.cli;
    if (!isCliKind(cli)) throw new Error("核验计划须指定合法的 cli");
    const declaredModel = typeof (item.model ?? item.declaredModel ?? body.model) === "string"
      ? String(item.model ?? item.declaredModel ?? body.model).trim()
      : "";
    if (!declaredModel) throw new Error("核验计划须指定声明模型 model");
    const profile = typeof item.profile === "string" && item.profile.trim() !== "" ? item.profile.trim() : DEFAULT_PROFILE;
    if (profile !== DEFAULT_PROFILE) launchFor(config, cli, profile, { allowDisabled: true });
    resolveFingerprintTarget(config, catalog, cli, declaredModel, profile);
    const cliSets = allSets.filter((s) => s.cli === cli);
    return planVerificationCheck({
      cli, declaredModel, sampleSetsByModel: buildSampleSetsByModelMap(cliSets),
      requestedProbes: parseProbesInput(item.probes) ?? probes, configuredProbes: fpCfg.probes,
      samplesPerProbe: fpCfg.samplesPerProbe, samplesByProbe: fpCfg.samplesByProbe,
      valuesPerCheck: fpCfg.valuesPerCheck, valuesPerCheckByProbe: fpCfg.valuesPerCheckByProbe,
      checkAttempts: fpCfg.checkAttempts, targetAccuracy: fpCfg.targetAccuracy, overrides: fpCfg.modelPrompts,
    });
  });
  return NextResponse.json({ ok: true, mode: "check", checkPlan: aggregateVerificationCheckPlans(plans) });
}

async function handlePlanPost(config: AppConfig, body: Record<string, unknown>): Promise<NextResponse> {
  const fpCfg = resolveModelFingerprintConfig(config);
  const mode = body.mode === "check" || body.action === "check" ? "check" : "fill";
  const probes = parseProbesInput(body.probes);
  const allSets = await listAllSampleSets({ appliedEffort: fpCfg.effort });
  if (mode === "check") return handleCheckPlanPost(config, body, probes, allSets);
  const cliFilter = body.cli !== undefined && body.cli !== "" ? (isCliKind(body.cli) ? body.cli : undefined) : undefined;
  if (body.cli !== undefined && body.cli !== "" && cliFilter === undefined) throw new Error(`未知 CLI：${String(body.cli)}`);
  const modelFilter = typeof body.model === "string" && body.model.trim() !== "" ? body.model.trim() : undefined;
  const countLimit = parseCountInput(body.count);
  const reset = body.reset === true;
  if (reset && (!cliFilter || !modelFilter || !probes || probes.length === 0)) {
    throw new Error("--reset 必须同时显式指定 cli、model 与 probes");
  }
  const fillPlan = planReferenceFill({
    configuredReferences: fpCfg.references, sampleSets: buildSampleSetsByKeyMap(allSets),
    cliFilter, modelFilter, requestedProbes: probes, configuredProbes: fpCfg.probes,
    samplesPerProbe: fpCfg.samplesPerProbe, samplesByProbe: fpCfg.samplesByProbe,
    valuesPerCheck: fpCfg.valuesPerCheck, valuesPerCheckByProbe: fpCfg.valuesPerCheckByProbe,
    maxCallsFactor: fpCfg.maxCallsFactor, countLimit, overrides: fpCfg.modelPrompts,
    mutation: { reset, excludeReqIds: parseStringList(body.exclude), includeReqIds: parseStringList(body.include) },
  });
  return NextResponse.json({ ok: true, mode: "fill", fillPlan });
}

async function handleRescorePost(config: AppConfig, body: Record<string, unknown>, who: { deviceId: string; ip: string | null }): Promise<NextResponse> {
  const checkId = typeof body.checkId === "string" ? body.checkId.trim() : "";
  if (!checkId || !SAFE_ID_RE.test(checkId)) {
    return NextResponse.json({ error: "rescore 须提供合法的 checkId" }, { status: 400 });
  }
  const record = await rescoreCheckRecord(config, checkId);
  await audit({ action: "fingerprint-rescore", outcome: "ok", deviceId: who.deviceId, ip: who.ip, detail: checkId });
  return NextResponse.json({ ok: true, record });
}

async function handleCancelPost(body: Record<string, unknown>, who: { deviceId: string; ip: string | null }): Promise<NextResponse> {
  const explicitId = typeof body.jobId === "string" ? body.jobId.trim() : "";
  if (explicitId && !SAFE_ID_RE.test(explicitId)) {
    return NextResponse.json({ error: "非法的 jobId" }, { status: 400 });
  }
  const active = await findActiveFingerprintJob();
  if (!active) return NextResponse.json({ error: "当前没有正在运行的模型指纹作业" }, { status: 404 });
  if (explicitId && active.jobId !== explicitId) {
    return NextResponse.json({ error: `当前运行中的作业为 ${active.jobId}，与指定的 ${explicitId} 不一致` }, { status: 409 });
  }
  await requestFingerprintJobCancel(active.jobId);
  await audit({ action: "fingerprint-cancel", outcome: "ok", deviceId: who.deviceId, ip: who.ip, detail: active.jobId });
  return NextResponse.json({ ok: true, jobId: active.jobId });
}

function parseProfilesByCliInput(raw: unknown): Partial<Record<CliKind, string>> | undefined {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return undefined;
  const out: Partial<Record<CliKind, string>> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (!isCliKind(k) || typeof v !== "string") continue;
    const name = v.trim();
    if (name && name !== DEFAULT_PROFILE) out[k] = name;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

async function validateProfileLaunch(config: AppConfig, cli: CliKind, profile: string): Promise<void> {
  if (!profile || profile === DEFAULT_PROFILE) return;
  const res = await launchFor(config, cli, profile, { allowDisabled: true });
  if (typeof res === "string") throw new Error(res);
}

async function parseFillPayload(config: AppConfig, body: Record<string, unknown>): Promise<FingerprintFillRequestPayload> {
  const cli = body.cli !== undefined && body.cli !== "" ? (isCliKind(body.cli) ? body.cli : undefined) : undefined;
  if (body.cli !== undefined && body.cli !== "" && cli === undefined) throw new Error(`未知 CLI：${String(body.cli)}`);
  const model = typeof body.model === "string" && body.model.trim() !== "" ? body.model.trim() : undefined;
  const profile = typeof body.profile === "string" && body.profile.trim() !== "" ? body.profile.trim() : undefined;
  const profilesByCli = parseProfilesByCliInput(body.profilesByCli);
  if (profile && profile !== DEFAULT_PROFILE && cli) await validateProfileLaunch(config, cli, profile);
  if (profilesByCli) {
    for (const [k, p] of Object.entries(profilesByCli)) {
      if (p) await validateProfileLaunch(config, k as CliKind, p);
    }
  }
  const probes = parseProbesInput(body.probes);
  const count = parseCountInput(body.count);
  const exclude = parseStringList(body.exclude);
  const include = parseStringList(body.include);
  const reset = body.reset === true;
  if (reset && (!cli || !model || !probes || probes.length === 0)) {
    throw new Error("--reset 必须同时显式指定 cli、model 与 probes");
  }
  return { cli, profile, profilesByCli, model, probes, count, exclude, include, reset };
}

async function handleFillPost(config: AppConfig, body: Record<string, unknown>, who: { deviceId: string; ip: string | null }): Promise<NextResponse> {
  const payload = await parseFillPayload(config, body);
  const holder = globalThis as FlagHolder;
  if (holder[FLAG] === true) return NextResponse.json({ error: "已有模型指纹作业正在启动" }, { status: 409 });
  holder[FLAG] = true;
  try {
    const active = await findActiveWork();
    if (active !== null) return NextResponse.json({ error: describeActiveWorkConflict(active) }, { status: 409 });
    return externalRunner()
      ? await startViaRunner("fingerprint-fill", payload, who)
      : await startLocalFill(config, payload, who);
  } finally {
    holder[FLAG] = false;
  }
}

async function startLocalFill(
  config: AppConfig,
  payload: FingerprintFillRequestPayload,
  who: { deviceId: string; ip: string | null },
): Promise<NextResponse> {
  let startedResolve!: (out: { jobId: string | null; completed: boolean }) => void;
  let startedReject!: (err: unknown) => void;
  const signalPromise = new Promise<{ jobId: string | null; completed: boolean }>((res, rej) => {
    startedResolve = res;
    startedReject = rej;
  });

  void executeFingerprintFill(config, { ...payload, onStarted: (jobId) => startedResolve({ jobId, completed: false }) })
    .then((result) => startedResolve({ jobId: result.jobId, completed: true }))
    .catch((cause: unknown) => startedReject(cause));

  try {
    const out = await signalPromise;
    await audit({ action: "fingerprint-fill", outcome: "ok", deviceId: who.deviceId, ip: who.ip, detail: out.jobId ?? "local-mutation-only" });
    return NextResponse.json({ ok: true, started: !out.completed, jobId: out.jobId }, { status: 202 });
  } catch (cause) {
    await audit({ action: "fingerprint-fill", outcome: "error", deviceId: who.deviceId, ip: who.ip, detail: describe(cause) });
    return NextResponse.json({ error: describe(cause) }, { status: 500 });
  }
}

async function parseAndValidateCheckPayload(config: AppConfig, body: Record<string, unknown>): Promise<FingerprintCheckRequestPayload | NextResponse> {
  if (!isCliKind(body.cli)) return NextResponse.json({ error: "check 须指定合法的 cli" }, { status: 400 });
  const model = typeof body.model === "string" ? body.model.trim() : "";
  if (!model) return NextResponse.json({ error: "check 须指定声明模型 model" }, { status: 400 });
  const profile = typeof body.profile === "string" && body.profile.trim() !== "" ? body.profile.trim() : DEFAULT_PROFILE;
  await validateProfileLaunch(config, body.cli, profile);
  const probes = parseProbesInput(body.probes);

  const fpCfg = resolveModelFingerprintConfig(config);
  const catalog = await readCachedCatalog();
  resolveFingerprintTarget(config, catalog, body.cli, model, profile);
  const referenceSets = await listAllSampleSets({ cli: body.cli, appliedEffort: fpCfg.effort });
  const plan = planVerificationCheck({
    cli: body.cli, declaredModel: model, sampleSetsByModel: buildSampleSetsByModelMap(referenceSets),
    requestedProbes: probes, configuredProbes: fpCfg.probes, samplesPerProbe: fpCfg.samplesPerProbe, samplesByProbe: fpCfg.samplesByProbe,
    valuesPerCheck: fpCfg.valuesPerCheck, valuesPerCheckByProbe: fpCfg.valuesPerCheckByProbe,
    checkAttempts: fpCfg.checkAttempts, targetAccuracy: fpCfg.targetAccuracy, overrides: fpCfg.modelPrompts,
  });
  if (plan.executableProbes.length === 0) {
    return NextResponse.json({ error: `声明模型 ${body.cli}/${model} 在所选探针上无满额基准样本集，请先运行 fingerprint:fill` }, { status: 400 });
  }
  return { cli: body.cli, profile, model, probes };
}

async function parseAndValidateCheckBatch(config: AppConfig, body: Record<string, unknown>): Promise<FingerprintCheckRequestPayload[] | NextResponse> {
  const rawTargets = Array.isArray(body.targets) && body.targets.length > 0
    ? body.targets.filter((x): x is Record<string, unknown> => typeof x === "object" && x !== null)
    : [body];
  const validated: FingerprintCheckRequestPayload[] = [];
  for (const item of rawTargets) {
    const merged: Record<string, unknown> = { ...item, model: item.model ?? item.declaredModel ?? body.model, probes: item.probes ?? body.probes };
    const one = await parseAndValidateCheckPayload(config, merged);
    if (one instanceof NextResponse) return one;
    validated.push(one);
  }
  return validated;
}

async function handleCheckPost(config: AppConfig, body: Record<string, unknown>, who: { deviceId: string; ip: string | null }): Promise<NextResponse> {
  const validated = await parseAndValidateCheckBatch(config, body);
  if (validated instanceof NextResponse) return validated;
  const batchPayload: FingerprintCheckRequestPayload = { ...validated[0]!, targets: validated };

  const holder = globalThis as FlagHolder;
  if (holder[FLAG] === true) return NextResponse.json({ error: "已有模型指纹作业正在启动" }, { status: 409 });
  holder[FLAG] = true;
  try {
    const active = await findActiveWork();
    if (active !== null) return NextResponse.json({ error: describeActiveWorkConflict(active) }, { status: 409 });
    return externalRunner()
      ? await startViaRunner("fingerprint-check", batchPayload, who)
      : await startLocalCheck(config, batchPayload, who);
  } finally {
    holder[FLAG] = false;
  }
}

async function startLocalCheck(
  config: AppConfig,
  batchPayload: FingerprintCheckRequestPayload,
  who: { deviceId: string; ip: string | null },
): Promise<NextResponse> {
  const started = new Promise<string>((resolve, reject) => {
    void executeFingerprintCheckBatch(config, { ...batchPayload, onStarted: resolve }).catch((cause: unknown) => reject(cause));
  });
  try {
    const jobId = await started;
    await audit({ action: "fingerprint-check", outcome: "ok", deviceId: who.deviceId, ip: who.ip, detail: jobId });
    return NextResponse.json({ ok: true, started: true, jobId }, { status: 202 });
  } catch (cause) {
    await audit({ action: "fingerprint-check", outcome: "error", deviceId: who.deviceId, ip: who.ip, detail: describe(cause) });
    return NextResponse.json({ error: describe(cause) }, { status: 500 });
  }
}

async function startViaRunner(
  kind: "fingerprint-fill" | "fingerprint-check",
  payload: FingerprintFillRequestPayload | FingerprintCheckRequestPayload,
  who: { deviceId: string; ip: string | null },
): Promise<NextResponse> {
  const queued =
    kind === "fingerprint-fill"
      ? await enqueueRequest("fingerprint-fill", { fingerprintFill: payload as FingerprintFillRequestPayload })
      : await enqueueRequest("fingerprint-check", { fingerprintCheck: payload as FingerprintCheckRequestPayload });
  const settled = await waitForRequest(queued.id, RUNNER_START_TIMEOUT_MS);
  if (settled?.state === "done") {
    const jobId = settled.result?.jobId ?? null;
    await audit({ action: kind, outcome: "ok", deviceId: who.deviceId, ip: who.ip, detail: jobId ?? queued.id });
    return NextResponse.json({ ok: true, started: jobId !== null, jobId }, { status: 202 });
  }
  const error = settled?.state === "failed" ? (settled.result?.error ?? "执行器拒绝了请求") : "执行器未响应：确认 runner 容器在运行（docker compose ps）";
  await audit({ action: kind, outcome: "error", deviceId: who.deviceId, ip: who.ip, detail: error });
  return NextResponse.json({ error }, { status: settled?.state === "failed" ? 409 : 503 });
}

function describe(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause);
}
