import type { PromptStandard } from "../../types";

/** 一景题面里随地标变化的六段 */
export interface LandmarkPromptParts {
  /** 主体：城市 + 地标 + 必要限定（如「白天」） */
  readonly subject: string;
  /** 结构：按 ①②③ 编号，自下而上或由近及远列出构件、子构件与相对位置 */
  readonly structure: string;
  /** 比例：高宽比、分段高度、主次高度关系 */
  readonly proportion: string;
  /** 材质与色彩：材料质感、明暗处理与色板建议值 */
  readonly material: string;
  /** 环境与微缩细节：底座上的场景陈设 */
  readonly environment: string;
  /** 该景特有的禁止项，追加在统一禁止项之后 */
  readonly forbidden: string;
}

/** 一景的全部数据：题面六段 + 该景的评分标准，静态与动态两套题共用 */
export interface LandmarkScene {
  /** 地标 slug，如 `paris-eiffel-tower`；静态候选 id 为 `landmark-<slug>`，动态为 `landmark-anim-<slug>` */
  readonly slug: string;
  /** 城市 + 地标，动态版在其后追加「（动态）」 */
  readonly label: string;
  readonly parts: LandmarkPromptParts;
  readonly standard: PromptStandard;
}
