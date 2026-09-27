/**
 * VFX-3: 离散微分几何、神经隐式曲面与动态拓扑流形 前沿评测题库。
 * 包含 10 道独立题目规格，以及 1 套领域分组聚合套题（UX 交互与轮换结构对齐四大名著 candidates 规范）。
 */

import type { PromptSpec } from "../prompt";

/**
 * VFX-GEOM-01: 基于离散外微积分的三角网格热流测地线距离场与等距线重构
 */
export const VFX_GEOM_01_PROMPT: PromptSpec = {
  id: "VFX-GEOM-01",
  label: "基于离散外微积分的三角网格热流测地线距离场与等距线重构 (Discrete Exterior Calculus (DEC) Heat Method Geodesics & Isoline Reconstruction)",
  template: "Generate an SVG technical visualization of Discrete Exterior Calculus (DEC) Heat Method Geodesics & Isoline Reconstruction as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: 1. **离散拉普拉斯-贝尔特拉米算子（Cotangent Laplacian）**： $$L_{ij} = \\frac{1}{2}(\\cot \\alpha_{ij} + \\cot \\beta_{ij}) \\quad (i \\neq j), \\quad L_{ii} = -\\sum_{j \\in N(i)} L_{ij}$$ 2. **双对偶面积质量矩阵（Lumped Voronoi Mass Matrix）**： $$M_{ii} = A_{\\text{Voronoi}}(v_i) = \\frac{1}{8} \\sum_{j \\in N(i)} (\\cot \\alpha_{ij} + \\cot \\beta_{ij}) \\|\\mathbf{e}_{ij}\\|^2$$ 3. **热流扩散与切向量场提取**： $$(M - t L) u = \\delta_{x_0}, \\quad t = h^2 \\quad (h \\text{ 为网格平均边长})$$ $$X = -\\frac{\\nabla u}{\\|\\nabla u\\|}$$ 4. **泊松方程反演测地线场**： $$L \\phi = \\nabla \\cdot X, \\quad \\text{Boundary: } \\phi(x_0) = 0$$ 5. **几何公差**：测地线距离场梯度范数绝对误差 $|\\|\\nabla \\phi\\| - 1| \\le 2.5 \\times 10^{-3}$；等距离散等值线必须与源点辐射同心环保持微分正交，拓扑无伪局部极小值（Spurious Extrema = 0）。 Visual Inspection Criteria: - **机器比对**：提取 SVG 路径中 10 个等间距标量等值线（Iso-contour loops），计算各环路径闭合点到点源 $x_0$ 的测地线偏离均方根误差（RMSE $\\le 1.5\\%$）；检查梯度流线切线方向与等值线法线点积夹角余弦 $|\\cos \\theta| \\le 0.02$。 - **视觉比对**：同心等距色带平滑渐变，无锯齿断裂，在负高斯曲率（双曲鞍点）区域呈现显著的双曲扇出几何变形。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Crane, K., Weischedel, C., & Wardetzky, M. (2013). *Geodesics in heat: A new approach to computing distance based on heat flow*. **ACM Transactions on Graphics (TOG)**, 32(5), 1-11. DOI: `10.1145/25",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "基于离散外微积分的三角网格热流测地线距离场与等距线重构",
    groundTruth: "1. **离散拉普拉斯-贝尔特拉米算子（Cotangent Laplacian）**： $$L_{ij} = \\frac{1}{2}(\\cot \\alpha_{ij} + \\cot \\beta_{ij}) \\quad (i \\neq j), \\quad L_{ii} = -\\sum_{j \\in N(i)} L_{ij}$$ 2. **双对偶面积质量矩阵（Lumped Voronoi Mass Matrix）**： $$M_{ii} = A_{\\text{Voronoi}}(v_i) = \\frac{1}{8} \\sum_{j \\in N(i)} (\\cot \\alpha_{ij} + \\co",
    evaluationCriteria: "- **机器比对**：提取 SVG 路径中 10 个等间距标量等值线（Iso-contour loops），计算各环路径闭合点到点源 $x_0$ 的测地线偏离均方根误差（RMSE $\\le 1.5\\%$）；检查梯度流线切线方向与等值线法线点积夹角余弦 $|\\cos \\theta| \\le 0.02$。 - **视觉比对**：同心等距色带平滑渐变，无锯齿断裂，在负高斯曲率（双曲鞍点）区域呈现显著的双曲扇出几何变形。",
    referenceSource: "- Crane, K., Weischedel, C., & Wardetzky, M. (2013). *Geodesics in heat: A new approach to computing distance based on heat flow*. **ACM Transactions on Graphics (TOG)**, 32(5), 1-11. DOI: `10.1145/25",
  },
};

/**
 * VFX-GEOM-02: 神经隐式距离场 (NeuS) Eikonal 梯度约束与自适应八叉树 Dual Contouring 剖分
 */
export const VFX_GEOM_02_PROMPT: PromptSpec = {
  id: "VFX-GEOM-02",
  label: "神经隐式距离场 (NeuS) Eikonal 梯度约束与自适应八叉树 Dual Contouring 剖分 (Neural SDF Eikonal Gradient Field & Adaptive Octree Dual Contouring)",
  template: "Generate an SVG technical visualization of Neural SDF Eikonal Gradient Field & Adaptive Octree Dual Contouring as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: 1. **神经 SDF 解析场（带尖锐几何特征的多面体距离偶极）**： $$f(\\mathbf{x}) = \\min_{k} (\\mathbf{n}_k \\cdot (\\mathbf{x} - \\mathbf{p}_k))$$ 2. **Eikonal 梯度条件与法向量场**： $$\\|\\nabla f(\\mathbf{x})\\| = 1 \\quad \\text{a.e.}, \\quad \\mathbf{n}(\\mathbf{x}) = \\frac{\\nabla f(\\mathbf{x})}{\\|\\nabla f(\\mathbf{x})\\|}$$ 3. **自适应八叉树细分准则与 QEF 顶点定位**： 对八叉树叶子立方体 $C$，当且仅当 $\\max_{v \\in C} f(v) \\cdot \\min_{v \\in C} f(v) \\le 0$ 时细分；在零交叉单元内部通过二次误差函数（Quadric Error Function, QEF）确定最优网格顶点： $$\\mathbf{x}^* = \\arg\\min_{\\mathbf{x}} \\sum_{i \\in \\text{Edges}} (\\mathbf{n}_i \\cdot (\\mathbf{x} - \\mathbf{p}_i))^2$$ 4. **几何公差**：零等值面拓扑亏格 $g=0$，表面法线方向误差 $\\Delta \\mathbf{n} \\le 1.0^\\circ$，Eikonal 惩罚偏离 $\\mathbb{E}[(\\|\\nabla f\\| - 1)^2] \\le 1.0 \\times 10^{-4}$。 Visual Inspection Criteria: - **机器比对**：解析 SVG 中提取的零等值面多边形轮廓线坐标，验证点集在隐式解析场中的绝对值误差 $\\max |f(\\mathbf{x}_k)| \\le 10^{-4}$；检查八叉树悬挂节点（T-junctions）在 Dual Contouring 模式下的闭合性（非流行边数量 $=0$）。 - **视觉比对**：隐式符号反转清晰（内部负值为深蓝冷色，外部正值为暖红），零等值面紧致附着于白零基准带上，且在直角拐角处保持尖锐（Sharp Edge Retention），无传统 Marching Cubes 常见的钝化截断。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Wang, P., et al. (2021). *NeuS: Learning Neural Implicit Surfaces by Volume Rendering for Multi-view Reconstruction*. **NeurIPS 2021**. - Wang, Y., et al. (2023). *NeuS2: Fast Learning of Neural Imp",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "神经隐式距离场 (NeuS) Eikonal 梯度约束与自适应八叉树 Dual Contouring 剖分",
    groundTruth: "1. **神经 SDF 解析场（带尖锐几何特征的多面体距离偶极）**： $$f(\\mathbf{x}) = \\min_{k} (\\mathbf{n}_k \\cdot (\\mathbf{x} - \\mathbf{p}_k))$$ 2. **Eikonal 梯度条件与法向量场**： $$\\|\\nabla f(\\mathbf{x})\\| = 1 \\quad \\text{a.e.}, \\quad \\mathbf{n}(\\mathbf{x}) = \\frac{\\nabla f(\\mathbf{x})}{\\|\\nabla f(\\mathbf{x})\\|}$$ 3. **自适应八叉树细分准则与 QEF 顶点",
    evaluationCriteria: "- **机器比对**：解析 SVG 中提取的零等值面多边形轮廓线坐标，验证点集在隐式解析场中的绝对值误差 $\\max |f(\\mathbf{x}_k)| \\le 10^{-4}$；检查八叉树悬挂节点（T-junctions）在 Dual Contouring 模式下的闭合性（非流行边数量 $=0$）。 - **视觉比对**：隐式符号反转清晰（内部负值为深蓝冷色，外部正值为暖红），零等值面紧致附着于白零基准带上，且在直角拐角处保持尖锐（Sharp Edge Retention），无传统 Marching Cubes 常见的钝化截断。",
    referenceSource: "- Wang, P., et al. (2021). *NeuS: Learning Neural Implicit Surfaces by Volume Rendering for Multi-view Reconstruction*. **NeurIPS 2021**. - Wang, Y., et al. (2023). *NeuS2: Fast Learning of Neural Imp",
  },
};

/**
 * VFX-GEOM-03: 四维超正方体 (8-cell) SO(4) 等斜双自转与佩特里多边形 Coxeter 平面透视
 */
export const VFX_GEOM_03_PROMPT: PromptSpec = {
  id: "VFX-GEOM-03",
  label: "四维超正方体 (8-cell) SO(4) 等斜双自转与佩特里多边形 Coxeter 平面透视 (Tesseract (4-Cube) SO(4) Isoclinic Double Rotation & Petrie Octagon Coxeter Perspective)",
  template: "Generate an SVG technical visualization of Tesseract (4-Cube) SO(4) Isoclinic Double Rotation & Petrie Octagon Coxeter Perspective as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: 1. **拓扑骨架拓扑度量**：16 个顶点 $(\\pm 1, \\pm 1, \\pm 1, \\pm 1)$，32 条棱，24 个正方形面，8 个三维立方体胞（Cubical Cells），欧拉示性数： $$\\chi = V - E + F - C = 16 - 32 + 24 - 8 = 0$$ 2. **SO(4) 左等斜变换矩阵（Left-Isoclinic Rotation）**： $$R_L(\\theta) = \\begin{pmatrix} \\cos\\theta & -\\sin\\theta & 0 & 0 \\\\ \\sin\\theta & \\cos\\theta & 0 & 0 \\\\ 0 & 0 & \\cos\\theta & -\\sin\\theta \\\\ 0 & 0 & \\sin\\theta & \\cos\\theta \\end{pmatrix}$$ 3. **Coxeter 佩特里八边形投影基底**： 投影到二维平面 $\\mathbb{R}^2$ 的正交投影基向量 $U, V \\in \\mathbb{R}^4$： $$U = \\frac{1}{2}(\\cos \\frac{\\pi}{8}, \\cos \\frac{3\\pi}{8}, \\cos \\frac{5\\pi}{8}, \\cos \\frac{7\\pi}{8}), \\quad V = \\frac{1}{2}(\\sin \\frac{\\pi}{8}, \\sin \\frac{3\\pi}{8}, \\sin \\frac{5\\pi}{8}, \\sin \\frac{7\\pi}{8})$$ 4. **几何公差**：旋转周期内任意时刻 32 条投影线段在四维欧氏空间中的原长必须严格恒定为 $L_{4D} = 2.0$；投影外轮廓在特定对称相位必须收敛为几何严格正八边形（对角线中心对称度误差 $< 0.1\\%$）。 Visual Inspection Criteria: - **机器比对**：采样 $t = 0, T/4, T/2$ 帧 SVG 的 `d` 属性路径，提取 16 个顶点坐标，计算与理论 Coxeter 投影坐标的欧氏距离，最大偏差 $\\le 0.5\\text{px}$；验证 32 条棱的拓扑连接邻接矩阵严格匹配超立方体图结构。 - **视觉比对**：动画流畅且无拓扑跳跃，观察到内部立方体胞向外翻转、外部立方体胞向中心缩聚的“超维吞吐”平滑呼吸感，外轮廓对称性维持 8 重旋转对称（Coxeter Number $h=8$）。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Coxeter, H. S. M. (1973). *Regular Polytopes*. Dover Publications, 3rd ed. - Hanson, A. J. (1994). *Visualizing dimensions: Four-dimensional rotation and tesseracts*. **SIGGRAPH Courses**. - Van Elf",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "四维超正方体 (8-cell) SO(4) 等斜双自转与佩特里多边形 Coxeter 平面透视",
    groundTruth: "1. **拓扑骨架拓扑度量**：16 个顶点 $(\\pm 1, \\pm 1, \\pm 1, \\pm 1)$，32 条棱，24 个正方形面，8 个三维立方体胞（Cubical Cells），欧拉示性数： $$\\chi = V - E + F - C = 16 - 32 + 24 - 8 = 0$$ 2. **SO(4) 左等斜变换矩阵（Left-Isoclinic Rotation）**： $$R_L(\\theta) = \\begin{pmatrix} \\cos\\theta & -\\sin\\theta & 0 & 0 \\\\ \\sin\\theta & \\cos\\theta & 0 & 0 \\\\ 0",
    evaluationCriteria: "- **机器比对**：采样 $t = 0, T/4, T/2$ 帧 SVG 的 `d` 属性路径，提取 16 个顶点坐标，计算与理论 Coxeter 投影坐标的欧氏距离，最大偏差 $\\le 0.5\\text{px}$；验证 32 条棱的拓扑连接邻接矩阵严格匹配超立方体图结构。 - **视觉比对**：动画流畅且无拓扑跳跃，观察到内部立方体胞向外翻转、外部立方体胞向中心缩聚的“超维吞吐”平滑呼吸感，外轮廓对称性维持 8 重旋转对称（Coxeter Number $h=8$）。",
    referenceSource: "- Coxeter, H. S. M. (1973). *Regular Polytopes*. Dover Publications, 3rd ed. - Hanson, A. J. (1994). *Visualizing dimensions: Four-dimensional rotation and tesseracts*. **SIGGRAPH Courses**. - Van Elf",
  },
};

/**
 * VFX-GEOM-04: 克莱因瓶四维浸入在三维空间中的“Figure-8”无边界不可定向光滑流形
 */
export const VFX_GEOM_04_PROMPT: PromptSpec = {
  id: "VFX-GEOM-04",
  label: "克莱因瓶四维浸入在三维空间中的“Figure-8”无边界不可定向光滑流形 (Klein Bottle Figure-8 Immersion & Smooth Metric Flow Manifold)",
  template: "Generate an SVG technical visualization of Klein Bottle Figure-8 Immersion & Smooth Metric Flow Manifold as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: 1. **Figure-8 浸入参数方程**（$u, v \\in [0, 2\\pi)$, 结构半径 $r_0 = 3.0$）： $$x(u, v) = \\left( r_0 + \\cos\\frac{u}{2} \\sin v - \\sin\\frac{u}{2} \\sin 2v \\right) \\cos u$$ $$y(u, v) = \\left( r_0 + \\cos\\frac{u}{2} \\sin v - \\sin\\frac{u}{2} \\sin 2v \\right) \\sin u$$ $$z(u, v) = \\sin\\frac{u}{2} \\sin v + \\cos\\frac{u}{2} \\sin 2v$$ 2. **拓扑示性数**： 不可定向无边界闭曲面，欧拉示性数 $\\chi = 2 - 2g_{\\text{unoriented}} = 2 - 2(1) = 0$（由两个同向交错莫比乌斯带边缘粘合而成）。 3. **自相交圆环轨迹方程（Self-intersection Singular Locus）**： 当 $v = 0$ 或 $v = \\pi$ 时，截面自交点汇聚于平面 $z = 0$，自相交轨迹为严格圆： $$x^2 + y^2 = r_0^2, \\quad z = 0$$ 4. **几何公差**：总高斯曲率面积分 $\\iint_{\\mathcal{M}} K dA = 2\\pi \\chi = 0$；自相交线严格位于 $z=0$ 平面，公差 $\\Delta z < 1.0 \\times 10^{-4}$。 Visual Inspection Criteria: - **机器比对**：校验生成的曲面网格法向量连通性，验证在 $u \\to u + 2\\pi$ 时法向反转 $\\mathbf{n}(u+2\\pi, v) = -\\mathbf{n}(u, v)$；验证自相交顶点严格吻合半径为 $r_0$ 的圆弧。 - **视觉比对**：纵向网格线沿空间平滑旋转 $180^\\circ$ 形成连贯的莫比乌斯扭转；“8”字形截面沿中心轴平滑公转，内部面与外部面完全连通为同一表面，无裂隙无突异退化点。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Gray, A., Abbena, E., & Salamon, S. (2006). *Modern Differential Geometry of Curves and Surfaces with Mathematica*. Chapman and Hall/CRC, 3rd ed. - Nordstrand, T. (1998). *The 8-surface Klein Bottle",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "克莱因瓶四维浸入在三维空间中的“Figure-8”无边界不可定向光滑流形",
    groundTruth: "1. **Figure-8 浸入参数方程**（$u, v \\in [0, 2\\pi)$, 结构半径 $r_0 = 3.0$）： $$x(u, v) = \\left( r_0 + \\cos\\frac{u}{2} \\sin v - \\sin\\frac{u}{2} \\sin 2v \\right) \\cos u$$ $$y(u, v) = \\left( r_0 + \\cos\\frac{u}{2} \\sin v - \\sin\\frac{u}{2} \\sin 2v \\right) \\sin u$$ $$z(u, v) = \\sin\\frac{u}{2} \\sin v + \\cos\\frac{u}{2} \\",
    evaluationCriteria: "- **机器比对**：校验生成的曲面网格法向量连通性，验证在 $u \\to u + 2\\pi$ 时法向反转 $\\mathbf{n}(u+2\\pi, v) = -\\mathbf{n}(u, v)$；验证自相交顶点严格吻合半径为 $r_0$ 的圆弧。 - **视觉比对**：纵向网格线沿空间平滑旋转 $180^\\circ$ 形成连贯的莫比乌斯扭转；“8”字形截面沿中心轴平滑公转，内部面与外部面完全连通为同一表面，无裂隙无突异退化点。",
    referenceSource: "- Gray, A., Abbena, E., & Salamon, S. (2006). *Modern Differential Geometry of Curves and Surfaces with Mathematica*. Chapman and Hall/CRC, 3rd ed. - Nordstrand, T. (1998). *The 8-surface Klein Bottle",
  },
};

/**
 * VFX-GEOM-05: 霍普夫纤维化 ($S^3 \to S^2$) 嵌套同轴环面簇与维拉索圆 (Villarceau Circles) 拓扑环链
 */
export const VFX_GEOM_05_PROMPT: PromptSpec = {
  id: "VFX-GEOM-05",
  label: "霍普夫纤维化 ($S^3 \\to S^2$) 嵌套同轴环面簇与维拉索圆 (Villarceau Circles) 拓扑环链 (Hopf Fibrillation ($S^3 \\to S^2$) Nested Tori Family & Villarceau Circle Links)",
  template: "Generate an SVG technical visualization of Hopf Fibrillation ($S^3 \\to S^2$) Nested Tori Family & Villarceau Circle Links as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: 1. **霍普夫映射与复数坐标参数化**： 设 $(z_1, z_2) \\in \\mathbb{C}^2$ 满足 $|z_1|^2 + |z_2|^2 = 1$（定义 $S^3$）： $$z_1 = \\cos\\eta \\, e^{i(\\xi_1 + \\xi_2)}, \\quad z_2 = \\sin\\eta \\, e^{i(\\xi_1 - \\xi_2)} \\quad (\\eta \\in (0, \\pi/2))$$ 霍普夫映射 $\\pi: S^3 \\to S^2$: $$\\pi(z_1, z_2) = (2 z_1 \\bar{z}_2, |z_1|^2 - |z_2|^2) \\in S^2 \\subset \\mathbb{C} \\times \\mathbb{R}$$ 2. **从四维到三维空间的球极立体投影（Stereographic Projection）**： $$(x, y, z) = \\frac{1}{1 - \\text{Im}(z_2)} \\left( \\text{Re}(z_1), \\text{Im}(z_1), \\text{Re}(z_2) \\right)$$ 投影后每个固定纬度角 $\\eta$ 的反象为 $\\mathbb{R}^3$ 中的标准环面，主半径 $R = \\csc(2\\eta)$，副半径 $r = \\cot(2\\eta)$。 3. **拓扑不变量（Linking Number）**： 任意两条不重合的纤维光环 $F_a, F_b$ 的高斯环绕积分严格满足： $$\\text{Lk}(F_a, F_b) = \\frac{1}{4\\pi} \\oint_{F_a} \\oint_{F_b} \\frac{\\mathbf{r}_a - \\mathbf{r}_b}{\\|\\mathbf{r}_a - \\mathbf{r}_b\\|^3} \\cdot (d\\mathbf{r}_a \\times d\\mathbf{r}_b) = \\pm 1$$ 4. **几何公差**：三维空间中每个光环投影必须为严格几何圆形（偏心率偏离值 $e < 1.0 \\times 10^{-4}$）；同层环面长短半径比严格满足 $R/r = \\sec(2\\eta)$。 Visual Inspection Criteria: - **机器比对**：解析 SVG 中的圆弧曲线方程，提取各闭合线圈并计算任意两线圈的二维绕数与投影交叉拓扑，验证其严格满足 Hopf 链链接数 $|Lk| = 1$；测量同轴同心度误差 $\\le 0.1\\text{px}$。 - **视觉比对**：内层小环面与外层大环面呈同轴嵌套结构，色彩依基底 $S^2$ 映射坐标连续调和变化；光环沿维拉索倾角（$\\theta = \\pm \\arcsin(r/R)$）斜掠旋转，展现出毫无死锁的光滑穿透感。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Hopf, H. (1931). *Über die Abbildungen der dreidimensionalen Sphäre auf die Kugelfläche*. **Mathematische Annalen**, 104(1), 637-665. - Johnson, N. (2012). *Visualizing the Hopf Fibration*. Notices ",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "霍普夫纤维化 ($S^3 \\to S^2$) 嵌套同轴环面簇与维拉索圆 (Villarceau Circles) 拓扑环链",
    groundTruth: "1. **霍普夫映射与复数坐标参数化**： 设 $(z_1, z_2) \\in \\mathbb{C}^2$ 满足 $|z_1|^2 + |z_2|^2 = 1$（定义 $S^3$）： $$z_1 = \\cos\\eta \\, e^{i(\\xi_1 + \\xi_2)}, \\quad z_2 = \\sin\\eta \\, e^{i(\\xi_1 - \\xi_2)} \\quad (\\eta \\in (0, \\pi/2))$$ 霍普夫映射 $\\pi: S^3 \\to S^2$: $$\\pi(z_1, z_2) = (2 z_1 \\bar{z}_2, |z_1|^2 - |z_2|^2) \\in S^2 \\s",
    evaluationCriteria: "- **机器比对**：解析 SVG 中的圆弧曲线方程，提取各闭合线圈并计算任意两线圈的二维绕数与投影交叉拓扑，验证其严格满足 Hopf 链链接数 $|Lk| = 1$；测量同轴同心度误差 $\\le 0.1\\text{px}$。 - **视觉比对**：内层小环面与外层大环面呈同轴嵌套结构，色彩依基底 $S^2$ 映射坐标连续调和变化；光环沿维拉索倾角（$\\theta = \\pm \\arcsin(r/R)$）斜掠旋转，展现出毫无死锁的光滑穿透感。",
    referenceSource: "- Hopf, H. (1931). *Über die Abbildungen der dreidimensionalen Sphäre auf die Kugelfläche*. **Mathematische Annalen**, 104(1), 637-665. - Johnson, N. (2012). *Visualizing the Hopf Fibration*. Notices ",
  },
};

/**
 * VFX-GEOM-06: 基于离散表面里奇流与圆填充度规的保角映射与零角畸变复平面展开
 */
export const VFX_GEOM_06_PROMPT: PromptSpec = {
  id: "VFX-GEOM-06",
  label: "基于离散表面里奇流与圆填充度规的保角映射与零角畸变复平面展开 (Discrete Ricci Flow Conformal Parameterization & Zero Angular Distortion Complex Mapping)",
  template: "Generate an SVG technical visualization of Discrete Ricci Flow Conformal Parameterization & Zero Angular Distortion Complex Mapping as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: 1. **圆填充度规（Circle Packing Metric）**： 每条边长 $l_{ij}$ 由顶点处虚拟圆半径 $r_i, r_j$ 及夹角 $\\Phi_{ij}$ 决定： $$l_{ij}^2 = r_i^2 + r_j^2 + 2 r_i r_j \\cos \\Phi_{ij}$$ 2. **离散里奇流曲率驱动演化方程**： 对数共形因子 $u_i = \\ln r_i$，流演化偏微分方程为： $$\\frac{d u_i}{dt} = \\bar{K}_i - K_i$$ 其中 $K_i = 2\\pi - \\sum_{j,k \\in F(i)} \\theta_i^{jk}$ 为离散高斯角亏曲率，$\\bar{K}_i$ 为指定目标曲率（内部为 0，边界满足 Gauss-Bonnet 拓扑和 $\\sum \\bar{K}_i = 2\\pi \\chi$）。 3. **共形无畸变条件（Cauchy-Riemann / Beltrami 判据）**： 柯西-黎曼复导数满足共形导数无伪分量，贝尔特拉米微分（Beltrami Coefficient）： $$\\mu(z) = \\frac{\\partial f / \\partial \\bar{z}}{\\partial f / \\partial z} \\equiv 0$$ 4. **几何公差**：网格三角形内角最大变形误差 $|\\theta_{\\text{planar}} - \\theta_{\\text{manifold}}| \\le 1.2^\\circ$；局部 Tissot 变形指示椭圆长短半轴比 $a/b \\equiv 1.0 \\pm 0.02$（正形圆保持度）。 Visual Inspection Criteria: - **机器比对**：解析平面展开图的所有三角形，计算对应三维三角形与二维三角形的三内角差，统计全网格角度方差 $\\sigma^2_{\\Delta \\theta} < 0.25$；验证 Tissot 指示图元为严格正圆而非椭圆。 - **视觉比对**：贴图网格的所有经纬交点在任何曲率集中区均保持严格 $90^\\circ$ 相互正交垂直；纹理棋盘格缩放均匀，无剪切拉伸变形（Zero Shear Strain）。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Gu, X., & Yau, S. T. (2003). *Global conformal surface parameterization*. **Eurographics Symposium on Geometry Processing (SGP)**, 127-137. - Jin, M., Kim, J., Luo, F., & Gu, X. (2008). *Discrete su",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "基于离散表面里奇流与圆填充度规的保角映射与零角畸变复平面展开",
    groundTruth: "1. **圆填充度规（Circle Packing Metric）**： 每条边长 $l_{ij}$ 由顶点处虚拟圆半径 $r_i, r_j$ 及夹角 $\\Phi_{ij}$ 决定： $$l_{ij}^2 = r_i^2 + r_j^2 + 2 r_i r_j \\cos \\Phi_{ij}$$ 2. **离散里奇流曲率驱动演化方程**： 对数共形因子 $u_i = \\ln r_i$，流演化偏微分方程为： $$\\frac{d u_i}{dt} = \\bar{K}_i - K_i$$ 其中 $K_i = 2\\pi - \\sum_{j,k \\in F(i)} \\theta_i^{jk}$ 为离散高斯",
    evaluationCriteria: "- **机器比对**：解析平面展开图的所有三角形，计算对应三维三角形与二维三角形的三内角差，统计全网格角度方差 $\\sigma^2_{\\Delta \\theta} < 0.25$；验证 Tissot 指示图元为严格正圆而非椭圆。 - **视觉比对**：贴图网格的所有经纬交点在任何曲率集中区均保持严格 $90^\\circ$ 相互正交垂直；纹理棋盘格缩放均匀，无剪切拉伸变形（Zero Shear Strain）。",
    referenceSource: "- Gu, X., & Yau, S. T. (2003). *Global conformal surface parameterization*. **Eurographics Symposium on Geometry Processing (SGP)**, 127-137. - Jin, M., Kim, J., Luo, F., & Gu, X. (2008). *Discrete su",
  },
};

/**
 * VFX-GEOM-07: Costa 亏格-1 三悬端无自交极小曲面零均曲率 ($H=0$) 解析线框
 */
export const VFX_GEOM_07_PROMPT: PromptSpec = {
  id: "VFX-GEOM-07",
  label: "Costa 亏格-1 三悬端无自交极小曲面零均曲率 ($H=0$) 解析线框 (Costa Genus-1 Three-Ended Minimal Surface Zero Mean Curvature Manifold)",
  template: "Generate an SVG technical visualization of Costa Genus-1 Three-Ended Minimal Surface Zero Mean Curvature Manifold as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: 1. **Weierstrass-Enneper 解析参数表达**： 曲面在正方形复平托罗环面 $\\mathbb{C}/(\\mathbb{Z} + i\\mathbb{Z})$ 上定义，坐标微分积分形式： $$\\mathbf{x}(\\zeta) = \\text{Re} \\int_0^\\zeta \\left( \\frac{1}{2}(1 - g^2) f, \\; \\frac{i}{2}(1 + g^2) f, \\; g f \\right) dz$$ 其中亚纯函数与微分形式由 Weierstrass 椭圆函数 $\\wp(z)$ 给出： $$g(z) = \\frac{2\\sqrt{2\\pi}}{a} \\frac{1}{\\wp'(z)}, \\quad f(z) = \\wp(z)$$ 对于正方形晶格，椭圆不变量为 $g_2 \\approx 189.072772, g_3 = 0, e_1 = \\wp(1/2) \\approx 6.87519$。 2. **端点渐近行为（Asymptotic Ends）**： - $z \\to 0$：中间平面端（Planar End），逼近水平面 $z \\to 0$； - $z \\to \\pm 1/2$：两个上下悬链面端（Catenoidal Ends），渐近行为如同悬链线柱面的对称翻展。 3. **微分几何黄金不变量**： - 主曲率满足严格等值反号：$k_1 + k_2 = 0 \\implies$ 平均曲率处处为零： $$H(\\mathbf{x}) \\equiv 0 \\quad (\\forall \\mathbf{x} \\in \\mathcal{M})$$ - 拓扑亏格 $g=1$，端数 $k=3$，总高斯曲率绝对积分： $$\\iint_{\\mathcal{M}} K dA = 2\\pi (\\chi - k) = 2\\pi (2 - 2g - 2k) = -12\\pi$$ 4. **几何公差**：提取网格顶点的离散平均曲率 $\\|H_{\\text{discrete}}\\| \\le 5.0 \\times 10^{-4}$；上下对称与四重旋转对称（$D_4$ 对称群）相对偏差 $< 0.1\\%$。 Visual Inspection Criteria: - **机器比对**：计算网格各面片的顶点法向量夹角与切向主曲率，核验离散平均曲率散度 $\\sum |H_i| / N \\le 10^{-3}$；核对中央环面孔洞的闭合第一同调群基底环圈 $\\gamma_1, \\gamma_2$ 的不可收缩拓扑性。 - **视觉比对**：清晰呈现中央像甜甜圈般的环面通孔（Torus Hole），中间扁平延伸的薄片与上下对称飞翘的悬链喇叭口形成空间鞍状自然张力平衡，全曲面处处鞍形无任何凸起隆起。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Costa, C. J. (1984). *Example of a complete minimal surface in $\\mathbb{R}^3$ of genus one and three embedded ends*. **Boletim da Sociedade Brasileira de Matemática**, 15(1-2), 47-54. - Hoffman, D.,",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "Costa 亏格-1 三悬端无自交极小曲面零均曲率 ($H=0$) 解析线框",
    groundTruth: "1. **Weierstrass-Enneper 解析参数表达**： 曲面在正方形复平托罗环面 $\\mathbb{C}/(\\mathbb{Z} + i\\mathbb{Z})$ 上定义，坐标微分积分形式： $$\\mathbf{x}(\\zeta) = \\text{Re} \\int_0^\\zeta \\left( \\frac{1}{2}(1 - g^2) f, \\; \\frac{i}{2}(1 + g^2) f, \\; g f \\right) dz$$ 其中亚纯函数与微分形式由 Weierstrass 椭圆函数 $\\wp(z)$ 给出： $$g(z) = \\frac{2\\sqrt{2\\pi}}{a} ",
    evaluationCriteria: "- **机器比对**：计算网格各面片的顶点法向量夹角与切向主曲率，核验离散平均曲率散度 $\\sum |H_i| / N \\le 10^{-3}$；核对中央环面孔洞的闭合第一同调群基底环圈 $\\gamma_1, \\gamma_2$ 的不可收缩拓扑性。 - **视觉比对**：清晰呈现中央像甜甜圈般的环面通孔（Torus Hole），中间扁平延伸的薄片与上下对称飞翘的悬链喇叭口形成空间鞍状自然张力平衡，全曲面处处鞍形无任何凸起隆起。",
    referenceSource: "- Costa, C. J. (1984). *Example of a complete minimal surface in $\\mathbb{R}^3$ of genus one and three embedded ends*. **Boletim da Sociedade Brasileira de Matemática**, 15(1-2), 47-54. - Hoffman, D.,",
  },
};

/**
 * VFX-GEOM-08: 基于曲率度规张量场 (Metric Tensor) 的自适应各向异性网格边折叠/翻转平衡
 */
export const VFX_GEOM_08_PROMPT: PromptSpec = {
  id: "VFX-GEOM-08",
  label: "基于曲率度规张量场 (Metric Tensor) 的自适应各向异性网格边折叠/翻转平衡 (Adaptive Anisotropic Remeshing Guided by Curvature Metric Tensor Ellipsoids)",
  template: "Generate an SVG technical visualization of Adaptive Anisotropic Remeshing Guided by Curvature Metric Tensor Ellipsoids as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: 1. **局部曲率度规张量场定义**： 在点 $\\mathbf{x}$ 处由形状算子（Shape Operator）特征分解导出： $$\\mathcal{M}(\\mathbf{x}) = V \\Lambda V^T = \\begin{pmatrix} \\mathbf{v}_1 & \\mathbf{v}_2 \\end{pmatrix} \\begin{pmatrix} \\lambda_1 & 0 \\\\ 0 & \\lambda_2 \\end{pmatrix} \\begin{pmatrix} \\mathbf{v}_1^T \\\\ \\mathbf{v}_2^T \\end{pmatrix}, \\quad \\lambda_i = \\max\\left( \\epsilon_{\\text{min}}, \\frac{|k_i|}{\\epsilon_{\\text{tol}}} \\right)$$ 其中 $\\mathbf{v}_1, \\mathbf{v}_2$ 为主曲率切方向，$k_1, k_2$ 为对应主曲率。 2. **黎曼度规诱导边长与平衡准则**： 边 $\\mathbf{e} = \\mathbf{v}_j - \\mathbf{v}_i$ 在非均匀度规下的度规边长（Riemannian Edge Length）： $$L_{\\mathcal{M}}(\\mathbf{e}) = \\int_0^1 \\sqrt{\\mathbf{e}^T \\mathcal{M}((1-t)\\mathbf{v}_i + t\\mathbf{v}_j) \\mathbf{e}} \\, dt \\approx \\sqrt{\\mathbf{e}^T \\bar{\\mathcal{M}}_{ij} \\mathbf{e}}$$ - **边分裂（Edge Split）**：若 $L_{\\mathcal{M}}(\\mathbf{e}) > \\sqrt{2}$，触发中点插入； - **边折叠（Edge Collapse）**：若 $L_{\\mathcal{M}}(\\mathbf{e}) < 1/\\sqrt{2}$，合并消除短边； - **度规 Delaunay 边翻转（Delaunay Flip）**：翻转对角线以最大化度规空间内的最小内角。 3. **拓扑收敛状态不变量**： 重剖后内部所有顶点的度数（Valence）期望值 $\\mathbb{E}[\\text{deg}(v)] = 6$；全网格度规边长均值 $\\bar{L}_{\\mathcal{M}} \\in [0.95, 1.05]$。 4. **几何公差**：反向重构流形与原始解析面的豪斯多夫距离（Hausdorff Distance）$d_H(\\mathcal{M}_{\\text{mesh}}, \\mathcal{M}_0) \\le \\epsilon_{\\text{tol}}$；退化钝角/倒置三角形（Inverted Face）数量严格为 0。 Visual Inspection Criteria: - **机器比对**：计算 SVG 中每条多边形线段沿其局部曲率椭球方向的投影长度，检验 $L_{\\mathcal{M}}$ 直方图分布是否紧密聚集在 $[0.7, 1.4]$ 内；检查顶点度数直方图中 6-度顶点的占比 $\\ge 85\\%$。 - **视觉比对**：在柱面或刀刃脊线处，三角形长宽比高度拉长且与主曲率脊线严格平行（流线型排列）；在球面或各向同性平原处，三角形恢复为匀称的正三角形。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Bossen, F. J., & Heckbert, P. S. (1996). *A pliant method for anisotropic mesh generation*. **SIGGRAPH 1996 Proceedings**, 77-84. - Alliez, P., Ucelli, G., Gotsman, C., & Attene, M. (2005). *Recent ",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "基于曲率度规张量场 (Metric Tensor) 的自适应各向异性网格边折叠/翻转平衡",
    groundTruth: "1. **局部曲率度规张量场定义**： 在点 $\\mathbf{x}$ 处由形状算子（Shape Operator）特征分解导出： $$\\mathcal{M}(\\mathbf{x}) = V \\Lambda V^T = \\begin{pmatrix} \\mathbf{v}_1 & \\mathbf{v}_2 \\end{pmatrix} \\begin{pmatrix} \\lambda_1 & 0 \\\\ 0 & \\lambda_2 \\end{pmatrix} \\begin{pmatrix} \\mathbf{v}_1^T \\\\ \\mathbf{v}_2^T \\end{pmatrix}, \\quad \\",
    evaluationCriteria: "- **机器比对**：计算 SVG 中每条多边形线段沿其局部曲率椭球方向的投影长度，检验 $L_{\\mathcal{M}}$ 直方图分布是否紧密聚集在 $[0.7, 1.4]$ 内；检查顶点度数直方图中 6-度顶点的占比 $\\ge 85\\%$。 - **视觉比对**：在柱面或刀刃脊线处，三角形长宽比高度拉长且与主曲率脊线严格平行（流线型排列）；在球面或各向同性平原处，三角形恢复为匀称的正三角形。",
    referenceSource: "- Bossen, F. J., & Heckbert, P. S. (1996). *A pliant method for anisotropic mesh generation*. **SIGGRAPH 1996 Proceedings**, 77-84. - Alliez, P., Ucelli, G., Gotsman, C., & Attene, M. (2005). *Recent ",
  },
};

/**
 * VFX-GEOM-09: 莫比乌斯带平行移动法向量完整翻转与中线二分剖切拓扑相变
 */
export const VFX_GEOM_09_PROMPT: PromptSpec = {
  id: "VFX-GEOM-09",
  label: "莫比乌斯带平行移动法向量完整翻转与中线二分剖切拓扑相变 (Möbius Strip Midline Bifurcation & Non-Orientable Normal Holonomy Inversion)",
  template: "Generate an SVG technical visualization of Möbius Strip Midline Bifurcation & Non-Orientable Normal Holonomy Inversion as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: 1. **解析三维嵌入参数方程**（中心线半径 $R_0 = 4.0$，半带宽 $w = 1.0, v \\in [-w, w], u \\in [0, 2\\pi]$）： $$\\mathbf{r}(u, v) = \\left( \\left(R_0 + \\frac{v}{2}\\cos\\frac{u}{2}\\right)\\cos u, \\; \\left(R_0 + \\frac{v}{2}\\cos\\frac{u}{2}\\right)\\sin u, \\; \\frac{v}{2}\\sin\\frac{u}{2} \\right)$$ 2. **中心线平移法向量场与完整反转（Holonomy Sign Flip）**： 令 $v=0$，中心线为 $\\mathbf{c}(u) = (R_0 \\cos u, R_0 \\sin u, 0)$。其单位表面法向向量为： $$\\mathbf{n}(u) = \\left( -\\sin\\frac{u}{2}\\cos u, \\; -\\sin\\frac{u}{2}\\sin u, \\; \\cos\\frac{u}{2} \\right)$$ 当参数经历一个周期 $u: 0 \\to 2\\pi$ 时： $$\\mathbf{n}(2\\pi) = (0, 0, -1) = -\\mathbf{n}(0) \\quad (\\text{反转角 } \\Delta \\theta = \\pi)$$ 3. **拓扑外科相变（Topological Midline Surgery）**： - **剪切前（原始莫比乌斯带）**：不可定向，边界连通分支数 $B=1$（一条长度为 $4\\pi R_0$ 的单一边缘），欧拉示性数 $\\chi_1 = 0$； - **剪切后（中线 $v=0$ 剔除）**：拓扑重构为同胚于圆环面的长带，**可定向**，具有 2 个完整扭转（Twist Number $= 4\\pi$），边界分支数跃迁为 $B=2$，周长扩大为两倍，欧拉示性数保持 $\\chi_2 = 0$。 4. **几何公差**：法向量连续旋转角速度绝对均匀度偏差 $< 0.1\\%$；中线二分剖切后的几何对称性与连续性严格守恒。 Visual Inspection Criteria: - **机器比对**：抓取法向量箭头端点轨迹，验证其在 $u=2\\pi$ 处与起点法向的内积严格等于 $-1.000$；剪切状态下检查多边形连续路径的连通分支数（Connected Components Count）在 $v=0$ 割开前后从 1 依然维持为 1（非分离状态）。 - **视觉比对**：法向指示箭头沿环滑移时平滑倾斜扭转，绝无突兀镜像突跳；剪切过程犹如拉链拉开，裂解出一条具有双重扭结、大一号的立体贯通环。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Spivak, M. (1999). *A Comprehensive Introduction to Differential Geometry, Vol. 1*. Publish or Perish. - do Carmo, M. P. (2016). *Differential Geometry of Curves and Surfaces*. Dover Publications. -",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "莫比乌斯带平行移动法向量完整翻转与中线二分剖切拓扑相变",
    groundTruth: "1. **解析三维嵌入参数方程**（中心线半径 $R_0 = 4.0$，半带宽 $w = 1.0, v \\in [-w, w], u \\in [0, 2\\pi]$）： $$\\mathbf{r}(u, v) = \\left( \\left(R_0 + \\frac{v}{2}\\cos\\frac{u}{2}\\right)\\cos u, \\; \\left(R_0 + \\frac{v}{2}\\cos\\frac{u}{2}\\right)\\sin u, \\; \\frac{v}{2}\\sin\\frac{u}{2} \\right)$$ 2. **中心线平移法向量场与完整反转（Holonomy Sign Flip）",
    evaluationCriteria: "- **机器比对**：抓取法向量箭头端点轨迹，验证其在 $u=2\\pi$ 处与起点法向的内积严格等于 $-1.000$；剪切状态下检查多边形连续路径的连通分支数（Connected Components Count）在 $v=0$ 割开前后从 1 依然维持为 1（非分离状态）。 - **视觉比对**：法向指示箭头沿环滑移时平滑倾斜扭转，绝无突兀镜像突跳；剪切过程犹如拉链拉开，裂解出一条具有双重扭结、大一号的立体贯通环。",
    referenceSource: "- Spivak, M. (1999). *A Comprehensive Introduction to Differential Geometry, Vol. 1*. Publish or Perish. - do Carmo, M. P. (2016). *Differential Geometry of Curves and Surfaces*. Dover Publications. -",
  },
};

/**
 * VFX-GEOM-10: 庞加莱单位圆盘双曲几何七阶三边形 $\{7, 3\}$ 正镶嵌与圆反演对称凝聚
 */
export const VFX_GEOM_10_PROMPT: PromptSpec = {
  id: "VFX-GEOM-10",
  label: "庞加莱单位圆盘双曲几何七阶三边形 $\\{7, 3\\}$ 正镶嵌与圆反演对称凝聚 (Poincaré Disk Hyperbolic Regular Tiling {7,3} & Circle Inversion Isometry Condensation)",
  template: "Generate an SVG technical visualization of Poincaré Disk Hyperbolic Regular Tiling {7,3} & Circle Inversion Isometry Condensation as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: 1. **庞加莱度规与双曲测地线方程**： $$ds^2 = \\frac{4 (dx^2 + dy^2)}{(1 - x^2 - y^2)^2}$$ 两点 $z_1, z_2 \\in \\mathbb{D}$ 之间的双曲距离： $$d_{\\mathbb{H}}(z_1, z_2) = 2 \\operatorname{artanh} \\left| \\frac{z_1 - z_2}{1 - z_1 \\bar{z}_2} \\right|$$ 2. **正 $\\{p, q\\}$ 双曲镶嵌充要条件（Schläfli Symbol）**： $$(p-2)(q-2) > 4 \\quad (\\text{对于 } \\{7, 3\\}: (7-2)(3-2) = 5 > 4)$$ 3. **中心正七边形基底顶点欧氏半径计算**： 利用双曲余弦第二定理，计算原点到中心正 $p$ 边形各顶点的欧氏距离 $r_0$： $$\\cosh d_0 = \\frac{\\cos(\\pi/q)}{\\sin(\\pi/p)} = \\frac{\\cos(\\pi/3)}{\\sin(\\pi/7)} = \\frac{1/2}{\\sin(\\pi/7)} \\approx 1.15238$$ $$r_0 = \\tanh(d_0 / 2) = \\sqrt{\\frac{\\cosh d_0 - 1}{\\cosh d_0 + 1}} \\approx 0.26610$$ 4. **圆反演等距反射算子（Circle Inversion Isometry）**： 关于中心为 $c$、半径为 $R$ 的圆弧测地线的双曲反射映射为： $$\\sigma(z) = c + \\frac{R^2}{\\bar{z} - \\bar{c}}$$ 5. **几何公差**：所有交汇顶点的内角必须严格等于 $2\\pi/3 = 120.0^\\circ$（公差 $< 0.1^\\circ$）；所有测地线圆弧与边界单位圆的相交切角严格为 $90.0^\\circ \\pm 0.05^\\circ$。 Visual Inspection Criteria: - **机器比对**：提取圆周边缘各测地线圆弧的端点法线与单位圆切线，计算点积验证正交性误差 $\\le 10^{-4}$；检测 3 阶镶嵌顶点内角和，验证 $\\sum_{k=1}^3 \\theta_k = 360.0^\\circ$。 - **视觉比对**：中央正七边形匀称居中，向圆盘边缘递推递归时，七边形呈现指数级收缩细密化，并在 $|z| \\to 1$ 边界处形成分形般的无限凝聚环，展现出极具冲击力的非欧双曲纵深感。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Coxeter, H. S. M. (1954). *Regular honeycombs in hyperbolic space*. **Proceedings of the International Congress of Mathematicians**, 3, 155-169. - Dunham, D. (1986). *Hyperbolic symmetry*. **Compute",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "庞加莱单位圆盘双曲几何七阶三边形 $\\{7, 3\\}$ 正镶嵌与圆反演对称凝聚",
    groundTruth: "1. **庞加莱度规与双曲测地线方程**： $$ds^2 = \\frac{4 (dx^2 + dy^2)}{(1 - x^2 - y^2)^2}$$ 两点 $z_1, z_2 \\in \\mathbb{D}$ 之间的双曲距离： $$d_{\\mathbb{H}}(z_1, z_2) = 2 \\operatorname{artanh} \\left| \\frac{z_1 - z_2}{1 - z_1 \\bar{z}_2} \\right|$$ 2. **正 $\\{p, q\\}$ 双曲镶嵌充要条件（Schläfli Symbol）**： $$(p-2)(q-2) > 4 \\quad (\\text{对于 }",
    evaluationCriteria: "- **机器比对**：提取圆周边缘各测地线圆弧的端点法线与单位圆切线，计算点积验证正交性误差 $\\le 10^{-4}$；检测 3 阶镶嵌顶点内角和，验证 $\\sum_{k=1}^3 \\theta_k = 360.0^\\circ$。 - **视觉比对**：中央正七边形匀称居中，向圆盘边缘递推递归时，七边形呈现指数级收缩细密化，并在 $|z| \\to 1$ 边界处形成分形般的无限凝聚环，展现出极具冲击力的非欧双曲纵深感。",
    referenceSource: "- Coxeter, H. S. M. (1954). *Regular honeycombs in hyperbolic space*. **Proceedings of the International Congress of Mathematicians**, 3, 155-169. - Dunham, D. (1986). *Hyperbolic symmetry*. **Compute",
  },
};

export const VFX_GEOM_INDIVIDUAL_PROMPTS: readonly PromptSpec[] = [
  VFX_GEOM_01_PROMPT,
  VFX_GEOM_02_PROMPT,
  VFX_GEOM_03_PROMPT,
  VFX_GEOM_04_PROMPT,
  VFX_GEOM_05_PROMPT,
  VFX_GEOM_06_PROMPT,
  VFX_GEOM_07_PROMPT,
  VFX_GEOM_08_PROMPT,
  VFX_GEOM_09_PROMPT,
  VFX_GEOM_10_PROMPT,
];

/**
 * VFX-3: 离散微分几何、神经隐式曲面与动态拓扑流形 领域分组套题（UX 交互对齐四大名著，含 10 个候选场景）
 */
export const VFX_GEOM_SUITE_PROMPT: PromptSpec = {
  id: "vfx-geom-v1",
  label: "VFX-3: 离散微分几何与拓扑流形（十题组）",
  template: "VFX-3: 离散微分几何、神经隐式曲面与动态拓扑流形 前沿视觉特效十题组，每个轮换周期洗牌抽一题，或在下拉菜单中直接指定场景。",
  variables: [],
    candidates: [
    {
      id: VFX_GEOM_01_PROMPT.id,
      label: "基于离散外微积分的三角网格热流测地线距离场与等距线重构",
      text: VFX_GEOM_01_PROMPT.template,
      standard: VFX_GEOM_01_PROMPT.standard,
    },
    {
      id: VFX_GEOM_02_PROMPT.id,
      label: "神经隐式距离场 (NeuS) Eikonal 梯度约束与自适应八叉树 Dual Contouring 剖分",
      text: VFX_GEOM_02_PROMPT.template,
      standard: VFX_GEOM_02_PROMPT.standard,
    },
    {
      id: VFX_GEOM_03_PROMPT.id,
      label: "四维超正方体 (8-cell) SO(4) 等斜双自转与佩特里多边形 Coxeter 平面透视",
      text: VFX_GEOM_03_PROMPT.template,
      standard: VFX_GEOM_03_PROMPT.standard,
    },
    {
      id: VFX_GEOM_04_PROMPT.id,
      label: "克莱因瓶四维浸入在三维空间中的“Figure-8”无边界不可定向光滑流形",
      text: VFX_GEOM_04_PROMPT.template,
      standard: VFX_GEOM_04_PROMPT.standard,
    },
    {
      id: VFX_GEOM_05_PROMPT.id,
      label: "霍普夫纤维化 ($S^3 \\\\to S^2$) 嵌套同轴环面簇与维拉索圆 (Villarceau Circles) 拓扑环链",
      text: VFX_GEOM_05_PROMPT.template,
      standard: VFX_GEOM_05_PROMPT.standard,
    },
    {
      id: VFX_GEOM_06_PROMPT.id,
      label: "基于离散表面里奇流与圆填充度规的保角映射与零角畸变复平面展开",
      text: VFX_GEOM_06_PROMPT.template,
      standard: VFX_GEOM_06_PROMPT.standard,
    },
    {
      id: VFX_GEOM_07_PROMPT.id,
      label: "Costa 亏格-1 三悬端无自交极小曲面零均曲率 ($H=0$) 解析线框",
      text: VFX_GEOM_07_PROMPT.template,
      standard: VFX_GEOM_07_PROMPT.standard,
    },
    {
      id: VFX_GEOM_08_PROMPT.id,
      label: "基于曲率度规张量场 (Metric Tensor) 的自适应各向异性网格边折叠/翻转平衡",
      text: VFX_GEOM_08_PROMPT.template,
      standard: VFX_GEOM_08_PROMPT.standard,
    },
    {
      id: VFX_GEOM_09_PROMPT.id,
      label: "莫比乌斯带平行移动法向量完整翻转与中线二分剖切拓扑相变",
      text: VFX_GEOM_09_PROMPT.template,
      standard: VFX_GEOM_09_PROMPT.standard,
    },
    {
      id: VFX_GEOM_10_PROMPT.id,
      label: "庞加莱单位圆盘双曲几何七阶三边形 $\\\\{7, 3\\\\}$ 正镶嵌与圆反演对称凝聚",
      text: VFX_GEOM_10_PROMPT.template,
      standard: VFX_GEOM_10_PROMPT.standard,
    },
  ],
  source: "- Crane, K., Weischedel, C., & Wardetzky, M. (2013). *Geodesics in heat: A new approach to computing distance based on heat flow*. **ACM Transactions on Graphics (TOG)**, 32(5), 1-11. DOI: `10.1145/25",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "离散外微分算子、四维超正方体 SO(4) 等斜自转与非欧拓扑流形",
    groundTruth: "以离散拉普拉斯-贝尔特拉米算子热流测地线场、四维超立方体正交双平面自转投影、克莱因瓶三维无自交光滑浸入与霍普夫纤维化（Hopf Fibration）嵌套环面族为基准，满足微分拓扑学与黎曼几何方程。",
    evaluationCriteria: "1. 拓扑正确性：流形亏格、法线朝向与欧拉示性数自洽；2. 投影无畸变：四维旋转对称与保角参数化角度保持；3. 语法规范：XML 严格合法，无交互 JS。",
    referenceSource: "https://www.geometryprocessing.org",
  },
};

export const VFX_GEOM_PROMPTS = VFX_GEOM_INDIVIDUAL_PROMPTS;
