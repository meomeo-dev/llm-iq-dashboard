# 设计要点

> [English](design-notes.md) | **简体中文**

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

另一个例外是直出约束 `run.harnessGuard`（缺省关）：开启后在每条提示词末尾另起一段附上要求
直接作答的原文，抑制 CLI 自带的联网、跑代码自测与截图自检；题目原文不变，附加原文记进
`run.json` 的 `harnessGuard` 并随公开记录发布。

## 每次调用一个干净工作目录

CLI 会自动加载所在目录的 agent 指令文件；在本仓库里运行会把本项目的文档带进上下文，
各模型面对的就不再是同一道题。因此每次调用都在
`data/scratch/<runId>/<targetId>__<promptId>/` 这个一次性空目录中执行，整轮结束后删除本轮的
目录；每轮开始前清理被中断轮次留下的、超过 3 小时的残留目录。

## SVG 净化

看板展示的是**模型生成、未经审阅**的标记。SVG 是完整的 XML 文档格式：`<script>` 会执行、
`on*` 属性会执行、`<foreignObject>` 能塞入任意 HTML、外部 `href` 会泄露访问行为。

[`src/app/components/card/svg-sanitize.ts`](../src/app/components/card/svg-sanitize.ts) 在标记进入 DOM
之前剪枝。解析前只做 XML 良构修补（`<style>` 包进 CDATA、规整注释里的连续短横线、去掉重复属性、
HTML 命名实体转成字符），让模型常见的笔误不至于整件解析失败；安全剪枝走“解析成文档树 → 按规则
剪枝 → `importNode` 挂载”的路径，不靠字符串过滤。净化只在浏览器端执行，服务端渲染的 HTML 里不会
出现模型生成的标记。

## 作品挂载与隔离

净化后的作品先给 id 加唯一前缀（`svg-scope.ts`），同屏多件作品的 `url(#id)` 引用不会互相抢；
再挂进作品框的 shadow root（`svg-shadow.ts`）。作品内联 `<style>` 里的类型选择器、类名与
`@keyframes` 只作用于自身，看板的样式也不进入作品。shadow root 里 `:root` 匹配不到任何元素，
挂载时改写为 `:host`；Chrome 不认 shadow 树里的 `@property`，这类规则提到文档 head。

有 viewBox 时，svg 元素按 viewBox 的宽高比以容器查询单位（`cqw` / `cqh`）在图框内定尺寸。
SVG 在元素盒子处裁切而不是在 viewBox 处，盒子比例与 viewBox 一致，画在 viewBox 外的内容就不会
出现在留白里。导出图的缩略图以嵌套 `<svg viewBox>` 包住 `<image>`，按同样的边界裁切。

## 失败分类与诊断

`no-svg`（模型答了但没给出可用 SVG）与 `error`（调用链本身失败）在数据模型上分开记录：
前者是基准结果，后者是运维故障，混在一起会让成功率失去意义。

失败时由适配器从事件流中提取 CLI 层面的原因（参数被拒、工具调用被拒、turn 失败等）
作为错误信息。

作品按可信度依次寻找：回答正文里的内联 SVG → 模型写出的文件 → 回答中给出的
`file://…/*.svg` 路径。“写出的文件”既包括写文件工具的产物（事件流里带着路径或内容，当场
读回），也包括脚本生成、随后在命令里被提到的 `.svg`（多个版本时取最后一版）；只接受本次
调用开始之后修改过的文件，以免把以前留下的同名旧作算进来。

超时前已经写出的作品仍记为成功，取最后一版。

## CLI 调用方式

三家都走结构化的事件流：

| CLI | 调用方式 | 要点 |
| --- | --- | --- |
| claude | `claude -p … --output-format stream-json --verbose --tools ""` | 不给任何工具；`result` 事件列出被拒绝的工具调用 |
| codex | `codex app-server`（stdio JSON-RPC） | 登录态一轮一个长驻进程，每个非默认 profile 另起一个、各用临时 home；每次调用一个 ephemeral thread；只读沙箱 + `untrusted` 审批策略，审批请求全部拒绝，模型读不到文件 |
| agy | `agy --print … --output-format stream-json --sandbox` | 未授权的命令与读取自动拒绝；从 `write_to_file` 事件取回写成文件的作品 |

codex 使用 app-server：多个 `codex exec` 并发启动时刷新模型列表会互相争用，报
`failed to refresh available models` 后卡死至超时。app-server 只启动一次，并发调用
共用一个进程，因此 codex 目标不接受命令行 `extraArgs`。

三家都不给模型工具：题目是画一张 SVG，不需要读文件或跑命令；放开工具会让模型能读到
运行环境里的凭据文件（见 docs/security/public-exposure-design.md §4.5）。agy 的 headless
模式无法弹出授权，gemini 偶尔在交付前先执行 `mkdir` 或校验命令，被拒后放弃交付——这
算作模型未交作品，是基准结果的一部分。原始事件流保存在每次调用的 `.txt` 中，可逐步核查。

例外是作品评审的裁判调用（评审模式）：临时工作目录里只放联系图，只放开读取它——claude 改用
`--tools Read`，codex 改用 `never` 审批（只读沙箱内的读取直接放行），agy 参数不变（工作目录本就
可读）；三家都仍不能执行命令。
