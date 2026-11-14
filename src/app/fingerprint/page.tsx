import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { listProfileOptions } from "@/app/api/run/run-options";
import { findActiveWork } from "@/core/active-work";
import { SESSION_COOKIE, verifySession } from "@/core/auth/session";
import { loadConfig, resolveModelFingerprintConfig } from "@/core/config";
import { isReadonly } from "@/core/deploy-mode";
import {
  listCachedCheckRecords,
  listCachedSampleSets,
  resolveDashboardBaseline,
} from "@/core/model-fingerprint/baseline-cache";
import { findActiveFingerprintJob } from "@/core/model-fingerprint/job";
import { configPath } from "@/core/paths";
import { readCredentialStatus } from "@/core/profile-credentials";
import { toProfileView } from "@/core/profile-view";
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
  const readonly = isReadonly();
  if (readonly) redirect("/");
  const owner = (await verifySession((await cookies()).get(SESSION_COOKIE)?.value)) !== null;
  if (!owner) redirect("/pair?next=%2Ffingerprint");
  const canOperate = owner && !readonly;

  const config = loadConfig(configPath());
  const fpCfg = resolveModelFingerprintConfig(config);
  const [allSets, activeJob, activeWork, checks, credentials] = await Promise.all([
    listCachedSampleSets({ appliedEffort: fpCfg.effort }),
    findActiveFingerprintJob(),
    findActiveWork(),
    listCachedCheckRecords(50),
    canOperate ? readCredentialStatus() : Promise.resolve({}),
  ]);
  const { matrix, selfTest, selfTestByCli } = resolveDashboardBaseline(fpCfg, allSets);
  const profiles = listProfileOptions(config, credentials).map((opt, idx) => ({
    ...(config.profiles[idx] ? toProfileView(config.profiles[idx]!) : {}),
    ...opt,
  }));

  return (
    <FingerprintDashboard
      owner={owner}
      readonly={readonly}
      initialSnapshot={{
        modelFingerprint: fpCfg,
        profiles,
        matrix,
        selfTest,
        selfTestByCli,
        activeJob,
        activeWork,
        checks,
        defaultTimeZone: config.schedule.timezone,
      }}
    />
  );
}

