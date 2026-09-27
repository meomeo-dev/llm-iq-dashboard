# 设计要点

鹈鹕自行车基准执行层的关键设计取舍：能力探测、可比性、隔离、安全与诊断。

## CLI 能力探测

模型清单与强度档位从命令行实时读取，以跟上 CLI 升级：

| CLI | 模型来源 | 强度来源 |
| --- | --- | --- |
| codex | `codex debug models`（JSON） | 逐模型声明，如 gpt-6-astra 支持到 `ultra`，gpt-5.5 只到 `xhigh` |
| agy | `agy models` | 带后缀的变体合并为基名（`gemini-3.8-flash` → low/medium/high）；无变体的模型不可调 |
| claude | 无列举命令 | `claude --help` 中的取值列表 |

claude 的模型来自历史成功记录、仓库内置清单与手填，界面上逐项标注来源（已探测 /
已验证 / 自定义 / 内置）。探测结果缓存在 `data/capabilities.json`，界面上可一键重新探测。

请求的强度超出该模型的支持范围时，按“不越级加码”折叠：取不高于请求档位的最高可用档。
运行记录同时保存请求档位、实际档位、以及强度是否真的生效，看板上分别显示为
`effort: max → high` 与“强度不可调”。

## 考题与考场规则分离

提示词逐字不变是基准可比性的前提，改动它会使此前的历史结果不可比。agent 型 CLI 常把
SVG 存成文件、只回一句“已保存到 …”，基准因此取不到作品。

产出格式约束不拼进提示词，作为“考场规则”写进每次调用的工作目录
（`AGENTS.md` / `CLAUDE.md` / `GEMINI.md`，三份内容逐字相同）。见
[`src/core/house-rules.ts`](../src/core/house-rules.ts)。

例外：agy 在 print 模式下不加载工作目录里的规则文件（受信任目录也不加载），考场规则
对它无效，只能在交付环节补救，见下文“CLI 调用方式”。

## 每次调用一个干净工作目录

CLI 会自动加载所在目录的 agent 指令文件；在本仓库里运行会把本项目的文档带进上下文，
各模型面对的就不再是同一道题。因此每次调用都在
`data/scratch/<runId>/<targetId>/` 这个一次性空目录中执行，跑完即删。

## SVG 净化

看板展示的是**模型生成、未经审阅**的标记。SVG 是完整的 XML 文档格式：`<script>` 会执行、
`on*` 属性会执行、`<foreignObject>` 能塞入任意 HTML、外部 `href` 会泄露访问行为。

[`src/app/components/card/svg-sanitize.ts`](../src/app/components/card/svg-sanitize.ts) 在标记进入 DOM
之前剪枝，走“解析成文档树 → 按规则剪枝 → `importNode` 挂载”的路径，不做字符串拼接或正则
替换。净化只在浏览器端执行，服务端渲染的 HTML 里不会出现模型生成的标记。

## 失败分类与诊断

`no-svg`（模型答了但没给出可用 SVG）与 `error`（调用链本身失败）在数据模型上分开记录：
前者是基准结果，后者是运维故障，混在一起会让成功率失去意义。

失败时由适配器从事件流中提取 CLI 层面的原因（参数被拒、工具调用被拒、turn 失败等）
作为错误信息。

作品按可信度依次寻找：回答正文里的内联 SVG → 模型写出的文件 → 回答中给出的
`file://…/*.svg` 路径。“写出的文件”既包括写文件工具的产物（事件流里带着路径或内容，当场
读回），也包括脚本生成、随后在命令里被提到的 `.svg`（多个版本时取最后一版）；只接受本次
调用开始之后修改过的文件，以免把以前留下的同名旧作算进来。

超时前已经产出的作品仍记为成功：gemini 放行工具后会反复“生成 → 渲染 → 自查 → 改稿”
直到时限，此时取最后一版。

## CLI 调用方式

三家都走结构化的事件流：

| CLI | 调用方式 | 要点 |
| --- | --- | --- |
| claude | `claude -p … --output-format stream-json --verbose --tools ""` | 不给任何工具；`result` 事件列出被拒绝的工具调用 |
| codex | `codex app-server`（stdio JSON-RPC） | 一轮一个长驻进程，每次调用一个 ephemeral thread；只读沙箱 + `untrusted` 审批策略，审批请求全部拒绝，模型读不到文件 |
| agy | `agy --print … --output-format stream-json --sandbox` | 未授权的命令与读取自动拒绝；从 `write_to_file` 事件取回写成文件的作品 |

codex 使用 app-server：多个 `codex exec` 并发启动时刷新模型列表会互相争用，报
`failed to refresh available models` 后卡死至超时。app-server 只启动一次，并发调用
共用一个进程，因此 codex 目标不接受命令行 `extraArgs`。

三家都不给模型工具：题目是画一张 SVG，不需要读文件或跑命令；放开工具会让模型能读到
运行环境里的凭据文件（见 docs/security/public-exposure-design.md §4.5）。agy 的 headless
模式无法弹出授权，gemini 偶尔在交付前先执行 `mkdir` 或校验命令，被拒后放弃交付——这
算作模型未交作品，是基准结果的一部分。原始事件流保存在每次调用的 `.txt` 中，可逐步核查。
