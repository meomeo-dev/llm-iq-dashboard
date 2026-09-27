#!/bin/sh
# 把三家 CLI 安装到 CLI 卷（$PELICAN_CLI_HOME，默认 /opt/clis）。镜像不含这些程序，
# 由容器启动时从各家官方渠道下载。已装且版本一致的跳过；claude / codex 的钉定版本
# （CLAUDE_CODE_VERSION、CODEX_VERSION）变化时重装。登录态在各自的卷里，不受影响。
# 退出码：全部就绪为 0，任一安装失败为 1。
set -u

CLI_HOME="${PELICAN_CLI_HOME:-/opt/clis}"
NPM_PREFIX="$CLI_HOME/npm"
BIN_DIR="$CLI_HOME/bin"
AGY_INSTALLER_URL="https://antigravity.google/cli/install.sh"
AGY_ATTEMPTS=3
mkdir -p "$NPM_PREFIX" "$BIN_DIR"

# npm 发布的 CLI：<包名> <版本> <命令名>
install_npm_cli() {
  package=$1
  version=$2
  command=$3
  manifest="$NPM_PREFIX/lib/node_modules/$package/package.json"
  installed=$(node -p "require('$manifest').version" 2>/dev/null || true)
  if [ "$installed" = "$version" ]; then
    echo "✓ $command $version"
    return 0
  fi
  echo "安装 $command $version …"
  if ! npm install -g --prefix "$NPM_PREFIX" --no-fund --no-audit "$package@$version" >/dev/null; then
    echo "✗ $command 安装失败" >&2
    return 1
  fi
  echo "✓ $command $version"
}

# agy 只提供最新版安装脚本（按官方清单的 sha512 校验），装好后由它自己在后台更新。
# 先下载再执行：sh 没有 pipefail，`curl | bash` 在下载失败时仍以 0 退出。
install_agy() {
  if [ -x "$BIN_DIR/agy" ]; then
    echo "✓ agy $("$BIN_DIR/agy" --version 2>/dev/null | head -n 1)"
    return 0
  fi
  echo "安装 agy …"
  # 官方安装脚本下载程序包时不重试，网络抖动就会失败，所以整体最多试 AGY_ATTEMPTS 次
  attempt=1
  while [ "$attempt" -le "$AGY_ATTEMPTS" ]; do
    if try_install_agy; then
      echo "✓ agy $("$BIN_DIR/agy" --version 2>/dev/null | head -n 1)"
      return 0
    fi
    attempt=$((attempt + 1))
    sleep 3
  done
  echo "✗ agy 安装失败" >&2
  return 1
}

try_install_agy() {
  installer=$(mktemp)
  curl -fsSL --retry 5 --retry-all-errors -o "$installer" "$AGY_INSTALLER_URL" \
    && bash "$installer" --dir "$BIN_DIR" >/dev/null 2>&1 \
    && "$BIN_DIR/agy" --version >/dev/null 2>&1
  result=$?
  rm -f "$installer"
  return "$result"
}

status=0
install_npm_cli @anthropic-ai/claude-code "$CLAUDE_CODE_VERSION" claude || status=1
install_npm_cli @openai/codex "$CODEX_VERSION" codex || status=1
install_agy || status=1
exit "$status"
