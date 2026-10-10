# 2026 年秋季流行 AI 测试题：最终 10 道动态 SVG 评测基准题库规范

> **基准目录**：`docs/research/x-viral-ai-evals-2026-sep-oct/final_10_outcome/`  
> **制定日期**：2026-10-10  
> **对齐基准模板**：严格参考本项目内置 [`ANIMATED_PELICAN_PROMPT`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/core/prompt/data-classic.ts#L90-L116) 的结构、代码规范与评分设计。  
> **核心原则**：**全量 10 道题目全部升级并规范为【动态 SVG 测试 (Dynamic Animated SVG)】**；零外部工具依赖；严格数据安全与知识产权中立。

---

## 一、10 道动态题目全景索引表

| 全局编号 | 项目规范 ID (`PromptSpec.id`) | 题目全称与链接 | 核心考点与鉴别维度 (`coreKey`) | 动态运动学机制 |
| :--- | :--- | :--- | :--- | :--- |
| **01** | `animated-iso-vintage-pc-v1` | [01-等轴测初代个人电脑.md](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/docs/research/x-viral-ai-evals-2026-sep-oct/final_10_outcome/01-%E7%AD%89%E8%BD%B4%E6%B5%8B%E5%88%9D%E4%BB%A3%E4%B8%AA%E4%BA%BA%E7%94%B5%E8%84%91.md) | 30° 等轴测三维几何投影、微光磷光呼吸、2Hz 方波光标闪烁 | 屏幕荧光呼吸微闪、2Hz 方波光标、机箱指示灯脉冲 |
| **02** | `animated-iso-amber-crt-v1` | [02-橙屏-crt-台式机.md](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/docs/research/x-viral-ai-evals-2026-sep-oct/final_10_outcome/02-%E6%A9%99%E5%B1%8F-crt-%E5%8F%B0%E5%BC%8F%E6%9C%BA.md) | 凸曲面 CRT 投影面板、向下扫描线滚扫、单焦点琥珀色发光 | 屏幕向下扫描线光带平滑滚动、温和琥珀色呼吸、光标闪烁 |
| **03** | `animated-iso-server-rack-v1` | [03-十秒无缝机架.md](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/docs/research/x-viral-ai-evals-2026-sep-oct/final_10_outcome/03-%E5%8D%81%E7%A7%92%E6%97%A0%E7%BC%9D%E6%9C%BA%E6%9E%B6.md) | 19 英寸机柜网格、整除周期时钟、多通道 LED 阵列律动 | 多通道 LED 阵列按 10s 整除数闪烁、顶部双排风扇旋转 |
| **04** | `animated-iso-camera-exploded-v1` | [04-相机爆炸图再组装.md](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/docs/research/x-viral-ai-evals-2026-sep-oct/final_10_outcome/04-%E7%9B%B8%E6%9C%BA%E7%88%86%E7%82%B8%E5%9B%BE%E5%86%8D%E7%BB%84%E8%A3%85.md) | 同轴爆炸运动学、四段式节拍律、引线标注动态锚定与无漂移复位 | 沿 30° 光轴展开(35%)、悬停带标签(25%)、收拢(25%)、闭合(15%) |
| **05** | `animated-armadillo-fishnet-mars-v1` | [05-穿网袜的犰狳在火星闯红灯.md](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/docs/research/x-viral-ai-evals-2026-sep-oct/final_10_outcome/05-%E7%A9%BF%E7%BD%91%E8%A2%9C%E7%9A%84%E7%8A%B0%E7%8B%B3%E5%9C%A8%E7%81%AB%E6%98%9F%E9%97%AF%E7%BA%A2%E7%81%AF.md) | 四足步行对角步态、曲面贴体网袜变形、甲壳俯仰节律 | **对标动态鹈鹕车：** 四肢对角交替踩地、背甲俯仰、尾波摆动 |
| **06** | `animated-lemur-scooter-front-v1` | [06-环尾狐猴骑电动滑板车正视图.md](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/docs/research/x-viral-ai-evals-2026-sep-oct/final_10_outcome/06-%E7%8E%AF%E5%B0%BE%E7%8B%90%E7%8C%B4%E9%AA%91%E7%94%B5%E5%8A%A8%E6%BB%91%E6%9D%BF%E8%BD%A6%E6%AD%A3%E8%A7%86%E5%9B%BE.md) | 正交对称正视图、单腿后蹬推进动力学、前后轮同轴投影 | **对标动态鹈鹕车：** 单腿蹬地推车、车身减震微晃、尾部平衡摆动 |
| **07** | `animated-human-hand-kinetic-v1` | [07-人的一只手.md](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/docs/research/x-viral-ai-evals-2026-sep-oct/final_10_outcome/07-%E4%BA%BA%E7%9A%84%E4%B8%80%E5%8F%AA%E6%89%8B.md) | 五指解剖运动学、指节层级旋转约束、大拇指对掌轨迹 | 五指阶梯屈曲成拳、大拇指跨掌内收、指节层级联动展开 |
| **08** | `animated-fish-cloud-amodal-v1` | [08-鱼跃水入云-非模态遮挡完整.md](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/docs/research/x-viral-ai-evals-2026-sep-oct/final_10_outcome/08-%E9%B1%BC%E8%B7%83%E6%B0%B4%E5%85%A5%E4%BA%91-%E9%9D%9E%E6%A8%A1%E6%80%81%E9%81%AE%E6%8C%A1%E5%AE%8C%E6%95%B4.md) | 抛物线跳跃运动学、云层非模态遮挡、水花涟漪扩散 | 鱼身抛物线弹道穿云跃起、云层真实深度遮挡、出入水涟漪 |
| **09** | `animated-island-chest-containment-v1` | [09-岛-棕榈树与宝箱-包含关系.md](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/docs/research/x-viral-ai-evals-2026-sep-oct/final_10_outcome/09-%E5%B2%9B-%E6%A3%95%E6%A6%88%E6%A0%91%E4%B8%8E%E5%AE%9D%E7%AE%B1-%E5%8C%85%E5%90%AB%E5%85%B3%E7%B3%BB.md) | 动态海浪推进、椰树受风悬链弯曲、宝箱发光脉冲 | 海浪谐波推涌、椰子树受风柔和摇曳（树根定点扎根）、金光闪烁 |
| **10** | `animated-tree-reader-occlusion-v1` | [10-树下读书的人-人体与遮挡.md](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/docs/research/x-viral-ai-evals-2026-sep-oct/final_10_outcome/10-%E6%A0%91%E4%B8%8B%E8%AF%BB%E4%B9%A6%E7%9A%84%E4%BA%BA-%E4%BA%BA%E4%BD%93%E4%B8%8E%E9%81%AE%E6%8C%A1.md) | 树冠风吹微动、斑驳树影漂移、读者翻书动作与深度遮挡 | 树冠微风摇曳、斑驳光影漂移、右手翻书拱形弧线、胸腔呼吸起伏 |

---

## 二、与本项目标准（动态鹈鹕车）的书写习惯对齐细节

本项目代码库（`src/core/prompt/data-classic.ts`）中收录的 [`ANIMATED_PELICAN_PROMPT`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/core/prompt/data-classic.ts#L90-L116) 代表了本系统对**动态矢量基准**的权威工业级规范。本次构建的 10 道题目完全继承其设计模式：

1. **模板结构三段论**：
   - **首段（任务与声明式声明）**：`"Generate an animated SVG demonstrating/depicting [主题] featuring pure inline SVG animation (using SMIL <animateTransform>/<animate> or inline CSS @keyframes)."`
   - **二段（解剖/机械/几何结构）**：清晰指明模型必须构建的核心几何图元、材质、面内嵌套与层级组件。
   - **三段（分步编号运动学规范）**：使用 `1. ... 2. ... 3. ...` 清单精确界定各运动子通道的自转中心（`transform-origin`）、相位同步、触地支撑动力学与非模态连续性。
   - **末段（XML 洁净度与沙箱安全强制约束）**：统一包含自包含性要求、样式块 CDATA 保护、禁止外部资源以及**严格禁止任何 JavaScript 脚本（0 `<script>` 标签）**。

2. **客观测验标准 (`PromptStandard`)**：
   - 每道题目均具有 `coreKey`（考点维度）、`groundTruth`（客观几何/动力学真值）、`evaluationCriteria`（Pass/Partial/Fail 三态尖锐判据）以及 `referenceSource`（权威溯源）。

3. **数据安全与考场独立性**：
   - 商业商标全量中立化（经典一体机中立化为通用 1980 年代个人工作站，经典机械旁轴相机中立化为通用机械几何组件，杜绝任何商业品牌与注册商标）；
   - 彻底剥离对任何客户端预装 Skill（如 `/isometric-objects`）的依赖，提示词自包含所有制图规范，纯净考场开箱即用。

4. **发丝工业图解审美锁定（对标 PENROSE_PROMPT 与 Gist 原案）**：
   - 题目 Q01–Q04 模板统一显式加入精密图解风格约束句：`"Render in a dark hairline technical figure style (near-black solids on a dark background, crisp 1px hairline edges with a subtle top-front highlight line, and at most 5% focal accent glow)."`；
   - 确保模型输出在免除三明治冗长注入的同时，视觉色彩、材质三阶与边缘发丝高光 100% 收敛到 Gist 原案审美水准。

---

## 三、代码级注册规格说明

全部 10 个题目的标准 TypeScript `PromptSpec` 常量定义（完全符合 `src/core/prompt/types.ts` 强类型契约）已分别完整内嵌在各个题目的 `*.md` 独立文档的第 3 节中，方便逐个对照查阅，本目录不保留任何 `.ts` 代码文件。

---

## 四、题目来源出处与背景汇总 (Provenance Summary)

| 全局编号 | 题目规范 ID | 核心考点与动力学 | 来源出处 (Source Attribution) | 授权/合规状态 |
| :--- | :--- | :--- | :--- | :--- |
| **01** | `animated-iso-vintage-pc-v1` | 30° 等轴测、微光呼吸、2Hz 方波光标 | Kris Chase Gist ([b2aa7b99...](https://gist.github.com/mehh/b2aa7b990f1d4fa0d6e06fcefc38f2ee)) | Free to use, remix, ship；商业商标中立化 |
| **02** | `animated-iso-amber-crt-v1` | 凸面 CRT、向下滚扫扫描线、琥珀微光 | Kris Chase Gist ([b2aa7b99...](https://gist.github.com/mehh/b2aa7b990f1d4fa0d6e06fcefc38f2ee)) | Free to use, remix, ship；自包含无插件 |
| **03** | `animated-iso-server-rack-v1` | 机柜网格、10s 整除时钟律、面内共面 | Kris Chase Gist ([b2aa7b99...](https://gist.github.com/mehh/b2aa7b990f1d4fa0d6e06fcefc38f2ee)) | Free to use, remix, ship；纯声明式无脚本 |
| **04** | `animated-iso-camera-exploded-v1` | 同轴爆炸展开/收拢、四段节拍、零漂移 | Kris Chase Gist ([b2aa7b99...](https://gist.github.com/mehh/b2aa7b990f1d4fa0d6e06fcefc38f2ee)) | Free to use, remix, ship；通用旁轴机械外形 |
| **05** | `animated-armadillo-fishnet-mars-v1` | 四足对角步态、曲面适形网袜、火星红沙 | Hacker News 讨论串 ([49982139](https://news.ycombinator.com/item?id=49982139)) | 社区公开讨论题；2026 秋替代鹈鹕车基准 |
| **06** | `animated-lemur-scooter-front-v1` | 正交对称正视图、单腿蹬地、尾部平衡 | Hacker News 讨论串 ([49578488](https://news.ycombinator.com/item?id=49578488)) | 社区公开讨论题；反侧视图退化一票否决 |
| **07** | `animated-human-hand-kinetic-v1` | 5 指数量约束、指节层级旋转、对掌轨迹 | Hacker News 讨论串 ([49573027](https://news.ycombinator.com/item?id=49573027)) | 社区公开讨论题；通用人体解剖学规范 |
| **08** | `animated-fish-cloud-amodal-v1` | 抛物线弹道、云层遮挡非模态完形、水花 | EMNLP 2026 空间几何专项 ([2026.emnlp...](https://aclanthology.org/2026.emnlp-main.spatial/)) | CC BY 4.0 开放许可；保留拓扑量测 |
| **09** | `animated-island-chest-containment-v1` | 海洋/岛/树/箱多层包含不变性、波浪推涌 | EMNLP 2026 空间拓扑专项 ([2026.emnlp...](https://aclanthology.org/2026.emnlp-main.spatial/)) | CC BY 4.0 开放许可；包含拓扑硬约束 |
| **10** | `animated-tree-reader-occlusion-v1` | 树冠荫蔽、坐姿翻书弧线、躯干非模态完整 | 社区空间评测 / EMNLP 2026 ([2026.emnlp...](https://aclanthology.org/2026.emnlp-main.spatial/)) | CC BY 4.0 开放许可；去商业品牌中立化 |
