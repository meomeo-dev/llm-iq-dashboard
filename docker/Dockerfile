# 鹈鹕自行车基准看板的容器镜像，web 与 runner 两个容器共用（见 compose.yaml 与
# docker/entrypoint.sh）。镜像只含开源组件；三家 CLI（claude / codex / agy）在 runner 容器
# 启动时安装到 CLI 卷（见 docker/install-clis.sh）。登录态与运行产物放在卷里，镜像本身
# 不含任何账号信息。
FROM node:22-bookworm-slim

# curl 供安装 agy；git 供 CLI 在工作目录里正常识别仓库状态；
# chromium 供作品评审的渲染层定格动画、截联系图（ACR-019 / ACR-020），字体给作品里的文字
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates curl git chromium fonts-liberation fonts-noto-cjk \
  && rm -rf /var/lib/apt/lists/*

ARG PNPM_VERSION=11.24.0
RUN npm install -g "pnpm@${PNPM_VERSION}" && npm cache clean --force

# 登录态目录与数据目录先以 node 用户建好：命名卷首次挂载时沿用镜像里的属主
RUN mkdir -p /app /opt/clis /home/node/.claude /home/node/.codex /home/node/.gemini \
  && chown -R node:node /app /opt/clis /home/node
RUN mkdir -p /app/secrets && chown node:node /app/secrets && chmod 700 /app/secrets

USER node
WORKDIR /app

# claude / codex 钉版本：容器启动时按这里的版本安装，改版本号并重建后才会升级，
# 凭据格式变化导致的重新登录只在主动升级时发生
# GIT_CONFIG_*：数据仓以 bind mount 挂入 /data-repo，属主与容器内 node 用户不同，按安全目录放行
ENV CLAUDE_CODE_VERSION=2.1.283 \
    CODEX_VERSION=0.157.1 \
    PELICAN_CLI_HOME=/opt/clis \
    PATH=/opt/clis/bin:/opt/clis/npm/bin:$PATH \
    PELICAN_CONFIG=/app/data/pelican.config.yaml \
    PELICAN_BROWSER_PATH=/usr/bin/chromium \
    PELICAN_BROWSER_NO_SANDBOX=1 \
    PELICAN_COMMAND_PREFIX="docker exec -it llm-iq-runner" \
    CLAUDE_CONFIG_DIR=/home/node/.claude \
    DISABLE_AUTOUPDATER=1 \
    NEXT_TELEMETRY_DISABLED=1 \
    GIT_CONFIG_COUNT=1 \
    GIT_CONFIG_KEY_0=safe.directory \
    GIT_CONFIG_VALUE_0=/data-repo

COPY --chown=node:node . .
# postinstall 把价格目录下载到 data/，数据卷首次创建时随之复制进卷
RUN pnpm install --frozen-lockfile && pnpm build

EXPOSE 3000
ENTRYPOINT ["/app/docker/entrypoint.sh"]
CMD ["web"]
