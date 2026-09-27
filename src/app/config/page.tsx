import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySession } from "@/core/auth/session";
import { commandHint } from "@/core/command-hint";
import { configPath } from "@/core/paths";
import { BUILTIN_PROMPTS } from "@/core/prompt";
import { isReadonly } from "@/core/deploy-mode";
import { ConfigEditor } from "./ConfigEditor";
import { DataRepoPanel } from "./DataRepoPanel";
import { DevicePanel } from "./DevicePanel";
import { ConfigPageHeader } from "./ConfigPageHeader";
import { ConfigSideNav } from "./ConfigSideNav";
import {
  ConfigCatalogUnavailableAlert,
  ConfigLoadErrorAlert,
} from "./ConfigAlerts";
import {
  loadAppConfigSafely,
  loadConfigPageCatalog,
} from "./config-page-loader";

/** 配置可能被其他进程改写，每次请求重读 */
export const dynamic = "force-dynamic";

export default async function ConfigPage() {
  if (isReadonly()) redirect("/");
  // 配置页整页只对所有者开放：配置里有模型矩阵、提示词与 CLI 状态
  const owner = await verifySession((await cookies()).get(SESSION_COOKIE)?.value);
  if (owner === null) redirect("/pair?next=%2Fconfig");
  const path = configPath();

  const { config, loadError } = loadAppConfigSafely(path);
  const catalog = await loadConfigPageCatalog(config?.customModels);

  if (catalog === null) {
    return <ConfigCatalogUnavailableAlert />;
  }

  return (
    <main className="page config-page-layout">
      <ConfigSideNav />
      <div className="config-content">
        <ConfigPageHeader path={path} />

        {loadError !== null ? (
          <ConfigLoadErrorAlert error={loadError} />
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
        <DataRepoPanel />
        <DevicePanel pairCommand={commandHint("pnpm pair")} />
      </div>
    </main>
  );
}
