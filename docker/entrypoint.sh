#!/bin/sh
# 容器入口：`entrypoint.sh web` 只跑看板；`entrypoint.sh runner` 安装 CLI、自查并常驻执行器。
# 两个容器共用数据卷，看板容器不挂凭据卷、不装 CLI（见 compose.yaml）。
set -eu

MODE="${1:-web}"

# 配置放在数据卷里，重建容器不丢；首次启动由起步模板生成
if [ ! -f "$PELICAN_CONFIG" ]; then
  mkdir -p "$(dirname "$PELICAN_CONFIG")"
  cp /app/config/pelican.example.yaml "$PELICAN_CONFIG"
  echo "已从起步模板生成配置 $PELICAN_CONFIG"
fi

case "$MODE" in
  web)
    exec /app/node_modules/.bin/next start --hostname 0.0.0.0 --port 3000
    ;;
  runner)
    if [ -n "${PELICAN_SECRETS_DIR:-}" ]; then
      if [ -d "$PELICAN_SECRETS_DIR" ] && [ -w "$PELICAN_SECRETS_DIR" ]; then
        chmod 700 "$PELICAN_SECRETS_DIR" 2>/dev/null || true
      elif mkdir -p "$PELICAN_SECRETS_DIR" 2>/dev/null && [ -w "$PELICAN_SECRETS_DIR" ]; then
        chmod 700 "$PELICAN_SECRETS_DIR" 2>/dev/null || true
      else
        echo "警告：凭据目录 $PELICAN_SECRETS_DIR 不存在或不可写，GitHub App 凭据功能可能不可用"
      fi
    fi

    # CLI 不在镜像里，首次启动时下载安装，之后只核对版本；失败不阻止启动，重启容器会重试
    if ! sh /app/docker/install-clis.sh; then
      echo "提示：有 CLI 安装失败（多为网络问题），重启容器会重试：docker restart llm-iq-runner"
    fi

    # 镜像升级后锁文件可能指向新版本的价格目录；失败只警告
    pnpm -s pricing:sync --soft || true

    # 自查并把 CLI 登录状态记到看板读取的缓存；有问题不阻止启动，看板页首会提示
    if ! pnpm -s preflight; then
      echo "提示：有 CLI 尚未就绪，在宿主机运行 docker exec -it llm-iq-runner pnpm onboard 完成登录"
    fi

    exec node /app/node_modules/tsx/dist/cli.mjs /app/src/bin/runner.ts
    ;;
  *)
    echo "未知模式：$MODE（可选 web | runner）" >&2
    exit 64
    ;;
esac
