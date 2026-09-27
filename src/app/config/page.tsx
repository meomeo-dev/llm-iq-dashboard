import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySession } from "@/core/auth/session";
import { commandHint } from "@/core/command-hint";
import { loadConfig } from "@/core/config";
import { configPath } from "@/core/paths";
import { BUILTIN_PROMPTS } from "@/core/prompt";
import { readCachedCatalog, refreshCatalog } from "@/capabilities/catalog";
import { probeViaRunner } from "@/core/requests";
import { externalRunner } from "@/core/runner-link";
import { isReadonly } from "@/core/deploy-mode";
import { ConfigEditor } from "./ConfigEditor";
import { DevicePanel } from "./DevicePanel";

/** 配置可能被其他进程改写，每次请求重读 */
export const dynamic = "force-dynamic";

export default async function ConfigPage() {
  if (isReadonly()) redirect("/");
  // 配置页整页只对所有者开放：配置里有模型矩阵、提示词与 CLI 状态
  const owner = await verifySession((await cookies()).get(SESSION_COOKIE)?.value);
  if (owner === null) redirect("/pair?next=%2Fconfig");
  const path = configPath();

  let config;
  let loadError: string | null = null;
  try {
    config = loadConfig(path);
  } catch (cause) {
    loadError = cause instanceof Error ? cause.message : String(cause);
  }

  // 无缓存时探测一次：分容器部署交给执行器，本机就地探测
  const catalog =
    (await readCachedCatalog()) ??
    (externalRunner() ? await probeViaRunner() : await refreshCatalog(config?.customModels ?? {}));
  if (catalog === null) {
    return (
      <main className="page">
        <div className="alert error">
          <strong>能力目录尚未探测</strong>
          <p>执行器未响应。确认 runner 容器在运行（docker compose ps），稍后刷新。</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <header className="masthead">
        <div>
          <h1>
            基准配置
            <Link className="nav-link" href="/">
              ← 看板
            </Link>
          </h1>
          <p className="prompt">{path}</p>
        </div>
      </header>

      {loadError !== null ? (
        <div className="alert error">
          <strong>配置无法加载</strong>
          <pre>{loadError}</pre>
          <p>请直接修正该文件后刷新；界面不会在配置损坏时覆盖它。</p>
        </div>
      ) : (
        <ConfigEditor
          initialConfig={{
            schedule: config!.schedule,
            run: config!.run,
            targets: config!.targets,
            customPrompts: config!.customPrompts,
            customModels: config!.customModels,
          }}
          builtinPrompts={[...BUILTIN_PROMPTS]}
          initialCatalog={catalog}
        />
      )}
      <DevicePanel pairCommand={commandHint("pnpm pair")} />
    </main>
  );
}
