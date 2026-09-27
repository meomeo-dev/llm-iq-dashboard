# llm-iq-dashboard 代理须知

本文件记录在本仓库工作的长期规则，适用于所有编码代理与协作者。

## 代码与数据分离

- 评测运行产物（`data/`，含 `data/runs/`）不进入本仓库。
- 运行结果只经 `pnpm sync:data` 脱敏后写入公开数据仓
  [`meomeo-dev/llm-iq-data`](https://github.com/meomeo-dev/llm-iq-data)，
  本地工作副本位于同级目录 `../llm-iq-data`。
- 向数据仓推送（`--push` 或 `git push`）会公开发布数据，须先经人工确认。
- 数据仓布局与记录格式的唯一契约是 `src/core/data-repo/contract.ts`；改动契约时同步更新
  数据仓的 `schemas/` 与 `scripts/lib/validator.mjs`。

## 永不发布的题目

- `leijun-v1`（雷军骑自行车）只是本地测试题，其题面与结果永远不上传到 llm-iq-data。
- 规则由两处代码强制，二者须保持一致：
  - 本仓库 `src/core/data-repo/contract.ts` 的 `UNPUBLISHABLE_PROMPT_IDS`：同步时剔除；
  - 数据仓 `scripts/lib/validator.mjs` 的 `UNPUBLISHABLE_PROMPT_IDS`：CI 拒收。
- 新增以真人为主体或仅供本地测试的题目时，加入上述两处清单。
- 不要用 `--run` 指定、手工复制或其他方式绕过这条规则。

## 质量门

提交前运行：`pnpm lint`、`pnpm test`、`pnpm validate:prompts`、`pnpm build`、
`pnpm check:length`（文件与函数长度阈值见 `config/code-length-policy.yaml`）。
改动只读部署或远程数据源时，另跑 `pnpm showcase:smoke`。
