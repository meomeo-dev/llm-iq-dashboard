# 【VFX-5: 物理驱动运动控制、具身动力学与生物解剖 CFX】基准评测体系规范报告

**报告类型**：2026 次世代计算机动画、生物力学与物理角色仿真（Physics-Based Character & Creature Dynamics）基准评测集  
**受控题号**：VFX-MOTION-01 至 VFX-MOTION-10  
**版权与合规声明**：MIT 开源净室合规（Clean-room IP Compliance）。全套试题基于公开发表之经典与前沿顶会顶刊（ACM TOG/SIGGRAPH 2024–2026, ACM SCA, Journal of Biomechanics, IEEE T-RO）中的真实物理本构、微分方程体系与无量纲流形完成纯净原创设计，不包含任何商业独占素材或私有题库。所有题目均严格遵循纯直观矢量 SVG（静态微观剖面或内联 CSS/SMIL 连续动力学动画）表现形式，绝无交互式代码，支持肉眼比对与机器全自动视觉特征对齐。

---

## 目录
1. 32 轮连续深度检索关键词与检索路径全景台账
2. VFX-5 领域的攻坚范围与理论全景架构
3. 精选 10 道基准评测题目的完整工程规范（VFX-MOTION-01 ~ VFX-MOTION-10）
4. 机器自动量化与视觉判定执行细则
5. 开源净室合规（Clean-room IP Compliance）核查书

---

## 第一部分：32 轮连续深度学术检索台账

在本次调研与基准规范设计过程中，执行了 32 轮连续深度 Web 检索，精准穿透经典生物力学模型至 2024–2026 年 SIGGRAPH/IEEE 顶级成果，其检索路径及关键抓取点如下：

1. **Round 1**: `"Spring-Loaded Inverted Pendulum" SLIP running limit cycle apex return map "SIGGRAPH" OR "Journal of Biomechanics"` — 检索 SLIP 奔跑极限环、Poincaré 映射截面与质心垂直振荡。
2. **Round 2**: `"Spring-Loaded Inverted Pendulum" equations stance phase polar coordinates "m*r_ddot" touch-down angle` — 提取 SLIP 触地角 $\theta_{td}$ 与支撑相极坐标非线性微分方程 $m\ddot{r} = mr\dot{\theta}^2 + k(\ell_0 - r) - mg\cos\theta$。
3. **Round 3**: `"Hill-type muscle model" "CE" "SEE" "PEE" "Zajac" "force-length" "force-velocity" equation` — 检索希尔型三元素肌肉模型（CE/SEE/PEE）基础力-长-速方程与 Zajac (1989) 动力学架构。
4. **Round 4**: `"Millard" "2013" "muscle" "tendon" "f_l" "f_v" "f_pe" "pennation angle" "SIGGRAPH" OR "Journal of Biomechanical Engineering"` — 锁定 Millard et al. (2013) 肌肉-腱复合体平滑能量方程与羽状角几何关系。
5. **Round 5**: `"Neo-Hookean" muscle bulging simulation "SIGGRAPH" OR "ACM TOG" FEM fascia` — 调研图形学中有限元肌肉膨胀（Bulging）与超弹性组织仿真历程。
6. **Round 6**: `"Stable Neo-Hookean Flesh Simulation" "Smith" "energy" "\mu" "\lambda" "J - "` — 提取 Smith, De Goes & Kim (SIGGRAPH 2018) 稳定新胡克应变能密度公式 $\Psi_{\text{SNH}} = \frac{\mu}{2}(I_1-3) - \mu(J-1) + \frac{\lambda+\mu}{2}(J-1)^2$。
7. **Round 7**: `"feather" simulation "SIGGRAPH" OR "ACM TOG" OR "feather dynamics" "barbules"` — 探索禽类羽毛羽轴、羽枝（Barbs）与羽小枝（Barbules）在图形学中的模拟方法。
8. **Round 8**: `"Modelling a Feather as a Strongly Anisotropic Elastic Shell" SIGGRAPH 2024` — 锁定 Jouve et al. (SIGGRAPH 2024) 飞羽三参数强各向异性壳体理论，刚度比达 $10^4:1$。
9. **Round 9**: `"quadruped" "gait transition" "Froude number" "walk" "trot" "gallop" "Alexander" "duty factor"` — 调研四足哺乳动物 Froude 数 $Fr = v^2/(gL)$、占空比 $\beta$ 与步态相变动力相似性。
10. **Round 10**: `"Hildebrand" "gait" "duty factor" "phase lag" "walk" "trot" "gallop" diagram` — 抓取 Hildebrand (1965/1976) 对称与非对称步态分类图谱及相位滞后（Phase Lag）参数。
11. **Round 11**: `"Discrete Elastic Rods" "Bergou" "bending energy" "twisting energy" "Bishop frame" "material frame"` — 检索 Bergou et al. (SIGGRAPH 2008) 离散弹性棒（DER）的 Bishop 框架、材料框架与弯转能量分离。
12. **Round 12**: `"Discrete Elastic Rods" "plectoneme" OR "superhelical" "writhing" "twist" "Călugăreanu" OR "White-Fuller"` — 提取扭转失稳形成的超螺旋回环（Plectoneme）与 Călugăreanu-White-Fuller 拓扑守恒定理 $Lk = Tw + Wr$。
13. **Round 13**: `"Vicsek" "polarization order parameter" "phase transition" "flocking" "Cavagna" "topological"` — 调研群体动力学中 Vicsek 极化序参量 $\varphi$ 与 Cavagna et al. (PNAS) 无尺度拓扑距离（$k\approx 7$ 近邻）。
14. **Round 14**: `"Capture Point" "Pratt" "instantaneous capture point" "friction cone" "GRF" "divergent component of motion"` — 检索平衡恢复的核心概念：瞬时捕获点（ICP）、发散运动分量（DCM）与地面反作用力。
15. **Round 15**: `"reverse von Kármán" "Strouhal number" fish swimming "Lighthill" carangiform thunniform` — 检索波动游泳流体推进理论、斯特劳哈尔数 $St = fA/U \in [0.2, 0.4]$ 与逆卡门涡街正推力射流。
16. **Round 16**: `"contact wrench cone" "limit surface" "Goyal" "Ruina" "friction" "dexterous manipulation"` — 抓取 Goyal, Ruina, Papadopoulos (1991) 刚体平面接触极限曲面（Limit Surface）原初理论。
17. **Round 17**: `"limit surface" "Howe" "Cutkosky" ellipsoidal approximation "wrench" friction` — 提取 Howe & Cutkosky 椭球极限曲面解析近似方程与滑动临界流形。
18. **Round 18**: `"SIGGRAPH 2024" OR "SIGGRAPH 2025" "muscle" OR "tissue" OR "flesh" simulation "FEM"` — 检索 2024-2025 前沿肌肉解算，如 SideFX Houdini Otis GPU 肌肉解算器与 IMEX 混合有限元技术。
19. **Round 19**: `"SIGGRAPH 2024" OR "SIGGRAPH 2025" "hair" "Discrete Elastic Rods" OR "strands" simulation` — 追踪头发微股模拟前沿：Hair Meshes、Stable Cosserat Rods 与物理引导插值。
20. **Round 20**: `"Stable Cosserat Rods" "SIGGRAPH" 2025` — 抓取 Jerry Hsu, Tongtong Wang, Kui Wu, Cem Yuksel (SIGGRAPH 2025) 稳定 Cosserat 棒算法与准静态方向解算。
21. **Round 21**: `"SIGGRAPH 2024" OR "SIGGRAPH 2025" quadruped locomotion "friction cone" OR "capture point" OR "terrain"` — 检索基于物理引擎的四足越障控制、接触锥硬约束与稳定性度量。
22. **Round 22**: `"fish swimming" simulation "ACM TOG" OR "SIGGRAPH" "vortex" OR "fluid-structure"` — 追踪计算机图形学中的鱼类游动流固耦合（FSI）、DiffAqua 与逆涡街保真模拟。
23. **Round 23**: `"dexterous manipulation" "contact dynamics" "friction" "IEEE T-RO" OR "Transactions on Robotics" "limit surface"` — 抓取 IEEE T-RO 中 Shi, Woodruff & Lynch 软指极限曲面动态手内滑动控制。
24. **Round 24**: `"feather" interlocking "friction" "barbules" "aerodynamics" "Science Robotics" OR "Nature" OR "Bioinspiration"` — 调研羽小枝微观倒钩 Velcro 互锁力学、摩擦阻尼与仿生自修复机翼。
25. **Round 25**: `"Alexander" 1989 "Dynamic similarity" "Froude number" quadruped "trot" "gallop" transition` — 确认 Alexander (1989) 经典脊椎动物步态相变机制及能量/应力边界。
26. **Round 26**: `"Boids" "Reynolds" 1987 "separation" "alignment" "cohesion" vector acceleration equation` — 明确 Reynolds (1987) 群智三原则矢量求和与限制加速度控制方程。
27. **Round 27**: `"Capture Point: A step towards humanoid push recovery" Pratt 2006 equations` — 提取 Pratt et al. (2006) 经典捕获点封闭解析解 $\xi = x + \dot{x}/\omega_0$。
28. **Round 28**: `"Lighthill" 1971 "Large-amplitude elongated-body theory of fish locomotion" "thrust" "efficiency"` — 提取 Lighthill 大振幅波动理论尾鳍附加质量推力公式与动量通量。
29. **Round 29**: `"fascia" sliding simulation "muscle" "Projective Dynamics" OR "PBD" OR "FEM" "SIGGRAPH"` — 调研筋膜网格多层滑移接触机制与 Romeo et al. (2020) XPBD 筋膜接触约束。
30. **Round 30**: `"Vicsek model" "phase transition" "critical noise" "Binder cumulant" "order parameter"` — 提取主动物质在临界噪声 $\eta_c$ 下的一阶不连续相变特征与带状团簇。
31. **Round 31**: `"friction cone" linearized "friction pyramid" contact wrench cone "quadruped" quadratic program` — 提取四足二次规划（QP）中地面反作用力切向四棱锥松弛约束 $|f_x|, |f_y| \le \mu f_n / \sqrt{2}$。
32. **Round 32**: `"Projective Dynamics: Fusing Constraint Projections for Rapid Simulation" Bouaziz 2014 equations` — 提取投影动力学（Projective Dynamics）局部-全局交替求解框架与定常系统预分解结构。

---

## 第二部分：10 道高质量纯直观基准评测题目工程规范

---

### 【VFX-MOTION-01】弹簧加载倒立摆（SLIP）奔跑步态极限环与质心相图
- **题目 ID**：`VFX-MOTION-01`
- **中文名**：弹簧加载倒立摆（SLIP）奔跑步态极限环与质心相图
- **英文名**：Spring-Loaded Inverted Pendulum (SLIP) Running Limit Cycle & Phase Portrait
- **表现形式**：带内联 CSS/SMIL 连续动力学双画幅动画（左屏：质心跑跳弹簧伸缩轨迹；右屏：垂直位置-垂直速度相平面极限环闭合轨道）。
- **2026 前沿技术背景**：
  在具身智能、物理角色动画与四足/双足仿生控制中，SLIP（Blickhan, 1989）是表征陆生奔跑最本质的动力学模板。在无阻尼保守假设下，奔跑步态表现为离散 Apex-to-Apex 映射（Poincaré 截面）上的稳定极限环。现代物理引擎需在腾空（Ballistic flight）与触地支撑（Elastic stance）双相混合动力系统间维持能量守恒与周期轨道闭合。
- **客观黄金基准 Ground Truth**：
  1. **支撑相非线性常微分方程（以着地点为原点的极坐标系 $(r, \theta)$，$\theta$ 为摆杆与地面夹角）**：
     $$m\ddot{r} = m r \dot{\theta}^2 + k(\ell_0 - r) - mg\sin\theta$$
     $$m r^2 \ddot{\theta} + 2m r \dot{r}\dot{\theta} - mg r \cos\theta = 0$$
  2. **腾空相抛物线轨道（笛卡尔坐标系 $(x, z)$）**：
     $$\ddot{x} = 0, \quad \ddot{z} = -g$$
  3. **标准无量纲步态基准参数**：
     - 系统质量 $m = 80\,\text{kg}$，重力加速度 $g = 9.81\,\text{m/s}^2$，腿自然原长 $\ell_0 = 1.0\,\text{m}$。
     - 腿线弹性刚度 $k = 20\,\text{kN/m}$（无量纲刚度 $\tilde{k} = \frac{k\ell_0}{mg} \approx 25.48$）。
     - 触地角 $\theta_{td} = 68.5^\circ$（法向夹角 $\alpha_{td} = 21.5^\circ$）。
     - 顶点速度 $v_{apex} = 4.0\,\text{m/s}$，顶点高度 $z_{apex} = 1.05\,\text{m}$。
     - 极限环周期 $T_{stride} \approx 0.385\,\text{s}$，支撑期最大压缩量 $\Delta r_{\max} \approx 0.162\,\text{m}$。
  4. **相平面闭合条件**：
     在 $(z - \ell_0, \dot{z})$ 垂直相平面上，轨道必须呈现光滑、左右反对称、严格自闭合之椭圆变形环。机械能守恒偏差 $\frac{|E(t) - E_0|}{E_0} < 0.5\%$。
- **机器与视觉客观比对判据**：
  - **视觉肉眼判据**：左侧小球在地面跳跃时，触地时刻弹簧压缩并变色高亮（由松弛蓝过渡至压缩红），弹簧反弹推离地面时速度矢量方向平滑翻转；右侧相平面上的白光追踪点严格沿着深青色闭合极限环运转，无发散螺旋线或内缩衰减，两相交接点无折角间断。
  - **机器自动化比对判据**：
    - 提取 SVG `<path>` 轨迹点，计算相平面闭合残差：$\|\mathbf{x}(T) - \mathbf{x}(0)\| / \ell_0 < 0.008$（公差 $< 0.8\%$）。
    - 垂直振荡峰谷比：$z_{\max} / z_{\min} \in [1.24, 1.28]$。
    - 腾空与支撑时间占比（Duty Factor $\beta = T_{stance}/T_{stride}$）：$\beta = 0.39 \pm 0.02$。
- **权威学术出处**：
  - Blickhan, R. (1989). *The spring-mass model for running and hopping*. **Journal of Biomechanics**, 22(11-12), 1217-1227. DOI: 10.1016/0021-9290(89)90224-8.
  - Geyer, H., Seyfarth, A., & Blickhan, R. (2006). *Compliant leg behaviour explains basic dynamics of walking and running*. **Proceedings of the Royal Society B: Biological Sciences**, 273(1603), 2861-2867.
- **净室设计理念说明**：
  本题从第一性原理推导 SLIP 极坐标拉格朗日方程与守恒体系，规避任何专有物理引擎私有预设，直接以相图几何拓扑闭合作为数学真值。

---

### 【VFX-MOTION-02】希尔型三元素肌肉力学张力-长度-速度三维流形
- **题目 ID**：`VFX-MOTION-02`
- **中文名**：希尔型三元素肌肉力学张力-长度-速度三维流形
- **英文名**：Hill-Type Musculotendon Tension-Length-Velocity Manifold
- **表现形式**：静态高精度解剖力学拓扑剖面与规范曲线群（剖面含收缩元 CE、串联弹性腱 SEE、并联结缔组织 PEE 结构示意，配准标准化力-长-速特征曲面投影）。
- **2026 前沿技术背景**：
  在肌肉骨骼驱动角色（Biomechanically-Driven Digital Humans）中，肌肉力的生成由滑行肌丝理论与腱弹性耦合支配。传统的简单弹簧阻尼无法还原肌肉在离心收缩（Eccentric lengthening）时的受迫强化与向心收缩（Concentric shortening）时的力下陷特性。Millard et al. (2013) 确立的连续可微希尔模型是 OpenSim 与次世代神经解剖模拟的金标准。
- **客观黄金基准 Ground Truth**：
  1. **肌肉-肌腱复合体平衡微分方程**：
     $$F_{MT} = F_T = F_M \cos\alpha$$
     $$F_M = F_{CE} + F_{PEE} = \left[ a(t) \cdot f_L(\tilde{l}_{CE}) \cdot f_V(\tilde{v}_{CE}) + f_{PE}(\tilde{l}_{CE}) \right] F_0^M$$
     其中 $\tilde{l}_{CE} = l_{CE}/l_0^M$ 为归一化肌纤维长度，$\tilde{v}_{CE} = v_{CE}/v_{\max}$ 为归一化收缩速度，$a(t) \in [0, 1]$ 为神经激活度，$\alpha$ 为羽状角（Pennation angle）。
  2. **力-长特性 $f_L(\tilde{l}_{CE})$（主动高斯钟形曲线）**：
     $$f_L(\tilde{l}_{CE}) = \exp\left( - \frac{(\tilde{l}_{CE} - 1)^2}{\gamma} \right), \quad \gamma = 0.45$$
  3. **力-速特性 $f_V(\tilde{v}_{CE})$（双曲向心与对数饱和离心）**：
     $$\text{当 } \tilde{v}_{CE} \le 0 \text{ (向心收缩)}: \quad f_V = \frac{1 + \tilde{v}_{CE}}{1 - \tilde{v}_{CE}/k_c}, \quad k_c \approx 0.25$$
     $$\text{当 } \tilde{v}_{CE} > 0 \text{ (离心拉伸)}: \quad f_V = \frac{f_{max} \tilde{v}_{CE} + c_e}{\tilde{v}_{CE} + c_e}, \quad f_{max} = 1.4, \; c_e \approx 0.05$$
  4. **被动并联弹性 $f_{PE}(\tilde{l}_{CE})$（指数硬化）**：
     $$f_{PE}(\tilde{l}_{CE}) = \frac{\exp\left( k_{pe}(\tilde{l}_{CE} - 1)/\epsilon_0^M \right) - 1}{\exp(k_{pe}) - 1} \quad (\tilde{l}_{CE} > 1)$$
- **机器与视觉客观比对判据**：
  - **视觉肉眼判据**：SVG 剖面图须清晰区分 CE、SEE、PEE 的拓扑并串联节点；下方三条投影曲线必须呈现典型生物力学特征：(1) 主动力在 $\tilde{l}_{CE}=1.0$ 处达极值 $1.0$；(2) 离心力平台平滑渐进于 $1.4 F_0^M$，向心力在截断速度 $-1.0 v_{\max}$ 处降为 $0$；(3) 串联肌腱拉伸应变在 $>4\%$ 时呈现明显的线性弹性过渡区。
  - **机器自动化比对判据**：
    - 主动力峰值横坐标位置：$\tilde{l}_{CE}^* = 1.00 \pm 0.01$。
    - 离心渐近线比值：$\lim_{\tilde{v} \to \infty} f_V / f_V(0) = 1.40 \pm 0.03$。
    - 曲线切线连续性：二阶导数连续性检验 $C^1$ 连续，转折点无跳变奇异点。
- **权威学术出处**：
  - Zajac, F. E. (1989). *Muscle and tendon: properties, models, scaling, and application to biomechanics and motor control*. **CRC Critical Reviews in Biomedical Engineering**, 17(4), 359-411.
  - Millard, M., Uchida, T., Seth, A., & Delp, S. L. (2013). *Flexing computational muscle: modeling and simulation of musculotendon dynamics*. **Journal of Biomechanical Engineering**, 135(2), 021005. DOI: 10.1115/1.4023390.
- **净室设计理念说明**：
  完全依据 Hill-Zajac 经典无量纲化公式与 Millard 2013 平滑规范进行数学解析展开，独立生成几何 SVG 坐标流形，不使用任何商业软件导出的截图。

---

### 【VFX-MOTION-03】连续介质表皮-筋膜滑移与二头肌屈曲充血横向膨胀
- **题目 ID**：`VFX-MOTION-03`
- **中文名**：连续介质表皮-筋膜滑移与二头肌屈曲充血横向膨胀
- **英文名**：Tissue-CFX: Fascia-Muscle Sliding & Bicep Bulging FEM
- **表现形式**：带内联 CSS/SMIL 屈伸与横向应变动态膨胀动画（上臂屈肘 $0^\circ \to 90^\circ \to 135^\circ$ 时肌腹剖面网格非线性变形与表层筋膜相对滑移流线）。
- **2026 前沿技术背景**：
  在角色 CFX（Creature FX）生产管线（如 Houdini 21 Otis 解算器、SIGGRAPH 2024/2025 次世代解剖仿真）中，肌肉不仅沿纤维收缩，还因体积守恒（Poisson 比 $\nu \approx 0.499$）产生强烈的侧向膨胀（Bulging），并与外包覆深筋膜（Deep Fascia）及皮下脂肪产生切向无阻滑移、法向不可穿透的非线性接触。
- **客观黄金基准 Ground Truth**：
  1. **稳定新胡克超弹性应变能密度函数（Smith et al., SIGGRAPH 2018）**：
     $$\Psi_{\text{SNH}}(\mathbf{F}) = \frac{\mu}{2}(I_1 - 3) - \mu(J - 1) + \frac{\lambda + \mu}{2}(J - 1)^2$$
     其中 $\mathbf{F} = \frac{\partial \mathbf{x}}{\partial \mathbf{X}}$ 为变形梯度张量，$J = \det(\mathbf{F})$ 为体积比率，$I_1 = \mathrm{tr}(\mathbf{F}^T\mathbf{F})$ 为第一变形不变量。
  2. **各向异性肌纤维主动收缩第一 Piola-Kirchhoff 应力**：
     $$\mathbf{P}_{\text{total}} = \frac{\partial \Psi_{\text{SNH}}}{\partial \mathbf{F}} + \sigma_{act}(t) \cdot (\mathbf{F}\mathbf{a}_0 \otimes \mathbf{a}_0)$$
     其中 $\mathbf{a}_0$ 为静息肌纤维主朝向矢量，$\sigma_{act}(t)$ 为主动肌张力。
  3. **筋膜滑移边界接触约束（Signorini-Coulomb 无摩擦滑移条件）**：
     $$g_n = (\mathbf{x}_{\text{skin}} - \mathbf{x}_{\text{muscle}}) \cdot \mathbf{n} \ge 0, \quad \lambda_n \ge 0, \quad g_n \lambda_n = 0$$
     $$\mathbf{f}_{\text{tangential}} = \mathbf{0} \quad (\text{界面允许切向滑移自由位移 } \Delta u_\tau)$$
  4. **宏观膨胀准则（近不可压缩性 $J \approx 1$）**：
     当二头肌轴向缩短率 $\lambda_z = 0.70$ 时，径向必须等体积膨胀：
     $$\lambda_x = \lambda_y = \frac{1}{\sqrt{\lambda_z}} = \frac{1}{\sqrt{0.70}} \approx 1.195 \quad (+19.5\% \text{ 截面横向扩张})$$
- **机器与视觉客观比对判据**：
  - **视觉肉眼判据**：屈肘过程中，二头肌腹部网格呈饱满马鞍形隆起，肌肉边界向外顶推筋膜，筋膜轮廓滑移拉伸；内联动画中肌肉纤维呈现色彩明度随 $\sigma_{act}$ 提升而加深（充血变红）；最关键的解剖视觉特征：肌腹隆起峰值与骨骼转轴非线性脱耦，筋膜在肌肉隆起侧滑移最大，而在腱止点牢固锚定。
  - **机器自动化比对判据**：
    - 体积恒定性约束：四面体剖面总面积误差 $\frac{|\Delta A|}{A_0} < 1.5\%$。
    - 径向扩张比例：在轴向缩短 $30\%$ 处，肌腹横截面宽度必须达到基线宽度的 $1.19 \pm 0.02$ 倍。
    - 滑移位移场梯度：筋膜与肌表面节点间切向相对位移 $\Delta u_\tau \ge 0.12 L_{bicep}$。
- **权威学术出处**：
  - Smith, B., De Goes, F., & Kim, T. (2018). *Stable neo-hookean flesh simulation*. **ACM Transactions on Graphics (TOG)**, 37(2), Article 12. DOI: 10.1145/3180491.
  - Romeo, M., et al. (2020). *Muscle and Fascia Simulation with Extended Position Based Dynamics*. **Computer Graphics Forum**, 39(8), 134-146.
- **净室设计理念说明**：
  严格基于连续介质张量分析与变分变分法导出应变几何，避免抓取商业三维软件专属权重贴图与预设。

---

### 【VFX-MOTION-04】鸟类飞羽微结构层叠滑移与极端各向异性气动扭转
- **题目 ID**：`VFX-MOTION-04`
- **中文名**：鸟类飞羽微结构层叠滑移与极端各向异性气动扭转
- **英文名**：Avian Feather CFX: Barbule Interlocking & Anisotropic Aero-Torsion
- **表现形式**：静态高精度羽小枝拓扑钩锁与展弦扭转剖面（微观：远端带钩羽小枝与近端槽状羽小枝单向咬合；宏观：初级飞羽在外侧风压下的弯扭耦合弹性曲面）。
- **2026 前沿技术背景**：
  在飞行动物仿真与变形机翼（Morphing Wing）模拟中，羽毛展现了自然界中最极端的各向异性。Jouve et al. (SIGGRAPH 2024) 揭示了飞羽沿羽轴（Rachis）方向与垂直羽枝（Barbs）方向的拉伸刚度比高达惊人的 $10^4:1$。在气动升力作用下，单根羽毛自发发生气动弹性后掠与扭转，而层叠羽毛间依靠微观羽小枝的 Velcro 类似自锁结构维持气动密封面。
- **客观黄金基准 Ground Truth**：
  1. **三参数强各向异性正交各向异性弹性能面密度（Jouve et al., SIGGRAPH 2024）**：
     $$W(\mathbf{E}) = \frac{1}{2} E_{11} C_{1111} E_{11} + \frac{1}{2} E_{22} C_{2222} E_{22} + 2 E_{12} C_{1212} E_{12}$$
     刚度各向异性比：
     $$\frac{C_{1111} (\text{沿羽枝方向})}{C_{2222} (\text{跨羽枝横向})} \sim 10^4$$
  2. **微观羽小枝单向咬合接触力学（Asymmetric Micro-Frictional Interlocking）**：
     $$F_{\text{slip}}(\Delta x) = \begin{cases} \mu_0 N + k_{\text{hook}} \Delta x, & \text{正向分离受阻（钩锁锚定）} \\ \mu_{\text{low}} N, & \text{反向滑动（羽毛平滑复位）} \end{cases}$$
  3. **气动弯扭耦合微分方程（沿展长 $s$ 的梁-壳耦合）**：
     $$EI_y \frac{d^2 w}{ds^2} = M_y(s) = \int_s^L L_{\text{aero}}(s') (s' - s) ds'$$
     $$GJ \frac{d\theta}{ds} = T_{\text{aero}}(s) = \int_s^L L_{\text{aero}}(s') e(s') ds'$$
     其中气动力偏心距 $e(s) \approx 0.25 c(s)$，导致升力直接激发扭转角 $\theta(s)$，使翼尖冲角自动减小（Washout 效应），防止翼尖失速。
- **机器与视觉客观比对判据**：
  - **视觉肉眼判据**：微观剖面须清晰绘制羽轴主干、斜向羽枝、远端微小钩状羽小枝（Hooklets）与相邻羽小枝边缘法兰扣合的微观构型；宏观羽毛受压图须呈现明显的翼梢扭转下俯角（Twist-down $\Delta \theta \approx -8^\circ \sim -12^\circ$），并在羽片开缝处呈现微观单向互锁限制位移的层叠光影。
  - **机器自动化比对判据**：
    - 微观钩锁几何特征：羽小枝钩间距与倾角满足 $\alpha_{\text{hook}} \in [40^\circ, 50^\circ]$。
    - 宏观弯扭变形比：翼尖垂向挠度与扭转角之比 $\frac{w(L)}{\theta(L)} \in [0.15\,\text{m/rad}, 0.22\,\text{m/rad}]$。
    - 弹性模量标注严格符合 $\ge 10^3$ 阶梯量级差异。
- **权威学术出处**：
  - Jouve, J., Romero, V., Narain, R., Boissieux, L., Kim, T., & Bertails-Descoubes, F. (2024). *Modelling a Feather as a Strongly Anisotropic Elastic Shell*. **ACM Transactions on Graphics (TOG)** (SIGGRAPH 2024), 43(4), Article 112. DOI: 10.1145/3658145.
  - Sullivan, T. N., et al. (2017). *Extreme lightweight structures: avian feathers*. **Materials Today**, 20(7), 377-391.
- **净室设计理念说明**：
  依据真实鸟类解剖切片数据与 2024 SIGGRAPH 强各向异性壳体能量泛函构建，不复刻商业雕刻软件模型笔刷资产。

---

### 【VFX-MOTION-05】哺乳动物四足步态弗鲁德数相变图谱
- **题目 ID**：`VFX-MOTION-05`
- **中文名**：哺乳动物四足步态弗鲁德数相变图谱
- **英文名**：Mammalian Quadruped Gait Phase Transitions across Froude Spectrum
- **表现形式**：带内联 CSS/SMIL 步相带谱（Footfall Sequence Duty Cycles）与四足相图矩阵（动态展示伴随前进速度提高，四足从对角慢步 Walk $\to$ 小跑 Trot $\to$ 袭步/疾驰 Canter/Gallop 的相位滞后对称破缺）。
- **2026 前沿技术背景**：
  生物动力学中，四足动物步态选择并非任意，而是由动力相似性无量纲数——弗鲁德数（Froude Number, $Fr$）与代谢输运成本（Cost of Transport）共同支配（Alexander, 1989）。物理驱动四足角色在速度攀升时，必须在特定 $Fr$ 临界点发生自发相变（Bifurcation），从对称步态突变为非对称步态。
- **客观黄金基准 Ground Truth**：
  1. **无量纲弗鲁德数定义**：
     $$Fr = \frac{v^2}{g L_{\text{leg}}}$$
     其中 $v$ 为质心巡航速度，$g = 9.81\,\text{m/s}^2$，$L_{\text{leg}}$ 为四足站立有效腿长（以猎豹/犬科典型值 $L_{\text{leg}} = 0.8\,\text{m}$ 为基准）。
  2. **步态相变临界阈值表（Hildebrand 步态特征参数）**：
     - **常步（Walk, $Fr < 0.5$, 速度 $v < 2.0\,\text{m/s}$）**：
       占空比 $\beta > 0.5$（典型值 $0.65$）；触地相位滞后（左前落后左后）$\phi_{lh-lf} = 0.25$；始终保持 $\ge 2$ 足着地，重力势能与动能反相位转化（倒立摆模式）。
     - **快步/小跑（Trot, $0.5 < Fr < 2.0$, 速度 $2.0 \le v \le 4.0\,\text{m/s}$）**：
       占空比 $\beta \approx 0.40 - 0.50$；对角同相：$\phi(LF) = \phi(RH)$，$\phi(RF) = \phi(LH)$，相位差 $\Delta \phi = 0.50$；动能与弹性势能同相位振荡（弹簧质量模式）。
     - **疾驰/袭步（Transverse / Rotary Gallop, $Fr > 2.5$, 速度 $v > 4.5\,\text{m/s}$）**：
       占空比 $\beta < 0.35$（高速时 $\beta \approx 0.22$）；对角对称性完全破缺，出现单足-单足-双足撞击与全腾空（Gathered & Extended Flight Suspensions）双腾空期。
  3. **足端触地布尔指示函数**：
     $$S_i(t) = \begin{cases} 1, & (t \bmod T) / T \in [\phi_i, \phi_i + \beta] \\ 0, & \text{otherwise} \end{cases}, \quad i \in \{LF, RF, LH, RH\}$$
- **机器与视觉客观比对判据**：
  - **视觉肉眼判据**：中央动态甘特图（Gait Diagram）有四条平行的足迹色带（LF, RF, LH, RH），色块在水平滚动时光标指示触地期；随着上方 $Fr$ 仪表盘从 $0.2 \to 1.0 \to 3.0$ 切换，色带由交错的 Walk 模式平滑重组为成对并行的 Trot 模式，最后转变成不对称聚集的 Gallop 模式，且在 Gallop 模式下清晰可见两处四足全空的水平空白区间。
  - **机器自动化比对判据**：
    - Trot 模式下对角双足相位差判定：$|\phi_{LF} - \phi_{RH}| < 0.02$。
    - Gallop 悬空率判定：单个步态周期内 $S_{LF}+S_{RF}+S_{LH}+S_{RH} = 0$ 的时间占比 $> 15\%$。
    - $Fr$ 转换临界线标记位置：$Fr = 0.5 \pm 0.05$ 与 $Fr = 2.2 \pm 0.2$。
- **权威学术出处**：
  - Alexander, R. M. (1989). *Optimization and gaits in the locomotion of vertebrates*. **Physiological Reviews**, 69(4), 1199-1227. DOI: 10.1152/physrev.1989.69.4.1199.
  - Hildebrand, M. (1965). *Symmetrical gaits of horses*. **Science**, 150(3697), 701-708.
  - Hoyt, D. F., & Taylor, C. R. (1981). *Gait and the energetics of locomotion in horses*. **Nature**, 292(5820), 239-240.
- **净室设计理念说明**：
  数学矩阵与相位公式严格对齐 Hildebrand 拓扑定义与 Alexander 物理量纲，排除动画行业特定手工非物理关键帧插值。

---

### 【VFX-MOTION-06】稠密毛发离散弹性棒（DER）超螺旋弯曲失稳与回弹松弛
- **题目 ID**：`VFX-MOTION-06`
- **中文名**：稠密毛发离散弹性棒（DER）超螺旋弯曲失稳与回弹松弛
- **英文名**：Discrete Elastic Rods: Hair Strand Superhelical Buckling & Plectoneme Formation
- **表现形式**：带内联 CSS/SMIL 扭转诱发超螺旋回环动画（一根高纵横比弹性细棒两端施加反向扭矩 $\tau$，中心线发生屈曲突跃失稳，形成自重叠超螺旋回环 Plectoneme 并阻尼回弹）。
- **2026 前沿技术背景**：
  毛发、卷发与缝纫线的高保真物理仿真（如 Bergou et al., SIGGRAPH 2008 及 Jerry Hsu et al., SIGGRAPH 2025 "Stable Cosserat Rods"）核心瓶颈在于弯-扭耦合引起的非线性失稳。当微股毛发的轴向扭转达到临界阈值时，直棒将发生 Michell 失稳突变，能量从纯扭转形态瞬态转移为几何空间中心线的卷曲环绕（Writhing），形成超螺旋节。
- **客观黄金基准 Ground Truth**：
  1. **离散弹性棒（DER）两级运动学框架（Bergou et al., 2008）**：
     - 中心线离散折线顶点 $\mathbf{x}_0, \mathbf{x}_1, \dots, \mathbf{x}_N$，边向量 $\mathbf{e}^i = \mathbf{x}_{i+1} - \mathbf{x}_i$。
     - 无扭转 Bishop 平行转运标架 $\{\mathbf{u}^i, \mathbf{v}^i, \mathbf{t}^i\}$。
     - 材料标架（Material Frame）由标量扭转角 $\theta^i$ 确定：
       $$\mathbf{m}_1^i = \cos\theta^i \mathbf{u}^i + \sin\theta^i \mathbf{v}^i, \quad \mathbf{m}_2^i = -\sin\theta^i \mathbf{u}^i + \cos\theta^i \mathbf{v}^i$$
  2. **总离散弹性应变能**：
     $$E_{\text{total}} = E_{\text{bend}} + E_{\text{twist}} = \frac{1}{2} \sum_{k=1}^{N-1} \frac{\alpha (\kappa_k - \kappa_k^0)^2}{\bar{l}_k} + \frac{1}{2} \sum_{k=1}^{N-1} \frac{\beta (\Delta m_k)^2}{\bar{l}_k}$$
     其中 $\kappa_k = 2 \frac{\mathbf{e}^{k-1} \times \mathbf{e}^k}{\|\mathbf{e}^{k-1}\|\|\mathbf{e}^k\| + \mathbf{e}^{k-1}\cdot\mathbf{e}^k}$ 为离散曲率双法向矢量，$\alpha$ 为抗弯刚度，$\beta$ 为抗扭刚度。
  3. **Călugăreanu-White-Fuller 拓扑恒等式**：
     $$Lk = Tw + Wr$$
     - 环绕数（Linking number $Lk$）在闭合或两端受约束时为常数。
     - 扭转数 $Tw = \frac{1}{2\pi} \int \tau(s) ds$。
     - 缠绕数（Writhe $Wr$）表征中心线几何自缠绕空间积分。
  4. **临界失稳失稳判据（Michell Instability Criterion）**：
     在轴向张力 $T$ 下，发生超螺旋屈曲的临界扭矩：
     $$\tau_c = 2 \sqrt{\alpha T}$$
     一旦扭转过量，系统瞬态通过自碰撞形成半径为 $R_{\text{loop}} \approx \left(\frac{\alpha}{2T}\right)^{1/2}$ 的稳定 Plectoneme 螺旋纽结。
- **机器与视觉客观比对判据**：
  - **视觉肉眼判据**：动画中弹性细棒最初在两端旋转下仅表现为表面斑马纹条带的密集扭转；当扭角越过临界点，细棒中间猛烈突跃弯折成环，随后中心自接触螺旋缠绕形成“麻花状”Plectoneme 回环，同时两端外间距自发收缩；回弹过程带有高频欠阻尼衰减震荡。
  - **机器自动化比对判据**：
    - 拓扑守恒度量：整个屈曲全过程中 $|Lk - (Tw + Wr)| < 0.005$。
    - 临界分岔突跃时刻：屈曲发生时刻的扭矩误差满足 $|\tau - 2\sqrt{\alpha T}| / \tau_c < 3\%$。
    - 纽结自接触防穿透：中心线重叠区最近距离不得小于物理截面直径 $2r_{\text{hair}}$。
- **权威学术出处**：
  - Bergou, M., Wardetzky, M., Robinson, S., Audoly, B., & Grinspun, E. (2008). *Discrete elastic rods*. **ACM Transactions on Graphics (TOG)** (SIGGRAPH 2008), 27(3), Article 63. DOI: 10.1145/1360612.1360662.
  - Hsu, J., Wang, T., Wu, K., & Yuksel, C. (2025). *Stable Cosserat Rods*. **ACM Transactions on Graphics (TOG)** (SIGGRAPH 2025).
  - Goyal, S., Perkins, N. C., & Lee, C. L. (2005). *Nonlinear dynamic interconnecting plectoneme loops in elastic rods*. **International Journal of Non-Linear Mechanics**, 40(5), 663-674.
- **净室设计理念说明**：
  严格基于微分几何标架平移算子与 Călugăreanu 拓扑定理建模，完全独立自研矢量流形，杜绝抄袭影视工业专有毛发插件内部代码。

---

### 【VFX-MOTION-07】群智自组织涌现极化序参量相变与超密规避流线
- **中文名**：群智自组织涌现极化序参量相变与超密规避流线
- **英文名**：Boids/Vicsek Flocking: Polarization Phase Transition & Streamline Bifurcation
- **表现形式**：带内联 CSS/SMIL 群落相变与障碍分流激波动画（200 个自驱动粒子在圆形区域内，受噪声控制由完全混乱无序 Brownian 气体相，突变凝聚为高度一致的极化极向旋转涡群，并在遭遇柱状障碍物时呈现光滑的流线分流与尾迹重愈）。
- **2026 前沿技术背景**：
  集群动画（Crowd & Flock Dynamics）的物理本质是非平衡态自驱动主动物质（Active Matter）。Vicsek 经典模型与 Reynolds Boids 揭示了局部拓扑邻近对齐（Topological Neighborhood）与碰撞排斥能诱发宏观全局对称性破缺。在真实鸟群（如 Cavagna 等人针对罗马椋鸟的高速摄像测量）中，信息传递遵循无尺度拓扑关联（固定与最近 $k\approx 7$ 个邻居交互），而非简单的欧氏度规半径。
- **客观黄金基准 Ground Truth**：
  1. **具有拓扑近邻选择的更新微分方程**：
     $$\mathbf{x}_i(t + \Delta t) = \mathbf{x}_i(t) + \mathbf{v}_i(t) \Delta t$$
     $$\theta_i(t + \Delta t) = \operatorname{Arg}\left( \sum_{j \in \mathcal{N}_k(i)} \mathbf{v}_j(t) + \mathbf{F}_{\text{repel}}(i) \right) + \eta \xi_i(t)$$
     其中 $\mathcal{N}_k(i)$ 为基于 $k$-最近邻（Topological metric-free, $k = 7$）拓扑集，$\xi_i \in [-\pi, \pi]$ 为均匀白噪声，$\eta$ 为环境噪声强度。
  2. **Reynolds 矢量力学合成三原则**：
     $$\mathbf{F}_{\text{steer}} = w_s \frac{\mathbf{v}_{\text{des, sep}}}{\|\mathbf{v}_{\text{des, sep}}\|} + w_a \frac{\mathbf{v}_{\text{des, align}}}{\|\mathbf{v}_{\text{des, align}}\|} + w_c \frac{\mathbf{v}_{\text{des, coh}}}{\|\mathbf{v}_{\text{des, coh}}\|}$$
  3. **全局极化序参量（Polarization Order Parameter $\varphi$）**：
     $$\varphi(t) = \frac{1}{N v_0} \left\| \sum_{i=1}^N \mathbf{v}_i(t) \right\| \in [0, 1]$$
     - 无序气态相（Disordered phase, $\eta > \eta_c$）：$\varphi \approx \frac{1}{\sqrt{N}} \ll 1$（各向同性，宏观动量抵消）。
     - 极化凝相（Ordered flocking phase, $\eta < \eta_c$）：$\varphi \to 1.0$（自发破缺，产生单一主航向）。
  4. **障碍物无碰撞势流（Potential Flow Streamline Bifurcation）**：
     粒子在半径为 $R$ 的圆柱障碍物前的速度修正受偶极子位势诱导：
     $$\mathbf{v}_{\text{mod}} = \mathbf{v}_\infty - \frac{R^2}{r^2} [ 2(\mathbf{v}_\infty \cdot \hat{\mathbf{r}})\hat{\mathbf{r}} - \mathbf{v}_\infty ]$$
- **机器与视觉客观比对判据**：
  - **视觉肉眼判据**：左侧实时曲线显示 $\varphi(t)$ 从 $0.05$ 突变跃迁至 $0.92$ 以上的阶跃相变响应；右侧粒子场中，原本杂乱乱撞的三角形粒子在 $1.5$ 秒内自发对齐成顺时针大旋涡流；遇前方中央障碍球时，流群平滑裂解为左右两支对称流束，绕过障碍后尾部 $2R$ 距离内迅速闭合重组，无单粒子卡死在驻点（Stagnation Point）。
  - **机器自动化比对判据**：
    - 稳定相变序参量：低温稳态时 $\varphi_{\text{steady}} \ge 0.88$。
    - 粒子间最小距离：所有时间步长下 $\min_{i \ne j} \|\mathbf{x}_i - \mathbf{x}_j\| \ge d_{\text{safe}}$（零重叠穿透率）。
    - 尾流愈合长度：分流后重新达到局部极化 $\varphi_{\text{local}} > 0.8$ 的距离 $L_{\text{heal}} \le 2.5 R_{\text{obs}}$。
- **权威学术出处**：
  - Vicsek, T., et al. (1995). *Novel type of phase transition in a system of self-driven particles*. **Physical Review Letters**, 75(6), 1226-1229.
  - Cavagna, A., et al. (2010). *Scale-free correlations in starling flocks*. **Proceedings of the National Academy of Sciences (PNAS)**, 107(26), 11865-11870. DOI: 10.1073/pnas.1005766107.
  - Reynolds, C. W. (1987). *Flocks, herds and schools: A distributed behavioral model*. **ACM SIGGRAPH Computer Graphics**, 21(4), 25-34.
- **净室设计理念说明**：
  基于统计物理非平衡态相变方程与拓扑近邻定义完全重构，绝不使用商用集群插件中预编译的黑盒 Agent 逻辑。

---

### 【VFX-MOTION-08】四足崎岖地形接触反作用力摩擦金字塔与捕获点（Capture Point）平衡恢复
- **题目 ID**：`VFX-MOTION-08`
- **中文名**：四足崎岖地形接触反作用力摩擦金字塔与捕获点（Capture Point）平衡恢复
- **英文名**：Quadruped Rough Terrain GRF Friction Pyramid & Capture Point Recovery
- **表现形式**：静态多视点接触多面体摩擦锥切面与捕获盆地分布图（三维透视投影展示四足在非平整倾斜碎石坡面上的地面反作用力矢、线性化摩擦四棱锥内接界限与瞬时捕获点 ICP 落脚安全盆地）。
- **2026 前沿技术背景**：
  物理角色动画跨越恶劣地形（Rough Terrain）或遭遇外界横向强冲击（Push Recovery）时，足端与地面的力交互受库仑摩擦锥严苛约束。Pratt et al. (2006) 提出的捕获点（Capture Point, CP）理论及线性倒立摆（LIPM）动力学，为判定角色是否会滑移倾覆提供了精确解析判据。
- **客观黄金基准 Ground Truth**：
  1. **三维质心（CoM）发散动力学与瞬时捕获点（ICP, Pratt et al. 2006）**：
     $$\ddot{\mathbf{x}}_{\text{CoM}} = \omega_0^2 (\mathbf{x}_{\text{CoM}} - \mathbf{p}_{\text{CoP}}), \quad \omega_0 = \sqrt{\frac{g}{z_0}}$$
     瞬时捕获点定义为：
     $$\mathbf{\xi} = \mathbf{x}_{\text{CoM}} + \frac{\dot{\mathbf{x}}_{\text{CoM}}}{\omega_0}$$
     若要使角色在有限步内完全停止，下一落足点必须覆盖 $\mathbf{\xi}$。
  2. **非平整局部接触坐标系下的线性化摩擦金字塔（Friction Pyramid）**：
     对于斜面法向 $\mathbf{n}_i$ 与切向基底 $\{\mathbf{t}_{1i}, \mathbf{t}_{2i}\}$，单足地面反作用力 $\mathbf{f}_i$ 必须严格内接于摩擦锥：
     $$f_{i,n} = \mathbf{f}_i \cdot \mathbf{n}_i \ge 0 \quad (\text{单向受压，地表无粘聚力})$$
     $$|f_{i,t1}| = |\mathbf{f}_i \cdot \mathbf{t}_{1i}| \le \frac{\mu}{\sqrt{2}} f_{i,n}, \quad |f_{i,t2}| = |\mathbf{f}_i \cdot \mathbf{t}_{2i}| \le \frac{\mu}{\sqrt{2}} f_{i,n}$$
  3. **四足支撑多面体（Support Polygon）包络准则**：
     全系统合力旋量（Wrench）在 CoM 处产生的等效压力中心（CoP）必须严格处于当前四足支撑脚凸包 $\mathcal{CH}(\{\mathbf{p}_1, \mathbf{p}_2, \mathbf{p}_3, \mathbf{p}_4\})$ 内部，且到多面体边界的有符号距离 $d_{\text{margin}} > 0$。
- **机器与视觉客观比对判据**：
  - **视觉肉眼判据**：SVG 中各个接触点画出半透明青色金字塔摩擦锥，反作用力合力矢量箭头（粗红线）必须严格位于锥体实体内部；若遭受外界冲量冲击，动态画出一条指向前方的点划线，终点标记为发光的十字标星（Capture Point $\mathbf{\xi}$），该点落在当前预规划的踏步阴影多边形内。
  - **机器自动化比对判据**：
    - 摩擦力锥合规率：所有足端计算力矢量满足 $\max\left(\frac{|f_{t1}|}{f_n}, \frac{|f_{t2}|}{f_n}\right) \le \frac{\mu}{\sqrt{2}}$（相对误差 $0\%$ 突破容忍）。
    - 捕获点坐标闭合验证：$\|\mathbf{\xi} - (\mathbf{x} + \dot{\mathbf{x}}\sqrt{z_0/g})\| / L_{\text{leg}} < 0.005$。
    - 凸多边形内外判定：CoP 距离凸包边缘裕度 $d \ge 0.03\,\text{m}$。
- **权威学术出处**：
  - Pratt, J., Carff, J., Drakunov, S., & Goswami, A. (2006). *Capture point: A step towards humanoid push recovery*. **2006 IEEE-RAS International Conference on Humanoid Robots**, 200-207. DOI: 10.1109/ICHR.2006.321385.
  - Caron, S., Pham, Q. C., & Nakamura, Y. (2015). *Stability of surface-contacts for humanoid robots: Closed-form formulae of the Contact Wrench Cone for arbitrary planar contacts*. **IEEE Transactions on Robotics (T-RO)**, 31(4), 985-995.
- **净室设计理念说明**：
  基于经典刚体接触力学与凸二次规划理论正向构建，力学投影严格遵从解析欧氏空间变换，杜绝任何商业游戏引擎 PhysX/Havok 专属代码残留。

---

### 【VFX-MOTION-09】鱼类尾鳍逆卡门涡街反推力推进与波动应变包络
- **题目 ID**：`VFX-MOTION-09`
- **中文名**：鱼类尾鳍逆卡门涡街反推力推进与波动应变包络
- **英文名**：Carangiform Undulation & Reverse von Kármán Vortex Street Propulsion
- **表现形式**：带内联 CSS/SMIL 鱼体行波传递与尾鳍交替涡环脱落动画（身体中后段振幅由小到大递增的向后行波，并在尾鳍摆动尖端交替向后脱落顺时针与逆时针涡环，形成中心速度高于远场来流的射流射流线）。
- **2026 前沿技术背景**：
  在水下物理角色仿生推进（如 SIGGRAPH 2021 DiffAqua 软体水下动物解算、流固耦合 FSI）中，鲹科（Carangiform）与金枪鱼科（Thunniform）鱼类依靠鱼身肌肉从前向后传递的横向挠曲波，将水流工质推向尾后。当斯特劳哈尔数处于 $0.20 \le St \le 0.40$ 区间时，尾流形成逆卡门涡街（Reverse von Kármán Vortex Street），产生自发正向推力。
- **客观黄金基准 Ground Truth**：
  1. **Lighthill 细长体行波运动学包络方程**：
     $$y(x, t) = a(x) \sin(k x - \omega t)$$
     振幅包络函数 $a(x)$ 满足非线性二次多项式增长：
     $$a(x) = c_0 + c_1 \left(\frac{x}{L}\right) + c_2 \left(\frac{x}{L}\right)^2, \quad x \in [0, L]$$
     标准水动力学参数：$c_0 = 0.02 L$（头部微弱偏航），$c_1 = -0.08 L$，$c_2 = 0.16 L$（尾柄处大幅摆动），波数 $k = \frac{2\pi}{\lambda}$，波长 $\lambda \approx 0.95 L$（体内存在约一个完整波长）。
  2. **斯特劳哈尔数（Strouhal Number $St$）准则**：
     $$St = \frac{f \cdot A_{\text{tail}}}{U_{\infty}} \in [0.25, 0.35]$$
     其中 $f = \frac{\omega}{2\pi}$ 为摆尾频率，$A_{\text{tail}} = 2 a(L)$ 为尾尖峰-峰摆动全幅值，$U_{\infty}$ 为巡航前进速度。
  3. **Lighthill 大振幅理论时间平均推力（Mean Thrust）**：
     $$\bar{T} = \frac{1}{2} m_a \left[ \overline{\left(\frac{\partial y}{\partial t}\right)^2} - U_{\infty}^2 \overline{\left(\frac{\partial y}{\partial x}\right)^2} \right]_{x=L} > 0$$
     其中 $m_a = \frac{1}{4} \pi \rho s_T^2$ 为尾鳍端部虚拟附加质量（$s_T$ 为尾鳍展长）。当相速度 $c = \frac{\omega}{k} > U_{\infty}$ 时，推力为正。
  4. **逆卡门涡街拓扑特征**：
     上脱落涡为顺时针（负环量 $-\Gamma$），下脱落涡为逆时针（正环量 $+\Gamma$），两涡诱导出的中心轴线诱导流速度矢量 $u_{\text{induced}} > 0$（指向后方射流），与阻力型卡门涡街严格相反。
- **机器与视觉客观比对判据**：
  - **视觉肉眼判据**：鱼身骨干由一条柔韧正弦样条驱动，头部摆动小、尾部摆动剧烈；在鱼尾每一次变向到达摆动极值点时，平滑释放一个带有渐变淡出效果的同心圆双色涡环，且上方涡旋顺时针旋转，下方涡旋逆时针旋转；在尾流对称线上绘制青色速度矢量箭头，箭头长且直指后方，直观展现反冲射流。
  - **机器自动化比对判据**：
    - 行波包络单调性：$\frac{da}{dx} > 0$ 在后半段 $x > 0.5 L$ 严格成立。
    - 斯特劳哈尔数精确落位：$St = \frac{f A}{U} = 0.28 \pm 0.03$。
    - 涡旋空间分离波长比：脱落涡中心间距 $\Delta x_{\text{vortex}} / \lambda_{\text{wave}} \in [0.85, 1.05]$。
- **权威学术出处**：
  - Lighthill, M. J. (1971). *Large-amplitude elongated-body theory of fish locomotion*. **Proceedings of the Royal Society of London. Series B. Biological Sciences**, 179(1055), 125-138. DOI: 10.1098/rspb.1971.0085.
  - Triantafyllou, M. S., Triantafyllou, G. S., & Gopalkrishnan, R. (1991). *Wake mechanics for thrust generation in oscillating foils*. **Physics of Fluids A: Fluid Dynamics**, 3(12), 2835-2837.
- **净室设计理念说明**：
  完全遵照 Lighthill 1971 细长体解析模型推导波形曲线，不使用任何带有专有权的数据驱动神经流动网络或商业 CFD 软件网格流场直接导出。

---

### 【VFX-MOTION-10】灵巧手面接触摩擦极限椭球与滑动分岔判据
- **题目 ID**：`VFX-MOTION-10`
- **中文名**：灵巧手面接触摩擦极限椭球与滑动分岔判据
- **英文名**：Dexterous Manipulation Soft-Finger Limit Surface & Slip Bifurcation
- **表现形式**：静态高精度接触面切应力分布与 3D 极限流形剖面图（左侧：软指接触斑 Hertz 压力与环状剪切滑移边界；右侧：载荷空间 $(f_x, f_y, m_z)$ 中的光滑凸极曲面与关联流动剪切滑移矢量）。
- **2026 前沿技术背景**：
  在灵巧手操作（Dexterous In-Hand Manipulation）与触觉反馈角色交互（如 IEEE T-RO 2024 / SIGGRAPH 前沿接触控制）中，指尖与物体的接触绝非简单的硬点接触，而是具有有限接触面积的弹性面接触（Soft-Finger Contact）。Goyal-Ruina-Papadopoulos 极限曲面（Limit Surface）界定了法向压力 $f_n$ 恒定时，切向力 $(f_x, f_y)$ 与扭转力矩 $m_z$ 所能承受的最大静摩擦边界，是预测物体在指尖何时发生微滑与旋转滑移的第一性原理流形。
- **客观黄金基准 Ground Truth**：
  1. **Howe-Cutkosky 极限曲面椭球解析逼近模型**：
     $$\Phi(\mathbf{w}_c) = \frac{f_x^2 + f_y^2}{f_{\max}^2} + \frac{m_z^2}{m_{\max}^2} \le 1$$
     其中 $\mathbf{w}_c = [f_x, f_y, m_z]^T$ 为接触摩擦旋量，$f_{\max} = \mu f_n$ 为纯平移最大滑动摩擦力，$m_{\max} = c_m \mu f_n r_c$ 为纯扭转最大抗扭力矩（$r_c$ 为接触圆斑有效接触半径，$c_m \approx \frac{3\pi}{16} \approx 0.589$ 为赫兹接触压力分布常数）。
  2. **相关流动法则（Associated Flow Rule - 极值法向滑动准则）**：
     当载荷处于极限曲面边界 $\Phi(\mathbf{w}_c) = 1$ 时，产生临界滑动。滑移相对广义速度（Twist $\mathbf{v}_{\text{slip}} = [v_x, v_y, \omega_z]^T$）必须与极限曲面梯度的外法向平行：
     $$\mathbf{v}_{\text{slip}} = \dot{\lambda} \nabla_{\mathbf{w}_c} \Phi(\mathbf{w}_c) = \dot{\lambda} \left[ \frac{2 f_x}{f_{\max}^2}, \frac{2 f_y}{f_{\max}^2}, \frac{2 m_z}{m_{\max}^2} \right]^T, \quad \dot{\lambda} \ge 0$$
  3. **粘滞-滑动分岔（Stick-Slip Transition）微观剪切分界线**：
     在接触圆斑 $r \le r_c$ 上，法向应力呈抛物线分布 $\sigma_n(r) = \sigma_0 \sqrt{1 - (r/r_c)^2}$。粘滞核（Stick core）半径 $r_a$ 随切向载荷 $f_t = \sqrt{f_x^2+f_y^2}$ 增加而向内收缩：
     $$\frac{r_a}{r_c} = \left( 1 - \frac{f_t}{\mu f_n} \right)^{1/3}$$
- **机器与视觉客观比对判据**：
  - **视觉肉眼判据**：右侧载荷空间清楚绘制三维椭球体（水平轴 $f_x, f_y$ 为主轴，垂直轴 $m_z$ 缩短），载荷工作点落在椭球内表示静摩擦锁定（Stick），落在椭球表面时从接触点引出垂直法向量，标明滑动速度分量 $\mathbf{v}$ 与旋转速度 $\omega$；左侧圆形接触斑用同心圆精准展现外部粉红色的滑动区（Slip annulus）与内部深蓝色的粘滞核心（Stick core）。
  - **机器自动化比对判据**：
    - 椭球轴长比验证：长短轴比例严格满足 $\frac{m_{\max} / r_c}{f_{\max}} = c_m = 0.59 \pm 0.02$。
    - 滑动流动法向正交性：计算滑移矢量与切平面的点积，判定正交误差 $|\mathbf{v}_{\text{slip}} \times \nabla \Phi| \approx 0$（夹角偏差 $< 1.5^\circ$）。
    - 粘滞核半径比例：当 $f_t = 0.5 \mu f_n$ 时，内层核心半径比必须为 $r_a / r_c = (0.5)^{1/3} \approx 0.793 \pm 0.015$。
- **权威学术出处**：
  - Goyal, S., Ruina, A., & Papadopoulos, J. (1991). *Planar sliding with dry friction. Part 1. Limit surface and moment function*. **Wear**, 143(2), 307-330. DOI: 10.1016/0043-1648(91)90102-Q.
  - Howe, R. D., & Cutkosky, M. R. (1996). *Practical simulation of sliding in contact: The limit surface approach*. **IEEE Transactions on Robotics and Automation**, 12(3), 433-442.
  - Shi, J., Woodruff, J. Z., & Lynch, K. M. (2017). *Dynamic in-hand sliding manipulation*. **IEEE Transactions on Robotics**, 33(4), 778-795. DOI: 10.1109/TRO.2017.2693392.
- **净室设计理念说明**：
  从连续塑性力学与屈服准则的第一性原理出发，严格基于 Goyal-Ruina 方程组进行正交计算，绝无抓取商业机器人控制包的私有反解模块。

---

## 第三部分：机器自动量化与视觉判定执行细则

为了使上述 10 道题目能够直接集成进当前开源基准看板并进行全天候自动化回归评测，特制定统一的双轨（Dual-Track）评估准则：

### 1. 轨道 A：纯直观无辅助肉眼视觉比对（Human Expert Visual Pass）
- **无闪烁自闭合**：内联动画必须全部采用标准纯原生 SVG 语法（`<animate>`, `<animateTransform>`, 关键帧内联 `<style> @keyframes`），严禁携带任何交互脚本（无 `onclick`，无外链 JavaScript）。
- **解剖/动力学关键帧可辨度**：
  - 骨骼/肌肉拓扑层次明晰，肌肉收缩与被动结缔组织采用标准冷暖色相区分（高张力：深红/绯红；松弛被动：冰蓝/石板灰）。
  - 流体涡旋与气动流动采用反相流动透明渐变（Opacity Ramp 0.8 $\to$ 0.0），涡核旋转指向与推力喷流中心流线肉眼一眼可辨。
  - 相平面闭合轨迹在回圈重合点无错位断裂，肉眼观察 3 个周期以上无发散或坍缩。

### 2. 轨道 B：像素级与几何拓扑级机器客观判据（Automated CI/CD Evaluator）
评测脚本（如 `test/eval-motion.test.ts`）通过 XML 解析提取生成的 SVG DOM 树，并进行无损特征核验：
1. **XML 格式合法性**：严格通过 `DOMParser` 或 Node.js XML 解析器，无连续未转义双破折号 `--`，无重复属性，`<style>` 标签被 `<![CDATA[ ... ]]>` 严格包裹。
2. **标量与拓扑度量**：对关键几何控制点坐标与曲线特征点进行解析匹配，要求均方根误差 $\text{RMSE} < 2.5\%$，满足各题目所列之黄金基准公差。
3. **确定性重现**：同一提示词在相同参数种子下输出的 SVG 结构具有结构同构性。
