import { readCachedCatalog, refreshCatalog } from "@/capabilities/catalog";
import type { CapabilitySnapshot } from "@/capabilities/types";
import { loadConfig, type AppConfig } from "@/core/config";
import { probeViaRunner } from "@/core/requests";
import { externalRunner } from "@/core/runner-link";
import type { CliKind } from "@/core/types";

export function loadAppConfigSafely(path: string): {
  config?: AppConfig;
  loadError: string | null;
} {
  try {
    const config = loadConfig(path);
    return { config, loadError: null };
  } catch (cause) {
    const loadError = cause instanceof Error ? cause.message : String(cause);
    return { loadError };
  }
}

/** 无缓存时探测一次：分容器部署交给执行器，本机就地探测 */
export async function loadConfigPageCatalog(
  customModels: Partial<Record<CliKind, string[]>> | undefined,
): Promise<CapabilitySnapshot | null> {
  const cached = await readCachedCatalog();
  if (cached !== null) return cached;
  return externalRunner() ? await probeViaRunner() : await refreshCatalog(customModels ?? {});
}
