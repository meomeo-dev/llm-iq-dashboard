# 公开只读展台部署指南 (Deploy Public Showcase)

本文档说明如何将 LLM-IQ 看板作为公开成果展台部署到 Serverless / 云平台（如 Vercel），
展示公开数据仓中的评测历史与作品，同时在服务端保持严格的安全边界。

---

## 1. 架构与适用场景

- **适用平台**：Vercel、Netlify 等无常驻后台进程、文件系统只读的 Serverless 运行环境。
- **数据流向**：看板不再依赖本地 `data/` 目录，而是通过远程数据源模块向公开数据仓
  （`meomeo-dev/llm-iq-data`）按需请求轮次清单与脱敏后的作品。
- **只读保证**：安全边界由服务端强行约束，即便直接调用 API 也无法触发模型执行或修改配置。
- **评审结果**（ACR-020）：公开 `run.json` 的调用内嵌评审记录（`judge` 字段），展台卡片与作品页
  显示同样的智商在线 / 降智标签与逐项分；联系图与裁判转录不发布，展台抽屉里没有它们。

---

## 2. 环境变量配置

所有配置项均在服务端解析，**不使用** `NEXT_PUBLIC_` 前缀，客户端仅接收展示所需的只读 props。

| 环境变量名 | 推荐取值 | 必填 | 说明 |
|---|---|---|---|
| `PELICAN_READONLY` | `1` | 推荐 | 强制只读部署。写接口拦截为 403，配对页面 404，不触达磁盘写入。 |
| `PELICAN_DATA_SOURCE` | `remote` | 是 | 启用远程数据源，从数据仓读取数据。未设置 `PELICAN_READONLY` 时将自动隐含只读模式并记日志警告。 |
| `PELICAN_DATA_REPO_URL` | `https://raw.githubusercontent.com/<org>/<repo>/main` | 否 | 公开数据仓根地址。缺省为 `https://raw.githubusercontent.com/meomeo-dev/llm-iq-data/main`。 |

自建数据仓：以 [`meomeo-dev/llm-iq-data`](https://github.com/meomeo-dev/llm-iq-data) 为模板建仓
（其 README「作为模板建立自己的数据仓」一节），执行侧 `dataRepo.path` 指向它的本地副本，首次同步生成的
`index.json` 会从该仓的 `origin` 远程推导 `name` 与 `repository`；展台把 `PELICAN_DATA_REPO_URL` 指向
它的 raw 根地址即可，数据仓的 CI 会在每次推送时复跑契约校验与泄漏扫描。

---

## 3. 部署前自检 (Pre-deployment Checklist)

在将代码推送或在平台触发构建前，务必在本地执行全链路自检：

1. **运行冒烟测试**：
   ```bash
   pnpm showcase:smoke
   ```
   该脚本会使用本地夹具起静态数据仓，以 `PELICAN_READONLY=1 PELICAN_DATA_SOURCE=remote`
   启动生产级构建与服务，端到端断言首页呈现、`/api/health` 连通性、作品 CSP 沙箱策略、
   写操作 403 阻断及配置重定向。

2. **必需的环境变量清单**：
   - `PELICAN_READONLY=1`：强制只读，杜绝写操作。
   - `PELICAN_DATA_SOURCE=remote`：开启远程数据源模式。
   - `PELICAN_DATA_REPO_URL`：公开数据仓的根地址（缺省为官方数据仓）。

3. **健康检查验证**：
   - 部署完成后请求 `GET /api/health`（公开、只读、无副作用）；
   - 返回 HTTP 200 且 `dataRepo.reachable === true` 即为正常；
   - 若远程源不可达，接口同样返回 HTTP 200，但给出 `reachable: false` 与中文诊断原因，
     且保证不泄露任何本机文件绝对路径或系统环境变量。

4. **刷新节奏 60 秒的含义与限制**：
   - **含义**：清单（`index.json`）与日索引附带 `next: { revalidate: 60 }`，由 Next.js
     在边缘节点维护 60 秒增量再生成（ISR）缓存；
   - **限制**：数据仓有新轮次发布后，公开看板最长在 60 秒内同步展示，不支持秒级强实时；
     已入库的作品 SVG 为只追加且不可变，返回 24 小时长期缓存。

5. **价格目录打包核对（`outputFileTracingIncludes`）**：
   - 看板在 `next.config.ts` 中配置了 `outputFileTracingIncludes: { "/**": ["data/pricing/**/*"] }`；
   - 在构建安装阶段通过 `postinstall` 软同步下载锁文件指定的价格目录附件；
   - **降级表现**：若部署平台因离线环境导致未打包到价格附件，看板会优雅退化，
     作品卡片的成本字段显示为“未同步 / 未知”，不会引发 SSR 崩溃或 500 错误。

---

## 4. Vercel 部署步骤（用户操作）

1. **导入仓库**：
   - 登录 [Vercel 控制台](https://vercel.com/)；
   - 点击 **Add New...** -> **Project**，导入本仓库。
2. **构建设置**：
   - Framework Preset：自动检测为 **Next.js**；
   - Build Command：`pnpm build`（系统默认）；
   - Install Command：`pnpm install`（系统默认）。
3. **配置环境变量**：
   在 **Environment Variables** 面板中添加：
   - `PELICAN_READONLY` = `1`
   - `PELICAN_DATA_SOURCE` = `remote`
   - `PELICAN_DATA_REPO_URL` = `https://raw.githubusercontent.com/meomeo-dev/llm-iq-data/main`（或自定义数据仓地址）
4. **触发部署**：
   - 点击 **Deploy** 开始构建；
   - 构建完成后即可分配自定义域名或使用 Vercel 分配的 `.vercel.app` 域名访问公开看板。

---

## 5. 安全边界（服务端强制）

安全不是靠在前端隐藏按钮，而是在服务端各层强行拦截：

1. **写操作 403 阻断**：
   - 所有写接口（如 `POST /api/run`、`POST /api/run/cancel`、`PUT /api/config`、`PUT /api/auto-run` 等）
     统一在 `requireOwnerAction` 守卫中判定 `isReadonly()`，直接返回 `403 Forbidden`（中文原因“只读部署”），
     不执行任何调用，且不尝试写入 `data/audit.log`。
2. **配对与配置入口关闭**：
   - `/pair` 页面与 `POST /api/pair` 接口返回 `404 Not Found`；
   - `/config` 页面访问直接重定向回首页 `/`；
   - 所有者设备 Cookie 一律不予认可（`verifySession` 恒返回 `null`）；
   - 服务端密钥 `server.key` 与设备表 `devices.json` 完全禁止触达与生成。
3. **严格的 CSP 沙箱与同源约束**：
   - 全局响应头维持同源策略（`default-src 'self'`），不放宽对第三方代码仓的跨域；
   - 浏览器不直连 GitHub raw，作品统一经由 `/art/[runId]/[file]` 服务端代理返回；
   - 作品返回头自带严格的 `Content-Security-Policy: sandbox; default-src 'none'; style-src 'unsafe-inline'; img-src data:; font-src data:;`，
     并保持不透明源（opaque origin），防止恶意 SVG 脚本执行或同源刺探。
4. **文件名登记校验**：
   - `/art/[runId]/[file]` 沿用原有的登记检查：仅当 `file` 存在于对应轮次 `run.json` 的 `attempts[].svgFile` 时才放行，
     未登记或被脱敏拦下的文件名一律返回 404，防止路径穿越与未授权文件访问。

---

## 6. 缓存与刷新节奏

- **目录与日索引**：
  - `index.json`（Manifest）与 `runs/YYYY/MM/DD/index.json`（DayIndex）
    在 fetch 时附加 `next: { revalidate: 60 }`，每 60 秒在边缘节点自动刷新，保持数据新鲜。
- **轮次与作品（只追加、不可变）**：
  - 数据仓契约保证已入库的轮次目录不改写、不删除；
  - `/art` 接口向浏览器与 CDN 返回 `Cache-Control: public, max-age=86400, immutable`，
    可被公网缓存 24 小时，极大节省带宽并提升加载性能。
- **SSE 事件通道**：
  - `/api/events` 在 remote 模式下不拉起本地 `chokidar` 监视器，返回即时全量快照并保持连接，避免客户端频繁重连。

---

## 7. 功能限制

1. **不可在线发起评测**：展台不运行命令行工具（`claude` / `codex` / `agy`），亦不具备执行器常驻调度器；
2. **成本计算**：依赖部署构建时随包打包的价格目录（由 `outputFileTracingIncludes` 追踪 `data/pricing/**/*`）；
   若缺少对应模型的价格版本，成本字段降级显示为“未同步 / 未知”，不会导致页面渲染崩溃。
