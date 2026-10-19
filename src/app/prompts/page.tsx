import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/core/auth/session";
import { loadConfig } from "@/core/config";
import { isReadonly } from "@/core/deploy-mode";
import { configPath } from "@/core/paths";
import { BUILTIN_PROMPTS, listPrompts, type PromptSpec } from "@/core/prompt";
import { DEFAULT_LOCALE, getMessages, LOCALE_COOKIE, resolveLocale } from "@/i18n";
import { PromptsGalleryPage } from "./PromptsGalleryPage";
import "./prompts-page.css";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const cookieStore = await cookies();
    const headerStore = await headers();
    const locale = resolveLocale(
      cookieStore.get(LOCALE_COOKIE)?.value ?? null,
      headerStore.get("accept-language"),
    );
    return { title: getMessages(locale).promptsPage.pageTitle };
  } catch {
    return { title: getMessages(DEFAULT_LOCALE).promptsPage.pageTitle };
  }
}

export default async function PromptsPage() {
  const readonly = isReadonly();
  const owner =
    (await verifySession((await cookies()).get(SESSION_COOKIE)?.value)) !== null;

  let prompts: readonly PromptSpec[] = BUILTIN_PROMPTS;
  let scheduledPromptIds: readonly string[] | undefined;
  let defaultTimeZone = "Asia/Shanghai";

  try {
    const config = loadConfig(configPath());
    prompts = listPrompts(config.customPrompts);
    scheduledPromptIds = config.run.promptIds;
    defaultTimeZone = config.schedule.timezone ?? "Asia/Shanghai";
  } catch {
    // 只读远程展台或本机尚未生成配置文件时，平滑回退至内置题库
  }

  return (
    <PromptsGalleryPage
      owner={owner}
      readonly={readonly}
      prompts={prompts}
      scheduledPromptIds={scheduledPromptIds}
      defaultTimeZone={defaultTimeZone}
    />
  );
}
