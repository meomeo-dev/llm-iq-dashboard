/**
 * dashboard:prod —— 以生产模式手动启动看板（前台运行，Ctrl+C 停止）。
 *
 * 用法：pnpm dashboard:prod [-- --port 3000]
 *
 * 仓库根的 .next 由 `next dev` 使用，就地构建会覆盖 dev server，因此把已提交的 HEAD
 * 检出到同级 worktree（../<仓库名>-deploy，detached），在那里安装、构建、启动。
 *
 * - 只部署已提交的代码；工作区有未提交改动时给出提示。
 * - 产物目录与配置仍指向本仓库（PELICAN_DATA_DIR、PELICAN_CONFIG）。
 * - 部署目录已是该提交且构建产物存在时，跳过安装与构建。
 * - 端口被占用时直接退出，不停止任何进程。
 */

import { execFileSync, spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { createServer } from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_PORT = 3000;
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEPLOY_DIR = path.join(path.dirname(REPO_ROOT), `${path.basename(REPO_ROOT)}-deploy`);
/** next build 成功后写出；部署目录已是目标提交且它在，就能跳过构建 */
const BUILD_ID_FILE = path.join(DEPLOY_DIR, ".next", "BUILD_ID");

main().catch((cause) => fail(cause instanceof Error ? cause.message : String(cause)));

async function main() {
  const port = readPort(process.argv.slice(2));
  await assertPortFree(port);

  const commit = git(REPO_ROOT, "rev-parse", "HEAD");
  if (git(REPO_ROOT, "status", "--porcelain", "--untracked-files=no") !== "") {
    console.warn("⚠ 工作区有未提交的改动，生产只部署已提交的 HEAD");
  }
  const env = runtimeEnv();
  const reused = checkoutDeployDir(commit);
  if (reused) {
    console.log(`✓ ${DEPLOY_DIR} 已是 ${commit.slice(0, 7)} 且已构建，直接启动`);
  } else {
    // 安装时带上 env，postinstall 同步的价格目录落到本仓库的 data/
    run(DEPLOY_DIR, "pnpm", ["install", "--frozen-lockfile"], env);
    run(DEPLOY_DIR, "pnpm", ["build"], env);
  }
  // 依赖未变时 pnpm install 不跑 postinstall，因此每次启动前补一次同步；
  // 附件哈希一致时不联网，失败只警告
  run(DEPLOY_DIR, "pnpm", ["pricing:sync", "--soft"], env);
  startServer(port, env);
}

/** 部署目录只放代码，产物目录与配置指向本仓库 */
function runtimeEnv() {
  return {
    ...process.env,
    PELICAN_DATA_DIR: process.env.PELICAN_DATA_DIR || path.join(REPO_ROOT, "data"),
    PELICAN_CONFIG: process.env.PELICAN_CONFIG || path.join(REPO_ROOT, "config", "pelican.config.yaml"),
  };
}

/** 返回 true 表示部署目录已是该提交且构建产物齐全，可跳过安装与构建 */
function checkoutDeployDir(commit) {
  if (!existsSync(DEPLOY_DIR)) {
    run(REPO_ROOT, "git", ["worktree", "add", "--detach", DEPLOY_DIR, commit]);
    return false;
  }
  const current = git(DEPLOY_DIR, "rev-parse", "HEAD");
  if (current === commit && existsSync(BUILD_ID_FILE)) return true;
  if (git(DEPLOY_DIR, "status", "--porcelain") !== "") {
    fail(`${DEPLOY_DIR} 有本地改动，部署目录不应手工修改；请检查后清理再运行`);
  }
  run(DEPLOY_DIR, "git", ["checkout", "--detach", commit]);
  return false;
}

function startServer(port, env) {
  console.log(`▶ 生产看板 http://localhost:${port}  产物目录 ${env.PELICAN_DATA_DIR}`);
  const child = spawn("pnpm", ["start", "--port", String(port)], { cwd: DEPLOY_DIR, env, stdio: "inherit" });
  // 前台运行：Ctrl+C 或上层结束本进程时一并停掉看板
  for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => child.kill(signal));
  child.on("exit", (code) => process.exit(code ?? 0));
}

function readPort(args) {
  const index = args.indexOf("--port");
  if (index === -1) return DEFAULT_PORT;
  const port = Number(args[index + 1]);
  if (!Number.isInteger(port) || port <= 0 || port > 65535) fail(`--port 取值无效：${args[index + 1]}`);
  return port;
}

function assertPortFree(port) {
  return new Promise((resolve) => {
    const probe = createServer();
    probe.once("error", () => fail(`端口 ${port} 已被占用；先停掉占用它的进程（例如 next dev），或用 --port 换一个`));
    probe.listen(port, () => probe.close(() => resolve()));
  });
}

function git(cwd, ...args) {
  return execFileSync("git", args, { cwd, encoding: "utf8" }).trim();
}

function run(cwd, command, args, env = process.env) {
  console.log(`$ ${command} ${args.join(" ")}   (${path.relative(REPO_ROOT, cwd) || "."})`);
  execFileSync(command, args, { cwd, env, stdio: "inherit" });
}

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}
