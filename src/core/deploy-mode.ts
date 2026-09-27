/**
 * 部署模式模块：唯一读取部署模式环境变量的地方。
 *
 * - PELICAN_READONLY=1：强制只读部署。
 * - PELICAN_DATA_SOURCE=remote：从公开数据仓读取数据，隐含只读模式。
 * - PELICAN_DATA_REPO_URL：公开数据仓根地址，缺省为 GitHub raw。
 */

export const DEFAULT_DATA_REPO_URL =
  "https://raw.githubusercontent.com/meomeo-dev/llm-iq-data/main";

export type DataSourceKind = "local" | "remote";

export interface DeployMode {
  readonly: boolean;
  dataSource: DataSourceKind;
  dataRepoUrl: string;
}

let warnedRemoteReadonly = false;

/** 解析部署模式；环境变化（如测试中）时实时反映 */
export function getDeployMode(): DeployMode {
  const envSource = process.env.PELICAN_DATA_SOURCE?.trim();
  const dataSource: DataSourceKind = envSource === "remote" ? "remote" : "local";

  const envReadonly = process.env.PELICAN_READONLY?.trim();
  const explicitReadonly = envReadonly === "1" || envReadonly === "true";

  let readonly = explicitReadonly;
  if (dataSource === "remote" && !explicitReadonly) {
    readonly = true;
    if (!warnedRemoteReadonly) {
      warnedRemoteReadonly = true;
      console.warn("PELICAN_DATA_SOURCE=remote 隐含只读模式，已自动按只读处理");
    }
  }

  const envRepoUrl = process.env.PELICAN_DATA_REPO_URL?.trim();
  const dataRepoUrl = envRepoUrl && envRepoUrl.length > 0 ? envRepoUrl : DEFAULT_DATA_REPO_URL;

  return { readonly, dataSource, dataRepoUrl };
}

/** 是否处于只读部署模式 */
export function isReadonly(): boolean {
  return getDeployMode().readonly;
}

/** 是否使用远程数据源 */
export function isRemoteDataSource(): boolean {
  return getDeployMode().dataSource === "remote";
}

/** 获取远程数据仓根地址（去掉了结尾斜杠） */
export function getDataRepoUrl(): string {
  return getDeployMode().dataRepoUrl.replace(/\/+$/, "");
}

/** 供单测重置一次性警告状态 */
export function _resetDeployModeWarningForTest(): void {
  warnedRemoteReadonly = false;
}
