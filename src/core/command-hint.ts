/**
 * 生成用户可在自己终端直接执行的命令提示。容器部署时由 PELICAN_COMMAND_PREFIX
 * 给出 `docker exec` 前缀（见 docker/Dockerfile），本机直跑时为空。
 */

type Env = Readonly<Record<string, string | undefined>>;

function containerPrefix(env: Env): string {
  return env.PELICAN_COMMAND_PREFIX?.trim() ?? "";
}

/** 在用户终端里执行、作用于本系统所在环境的命令 */
export function commandHint(command: string, env: Env = process.env): string {
  const prefix = containerPrefix(env);
  return prefix === "" ? command : `${prefix} ${command}`;
}

/** 是否运行在容器里；容器内的 CLI 由 docker/install-clis.sh 安装 */
export function runsInContainer(env: Env = process.env): boolean {
  return containerPrefix(env) !== "";
}
