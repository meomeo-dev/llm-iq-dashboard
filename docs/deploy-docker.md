# Docker 部署

两个容器共用一个镜像：`llm-iq-web` 只跑看板、开端口、只挂数据卷；`llm-iq-runner` 装三家
CLI（claude / codex / agy）、挂登录态卷、不开端口，负责调度与执行。看板发起的一轮经数据卷里
的请求文件交给 runner，凭据从不出现在开端口的容器里。镜像只含开源组件，三家 CLI 在 runner
首次启动时从各家官方渠道安装；登录态与运行产物放在命名卷中，镜像本身不含任何账号信息。
各家都用订阅账号在 runner 里独立登录一次，之后重启、重建容器都不必再登。

## 快速开始

以下命令都在宿主机终端里执行，看板与命令输出里给出的提示也是宿主机命令。
`docker compose` 要在仓库目录下执行（它读仓库里的 `compose.yaml`）；容器名固定为
`llm-iq-web` 与 `llm-iq-runner`，`docker exec` 在任何目录都能用，登录与配对都在 runner 里执行。

```bash
docker compose up -d --build
docker exec -it llm-iq-runner pnpm onboard
docker exec -it llm-iq-runner pnpm pair
```

1. 第一条构建镜像并在后台启动两个容器。runner 首次启动时安装三家 CLI（需联网，约一两
   分钟）、按起步模板生成配置、同步价格目录、探测能力目录，并把各 CLI 的登录状态记下来；
   看板在 <http://localhost:3000>。进度见 `docker logs -f llm-iq-runner`。
2. 第二条逐家引导登录：已登录的跳过，没登录的就地启动该 CLI 自带的登录流程，终端里
   给出链接或设备码，在任意设备的浏览器里用自己的订阅账号授权；每家登完立即复查，
   最后打印环境汇总。只想登其中几家时带上名字，如
   `docker exec -it llm-iq-runner pnpm onboard claude agy`。
3. 第三条打印一个 10 分钟内有效、只能用一次的配对码；在浏览器打开看板右上角的钥匙
   图标（`/pair`）填入，这台浏览器即成为所有者。不配对也能看结果，但配置、跑一次与
   自动任务开关只对所有者显示。`pnpm pair --list` 列出设备，`--revoke <id>` 吊销一台，
   `--revoke-all` 清空；配置页末尾也能逐台吊销。
4. 回到看板点“跑一次”。可选范围是配置里的目标与当前能调用的 CLI 的交集：未登录的
   CLI 的模型暂不列出，配置不变；页首列出这些 CLI 并给出上面的命令，登录后它们的
   模型自动回到清单（用其他方式登录的，在页首点“重新检查”）。不打算使用的 CLI，
   在配置页（`/config`）删除它的目标；页首提示上的“不再提示”只在当前浏览器隐藏
   提示，不改配置，该 CLI 的目标每轮仍会记一条错误。

`pnpm onboard` 在容器里启动的登录流程如下，无需手动执行。

| CLI | 登录方式 | 登录态所在的卷 |
| --- | --- | --- |
| claude | `claude auth login --claudeai`：复制链接到浏览器授权，把授权码粘贴回终端 | `claude-auth` → `~/.claude` |
| codex | `codex login --device-auth`：浏览器打开链接，输入终端显示的设备码 | `codex-auth` → `~/.codex` |
| agy | 不带参数运行 `agy`，按提示登录 Google 账号；出现对话输入框即已登录，`/exit` 退出 | `agy-auth` → `~/.gemini` |

令牌会自动刷新并写回卷里。宿主机与容器各自登录、互不共用凭据：共用同一份凭据时，
一方刷新令牌会让另一方失效。

## 数据与配置

| 卷 | 挂载点 | 内容 |
| --- | --- | --- |
| `pelican-data` | `/app/data`（两个容器） | 运行记录、配置 `pelican.config.yaml`、价格目录、自动任务开关、设备表、审计日志、请求文件 |
| `cli-tools` | `/opt/clis`（仅 runner） | 三家 CLI 的程序文件；删掉后下次启动重新下载，不影响登录态 |
| `claude-auth` / `codex-auth` / `agy-auth` | `/home/node/.claude` 等（仅 runner） | 各家登录态；删掉某个卷即退出该 CLI 的登录 |

容器首次启动时使用起步配置（三家各一个轻量模型），与本机直跑时维护的矩阵不同。
要沿用本机的配置，把它拷进容器（留意本机矩阵的每轮成本，见其 `budget` 设置）：

```bash
docker cp config/pelican.config.yaml llm-iq-runner:/app/data/pelican.config.yaml
```

之后在看板的 `/config` 页修改即可。要直接编辑文件：

```bash
docker cp llm-iq-runner:/app/data/pelican.config.yaml ./pelican.config.yaml
docker cp ./pelican.config.yaml llm-iq-runner:/app/data/pelican.config.yaml
```

宿主机的 3000 端口被占用时，用 `PELICAN_PORT` 换一个端口启动，其余命令不变：

```bash
PELICAN_PORT=3100 docker compose up -d
```

`docker exec` 报容器不存在或未运行时，先在仓库目录执行 `docker compose up -d`。

### 宿主机上限

以下环境变量在 `compose.yaml` 或 `.env` 里设置，容器内的配置与看板只能在其下调整：

| 变量 | 作用 |
| --- | --- |
| `PELICAN_CEILING_PER_DAY_USD` | 近 24 小时花费上限（美元）；配置里的 `budget.perDayUsd` 取两者较小者 |
| `PELICAN_CEILING_PER_ROUND_USD` | 单轮预测成本上限（美元）；同上 |
| `PELICAN_ALLOW_EXTRA_ARGS` | 设为 `1` 才允许配置里的 `targets[].extraArgs` 生效；默认含该字段的配置校验失败 |

三家 CLI 的调用都不给模型工具（读文件、跑命令一律拒绝）；每轮开始时读取凭据文件生成
指纹，模型输出里出现凭据片段的调用记为 error，作品与转录不落盘。

排查环境用 `docker exec -it llm-iq-runner pnpm preflight`；看板输出见 `docker logs -f llm-iq-web`，
调度与执行输出见 `docker logs -f llm-iq-runner`。看板报"执行器未响应"时先看 runner 是否在跑
（`docker compose ps`）。

## 升级与登录态

令牌自动刷新并写回卷里，升级不需要重新登录。频繁重新登录可能触发账号风控。

升级本项目（拉取更新、重建镜像、替换容器）：

```bash
git pull
docker compose up -d --build
```

升级只替换镜像与容器，登录态与数据所在的卷保持不变；构建失败时正在运行的容器不受
影响。

| 操作 | 登录态 |
| --- | --- |
| `docker compose up -d --build`、`restart`、`stop` / `start`、`down`（不带 `-v`） | 保留 |
| 重启电脑或 Docker | 保留 |
| `docker compose down -v`、`docker volume rm llm-iq-dashboard_*-auth` | **清除，需要重新登录** |
| 修改 `compose.yaml` 里的 `name`、卷名或挂载路径 | **找不到原来的卷，需要重新登录** |

claude 与 codex 的版本钉在 `docker/Dockerfile` 的 `CLAUDE_CODE_VERSION`、`CODEX_VERSION`：
容器启动时按这两个版本安装，已装的版本一致就跳过。需要新版（例如新模型要求更新的
CLI）时改这两个值，再执行上面的升级命令。agy 的安装脚本只提供最新版（按官方清单的
sha512 校验），装好后由 agy 自己在后台更新。登录态与 CLI 版本无关，只有某家改动凭据
格式时才需要重新登录。

CLI 安装失败（多为网络问题）时看板照常启动，页首提示哪家未安装；重启容器会重试，
也可以手动安装：

```bash
docker exec -it llm-iq-runner sh docker/install-clis.sh
```

凭据文件的位置（均在对应的卷里）：claude 为 `~/.claude/.credentials.json`，codex 为
`~/.codex/auth.json`，agy 为 `~/.gemini/antigravity-cli/antigravity-oauth-token`（容器里
没有系统钥匙串，agy 退到文件存储）。

## 设计取舍

- **看板与凭据分容器**：Web 进程被攻破也拿不到登录态——它的文件系统里没有。两个容器
  只经数据卷交换状态：看板把"跑一次"、就绪检查与能力探测写成 `data/requests/` 下的请求
  文件，runner 认领执行并写回结果；停止与自动任务开关本来就是文件。看板看不见 runner 的
  pid，改看 runner 每 15 秒写的心跳（`data/runner.json`）判断某轮的执行进程是否还在。
- **调度器常驻 runner**：自动任务开关保存在数据卷里，runner 到点读取；重启容器后不必再拨。
- **只对本机开放**：`compose.yaml` 把端口绑定在 `127.0.0.1`。公网暴露的分层方案见
  `docs/security/public-exposure-design.md`。
- **不提供网页上传凭据**：原因同上；登录在终端里由 CLI 自己完成。
- **非 root 运行**：容器内以 `node` 用户运行，登录态目录与数据目录属于该用户。
- **镜像不含 CLI**：claude 与 agy 是专有软件，条款未授予再分发权；镜像只含开源组件，
  CLI 由每个使用者在自己的容器里从官方渠道安装。

## 已知限制

- codex 在容器内的登录（`codex login --device-auth`）与调用未经验证。
- codex 的只读沙箱依赖 Linux 的 Landlock 与 seccomp，在 Docker 默认安全配置下未经
  验证；出现沙箱相关错误时查看该次调用的 `.txt` 原始输出。
- 镜像按构建机的架构生成（amd64 或 arm64）；三家 CLI 都提供这两种架构的 Linux 版。
- 首次启动需要能访问 npm 与 antigravity.google。
