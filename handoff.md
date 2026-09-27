# 运维与工程交接文档 (Handoff Guide)

> **文档定位**：本文件为系统当前状态的运维与协作者交接文档。  
> **编写日期**：2026-09-27  
> **当前状态**：评测自动化、数据脱敏同步、发布确认门禁与两容器部署已完成；只读公开展台代码就绪，公网部署（Vercel）待人工完成。

---

## 1. 项目全貌与两仓分工

系统由两个物理隔离、职责明确的开源代码/数据仓库组成：

| 仓库名称 | GitHub 远程地址 | 本地工作副本路径 | 职责范围与开源协议 |
| :--- | :--- | :--- | :--- |
| **主工程看板仓**<br/>`llm-iq-dashboard` | [`meomeo-dev/llm-iq-dashboard`](https://github.com/meomeo-dev/llm-iq-dashboard) | 本工程根目录 | **系统源码与本地控制台**<br/>• Next.js 15 看板、调度器、CLI 适配器、数据同步流水线<br/>• 协议：**MIT License** |
| **公开数据仓**<br/>`llm-iq-data` | [`meomeo-dev/llm-iq-data`](https://github.com/meomeo-dev/llm-iq-data) | 同级目录 `../llm-iq-data` | **评测结果与矢量艺术冷归档湖**<br/>• 仅存放脱敏后成果（`run.json`、`*.svg`、`index.json`）<br/>• 协议：**代码 MIT + 数据/作品 CC-BY-4.0** |

### 纪律与规则（详见 `AGENTS.md`）
- **代码与数据物理分离**：本地评测运行产物（`data/`，含 `data/runs/`）严禁提交到主看板代码仓，仅经脱敏后写入公开数据仓。
- **发布须经人工确认**：容器与自动化流程中不存放任何公网推送凭据；数据向远端推送（`git push`）须由宿主机操作者人工确认并执行。
- **数据契约唯一权威**：数据仓格式与多级时序布局的权威契约为本仓库 `src/core/data-repo/contract.ts`；数据仓只追加（Append-Only），已归档轮次不改写、不删除。
- **永不发布题目**：`leijun-v1`（雷军骑自行车）仅用于本地测试，其题面与结果永不上传至公开数据仓，由两仓代码双重强制阻断（见 `AGENTS.md`）。

---

## 2. 已完成的核心能力与入口命令

| 功能领域 | 入口命令 / 地址 | 功能描述 |
| :--- | :--- | :--- |
| **单次执行** | `pnpm run:once` | 手动发起一轮基准评测，支持按题目与模型矩阵执行 |
| **常驻调度** | `pnpm scheduler` | 启动常驻定时调度进程，按配置节奏与自动任务开关执行 |
| **环境自查** | `pnpm preflight` | 预检 Node 环境、配置合法性、三家 CLI 登录态与用量价格表 |
| **引导登录** | `pnpm onboard` | 交互式逐家引导完成 `claude` / `codex` / `agy` 账号授权 |
| **设备配对** | `pnpm pair` | 生成临时配对码，配对本地浏览器为所有者管理控制台 |
| **价格同步** | `pnpm pricing:sync` | 按锁文件拉取公开价格目录并校验 sha256 完整性 |
| **题库校验** | `pnpm validate:prompts` | 强类型校验题库规范、候选集完备性与针对性评判标准 |
| **数据同步** | `pnpm sync:data [options]` | 执行数据仓脱敏导出、提交、发布确认或推送 |
| **展台自检** | `pnpm showcase:smoke` | 自动化端到端校验公开只读模式、远程数据拉取与安全边界 |
| **健康检查** | `GET /api/health` | 实时探测服务就绪态、数据源连通性与调度器存活动态 |

---

## 3. 标准运维操作规程

### 3.1 数据同步流程（所有者面板优先，CLI 备用）

系统提供看板网页面板与终端 CLI 两种操作入口，二者共用底层同步流水线与本地台账：

1. **看板面板操作（首选）**：
   所有者登录后进入看板 `/config` 页「数据仓」区块：
   - 查看工作副本连通性、当前分支与上游、领先/落后提交数及待同步轮次；
   - 点击「演练」预览待导出与脱敏情况（无写操作）；
   - 点击「导出」执行脱敏归档并生成本地 `chore(data)` Git 提交；
   - 点击「发布确认」基于匿名 fetch 校验上游祖先关系，自动回填 `published` 状态；
   - 点击「推送」：弹出二次确认框核对即将公开的提交短哈希列表，确认后安全推送（容器部署下禁用并提示在宿主机推送）。

2. **CLI 运维工具（备用，`pnpm sync:data`）**：
   参数与说明：
   - `--repo <path>`：数据仓本地路径（缺省读取 `pelican.config.yaml` 的 `dataRepo.path`）；
   - `--dry-run`：演练模式，任何地方都不写入，仅输出详细报告；
   - `--run <runId>`：指定同步的单个轮次（可多次传入）；
   - `--confirm-published`：发布确认模式，执行匿名 `git fetch` 并将已被远端包含的轮次标为 `published`；
   - `--push`：同步提交后执行 `git push`（与 `--confirm-published` 互斥）；
   - `--json`：以标准 JSON 结构输出执行结果。

   退出码定义：`0` 成功；`1` 执行出错（配置有误、工作区不干净、fetch/push 失败）；`2` 存在脱敏拦截拒绝发布或冲突。

### 3.2 容器部署与发布闭环工作流
在两容器部署（`compose.yaml`：`llm-iq-web` 与 `llm-iq-runner`）架构下：
1. **自动导出与提交**：
   - runner 容器将宿主机数据仓挂载至 `/data-repo`，配置 `dataRepo.path: /data-repo`、`autoSync: true`、`push: false`；
   - runner 每轮评测结束自动完成脱敏归档，并在 `/data-repo` 生成 `chore(data)` 提交，台账记录为 `status: exported`；
   - 容器内无 GitHub Token / SSH Key，不执行远程推送。
2. **宿主机人工发布**：
   - 宿主机操作者核验数据后，在宿主机终端执行 Git 推送：
     ```bash
     git -C ../llm-iq-data push
     ```
3. **状态确认回填（Confirm Published）**：
   - 方式一（自动）：runner 容器在下一次定时评测自动同步时，会自动通过匿名 fetch 与 merge-base 祖先校验完成确认，回填 `published` 状态；
   - 方式二（手动）：宿主机推送后可立即触发 runner 确认：
     ```bash
     docker compose exec runner pnpm sync:data --confirm-published
     ```

### 3.3 历史轮次滚动保留与修剪守卫
- 由 `retention.days` 控制历史轮次保留天数（例如 30 天）；
- 每轮评测启动前由 `pruneExpiredRuns` 执行清理巡检；
- **修剪守卫机制**：仅物理删除台账中确认为 `published` 的过期轮次；未确认发布的轮次由守卫安全熔断保留，防止网络异常导致数据丢失；
- 过期空目录允许删除；仅含 `progress.json` 过程文件而无 `run.json` 的目录予以保留。

### 3.4 公开展台自检与运行监控
- **发布前自检**：在部署公开展台前运行 `pnpm showcase:smoke`，脚本会在本地拉起静态数据服务与生产构建，验证只读路由拦截（写操作 403、配对 404、配置 307）与远程数据拉取；
- **健康监控**：向看板发起 `GET /api/health` 请求，可获得如下监控指标：
  ```json
  {
    "status": "healthy",
    "dataSource": "remote",
    "readonly": true,
    "dataRepo": {
      "reachable": true,
      "totalRuns": 128
    }
  }
  ```

---

## 4. 仍需人工完成的事项

以下步骤涉及外部平台控制台与私有凭据操作，须由运维或所有者人工完成：

1. **Vercel 公开展台托管部署**：
   - 登录 Vercel 控制台，选择 **Import Git Repository**，关联 `meomeo-dev/llm-iq-dashboard`；
   - 在项目设置（Settings → Environment Variables）中配置环境变量：
     * `PELICAN_DATA_SOURCE=remote`
     * `PELICAN_READONLY=1`
     * `PELICAN_DATA_REPO_URL=https://raw.githubusercontent.com/meomeo-dev/llm-iq-data/main`
   - 点击 **Deploy** 构建上线（利用 Next.js 增量缓存拉取公开数据仓）。
2. **宿主机定期人工推送发布**：
   - 定期或在重要评测轮次结束后，进入宿主机数据仓工作目录执行：
     ```bash
     git -C ../llm-iq-data status
     git -C ../llm-iq-data log -n 5 --oneline
     git -C ../llm-iq-data push
     ```

---

## 5. 质量门禁要求

在本仓库进行任何代码改动并提交前，必须依次通过以下质量门禁：

```bash
# 1. 代码规范与 TypeScript 类型检查
pnpm lint

# 2. 自动化单元与集成测试套件
pnpm test

# 3. 题库 Schema 与候选条目完整性校验
pnpm validate:prompts

# 4. Next.js 生产环境构建校验
pnpm build

# 5. 文件与函数长度门禁（阈值见 config/code-length-policy.yaml）
pnpm check:length
```
若改动涉及只读展示或远程数据源逻辑，另须通过：
```bash
pnpm showcase:smoke
```
