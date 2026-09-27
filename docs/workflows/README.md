# 基准研发工作流规范 Prompt（Benchmark Research & Ingestion Workflows）

本目录存放用于大模型基准题目调研、清洗与净室落地的标准化提示词工作流：

* [`frontier-benchmark-research.workflow.prompt.yaml`](./frontier-benchmark-research.workflow.prompt.yaml)：
  * **适用场景**：面向前沿工程与前沿视觉特效领域的新题目扩充与定期更迭；
  * **执行模式**：自下而上宏观分类学抓取 ➜ 分批次并发 3 子代理深度检索（每领域 $\ge 30$ 轮） ➜ 纯直观矢量 SVG 净室设计 ➜ 客观黄金标准与判读准则注标 ➜ 自动化 PromptSchema 门禁体检 ➜ 看板分组交互与溯源台账回填。
