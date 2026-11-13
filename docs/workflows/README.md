# 基准研发工作流规范 Prompt（Benchmark Research & Ingestion Workflows）

本目录存放用于大模型基准题目调研、清洗与净室落地的标准化提示词工作流：

* [`frontier-benchmark-research.workflow.prompt.yaml`](./frontier-benchmark-research.workflow.prompt.yaml)：
  * **适用场景**：面向前沿工程与前沿视觉特效领域的新题目扩充与定期更迭；
  * **执行模式**：自下而上宏观分类学抓取 ➜ 分批次并发 3 子代理深度检索（每领域 $\ge 30$ 轮） ➜ 纯直观矢量 SVG 净室设计 ➜ 客观黄金标准与判读准则注标 ➜ 自动化 PromptSchema 门禁体检 ➜ 看板分组交互与溯源台账回填。

* [`x-viral-benchmark-harvest.workflow.prompt.yaml`](./x-viral-benchmark-harvest.workflow.prompt.yaml)：
  * **适用场景**：面向每月常态化回顾上一个月（或指定月份）在 X（Twitter）及技术社区流行的爆款评测题目收集与去重入库；
  * **执行模式**：调用 `grok` 命令行下达不少于 50 轮深层联网检索指令 ➜ 提取推文原出处与争议焦点 ➜ 针对全库既有题库严格去重 ➜ 商业商标中立化与真实人物剔除 ➜ 纯内联动态矢量 SVG（0 `<script>`，动量下界门禁）净室重构 ➜ TypeScript 模块注册与看板月度分组 ➜ 溯源台账更新与五重 CI 门禁验收。
