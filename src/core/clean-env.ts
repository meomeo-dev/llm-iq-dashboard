/**
 * 剥离可能导致 CLI 误判运行环境的环境变量。
 *
 * 在 macOS 上，agy（Antigravity CLI）若检测到 SSH_CONNECTION、SSH_CLIENT 或 SSH_TTY，
 * 会判定当前处于无 GUI 授权的远端 SSH 会话，主动禁用系统 Keychain（Keyring）转而退回查找
 * 磁盘文件凭据；在后台进程或继承了 SSH 变量的开发终端里会导致本地已登录状态失效。
 */
export function cleanCliEnv(
  baseEnv: Readonly<Record<string, string | undefined>> = process.env,
  extraEnv: Record<string, string> = {},
): NodeJS.ProcessEnv {
  const env = { ...baseEnv, ...extraEnv, NO_COLOR: "1", CI: "1" } as unknown as NodeJS.ProcessEnv;
  delete env.SSH_CONNECTION;
  delete env.SSH_CLIENT;
  delete env.SSH_TTY;
  return env;
}
