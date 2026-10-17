import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySession } from "@/core/auth/session";
import { loadConfig, resolveModelFingerprintConfig } from "@/core/config";
import { isReadonly } from "@/core/deploy-mode";
import { findActiveFingerprintJob } from "@/core/model-fingerprint/job";
import { planFingerprintStatus, planReferenceFill } from "@/core/model-fingerprint/plan";
import {
  buildSampleSetsByKeyMap,
  listAllSampleSets,
  listCheckRecords,
} from "@/core/model-fingerprint/store";
import { configPath } from "@/core/paths";
import { DEFAULT_LOCALE, getMessages, LOCALE_COOKIE, resolveLocale } from "@/i18n";
import { FingerprintDashboard } from "./FingerprintDashboard";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const cookieStore = await cookies();
    const headerStore = await headers();
    const locale = resolveLocale(
      cookieStore.get(LOCALE_COOKIE)?.value ?? null,
      headerStore.get("accept-language"),
    );
    return { title: getMessages(locale).common.fingerprintPageTitle };
  } catch {
    return { title: getMessages(DEFAULT_LOCALE).common.fingerprintPageTitle };
  }
}

export default async function FingerprintPage() {
  if (isReadonly()) redirect("/");
  const owner = await verifySession((await cookies()).get(SESSION_COOKIE)?.value);
  if (owner === null) redirect("/pair?next=%2Ffingerprint");

  const config = loadConfig(configPath());
  const fpCfg = resolveModelFingerprintConfig(config);
  const allSets = await listAllSampleSets({ appliedEffort: fpCfg.effort });
  const baseOpts = {
    configuredProbes: fpCfg.probes,
    samplesPerProbe: fpCfg.samplesPerProbe,
    valuesPerCheck: fpCfg.valuesPerCheck,
    maxCallsFactor: fpCfg.maxCallsFactor,
    overrides: fpCfg.modelPrompts,
  };
  const matrix = planFingerprintStatus({
    configuredReferences: fpCfg.references,
    onDiskSampleSets: allSets,
    ...baseOpts,
  });
  const fillPlan = planReferenceFill({
    configuredReferences: fpCfg.references,
    sampleSets: buildSampleSetsByKeyMap(allSets),
    ...baseOpts,
  });
  const [activeJob, checks] = await Promise.all([
    findActiveFingerprintJob(),
    listCheckRecords(50),
  ]);
  const profiles = (config.profiles ?? []).map((p) => ({
    name: p.name,
    label: p.label,
    cli: p.cli,
    enabled: p.enabled,
  }));

  return (
    <FingerprintDashboard
      initialSnapshot={{
        modelFingerprint: fpCfg,
        profiles,
        matrix,
        fillPlan,
        activeJob,
        checks,
      }}
    />
  );
}
