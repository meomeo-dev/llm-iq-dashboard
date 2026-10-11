# 运维与工程交接文档 (Handoff Guide)

> **文档定位**：本文件为系统当前状态的运维与协作者交接文档。  
> **更新日期**：2026-10-11  
> **当前状态**：评测自动化、作品评审（代码层 + AI 语义层）、数据脱敏同步与两容器部署已完成；
> 只读公开展台运行于 <https://llm-iq-dashboard.vercel.app>。当前版本 v0.7.0，之后的改动见
> `CHANGELOG.md` 的「未发布」。

---

## 1. 项目全貌与两仓分工

系统由两个物理隔离、职责明确的开源代码/数据仓库组成：

| 仓库名称 | GitHub 远程地址 | 本地工作副本路径 | 职责范围与开源协议 |
| :--- | :--- | :--- | :--- |
| **主工程看板仓**<br/>`llm-iq-dashboard` | [`meomeo-dev/llm-iq-dashboard`](https://github.com/meomeo-dev/llm-iq-dashboard) | 本工程根目录 | **系统源码与本地控制台**<br/>• Next.js 15 看板、调度器、CLI 适配器、作品评审、数据同步流水线<br/>• 协议：**MIT License** |
| **公开数据仓**<br/>`llm-iq-data` | [`meomeo-dev/llm-iq-data`](https://github.com/meomeo-dev/llm-iq-data) | 同级目录 `../llm-iq-data` | **评测结果与矢量作品归档**<br/>• 仅存放脱敏后成果（`run.json`、`*.svg`、`index.json`）<br/>• 协议：**代码 MIT + 数据/作品 CC-BY-4.0** |

数据仓是哪一个由配置 `dataRepo.repository` 决定（配置页「数据仓设置」可改）；本地副本的
`origin` 与之不一致时拒绝同步。

### 纪律与规则（详见 `AGENTS.md`）
- **代码与数据物理分离**：本地评测运行产物（`data/`，含 `data/runs/`）严禁提交到主看板代码仓，仅经脱敏后写入公开数据仓。
- **发布须经人工确认**：向数据仓推送即公开发布，只在所有者确认后发生——看板面板的「推送」二次确认，
  或宿主机操作者手动 `git push`。推送令牌只存放在 runner 专用卷 `runner-secrets`，web 容器不挂该卷。
- **数据契约唯一权威**：数据仓格式与多级时序布局的权威契约为本仓库 `src/core/data-repo/contract.ts`；数据仓只追加（Append-Only），已归档轮次不改写、不删除。
- **永不发布题目**：`UNPUBLISHABLE_PROMPT_IDS` 清单内题目的题面与结果永不上传至公开数据仓，由两仓代码双重强制阻断（见 `AGENTS.md`）。
- **评审配额**：AI 语义层的裁判调用真实消耗配额，历史作品不补评。

---

## 2. 核心能力与入口命令

| 功能领域 | 入口命令 / 地址 | 功能描述 |
| :--- | :--- | :--- |
| **单次执行** | `pnpm run:once` | 手动发起一轮基准评测（真实调用 CLI、消耗配额） |
| **常驻调度** | `pnpm scheduler` | 宿主机直跑时的常驻定时调度，按配置节奏与自动任务开关执行 |
| **执行器** | `pnpm runner` | 分容器部署时 runner 容器的执行进程：调度、执行看板请求、评审与自动同步 |
| **生产看板** | `pnpm dashboard:prod` | 检出已提交的 HEAD 到同级目录构建并在 :3000 启动 |
| **开发看板** | `pnpm dev --port 3001` | 开发服务器，端口避开生产看板 |
| **环境自查** | `pnpm preflight` | 预检 Node 环境、配置合法性、三家 CLI 登录态与价格目录 |
| **引导登录** | `pnpm onboard` | 交互式逐家引导完成 `claude` / `codex` / `agy` 账号授权 |
| **设备配对** | `pnpm pair` | 生成临时配对码，配对本地浏览器为所有者管理控制台 |
| **价格同步** | `pnpm pricing:sync` | 按锁文件拉取公开价格目录并校验 sha256 完整性 |
| **题库校验** | `pnpm validate:prompts` | 校验题库规范、候选集完备性与评判标准 |
| **数据同步** | `pnpm sync:data [options]` | 执行数据仓脱敏导出、提交、发布确认或推送 |
| **评审补跑** | `pnpm judge:backfill -- --dry-run` | 对本地历史作品预演代码层评审；`--ai-only` 只在明确要求时按轮运行 |
| **展台自检** | `pnpm showcase:smoke` | 端到端校验公开只读模式、远程数据拉取与安全边界 |
| **健康检查** | `GET /api/health` | 返回部署模式（只读、数据源）、远程数据仓连通性（仅 remote 模式）与版本号 |

### 2026-09-27 之后上线的能力

逐项设计见 `docs/architecture/revisions/`，用户可见的变化见 `CHANGELOG.md`。

- **上游 profile**（ACR-013～016）：codex 多 profile，每个 profile 一个 app-server 与临时 home；
  「跑一次」可多选上游；看板提供上游对比视图与大图页同轮切换。
- **结果集导出 GIF**（ACR-017）：按时刻定格各作品的动画帧合成。
- **数据仓发布范围**（ACR-018）：发布 profile 结果、题目白名单 `publishPrompts`、面板按轮次勾选导出、
  丢弃与恢复。
- **作品评审**（ACR-019～021）：动态鹈鹕车的代码层（静态解析 + 无头 Chromium 量测，30 分）与
  AI 语义层（裁判 CLI 看联系图，盲描述 → 定位部位 → 按 C5–C9 打 70 分）。
- **Git 钩子**（ACR-022）：lefthook 管理 pre-commit 与 pre-push。
- **数据仓网页配置**（ACR-023）：配置页可改 `dataRepo.repository`，执行器按地址 clone 本地副本。
- 其余：直出约束 `run.harnessGuard`、定时轮次排队、时间线行标签的鹈鹕通过率、竖版时间线导出。

---

## 3. 标准运维操作规程

### 3.1 数据同步流程（所有者面板优先，CLI 备用）

系统提供看板网页面板与终端 CLI 两种操作入口，二者共用底层同步流水线与本地台账：

1. **看板面板操作（首选）**：
   所有者登录后进入看板 `/config` 页：
   - 「数据仓设置」区块填写数据仓地址 `repository`、本地路径 `path`、`autoSync` 与 `push`；
   - 「数据仓」区块查看工作副本连通性、当前分支与上游、领先/落后提交数及待同步轮次；
   - 勾选要导出的轮次，或丢弃不发布的轮次（台账记 `skipped/discarded`，可恢复）；
   - 点击「演练」预览待导出与脱敏情况（无写操作）；
   - 点击「导出」执行脱敏归档并生成本地 `chore(data)` Git 提交；
   - 点击「发布确认」基于匿名 fetch 校验上游祖先关系，自动回填 `published` 状态；
   - 点击「推送」：二次确认框核对即将公开的提交短哈希列表，确认后由 runner 经授权的 GitHub App 推送（未授权时提示连接 GitHub 或在宿主机推送）。

2. **CLI 运维工具（备用，`pnpm sync:data`）**：
   参数与说明：
   - `--repo <path>`：数据仓本地路径（缺省读取 `pelican.config.yaml` 的 `dataRepo.path`）；
   - `--dry-run`：演练模式，任何地方都不写入，仅输出详细报告；
   - `--run <runId>`：指定同步的单个轮次（可多次传入）；
   - `--confirm-published`：发布确认模式，执行匿名 `git fetch` 并将已被远端包含的轮次标为 `published`；
   - `--push`：同步提交后执行 `git push`（与 `--confirm-published` 互斥）；
   - `--json`：以标准 JSON 结构输出执行结果。

   退出码定义：`0` 成功；`1` 执行出错（配置有误、工作区不干净、fetch/push 失败）；`2` 存在脱敏拦截拒绝发布或冲突。

### 3.2 容器部署与发布闭环工作流（网页优先，宿主机备用）
在两容器部署（`compose.yaml`：`llm-iq-web` 与 `llm-iq-runner`）架构下：
1. **自动导出与提交**：
   - `compose.yaml` 把宿主机数据仓（`${PELICAN_DATA_REPO_DIR:-../llm-iq-data}`）挂载至 runner 的 `/data-repo`，配置 `dataRepo.path: /data-repo`、`autoSync: true`、`push: false`；该宿主机路径须加入 Docker Desktop 的 File Sharing；
   - 填了 `dataRepo.repository` 时，挂进来的是空目录也行，runner 启动时按地址 clone；
   - runner 每轮评测结束自动完成脱敏归档，并在 `/data-repo` 生成 `chore(data)` 提交，台账记录为 `status: exported`。
2. **网页一键授权与推送（首选闭环）**：
   - 所有者在看板 `/config` 页点击「连接 GitHub」，按流程创建 GitHub App 并安装至 `dataRepo.repository` 指定的数据仓；
   - 推送凭据自动保存在 runner 专用卷 `runner-secrets` 中（web 容器不接触任何密钥）；
   - 在面板点击「推送」核对领先提交列表后确认，runner 自动刷新令牌并推送，自动更新台账为 `published`。
3. **宿主机人工发布（备用）**：
   - 若未连接 GitHub App，宿主机操作者可使用宿主机 Git 凭据推送：
     ```bash
     git -C ../llm-iq-data push
     ```
   - 推送后在看板点击「发布确认」，或等待 runner 下次评测自动确认回填 `published` 状态。
4. **升级容器**：先确认 runner 空闲（最近一轮的 `run.json` 有 `finishedAt`，评审队列没有
   `queued` / `running`），再在仓库目录执行 `docker compose up -d --build`。升级只替换镜像与容器，
   数据、凭据与 CLI 登录态所在的卷保持不变；不要带 `-v` 执行 `down`。详见 `docs/deploy-docker.md`。

### 3.3 历史轮次滚动保留与修剪守卫
- 由 `retention.days` 控制历史轮次保留天数；每轮评测启动前由 `pruneExpiredRuns` 执行清理巡检，
  与数据仓动作共用一把锁，拿不到锁时跳过本次修剪；
- 过期且台账为 `published`、`skipped/unpublishable-prompt`、`skipped/empty`、`skipped/discarded` 的轮次删除；
- 过期且台账为 `skipped/rejected` 的轮次永不自动删除，汇总日志提示人工处理；
- 缺 `run.json` 或仍为 `inProgress` 的残轮，过期超过保留期两倍时记 `skipped/abandoned` 后删除；
- 其余未发布的过期轮次保留，防止网络异常导致数据丢失；过期空目录删除；
- 执行进程启动时收尾上一个进程没跑完的轮次：只有 `progress.json` 的目录直接删除，有 `run.json` 的置为已中断并照常导出。

### 3.4 公开展台自检与运行监控
- **展台地址**：<https://llm-iq-dashboard.vercel.app>，Vercel 经 GitHub 集成从 `main` 自动部署；
  环境变量与缓存时效见 `docs/deploy-public-showcase.md`；
- **发布前自检**：运行 `pnpm showcase:smoke`，脚本在本地拉起静态数据服务与生产构建，验证只读路由拦截（写操作 403、配对 404、配置 307）与远程数据拉取；
- **健康监控**：`GET /api/health` 返回如下结构（`dataRepo` 仅在 remote 模式下填写，本地模式为 `null`）：
  ```json
  {
    "mode": { "readonly": true, "dataSource": "remote" },
    "dataRepo": { "reachable": true, "schemaVersion": 1, "totalRuns": 128, "latestDay": "2026-10-11" },
    "version": "0.7.0"
  }
  ```

### 3.5 作品评审
- 缺省关闭，配置页「作品评审」区块开启；只有带评分标准的题目（`animated-pelican-v1`）参与；
- 代码层在作品落盘后运行；AI 语义层在整轮定稿后由 `judge.ai.judges` 中厂商与作品不同的第一个裁判评，
  评审进程中途退出的队列由下一个执行进程启动时续评；
- 评分口径改动升 `src/core/judge/schema.ts` 的 rubric `version`；只修解析、量测或截帧逻辑时
  只升实现版本（`static-judge@N` / `render-judge@N`），已有记录不重评；
- `pnpm judge:backfill -- --dry-run` 只预演代码层；`--ai-only` 会真实消耗配额，只在明确要求时运行。

---

## 4. 需人工完成的事项

以下步骤涉及账号登录、私有凭据或公开发布，须由运维或所有者人工完成：

1. **CLI 登录**：容器部署后在宿主机执行 `docker exec -it llm-iq-runner pnpm onboard`，逐家登录；
   登录态存于各自的卷，升级不需要重新登录。
2. **发布确认**：面板「推送」的二次确认，或未连接 GitHub App 时在宿主机执行：
   ```bash
   git -C ../llm-iq-data status
   git -C ../llm-iq-data log -n 5 --oneline
   git -C ../llm-iq-data push
   ```
3. **Docker Desktop File Sharing**：数据仓的宿主机路径须加入 File Sharing，修改时 Docker Desktop
   需完全退出，其他容器会短暂中断。

---

## 5. 质量门禁要求

在本仓库进行任何代码改动并提交前，必须依次通过以下质量门禁：

```bash
pnpm lint               # TypeScript 类型检查，含 test/
pnpm test               # 单元与集成测试，不调用 CLI、不读本机 data/
pnpm validate:prompts   # 题库与候选条目完整性校验
pnpm build              # Next.js 生产构建
pnpm check:length       # 文件与函数长度门禁（config/code-length-policy.yaml）
pnpm check:secrets      # 已跟踪文件的密钥扫描（config/secret-scan-policy.yaml）
```

若改动涉及只读展示或远程数据源逻辑，另须通过 `pnpm showcase:smoke`。

Git 钩子由 lefthook 管理（`lefthook.yml`），`pnpm install` 时自动安装：pre-commit 并行跑
`check:secrets`、`lint`、`check:length`，pre-push 跑 `validate:prompts` 与 `test`。确认误报时用
`LEFTHOOK=0 git commit` 绕过一次；容器构建用 `CI=1 pnpm install` 跳过装钩子。
