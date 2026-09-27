/**
 * FE-3: 容错量子信息、模拟与后量子系统工程 前沿评测题库。
 * 全量采用纯直观可视自闭合矢量 SVG（零外部 JS，无交互式事件，支持并排直接肉眼对比）。
 */

import type { PromptSpec } from "../prompt";

/**
 * FE-QUANTUM-01: 旋转表面码综合征提取与最小权完美匹配解码图
 */
export const FE_QUANTUM_01_PROMPT: PromptSpec = {
  id: "FE-QUANTUM-01",
  label: "旋转表面码综合征提取与最小权完美匹配解码图 (Rotated Surface Code Syndrome Extraction & MWPM Error Chain Decoding)",
  template: "Generate an SVG technical visualization of Rotated Surface Code Syndrome Extraction & MWPM Error Chain Decoding as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background:  Physical & Mathematical Ground Truth: - **晶格几何与量子比特配置**：以 $d=3$ 旋转表面码为例，包含 9 个数据量子比特 $D_1 \\sim D_9$ 排布在 $3 \\times 3$ 旋转方格顶点，坐标系为 $(x, y) \\in \\{0, 1, 2\\}^2$；包含 8 个辅助测量比特 $A_1 \\sim A_8$（4 个 $X$-型测量辅助比特位于对角面心，4 个 $Z$-型测量辅助比特位于边界与面心）。 - **稳定子算符定义**： - 块体权重-4 算符：$S_Z^{(bulk)} = Z_2 Z_4 Z_6 Z_8$；$S_X^{(bulk)} = X_4 X_5 X_7 X_8$ 等； - 边界权重-2 算符：光滑边界（Smooth boundary）对应权重-2 $X$-稳定子，粗糙边界（Rough boundary）对应权重-2 $Z$-稳定子。 - **物理注入误差事件**： - 注入数据比特误差：在 $D_4$ 发生 $X$ 错误（$X_4$），在 $D_2$ 发生 $Z$ 错误（$Z_2$）。 - 综合征激励输出：$X_4$ 错误激发相邻两枚 $Z$-稳定子算符测出 $-1$（设为红色发光节点）；$Z_2$ 错误激发相邻边界与块体两枚 $X$-稳定子算符测出 $-1$（设为琥珀色发光节点）。 - **MWPM 最优纠错边**：MWPM 算法根据 Manhattan 距离计算赋权图，精准输出两条连接纠错链——一条连接两枚 $-1$ 的 $Z$-综合征顶点并在 $D_4$ 执行恢复门 $\\hat{R} = X_4$；一条将 $X$-综合征顶点连接至最近光滑边界并在 $D_2$ 执行 $\\hat{R} = Z_2$。 Visual Inspection Criteria: - **视觉辨识要点**： 1. 9 个数据比特呈现为深色实心圆环（标明 $D_1 \\sim D_9$），8 个稳定子面呈现为半透明填色的斜向正方形或半正方形（$Z$-稳定子为冷蓝系青色，$X$-稳定子为暖橙色）； 2. 被激发的错误综合征节点（$-1$ 本征值）具有高亮红色辉光标记与醒目负号； 3. MWPM 解码链以粗虚线或荧光色段严格穿过物理比特 $D_4$ 与 $D_2$，闭合消除综合征，不能错连其他无缺陷顶点。 - **机器数值容差**：晶格节点坐标绝对对齐误差 $\\le 2\\,\\text{px}$；稳定子多边形包含测试点覆盖率 $100\\%$。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Fowler, A. G., et al. (2012). \"Surface codes: Towards practical large-scale quantum computation.\" *Physical Review A*, 86(3), 032324. DOI: [10.1103/PhysRevA.86.032324](https://doi.org/10.1103/PhysRe",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "旋转表面码综合征提取与最小权完美匹配解码图",
    groundTruth: "- **晶格几何与量子比特配置**：以 $d=3$ 旋转表面码为例，包含 9 个数据量子比特 $D_1 \\sim D_9$ 排布在 $3 \\times 3$ 旋转方格顶点，坐标系为 $(x, y) \\in \\{0, 1, 2\\}^2$；包含 8 个辅助测量比特 $A_1 \\sim A_8$（4 个 $X$-型测量辅助比特位于对角面心，4 个 $Z$-型测量辅助比特位于边界与面心）。 - **稳定子算符定义**： - 块体权重-4 算符：$S_Z^{(bulk)} = Z_2 Z_4 Z_6 Z_8$；$S_X^{(bulk)} = X_4 X_5 X_7 X_8$ 等； - 边界权重-2 算符：光滑边界（Smooth boundary）对应权重-2 $X$-稳定子，粗糙边界（Rough boundary）对应权重-2 $Z$-稳定子。 - **物理注入误差事件**： - 注入数据比特误差：",
    evaluationCriteria: "- **视觉辨识要点**： 1. 9 个数据比特呈现为深色实心圆环（标明 $D_1 \\sim D_9$），8 个稳定子面呈现为半透明填色的斜向正方形或半正方形（$Z$-稳定子为冷蓝系青色，$X$-稳定子为暖橙色）； 2. 被激发的错误综合征节点（$-1$ 本征值）具有高亮红色辉光标记与醒目负号； 3. MWPM 解码链以粗虚线或荧光色段严格穿过物理比特 $D_4$ 与 $D_2$，闭合消除综合征，不能错连其他无缺陷顶点。 - **机器数值容差**：晶格节点坐标绝对对齐误差 $\\le 2\\,\\text{px}$；稳定子多边形包含测试点覆盖率 $100\\%$。",
    referenceSource: "- Fowler, A. G., et al. (2012). \"Surface codes: Towards practical large-scale quantum computation.\" *Physical Review A*, 86(3), 032324. DOI: [10.1103/PhysRevA.86.032324](https://doi.org/10.1103/PhysRevA.86.032324). - Higgott, O., & Gidney, C. (2025). \"Sparse Blossom: Correcting a million errors per ",
  },
};

/**
 * FE-QUANTUM-02: 超百中性原子光镊阵列空间重构与匈牙利无碰撞路径
 */
export const FE_QUANTUM_02_PROMPT: PromptSpec = {
  id: "FE-QUANTUM-02",
  label: "超百中性原子光镊阵列空间重构与匈牙利无碰撞路径 (Neutral Atom Optical Tweezers Array Spatial Reconfiguration & Hungarian Routing)",
  template: "Generate an SVG technical visualization of Neutral Atom Optical Tweezers Array Spatial Reconfiguration & Hungarian Routing as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background:  Physical & Mathematical Ground Truth: - **初始阵列与装载态**：外围为一个 $10 \\times 10$ 的光镊微阱晶格网格（浅灰圆圈，晶格常数 $a = 4.0\\,\\mu\\text{m}$），随机装载 50 个 $^{87}\\text{Rb}$ 原子（青绿色光球，半径 $r_0 = 0.8\\,\\mu\\text{m}$）。 - **目标靶区**：中心区域标定为 $6 \\times 6$ 的紧密阵列靶位（带有金色虚线外框与靶标十字线，共 36 个目标位）。 - **匈牙利重排代价矩阵**：以欧氏移动距离平方和最小为目标，即 $\\min \\sum_{i,j} C_{ij} x_{ij}$，其中 $C_{ij} = \\|\\mathbf{r}_i^{init} - \\mathbf{r}_j^{target}\\|^2$。 - **无碰撞动力学传输（Collision-free Routing）**： - 动态 AOD 镊子拾取未在靶位内的外围原子，沿着晶格间隙（保持与驻留原子的安全距离 $d > 0.5a = 2.0\\,\\mu\\text{m}$）平滑滑移； - 动画总时长设为 $\\tau = 6.0\\,\\text{s}$，循环播放；各原子按照由外向内或分层填充的次序滑移就位。 Visual Inspection Criteria: - **视觉辨识要点**： 1. 动画起始时，背景为 $10 \\times 10$ 网格中半满的随机原子散布； 2. 动画运行期间，清晰看到青绿原子在动态发光的 AOD 镊子导引下平滑沿无碰撞轨道滑动； 3. 动画终止帧（就位阶段），中心 $6 \\times 6$ 靶位呈现 36 颗 100% 满填充的无缺陷规则点阵，外围多余原子保持静止或被移至抛弃区。 - **平滑度与轨迹规范**：使用 `<animateMotion>` 绑定由三次贝塞尔曲线或正交曼哈顿折线构成的 SVG `<path>`，轨迹杜绝跨过正在被占据的晶格中心点。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Barredo, D., et al. (2016). \"An atom-by-atom assembler of defect-free arbitrary two-dimensional atomic arrays.\" *Science*, 354(6315), 1021–1023. DOI: [10.1126/science.aah3778](https://doi.org/10.112",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "超百中性原子光镊阵列空间重构与匈牙利无碰撞路径",
    groundTruth: "- **初始阵列与装载态**：外围为一个 $10 \\times 10$ 的光镊微阱晶格网格（浅灰圆圈，晶格常数 $a = 4.0\\,\\mu\\text{m}$），随机装载 50 个 $^{87}\\text{Rb}$ 原子（青绿色光球，半径 $r_0 = 0.8\\,\\mu\\text{m}$）。 - **目标靶区**：中心区域标定为 $6 \\times 6$ 的紧密阵列靶位（带有金色虚线外框与靶标十字线，共 36 个目标位）。 - **匈牙利重排代价矩阵**：以欧氏移动距离平方和最小为目标，即 $\\min \\sum_{i,j} C_{ij} x_{ij}$，其中 $C_{ij} = \\|\\mathbf{r}_i^{init} - \\mathbf{r}_j^{target}\\|^2$。 - **无碰撞动力学传输（Collision-free Routing）**： - 动态 AOD 镊子拾取未在靶",
    evaluationCriteria: "- **视觉辨识要点**： 1. 动画起始时，背景为 $10 \\times 10$ 网格中半满的随机原子散布； 2. 动画运行期间，清晰看到青绿原子在动态发光的 AOD 镊子导引下平滑沿无碰撞轨道滑动； 3. 动画终止帧（就位阶段），中心 $6 \\times 6$ 靶位呈现 36 颗 100% 满填充的无缺陷规则点阵，外围多余原子保持静止或被移至抛弃区。 - **平滑度与轨迹规范**：使用 `<animateMotion>` 绑定由三次贝塞尔曲线或正交曼哈顿折线构成的 SVG `<path>`，轨迹杜绝跨过正在被占据的晶格中心点。",
    referenceSource: "- Barredo, D., et al. (2016). \"An atom-by-atom assembler of defect-free arbitrary two-dimensional atomic arrays.\" *Science*, 354(6315), 1021–1023. DOI: [10.1126/science.aah3778](https://doi.org/10.1126/science.aah3778). - Bluvstein, D., et al. (2024). \"A logical quantum processor with dynamically re",
  },
};

/**
 * FE-QUANTUM-03: 里德堡阻塞哈密顿量与反铁磁 ℤ₂ 晶格量子相变动力学
 */
export const FE_QUANTUM_03_PROMPT: PromptSpec = {
  id: "FE-QUANTUM-03",
  label: "里德堡阻塞哈密顿量与反铁磁 ℤ₂ 晶格量子相变动力学 (Rydberg Blockade Hamiltonian & Antiferromagnetic ℤ₂ Quantum Phase Transition)",
  template: "Generate an SVG technical visualization of Rydberg Blockade Hamiltonian & Antiferromagnetic ℤ₂ Quantum Phase Transition as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background:  Physical & Mathematical Ground Truth: - **哈密顿量表达式**： $$\\hat{H} = \\sum_{i=1}^N \\frac{\\hbar\\Omega(t)}{2} \\hat{\\sigma}_i^x - \\sum_{i=1}^N \\hbar\\Delta(t) \\hat{n}_i + \\sum_{i < j} \\frac{C_6}{|i-j|^6 a^6} \\hat{n}_i \\hat{n}_j$$ 其中 $\\hat{n}_i = |r\\rangle_i \\langle r|_i$。 - **参数指标**： - 原子数 $N = 21$ 个原子水平排列，晶距 $a = 5.7\\,\\mu\\text{m}$； - 范德华系数 $C_6 / 2\\pi = 862\\,\\text{GHz}\\cdot\\mu\\text{m}^6$；最大拉比频率 $\\Omega / 2\\pi = 2.0\\,\\text{MHz}$； - 阻塞半径 $R_b / a \\approx 1.25$（强力阻断紧邻激发，即 $n_i n_{i+1} = 0$）。 - **绝热扫频动力学**： - 失谐 $\\Delta(t)$ 由 $-8\\,\\text{MHz}$ 线性扫频至 $+10\\,\\text{MHz}$； - 原子激发概率幅 $P_r(i, t) = \\langle \\hat{n}_i(t) \\rangle$。 - 最终基态演化为 $\\mathbb{Z}_2$ 密度波：奇数格点 $P_r(2k+1) \\approx 0.92$，偶数格点 $P_r(2k) \\approx 0.08$。 Visual Inspection Criteria: - **视觉辨识要点**： 1. 上方为主控波形监视窗口，显示 $\\Omega(t)$（钟形脉冲包络）与 $\\Delta(t)$（由负向正的斜坡直线）的时序发光指针； 2. 下方为 21 个原子节点的一维阵列，每个原子球体的半透明光晕大小与填充透明度由 `<animate>` 动态调制； 3. 动画前 1/3 周期，所有原子均处于小尺寸暗灰色基态；跨越临界区后，奇数位原子急剧膨胀并爆发出强烈的红橙色里德堡态光晕，而偶数位原子收缩变暗，肉眼呈现极度清晰的“明-暗-明-暗”空间反铁磁自旋密度波。 - **振幅公差**：最终态奇偶格点反差比 $(P_{odd}-P_{even})/(P_{odd}+P_{even}) \\ge 0.80$。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Bernien, H., et al. (2017). \"Probing many-body dynamics on a 51-atom quantum simulator.\" *Nature*, 551(7682), 579–584. DOI: [10.1038/nature24622](https://doi.org/10.1038/nature24622). - Keesling, A.",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "里德堡阻塞哈密顿量与反铁磁 ℤ₂ 晶格量子相变动力学",
    groundTruth: "- **哈密顿量表达式**： $$\\hat{H} = \\sum_{i=1}^N \\frac{\\hbar\\Omega(t)}{2} \\hat{\\sigma}_i^x - \\sum_{i=1}^N \\hbar\\Delta(t) \\hat{n}_i + \\sum_{i < j} \\frac{C_6}{|i-j|^6 a^6} \\hat{n}_i \\hat{n}_j$$ 其中 $\\hat{n}_i = |r\\rangle_i \\langle r|_i$。 - **参数指标**： - 原子数 $N = 21$ 个原子水平排列，晶距 $a = 5.7\\,\\mu\\text{m}$； - 范德华系数 $C_6 / 2\\pi = 862\\,\\text{GHz}\\cdot\\mu\\text{m}^6$；最大拉比频率 $\\Omega / 2\\pi = 2.0\\,\\text{MHz}$； - 阻塞半径 $R_b /",
    evaluationCriteria: "- **视觉辨识要点**： 1. 上方为主控波形监视窗口，显示 $\\Omega(t)$（钟形脉冲包络）与 $\\Delta(t)$（由负向正的斜坡直线）的时序发光指针； 2. 下方为 21 个原子节点的一维阵列，每个原子球体的半透明光晕大小与填充透明度由 `<animate>` 动态调制； 3. 动画前 1/3 周期，所有原子均处于小尺寸暗灰色基态；跨越临界区后，奇数位原子急剧膨胀并爆发出强烈的红橙色里德堡态光晕，而偶数位原子收缩变暗，肉眼呈现极度清晰的“明-暗-明-暗”空间反铁磁自旋密度波。 - **振幅公差**：最终态奇偶格点反差比 $(P_{odd}-P_{even})/(P_{odd}+P_{even}) \\ge 0.80$。",
    referenceSource: "- Bernien, H., et al. (2017). \"Probing many-body dynamics on a 51-atom quantum simulator.\" *Nature*, 551(7682), 579–584. DOI: [10.1038/nature24622](https://doi.org/10.1038/nature24622). - Keesling, A., et al. (2019). \"Quantum many-body scars in a 51-atom quantum simulator.\" *Nature*, 568(7751), 207–",
  },
};

/**
 * FE-QUANTUM-04: 超导 Transmon 约瑟夫森余弦势阱束缚态波函数与非谐宇称图谱
 */
export const FE_QUANTUM_04_PROMPT: PromptSpec = {
  id: "FE-QUANTUM-04",
  label: "超导 Transmon 约瑟夫森余弦势阱束缚态波函数与非谐宇称图谱 (Transmon Josephson Potential Well & Anharmonic Bound-State Wavefunctions)",
  template: "Generate an SVG technical visualization of Transmon Josephson Potential Well & Anharmonic Bound-State Wavefunctions as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background:  Physical & Mathematical Ground Truth: - **定态薛定谔方程**： $$\\left[ -4E_C \\frac{d^2}{d\\phi^2} - E_J \\cos\\phi \\right] \\psi_m(\\phi) = E_m \\psi_m(\\phi)$$ - **物理参数设定**： - $E_J/E_C = 50$，$E_C/h = 250\\,\\text{MHz}$，$E_J/h = 12.5\\,\\text{GHz}$； - 跃迁频率：$\\omega_{01}/2\\pi \\approx \\frac{\\sqrt{8 E_J E_C} - E_C}{h} \\approx 4.75\\,\\text{GHz}$； - 跃迁频率：$\\omega_{12}/2\\pi \\approx \\frac{\\sqrt{8 E_J E_C} - 2E_C}{h} \\approx 4.50\\,\\text{GHz}$； - 绝对非谐度：$\\alpha/2\\pi = \\omega_{12}/2\\pi - \\omega_{01}/2\\pi \\approx -250\\,\\text{MHz}$。 - **波函数轮廓与能级基线**： - 在势能曲线 $V(\\phi)$ 内部，分别在纵坐标 $y = E_0, E_1, E_2, E_3$ 处绘制水平基线； - 在各基线上叠加绘制归一化波函数曲线 $E_m + A \\psi_m(\\phi)$： - $m=0$：单峰对称高斯形，无零点（偶宇称，绿色，基态能量 $E_0 \\approx \\frac{1}{2}\\hbar\\omega_p - E_J$）； - $m=1$：中心奇点穿过零点，左谷右峰（奇宇称，天青色）； - $m=2$：中央主峰，两侧各有次级反向波谷，2 个零交叉点（偶宇称，洋红色）； - $m=3$：3 个零交叉点（奇宇称，橙黄色）。 Visual Inspection Criteria: - **视觉辨识要点**： 1. 背景清晰呈现粗线条的抛物线-余弦复合势阱 $V(\\phi) = -E_J \\cos\\phi$，横坐标范围 $\\phi \\in [-\\pi, \\pi]$； 2. 四条束缚态能级清晰展现不等间距特征：明确标出 $\\Delta E_{01} > \\Delta E_{12} > \\Delta E_{23}$，视觉上能直接看出负非谐性； 3. 波函数的振幅与零点位置严格满足量子力学正交归一与宇称反演不变性（$\\psi_0(-\\phi)=\\psi_0(\\phi)$, $\\psi_1(-\\phi)=-\\psi_1(\\phi)$）。 - **绝对坐标容差**：波函数零交叉点横坐标 $\\phi$ 的数学误差 $\\le 0.05\\,\\text{rad}$。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Koch, J., et al. (2007). \"Charge-insensitive qubit design derived from the Cooper pair box.\" *Physical Review A*, 76(4), 042319. DOI: [10.1103/PhysRevA.76.042319](https://doi.org/10.1103/PhysRevA.76",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "超导 Transmon 约瑟夫森余弦势阱束缚态波函数与非谐宇称图谱",
    groundTruth: "- **定态薛定谔方程**： $$\\left[ -4E_C \\frac{d^2}{d\\phi^2} - E_J \\cos\\phi \\right] \\psi_m(\\phi) = E_m \\psi_m(\\phi)$$ - **物理参数设定**： - $E_J/E_C = 50$，$E_C/h = 250\\,\\text{MHz}$，$E_J/h = 12.5\\,\\text{GHz}$； - 跃迁频率：$\\omega_{01}/2\\pi \\approx \\frac{\\sqrt{8 E_J E_C} - E_C}{h} \\approx 4.75\\,\\text{GHz}$； - 跃迁频率：$\\omega_{12}/2\\pi \\approx \\frac{\\sqrt{8 E_J E_C} - 2E_C}{h} \\approx 4.50\\,\\text{GHz}$； - 绝对非谐度：$\\alpha/2\\pi ",
    evaluationCriteria: "- **视觉辨识要点**： 1. 背景清晰呈现粗线条的抛物线-余弦复合势阱 $V(\\phi) = -E_J \\cos\\phi$，横坐标范围 $\\phi \\in [-\\pi, \\pi]$； 2. 四条束缚态能级清晰展现不等间距特征：明确标出 $\\Delta E_{01} > \\Delta E_{12} > \\Delta E_{23}$，视觉上能直接看出负非谐性； 3. 波函数的振幅与零点位置严格满足量子力学正交归一与宇称反演不变性（$\\psi_0(-\\phi)=\\psi_0(\\phi)$, $\\psi_1(-\\phi)=-\\psi_1(\\phi)$）。 - **绝对坐标容差**：波函数零交叉点横坐标 $\\phi$ 的数学误差 $\\le 0.05\\,\\text{rad}$。",
    referenceSource: "- Koch, J., et al. (2007). \"Charge-insensitive qubit design derived from the Cooper pair box.\" *Physical Review A*, 76(4), 042319. DOI: [10.1103/PhysRevA.76.042319](https://doi.org/10.1103/PhysRevA.76.042319). - Blais, A., et al. (2021). \"Circuit quantum electrodynamics.\" *Reviews of Modern Physics*",
  },
};

/**
 * FE-QUANTUM-05: 微波腔 QED 色散读出与 IQ 相空间指针动力学轨迹
 */
export const FE_QUANTUM_05_PROMPT: PromptSpec = {
  id: "FE-QUANTUM-05",
  label: "微波腔 QED 色散读出与 IQ 相空间指针动力学轨迹 (Cavity QED Dispersive Readout & IQ Phase-Space Pointer Trajectory)",
  template: "Generate an SVG technical visualization of Cavity QED Dispersive Readout & IQ Phase-Space Pointer Trajectory as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background:  Physical & Mathematical Ground Truth: - **色散哈密顿量与运动方程**： $$\\hat{H}_{disp} = \\hbar(\\omega_r - \\omega_d + \\chi \\hat{\\sigma}_z)\\hat{a}^\\dagger \\hat{a} + \\frac{\\hbar\\Omega_d}{2}(\\hat{a} + \\hat{a}^\\dagger)$$ 腔场相干振幅经典运动方程（$\\alpha = I + iQ$）： $$\\frac{d\\alpha(t)}{dt} = -\\left( \\frac{\\kappa}{2} + i(\\Delta_r \\pm \\chi) \\right)\\alpha(t) - i\\frac{\\Omega_d}{2}$$ - **参数设置**： - 腔衰减率 $\\kappa/2\\pi = 2.0\\,\\text{MHz}$；色散频移 $\\chi/2\\pi = -1.2\\,\\text{MHz}$；驱动设于未微扰腔频（$\\Delta_r = 0$）； - 稳态相空间指针坐标： - $|0\\rangle$ 态渐近稳态：$\\alpha_0 = \\frac{-i\\Omega_d/2}{\\kappa/2 + i\\chi} \\Rightarrow I_0 > 0, Q_0 < 0$； - $|1\\rangle$ 态渐近稳态：$\\alpha_1 = \\frac{-i\\Omega_d/2}{\\kappa/2 - i\\chi} \\Rightarrow I_1 > 0, Q_1 > 0$； - 分离角 $\\Delta\\theta = 2\\arctan(2|\\chi|/\\kappa) \\approx 100.4^\\circ$。 - **动力学轨迹动画**：从真空态原点 $(I=0, Q=0)$ 开始，两束荧光轨迹线伴随发光端点，分别向第二象限与第四象限以螺旋阻尼路径发散，在 $t \\approx 3/\\kappa$ 时稳定于两个分离的置信度高斯误差圆盘内。 Visual Inspection Criteria: - **视觉辨识要点**： 1. 坐标系为明确标注的横轴 $I$（同相分量 In-Phase）与纵轴 $Q$（正交分量 Quadrature）； 2. 动画实时展示两条动态展开的发光曲线：一条天蓝色轨迹代表 $|0\\rangle$ 态演化，一条玫瑰红轨迹代表 $|1\\rangle$ 态演化； 3. 轨迹终点处带有半透明的不确定度噪声圆盘（Wigner 涨落半径 $\\sigma_W = 1/2$），两者在相空间中充分分离（中心间距 $> 3\\sigma$），中间展示测度判决边界（Threshold line）。 - **机器度量指标**：分离角度数必须落在 $100.4^\\circ \\pm 3.0^\\circ$ 范围内。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Blais, A., et al. (2004). \"Cavity quantum electrodynamics for superconducting electrical circuits: An architecture for quantum computation.\" *Physical Review A*, 69(6), 062320. DOI: [10.1103/PhysRev",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "微波腔 QED 色散读出与 IQ 相空间指针动力学轨迹",
    groundTruth: "- **色散哈密顿量与运动方程**： $$\\hat{H}_{disp} = \\hbar(\\omega_r - \\omega_d + \\chi \\hat{\\sigma}_z)\\hat{a}^\\dagger \\hat{a} + \\frac{\\hbar\\Omega_d}{2}(\\hat{a} + \\hat{a}^\\dagger)$$ 腔场相干振幅经典运动方程（$\\alpha = I + iQ$）： $$\\frac{d\\alpha(t)}{dt} = -\\left( \\frac{\\kappa}{2} + i(\\Delta_r \\pm \\chi) \\right)\\alpha(t) - i\\frac{\\Omega_d}{2}$$ - **参数设置**： - 腔衰减率 $\\kappa/2\\pi = 2.0\\,\\text{MHz}$；色散频移 $\\chi/2\\pi = -1.2\\,\\text{MHz}$；",
    evaluationCriteria: "- **视觉辨识要点**： 1. 坐标系为明确标注的横轴 $I$（同相分量 In-Phase）与纵轴 $Q$（正交分量 Quadrature）； 2. 动画实时展示两条动态展开的发光曲线：一条天蓝色轨迹代表 $|0\\rangle$ 态演化，一条玫瑰红轨迹代表 $|1\\rangle$ 态演化； 3. 轨迹终点处带有半透明的不确定度噪声圆盘（Wigner 涨落半径 $\\sigma_W = 1/2$），两者在相空间中充分分离（中心间距 $> 3\\sigma$），中间展示测度判决边界（Threshold line）。 - **机器度量指标**：分离角度数必须落在 $100.4^\\circ \\pm 3.0^\\circ$ 范围内。",
    referenceSource: "- Blais, A., et al. (2004). \"Cavity quantum electrodynamics for superconducting electrical circuits: An architecture for quantum computation.\" *Physical Review A*, 69(6), 062320. DOI: [10.1103/PhysRevA.69.062320](https://doi.org/10.1103/PhysRevA.69.062320). - Wallraff, A., et al. (2004). \"Strong cou",
  },
};

/**
 * FE-QUANTUM-06: 薛定谔猫态玻色纠错码相空间维格纳函数拓扑干涉条纹
 */
export const FE_QUANTUM_06_PROMPT: PromptSpec = {
  id: "FE-QUANTUM-06",
  label: "薛定谔猫态玻色纠错码相空间维格纳函数拓扑干涉条纹 (Schrödinger Cat State Bosonic QEC Wigner Function Quasiprobability Distribution)",
  template: "Generate an SVG technical visualization of Schrödinger Cat State Bosonic QEC Wigner Function Quasiprobability Distribution as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background:  Physical & Mathematical Ground Truth: - **态矢量与维格纳函数解析表达式**： 对于偶猫态 $|\\psi_+\\rangle = \\mathcal{N}_+ (|\\alpha\\rangle + |-\\alpha\\rangle)$，其中 $\\alpha = 2.5$（平均光子数 $\\bar{n} \\approx 6.25$）： $$W(x, p) = \\frac{2}{\\pi(1 + e^{-2|\\alpha|^2})} e^{-(x^2 + p^2)} \\left[ \\cosh(2\\sqrt{2}\\alpha x) + \\cos(2\\sqrt{2}\\alpha p) \\right]$$ （取无量纲正交坐标 $x = \\text{Re}(\\beta)\\sqrt{2}, p = \\text{Im}(\\beta)\\sqrt{2}$）。 - **特征拓扑结构**： - 两个经典相干态高斯极大值：位于 $(x, p) = (\\pm \\sqrt{2}\\alpha, 0) \\approx (\\pm 3.54, 0)$，峰值 $W \\approx \\frac{1}{\\pi}$； - 中心量子干涉条纹：位于 $x \\approx 0$ 区域，沿 $p$ 轴呈高速余弦振荡，条纹空间周期 $\\Delta p = \\frac{\\pi}{\\sqrt{2}\\alpha} \\approx 0.888$； - 负值深谷（Non-classical Negativity）：在 $(x, p) = (0, \\pm \\frac{\\pi}{2\\sqrt{2}\\alpha}) \\approx (0, \\pm 0.444)$ 等奇数半周期处，余弦项为 $-1$，导致 $W < 0$，出现深紫色/藏蓝色的量子负值槽。 Visual Inspection Criteria: - **视觉辨识要点**： 1. 采用严格的科学发色映射（Color map）：正峰值区为暖红/明黄色，零平面为淡灰/浅白色，负值干涉深谷为冷深蓝色； 2. 视觉中央必须呈现清晰交替的 5 根以上横向平行干涉条纹（中央亮纹，上下紧邻深暗负值暗纹）； 3. 左右两侧对称分布两个孤立的宏观相干态类高斯山峰，整体图形具备严格的二重轴对称性（$W(-x, -p) = W(x, p)$ 与 $W(x, -p) = W(x, p)$）。 - **数学公差**：负值干涉条纹周期 $\\Delta p$ 像素测量误差 $\\le 3\\%$；峰峰位置与原点对称度误差 $\\le 1\\,\\text{px}$。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Vlastakis, B., et al. (2013). \"Deterministically encoding quantum information using 100-photon Schrödinger cat states.\" *Science*, 342(6158), 607–610. DOI: [10.1126/science.1243289](https://doi.org/",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "薛定谔猫态玻色纠错码相空间维格纳函数拓扑干涉条纹",
    groundTruth: "- **态矢量与维格纳函数解析表达式**： 对于偶猫态 $|\\psi_+\\rangle = \\mathcal{N}_+ (|\\alpha\\rangle + |-\\alpha\\rangle)$，其中 $\\alpha = 2.5$（平均光子数 $\\bar{n} \\approx 6.25$）： $$W(x, p) = \\frac{2}{\\pi(1 + e^{-2|\\alpha|^2})} e^{-(x^2 + p^2)} \\left[ \\cosh(2\\sqrt{2}\\alpha x) + \\cos(2\\sqrt{2}\\alpha p) \\right]$$ （取无量纲正交坐标 $x = \\text{Re}(\\beta)\\sqrt{2}, p = \\text{Im}(\\beta)\\sqrt{2}$）。 - **特征拓扑结构**： - 两个经典相干态高斯极大值：位于 $(x, p) = (\\pm \\s",
    evaluationCriteria: "- **视觉辨识要点**： 1. 采用严格的科学发色映射（Color map）：正峰值区为暖红/明黄色，零平面为淡灰/浅白色，负值干涉深谷为冷深蓝色； 2. 视觉中央必须呈现清晰交替的 5 根以上横向平行干涉条纹（中央亮纹，上下紧邻深暗负值暗纹）； 3. 左右两侧对称分布两个孤立的宏观相干态类高斯山峰，整体图形具备严格的二重轴对称性（$W(-x, -p) = W(x, p)$ 与 $W(x, -p) = W(x, p)$）。 - **数学公差**：负值干涉条纹周期 $\\Delta p$ 像素测量误差 $\\le 3\\%$；峰峰位置与原点对称度误差 $\\le 1\\,\\text{px}$。",
    referenceSource: "- Vlastakis, B., et al. (2013). \"Deterministically encoding quantum information using 100-photon Schrödinger cat states.\" *Science*, 342(6158), 607–610. DOI: [10.1126/science.1243289](https://doi.org/10.1126/science.1243289). - Lescanne, R., et al. (2020). \"Exponential suppression of bit-flips in a ",
  },
};

/**
 * FE-QUANTUM-07: 离子阱声子相空间闭合轨迹与双比特 Mølmer–Sørensen 纠缠门
 */
export const FE_QUANTUM_07_PROMPT: PromptSpec = {
  id: "FE-QUANTUM-07",
  label: "离子阱声子相空间闭合轨迹与双比特 Mølmer–Sørensen 纠缠门 (Trapped Ion Phonon Phase-Space Trajectory & Mølmer–Sørensen Geometric Gate)",
  template: "Generate an SVG technical visualization of Trapped Ion Phonon Phase-Space Trajectory & Mølmer–Sørensen Geometric Gate as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background:  Physical & Mathematical Ground Truth: - **相互作用哈密顿量与位移算符**： 在 Lamb-Dicke 极限下，激光对称失谐 $\\delta = \\omega_L - \\omega_{phonon}$： $$\\hat{H}_{MS}(t) = \\hbar \\eta \\Omega \\hat{J}_x \\left( \\hat{a} e^{-i\\delta t} + \\hat{a}^\\dagger e^{i\\delta t} \\right)$$ 其中 $\\hat{J}_x = \\frac{1}{2}(\\sigma_x^{(1)} + \\sigma_x^{(2)})$。 - **相空间动量-坐标演化方程**： 对于自旋本征态 $M_x = \\pm 1$： $$\\alpha_{\\pm}(t) = \\mp \\frac{\\eta \\Omega}{\\delta} (1 - e^{i\\delta t})$$ 轨迹半径 $R_0 = \\frac{\\eta\\Omega}{\\delta}$； - **门操作闭合条件与几何相位**： - 门时间 $\\tau_g = \\frac{2\\pi}{\\delta} = 50\\,\\mu\\text{s}$（此时 $e^{i\\delta \\tau_g} = 1$，$\\alpha_\\pm(\\tau_g) = 0$ 闭合复原）； - 围道积分几何面积：$\\Phi = 2 \\times \\text{Area} = 2 \\times \\pi R_0^2 = 2\\pi \\left(\\frac{\\eta\\Omega}{\\delta}\\right)^2$； - 设定 $\\eta\\Omega/\\delta = 1/\\sqrt{8}$，恰好积累几何纠缠相位 $\\Phi = \\pi/4$，演化出最大纠缠态 $|\\psi\\rangle = \\frac{1}{\\sqrt{2}}(|00\\rangle - i|11\\rangle)$。 Visual Inspection Criteria: - **视觉辨识要点**： 1. 画布分为左右两联：左侧为声子动量-位置相空间 $(x_m, p_m)$，右侧为离子布居数与纠缠保真度实时仪表； 2. 动画运行中，两个发光质点（青绿与金黄）分别从相空间原点出发，沿圆周对称反向展开为上下两个闭合大圆弧； 3. 运行到达 $t = \\tau_g$ 周期时刻，两质点精确回到原点重合（完全消除声子残余自旋-运动纠缠），内部闭合区域被半透明金色几何相位网格覆盖，保真度指针瞬间锁定 100%。 - **轨迹闭合残余公差**：终点与原点几何重合误差距离 $\\Delta r \\le 0.5\\,\\text{px}$。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Sørensen, A., & Mølmer, K. (1999). \"Quantum computation with ions in thermal motion.\" *Physical Review Letters*, 82(9), 1971–1974. DOI: [10.1103/PhysRevLett.82.1971](https://doi.org/10.1103/PhysRevL",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "离子阱声子相空间闭合轨迹与双比特 Mølmer–Sørensen 纠缠门",
    groundTruth: "- **相互作用哈密顿量与位移算符**： 在 Lamb-Dicke 极限下，激光对称失谐 $\\delta = \\omega_L - \\omega_{phonon}$： $$\\hat{H}_{MS}(t) = \\hbar \\eta \\Omega \\hat{J}_x \\left( \\hat{a} e^{-i\\delta t} + \\hat{a}^\\dagger e^{i\\delta t} \\right)$$ 其中 $\\hat{J}_x = \\frac{1}{2}(\\sigma_x^{(1)} + \\sigma_x^{(2)})$。 - **相空间动量-坐标演化方程**： 对于自旋本征态 $M_x = \\pm 1$： $$\\alpha_{\\pm}(t) = \\mp \\frac{\\eta \\Omega}{\\delta} (1 - e^{i\\delta t})$$ 轨迹半径 $R_0 = \\frac",
    evaluationCriteria: "- **视觉辨识要点**： 1. 画布分为左右两联：左侧为声子动量-位置相空间 $(x_m, p_m)$，右侧为离子布居数与纠缠保真度实时仪表； 2. 动画运行中，两个发光质点（青绿与金黄）分别从相空间原点出发，沿圆周对称反向展开为上下两个闭合大圆弧； 3. 运行到达 $t = \\tau_g$ 周期时刻，两质点精确回到原点重合（完全消除声子残余自旋-运动纠缠），内部闭合区域被半透明金色几何相位网格覆盖，保真度指针瞬间锁定 100%。 - **轨迹闭合残余公差**：终点与原点几何重合误差距离 $\\Delta r \\le 0.5\\,\\text{px}$。",
    referenceSource: "- Sørensen, A., & Mølmer, K. (1999). \"Quantum computation with ions in thermal motion.\" *Physical Review Letters*, 82(9), 1971–1974. DOI: [10.1103/PhysRevLett.82.1971](https://doi.org/10.1103/PhysRevLett.82.1971). - Sørensen, A., & Mølmer, K. (2000). \"Entanglement and quantum computation with ions i",
  },
};

/**
 * FE-QUANTUM-08: 费米-哈伯德强关联反铁磁自旋序与自旋-电荷分离微观图谱
 */
export const FE_QUANTUM_08_PROMPT: PromptSpec = {
  id: "FE-QUANTUM-08",
  label: "费米-哈伯德强关联反铁磁自旋序与自旋-电荷分离微观图谱 (Fermi-Hubbard Antiferromagnetic Néel Order & Spin-Charge Separation Microscopic Lattice)",
  template: "Generate an SVG technical visualization of Fermi-Hubbard Antiferromagnetic Néel Order & Spin-Charge Separation Microscopic Lattice as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background:  Physical & Mathematical Ground Truth: - **哈密顿量定义**： $$\\hat{H} = -t \\sum_{\\langle i,j \\rangle, \\sigma} (\\hat{c}_{i\\sigma}^\\dagger \\hat{c}_{j\\sigma} + \\text{h.c.}) + U \\sum_i \\hat{n}_{i\\uparrow}\\hat{n}_{i\\downarrow} - \\mu \\sum_i \\hat{n}_i$$ - **参数标准**： - 相互作用 $U/t = 8.0$，有效交换作用 $J/t = 0.5$；温度 $T/t = 0.25$（低于反铁磁相变温度）； - $8 \\times 8$ 二维正方光晶格（共 64 个格点）。 - **未掺杂区反铁磁自旋关联**： - 交错交错磁化率与自旋关联函数：$C(d) = (-1)^{\\Delta x + \\Delta y} \\langle \\hat{S}_i^z \\hat{S}_{i+d}^z \\rangle > 0$； - 晶格呈现棋盘状相间的蓝色上自旋箭头（$\\uparrow$）与红色下自旋箭头（$\\downarrow$）。 - **掺杂区自旋-电荷分离组态**： - 晶格中心注入一个移动空穴（格点无自旋，标记为白色空心圆圈 Holon）； - 空穴在正方晶格跳跃留下一条自旋错配的张力弦（String of flipped spins），其末端束缚着一个孤立的净磁矩自旋畸变点（Spinon）。 Visual Inspection Criteria: - **视觉辨识要点**： 1. 背景为规则的灰色正交网格，格点上清晰渲染量子自旋矢量（蓝色箭头向上，红色箭头向下）； 2. 背景区域呈现绝对规则的反铁磁棋盘纹理（相邻格点自旋绝对反向）； 3. 掺杂扰动区清晰标识出空穴点（空心圆环）、自旋扰动弦（虚线相连）与脱离的自旋子端点，视觉层面对比分明。 - **几何与自旋配置公差**：64 个格点的正交栅格拓扑关系 $100\\%$ 正确，未掺杂区交错自旋反平行度校验 $100\\%$。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Mazurenko, A., et al. (2017). \"A cold-atom Fermi–Hubbard antiferromagnet.\" *Nature*, 545(7655), 462–466. DOI: [10.1038/nature22362](https://doi.org/10.1038/nature22362). - Hilker, T. A., et al. (201",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "费米-哈伯德强关联反铁磁自旋序与自旋-电荷分离微观图谱",
    groundTruth: "- **哈密顿量定义**： $$\\hat{H} = -t \\sum_{\\langle i,j \\rangle, \\sigma} (\\hat{c}_{i\\sigma}^\\dagger \\hat{c}_{j\\sigma} + \\text{h.c.}) + U \\sum_i \\hat{n}_{i\\uparrow}\\hat{n}_{i\\downarrow} - \\mu \\sum_i \\hat{n}_i$$ - **参数标准**： - 相互作用 $U/t = 8.0$，有效交换作用 $J/t = 0.5$；温度 $T/t = 0.25$（低于反铁磁相变温度）； - $8 \\times 8$ 二维正方光晶格（共 64 个格点）。 - **未掺杂区反铁磁自旋关联**： - 交错交错磁化率与自旋关联函数：$C(d) = (-1)^{\\Delta x + \\Delta y} \\langle \\hat{S}_",
    evaluationCriteria: "- **视觉辨识要点**： 1. 背景为规则的灰色正交网格，格点上清晰渲染量子自旋矢量（蓝色箭头向上，红色箭头向下）； 2. 背景区域呈现绝对规则的反铁磁棋盘纹理（相邻格点自旋绝对反向）； 3. 掺杂扰动区清晰标识出空穴点（空心圆环）、自旋扰动弦（虚线相连）与脱离的自旋子端点，视觉层面对比分明。 - **几何与自旋配置公差**：64 个格点的正交栅格拓扑关系 $100\\%$ 正确，未掺杂区交错自旋反平行度校验 $100\\%$。",
    referenceSource: "- Mazurenko, A., et al. (2017). \"A cold-atom Fermi–Hubbard antiferromagnet.\" *Nature*, 545(7655), 462–466. DOI: [10.1038/nature22362](https://doi.org/10.1038/nature22362). - Hilker, T. A., et al. (2017). \"Revealing hidden antiferromagnetic correlations in doped Hubbard chains via string correlators.",
  },
};

/**
 * FE-QUANTUM-09: 马约拉纳零能模 T-型结编织网络与非阿贝尔贝里几何相位
 */
export const FE_QUANTUM_09_PROMPT: PromptSpec = {
  id: "FE-QUANTUM-09",
  label: "马约拉纳零能模 T-型结编织网络与非阿贝尔贝里几何相位 (Majorana Zero Modes T-Junction Network & Non-Abelian Braiding Dynamics)",
  template: "Generate an SVG technical visualization of Majorana Zero Modes T-Junction Network & Non-Abelian Braiding Dynamics as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background:  Physical & Mathematical Ground Truth: - **拓扑哈密顿量与代数关系**： 马约拉纳算符满足自共轭性与反对易代数：$\\gamma_i = \\gamma_i^\\dagger$，$\\{\\gamma_i, \\gamma_j\\} = 2\\delta_{ij}$。 复费米子基矢：$\\hat{c}^\\dagger = \\frac{1}{2}(\\gamma_1 - i\\gamma_2)$。 - **T-型结三步交换时序**： T-结包含水平左支路（L）、水平右支路（R）及垂直下支路（B）。 - **初始状态**：$\\gamma_1$ 位于 L 端，$\\gamma_2$ 位于 R 端； - **第一阶段（移入支路）**：调节底部垂直电极栅压，使 $\\gamma_1$ 沿结区滑移并驻留于垂直支路 B 底部； - **第二阶段（水平贯通）**：调节水平电极栅压，使 $\\gamma_2$ 由 R 端平滑穿越中心十字区滑向 L 端； - **第三阶段（复位归位）**：将暂存在 B 底部的 $\\gamma_1$ 抽拔并引导至 R 端。 - **编织变换结果**： $$\\begin{pmatrix} \\gamma_1 \\\\ \\gamma_2 \\end{pmatrix} \\xrightarrow{\\text{Braiding}} \\begin{pmatrix} 0 & 1 \\\\ -1 & 0 \\end{pmatrix} \\begin{pmatrix} \\gamma_1 \\\\ \\gamma_2 \\end{pmatrix} = \\begin{pmatrix} \\gamma_2 \\\\ -\\gamma_1 \\end{pmatrix}$$ 产生了严格的拓扑负号（Berry 几何相位相差 $\\pi$）。 Visual Inspection Criteria: - **视觉辨识要点**： 1. 主体呈现为清晰的 T-型超导纳米线管道（双线中空管体），各段上标有局域门电压状态指示灯（绿色导通，灰色阻断）； 2. 两个 MZM 表现为发光的拓扑边缘态波包（红色光团 $\\gamma_1$，黄色光团 $\\gamma_2$）； 3. 动画循环演示完整的三步编织过程，伴随底部空间时间-空间拓扑编织世界线（World lines）的同步拉伸； 4. 最终状态在标签上清晰显示波函数符号变化：$\\gamma_1 \\to \\gamma_2, \\gamma_2 \\to -\\gamma_1$。 - **运动轨迹规范**：使用 `<animateMotion>` 限制在 T-型纳米线中轴骨架上，无跳变或出轨。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Alicea, J., et al. (2011). \"Non-Abelian statistics and topological quantum information processing in 1D wire networks.\" *Nature Physics*, 7(5), 412–417. DOI: [10.1038/nphys1915](https://doi.org/10.1",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "马约拉纳零能模 T-型结编织网络与非阿贝尔贝里几何相位",
    groundTruth: "- **拓扑哈密顿量与代数关系**： 马约拉纳算符满足自共轭性与反对易代数：$\\gamma_i = \\gamma_i^\\dagger$，$\\{\\gamma_i, \\gamma_j\\} = 2\\delta_{ij}$。 复费米子基矢：$\\hat{c}^\\dagger = \\frac{1}{2}(\\gamma_1 - i\\gamma_2)$。 - **T-型结三步交换时序**： T-结包含水平左支路（L）、水平右支路（R）及垂直下支路（B）。 - **初始状态**：$\\gamma_1$ 位于 L 端，$\\gamma_2$ 位于 R 端； - **第一阶段（移入支路）**：调节底部垂直电极栅压，使 $\\gamma_1$ 沿结区滑移并驻留于垂直支路 B 底部； - **第二阶段（水平贯通）**：调节水平电极栅压，使 $\\gamma_2$ 由 R 端平滑穿越中心十字区滑向 L 端； - **第三阶段",
    evaluationCriteria: "- **视觉辨识要点**： 1. 主体呈现为清晰的 T-型超导纳米线管道（双线中空管体），各段上标有局域门电压状态指示灯（绿色导通，灰色阻断）； 2. 两个 MZM 表现为发光的拓扑边缘态波包（红色光团 $\\gamma_1$，黄色光团 $\\gamma_2$）； 3. 动画循环演示完整的三步编织过程，伴随底部空间时间-空间拓扑编织世界线（World lines）的同步拉伸； 4. 最终状态在标签上清晰显示波函数符号变化：$\\gamma_1 \\to \\gamma_2, \\gamma_2 \\to -\\gamma_1$。 - **运动轨迹规范**：使用 `<animateMotion>` 限制在 T-型纳米线中轴骨架上，无跳变或出轨。",
    referenceSource: "- Alicea, J., et al. (2011). \"Non-Abelian statistics and topological quantum information processing in 1D wire networks.\" *Nature Physics*, 7(5), 412–417. DOI: [10.1038/nphys1915](https://doi.org/10.1038/nphys1915). - Aasen, D., et al. (2016). \"Milestones toward Majorana-based quantum computing.\" *P",
  },
};

/**
 * FE-QUANTUM-10: 后量子格密码 LWE 离散高斯误差流形与 Babai 最近平面几何剖分
 */
export const FE_QUANTUM_10_PROMPT: PromptSpec = {
  id: "FE-QUANTUM-10",
  label: "后量子格密码 LWE 离散高斯误差流形与 Babai 最近平面几何剖分 (Post-Quantum LWE Discrete Gaussian Error Manifold & Babai Nearest-Plane Voronoi Partition)",
  template: "Generate an SVG technical visualization of Post-Quantum LWE Discrete Gaussian Error Manifold & Babai Nearest-Plane Voronoi Partition as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background:  Physical & Mathematical Ground Truth: - **二维 $q$-元模格构造**： 取素数模数 $q = 17$，公共向量 $\\mathbf{a} = (3, 7)^T$。 模格 $\\Lambda_q(\\mathbf{a}) = \\{ \\mathbf{x} \\in \\mathbb{Z}^2 : x_1 a_1 + x_2 a_2 \\equiv 0 \\pmod q \\}$。 - **坏基与好基对比**： - 倾斜坏基：$\\mathbf{B}_{bad} = [\\mathbf{b}_1, \\mathbf{b}_2] = \\begin{pmatrix} 1 & 14 \\\\ 0 & 17 \\end{pmatrix}$，向量模长大、夹角接近 $0^\\circ$； - LLL 规约好基：$\\mathbf{B}_{LLL} = [\\mathbf{v}_1, \\mathbf{v}_2] = \\begin{pmatrix} 3 & -2 \\\\ 2 & 5 \\end{pmatrix}$，正交性近 $90^\\circ$。 - **几何剖分曲面定义**： - 围绕格点原点 $\\mathbf{0}$，绘制正六边形 Voronoi 胞腔 $\\mathcal{V}(\\mathbf{0}) = \\{ \\mathbf{x} \\in \\mathbb{R}^2 : \\|\\mathbf{x}\\| \\le \\|\\mathbf{x} - \\mathbf{v}\\|, \\forall \\mathbf{v} \\in \\Lambda \\}$； - 叠加绘制坏基所张成的倾斜狭长基本域多面体 $\\mathcal{P}_{1/2}(\\mathbf{B}_{bad})$ 与好基的紧凑基本域 $\\mathcal{P}_{1/2}(\\mathbf{B}_{LLL})$； - **离散高斯噪声分布**： 围绕各个格点渲染参数为 $\\sigma = 1.2$ 的离散高斯概率云热力图：$\\rho_\\sigma(\\mathbf{x}) = \\exp(-\\pi \\|\\mathbf{x}\\|^2 / \\sigma^2)$，清晰标明目标密文点 $\\mathbf{t} = \\mathbf{A}\\mathbf{s} + \\mathbf{e}$ 与解码界限。 Visual Inspection Criteria: - **视觉辨识要点**： 1. 格点阵列以深色同心圆精确定位在整数坐标上； 2. 必须同图呈现两种截然不同的格基向量箭头：红色粗箭头代表倾斜坏基，青绿色粗箭头代表 LLL 正交规约好基； 3. 胞腔几何以半透明几何着色清晰呈现：淡黄色狭长带代表坏基基本域，淡蓝色正多边形代表真实 Voronoi 胞腔； 4. 目标扰动点 $\\mathbf{t}$ 位于 Voronoi 胞腔内、但落在坏基平行六面体外部，直观揭示为什么只有规约基才能完成抗量子纠错与密码恢复。 - **坐标投影公差**：格点相对间距线性度误差 $\\le 0.1\\%$，Voronoi 胞腔垂直平分线对齐误差 $\\le 1\\,\\text{px}$。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Regev, O. (2009). \"On lattices, learning with errors, random linear codes, and cryptography.\" *Journal of the ACM*, 56(6), 1–40. DOI: [10.1145/1568318.1568324](https://doi.org/10.1145/1568318.156832",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "后量子格密码 LWE 离散高斯误差流形与 Babai 最近平面几何剖分",
    groundTruth: "- **二维 $q$-元模格构造**： 取素数模数 $q = 17$，公共向量 $\\mathbf{a} = (3, 7)^T$。 模格 $\\Lambda_q(\\mathbf{a}) = \\{ \\mathbf{x} \\in \\mathbb{Z}^2 : x_1 a_1 + x_2 a_2 \\equiv 0 \\pmod q \\}$。 - **坏基与好基对比**： - 倾斜坏基：$\\mathbf{B}_{bad} = [\\mathbf{b}_1, \\mathbf{b}_2] = \\begin{pmatrix} 1 & 14 \\\\ 0 & 17 \\end{pmatrix}$，向量模长大、夹角接近 $0^\\circ$； - LLL 规约好基：$\\mathbf{B}_{LLL} = [\\mathbf{v}_1, \\mathbf{v}_2] = \\begin{pmatrix} 3 & -2 \\\\ 2 &",
    evaluationCriteria: "- **视觉辨识要点**： 1. 格点阵列以深色同心圆精确定位在整数坐标上； 2. 必须同图呈现两种截然不同的格基向量箭头：红色粗箭头代表倾斜坏基，青绿色粗箭头代表 LLL 正交规约好基； 3. 胞腔几何以半透明几何着色清晰呈现：淡黄色狭长带代表坏基基本域，淡蓝色正多边形代表真实 Voronoi 胞腔； 4. 目标扰动点 $\\mathbf{t}$ 位于 Voronoi 胞腔内、但落在坏基平行六面体外部，直观揭示为什么只有规约基才能完成抗量子纠错与密码恢复。 - **坐标投影公差**：格点相对间距线性度误差 $\\le 0.1\\%$，Voronoi 胞腔垂直平分线对齐误差 $\\le 1\\,\\text{px}$。",
    referenceSource: "- Regev, O. (2009). \"On lattices, learning with errors, random linear codes, and cryptography.\" *Journal of the ACM*, 56(6), 1–40. DOI: [10.1145/1568318.1568324](https://doi.org/10.1145/1568318.1568324). - Babai, L. (1986). \"On Lovász' lattice reduction and the nearest lattice point problem.\" *Combi",
  },
};

export const FE_QUANTUM_PROMPTS: readonly PromptSpec[] = [
  FE_QUANTUM_01_PROMPT,
  FE_QUANTUM_02_PROMPT,
  FE_QUANTUM_03_PROMPT,
  FE_QUANTUM_04_PROMPT,
  FE_QUANTUM_05_PROMPT,
  FE_QUANTUM_06_PROMPT,
  FE_QUANTUM_07_PROMPT,
  FE_QUANTUM_08_PROMPT,
  FE_QUANTUM_09_PROMPT,
  FE_QUANTUM_10_PROMPT,
];


/**
 * FE-3: 容错量子信息、模拟与后量子系统工程 领域分组套题（UX 交互对齐四大名著，含 10 个候选场景）
 */
export const FE_QUANTUM_SUITE_PROMPT: PromptSpec = {
  id: "fe-quantum-v1",
  label: "FE-3: 容错量子信息与后量子系统（十题组）",
  template: "FE-3: 容错量子信息、模拟与后量子系统工程 前沿工程十题组，每个轮换周期洗牌抽一题，或在下拉菜单中直接指定场景。",
  variables: [],
    candidates: [
    {
      id: FE_QUANTUM_01_PROMPT.id,
      label: "旋转表面码综合征提取与最小权完美匹配解码图",
      text: FE_QUANTUM_01_PROMPT.template,
      standard: FE_QUANTUM_01_PROMPT.standard,
    },
    {
      id: FE_QUANTUM_02_PROMPT.id,
      label: "超百中性原子光镊阵列空间重构与匈牙利无碰撞路径",
      text: FE_QUANTUM_02_PROMPT.template,
      standard: FE_QUANTUM_02_PROMPT.standard,
    },
    {
      id: FE_QUANTUM_03_PROMPT.id,
      label: "里德堡阻塞哈密顿量与反铁磁 ℤ₂ 晶格量子相变动力学",
      text: FE_QUANTUM_03_PROMPT.template,
      standard: FE_QUANTUM_03_PROMPT.standard,
    },
    {
      id: FE_QUANTUM_04_PROMPT.id,
      label: "超导 Transmon 约瑟夫森余弦势阱束缚态波函数与非谐宇称图谱",
      text: FE_QUANTUM_04_PROMPT.template,
      standard: FE_QUANTUM_04_PROMPT.standard,
    },
    {
      id: FE_QUANTUM_05_PROMPT.id,
      label: "微波腔 QED 色散读出与 IQ 相空间指针动力学轨迹",
      text: FE_QUANTUM_05_PROMPT.template,
      standard: FE_QUANTUM_05_PROMPT.standard,
    },
    {
      id: FE_QUANTUM_06_PROMPT.id,
      label: "薛定谔猫态玻色纠错码相空间维格纳函数拓扑干涉条纹",
      text: FE_QUANTUM_06_PROMPT.template,
      standard: FE_QUANTUM_06_PROMPT.standard,
    },
    {
      id: FE_QUANTUM_07_PROMPT.id,
      label: "离子阱声子相空间闭合轨迹与双比特 Mølmer–Sørensen 纠缠门",
      text: FE_QUANTUM_07_PROMPT.template,
      standard: FE_QUANTUM_07_PROMPT.standard,
    },
    {
      id: FE_QUANTUM_08_PROMPT.id,
      label: "费米-哈伯德强关联反铁磁自旋序与自旋-电荷分离微观图谱",
      text: FE_QUANTUM_08_PROMPT.template,
      standard: FE_QUANTUM_08_PROMPT.standard,
    },
    {
      id: FE_QUANTUM_09_PROMPT.id,
      label: "马约拉纳零能模 T-型结编织网络与非阿贝尔贝里几何相位",
      text: FE_QUANTUM_09_PROMPT.template,
      standard: FE_QUANTUM_09_PROMPT.standard,
    },
    {
      id: FE_QUANTUM_10_PROMPT.id,
      label: "后量子格密码 LWE 离散高斯误差流形与 Babai 最近平面几何剖分",
      text: FE_QUANTUM_10_PROMPT.template,
      standard: FE_QUANTUM_10_PROMPT.standard,
    },
  ],
  source: null,
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "容错量子纠错表面码、中性原子光镊阵列与超导非谐振能级跃迁",
    groundTruth: "以旋转晶格表面码（Surface Code）拓扑缺陷编织、超百个中性原子光镊相干跃迁拉比振荡、Transmon 约瑟夫森能级色散读出与格密码 LWE 空间为基准，满足量子力学哈密顿量与波函数演化。",
    evaluationCriteria: "1. 拓扑与态矢量：纠错稳定子测量几何与量子态概率幅准确；2. 动力学演化：能级跃迁与相干振荡周期自洽；3. 语法规范：XML 严格合法，无交互 JS。",
    referenceSource: "https://journals.aps.org/prl",
  },
};

export const FE_QUANTUM_INDIVIDUAL_PROMPTS = FE_QUANTUM_PROMPTS;
