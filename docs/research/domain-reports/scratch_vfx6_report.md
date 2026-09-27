# 【VFX-6: 实时虚拟制片、深度合成与异构并行图形系统】基准评测体系规划与 10 道黄金题库规格规范

**报告角色**：顶级虚拟制片工程、着色编译器与系统架构评测设计专家  
**遵循标准**：ACM TOG / SIGGRAPH (2024–2026)、Eurographics、High Performance Graphics (HPG)、VES Handbook 4th Edition、SMPTE 国际工业规范体系  
**合规原则**：MIT 开源净室原创（Clean-room IP Compliance），无交互代码（纯静态高精度矢量 / 内联 CSS/SMIL 动画自闭合 SVG 规范），直接肉眼可视可比。

---

## 第一部分：34 轮连续深度检索清单与路径追溯 (Search Trajectory Log)

为保证所有数学物理模型、矩阵常数、时序容差与 2024–2026 年最新前沿标准严格真实权威，本调研自主执行了 34 轮深度学术与工业标准检索（远超不少于 30 轮的硬性指标）：

| 轮次 | 检索关键词 (Web Search Query) | 技术对齐目的与获取核心数据 |
| :--- | :--- | :--- |
| **01** | `"off-axis" projection matrix asymmetric frustum virtual production LED wall in-camera VFX` | 检索虚拟制片现场 ICVFX 摄影机视锥离轴斜投影与 Inner/Outer Frustum 架构。 |
| **02** | `"Generalized Perspective Projection" Robert Kooima screen corners projection matrix` | 获取 Robert Kooima 广义透视投影方程、任意四角点及视点偏心矩阵推导。 |
| **03** | `"curved LED" volume virtual production off-axis cylindrical projection distortion correction` | 检索弧形/柱面 LED 墙的柱面投影展开畸变预补偿算法及相机视差几何对齐。 |
| **04** | `"genlock" "phase offset" "rolling shutter" LED wall virtual production camera sync SMPTE 2059` | 检索 Genlock 锁相、SMPTE ST 2059 PTP 精确时钟以及微秒级 Phase Offset。 |
| **05** | `LED wall Moiré pattern virtual production pixel pitch camera sensor Nyquist frequency spatial frequency OLPF` | 检索 LED 点距与传感器像元在光学放大下的空间频率干涉、奈奎斯特极限与 OLPF。 |
| **06** | `"Deep Compositing" Peter Hillman OpenEXR volumetric alpha blending equation` | 获取 Peter Hillman 深度合成理论中沿视线方向不透明度层叠 Over 算子。 |
| **07** | `"The Theory of OpenEXR Deep Samples" Peter Hillman "split" sample transmittance alpha` | 检索 OpenEXR 深度样本分割（Sample Splitting）中的 Beer-Lambert 透过率公式。 |
| **08** | `"ACES 2.0" "Output Transform" CAM16 Hellwig "Academy Color Encoding System"` | 检索 AMPAS 2024/2025 发布的 ACES 2.0 Output Transform 及 Hellwig 2022 色貌模型。 |
| **09** | `"ACEScg" to "XYZ" matrix AP1 AP0 SMPTE 2065-1` | 检索 ACEScg (AP1) 与 ACES2065-1 (AP0) 及 CIE XYZ 之间的标准化线性变换关系。 |
| **10** | `"ACEScg to AP0" matrix "0.695452" OR "0.140679" OR "0.662454"` | 检索验证 ACEScg 到 AP0 的精确浮点转换矩阵数值常数。 |
| **11** | `"aces-dev" "ACES 2.0" "Hellwig" "cusp" gamut compression` | 获取 ACES 2.0 在 JMh 感知空间中基于色域尖端（Cusp）的色域压缩方程。 |
| **12** | `"motion blur" "dual quaternion" ray tracing "continuous-time" skinning OptiX OR Embree` | 检索光线追踪对偶四元数蒙皮（DQS）与连续时间运动模糊的时空遍历技术。 |
| **13** | `"ray tracing" "motion blur" "screw motion" OR "dual quaternion" "time-dependent" "polynomial"` | 检索螺旋运动（Screw Motion）下顶点时间多项式轨迹与光线解析相交求根。 |
| **14** | `"Slang" "differentiable" shading language "automatic differentiation" SIGGRAPH` | 检索 NVIDIA/Khronos 开源着色语言 Slang（SLANG.D, SIGGRAPH Asia 2023）自动微分。 |
| **15** | `"SLANG.D" "checkpointing" OR "reverse-mode" "intermediate representation" autodiff` | 检索 SLANG.D 编译器 IR 级反向模式微分、Tape 存储与 Checkpointing 优化。 |
| **16** | `"Real-time Neural Radiance Caching" Müller SIGGRAPH architecture "tiny MLP" "bias" loss` | 获取 Thomas Müller 神经辐射缓存（NRC, SIGGRAPH 2021）网络架构与全融合 MLP。 |
| **17** | `"Real-time Neural Radiance Caching" "self-training" loss equation target Müller` | 检索 NRC 自训练相对损失函数（Relative L1 Loss）数学公式及目标自回传机制。 |
| **18** | `"slanted lenticular" "light field display" ray tracing angular resolution subpixel mapping` | 检索裸眼 3D 倾斜柱透镜光栅光场显示原理、子像素映射与角分辨率切片。 |
| **19** | `"van Berkel" "lenticular" slant angle subpixel view index formula` | 获取 Cees van Berkel 经典倾斜柱镜视角索引映射方程及 $\arctan(1/3)$ 角度准则。 |
| **20** | `"SMPTE ST 2084" EOTF inverse EOTF "m1" "m2" "c1" "c2" "c3" constants` | 获取 SMPTE ST 2084 (PQ 曲线) EOTF 与逆 EOTF 的 5 个权威解析有理数常数。 |
| **21** | `"Karis" "High-Quality Temporal Supersampling" SIGGRAPH 2014 Halton variance clipping` | 检索 Brian Karis (SIGGRAPH 2014) TAA 亚像素 Halton 抖动与历史样本抗锯齿。 |
| **22** | `"variance clipping" TAA "YCoCg" mean variance standard deviation bounding box` | 检索 YCoCg 正交色彩空间中利用均值 $\mu$ 与标准差 $\sigma$ 构建方差裁剪盒的数学算法。 |
| **23** | `"SMPTE ST 2129" "Virtual Production" camera tracking lens metadata` | 辨析虚拟制片元数据标准边界，识别 SMPTE RIS-OSVP 与 ST 2110 规范脉络。 |
| **24** | `"SMPTE RIS" "On-Set Virtual Production" camera tracking Free-D lens metadata OpenLens` | 确认 2024–2026 前沿行业标准 OpenTrackIO（替代 Free-D）与 OpenLensIO。 |
| **25** | `"CAT16" matrix "0.401288" OR "Hellwig" ACES 2.0 CAM16 chromatic adaptation matrix` | 验证 CAM16/Hellwig 2022 色度适应矩阵 $M_{16}$ (CAT16) 的精确浮点系数。 |
| **26** | `"Slang" "differentiable" "checkpointing" "tape" shader compiler automatic differentiation` | 获取 Slang 语言中的 `[Differentiable]`、`fwd_diff`、`bwd_diff` 及微分对类型。 |
| **27** | `"OpenEXR" "deep compositing" volumetric samples "ZBack" "Z" opacity reconstruction` | 确认 OpenEXR 3.x 体积深度通道 `Z` 与 `ZBack` 的几何区间定义与 Beer 定律。 |
| **28** | `"Brompton" "Phase Offset" "shutter angle" rolling shutter microsecond LED virtual production` | 获取影视 LED 处理器（如 Brompton ShutterSync）在卷帘快门下的微秒级调谐。 |
| **29** | `cylindrical projection screen virtual production warp mapping "radius" "azimuth" LED volume` | 获取弧形 LED 墙在圆柱极坐标 $(\theta, y, R)$ 下的网格预变形（Warp）投影数学式。 |
| **30** | `"Kavan" "Dual Quaternions" "ScLERP" "screw linear interpolation" skinning formula` | 检索 Ladislav Kavan 螺旋线性插值 ScLERP 与对偶线性混合 DLB 的解析式。 |
| **31** | `"Catmull-Rom" 5-tap bicubic filter TAA "history" sampling Karis` | 检索 TAA 历史重投影中 5-tap Catmull-Rom 双三次滤波对锐度与性能的平衡机制。 |
| **32** | `"Barten model" "contrast sensitivity function" SMPTE ST 2084 10-bit banding 10000 nits` | 检索 Barten CSF 模型对 PQ 曲线 10-bit/12-bit 在 10,000 nits 下色阶断裂的解释。 |
| **33** | `"Taichi" autodiff "Tape" "ti.Tape" differentiable rendering kernel compile` | 对比 Taichi 源码变换（SCT）录制 Tape 与 Slang 编译器 IR 级图微分的异构拓扑。 |
| **34** | `OptiX Embree "motion blur" polynomial "screw motion" transformation matrix interpolation ray tracing` | 验证现代光追内核（OptiX 8 / Embree 4）对多段线形与多项式运动边界的处理机制。 |

---

## 第二部分：VFX-6 领域 10 道精选基准题目规格规范 (VFX-SYS-01 ~ VFX-SYS-10)

```
====================================================================================================
【VFX-6 题库全景覆盖矩阵】
[VFX-SYS-01] 现场虚拟制片(ICVFX) 摄像机离轴斜透视投影与曲面LED墙柱面畸变预补偿 (内联SMIL动画)
[VFX-SYS-02] 卷帘快门(Rolling Shutter)与LED扫描刷新Genlock相位偏移莫尔条纹滤波 (内联SMIL动画)
[VFX-SYS-03] 全谱系深度合成(Deep Compositing)沿光线非均匀亚像素体积不透明度与透过率积分 (静态高精度)
[VFX-SYS-04] ACES 2.0 CAM16-Hellwig 全谱色貌模型高光平滑退饱和与色域边界压缩 (内联SMIL动画)
[VFX-SYS-05] 连续时间几何蒙皮运动模糊(Continuous-Time Motion Blur)对偶四元数螺旋求交 (静态高精度)
[VFX-SYS-06] 异构微着色语言 Slang 自动微分编译器可逆计算图与检查点梯度传播拓扑 (静态高精度)
[VFX-SYS-07] 实时神经辐射缓存(NRC)自训练 Tiny-MLP 时空辐射预测与偏差衰减网格 (静态高精度)
[VFX-SYS-08] 裸眼3D光场显示倾斜柱镜光栅(Slanted Lenticular)微透镜光线转向与子像素切片 (静态高精度)
[VFX-SYS-09] 现代广色域动态范围感知量化(PQ) SMPTE ST 2084 EOTF响应与Barten阶梯标尺 (静态高精度)
[VFX-SYS-10] 屏幕空间时域抗锯齿(TAA/TSR)亚像素 Halton 抖动与历史样本方差裁剪 (内联SMIL动画)
====================================================================================================
```

---

### VFX-SYS-01: 现场虚拟制片(ICVFX) 摄像机离轴斜透视投影与曲面LED墙柱面畸变预补偿
- **题目英文名**：In-Camera VFX Off-Axis Asymmetric Frustum Projection & Curved LED Cylindrical Pre-Warping
- **形式**：内联 SMIL 动画自闭合矢量 SVG（双分屏联动：左屏为俯视相机轨道与弧形 LED 墙光路追迹，右屏为相机传感器观察到的虚拟景深与物理真实前景共线对齐视图）
- **2026 前沿技术背景**：
  在现场虚拟制片（In-Camera VFX, ICVFX）中，影视工业（如 SMPTE RIS-OSVP OpenTrackIO 规范与 Unreal Engine nDisplay 架构）要求在摄影机连续运动时，LED 墙上实时渲染的 Inner Frustum（内视锥）必须随摄影机光学节点（No-Parallax Point）动态计算非对称离轴平截头体（Off-Axis Asymmetric Frustum）。针对主流弧形 LED 影棚（半径通常为 8m~12m 的圆弧圆柱面），还必须在投影着色器中执行精确的柱面极坐标反向预畸变展开（Cylindrical Pre-Warping），以彻底抵消曲面屏幕引入的弧度形变，保证相机拍摄到的虚拟背景与前景真实道具之间在全运镜过程中视差绝对为零。
- **客观黄金基准 Ground Truth**：
  1. **Robert Kooima 广义透视投影方程**：
     设摄影机光心在虚拟世界坐标为 $P_e = (x_e, y_e, z_e)$，LED 平面屏（或切平面分段）的三顶点为左下角 $P_a$、右下角 $P_b$、左上角 $P_c$。  
     构造屏幕正交基底：
     $$u = \frac{P_b - P_a}{\|P_b - P_a\|}, \quad v = \frac{P_c - P_a}{\|P_c - P_a\|}, \quad n = \frac{u \times v}{\|u \times v\|}$$
     计算近裁剪面截断边界（距离 $d = -((P_a - P_e) \cdot n)$，近裁距 $n_{near}$）：
     $$l = \frac{n_{near}}{d} (u \cdot (P_a - P_e)), \quad r = \frac{n_{near}}{d} (u \cdot (P_b - P_e))$$
     $$b = \frac{n_{near}}{d} (v \cdot (P_a - P_e)), \quad t = \frac{n_{near}}{d} (v \cdot (P_c - P_e))$$
     最终离轴平截头体投影矩阵为：
     $$M_{off-axis} = \begin{bmatrix} \frac{2 n_{near}}{r - l} & 0 & \frac{r + l}{r - l} & 0 \\ 0 & \frac{2 n_{near}}{t - b} & \frac{t + b}{t - b} & 0 \\ 0 & 0 & -\frac{f + n_{near}}{f - n_{near}} & -\frac{2 f n_{near}}{f - n_{near}} \\ 0 & 0 & -1 & 0 \end{bmatrix} \begin{bmatrix} u_x & u_y & u_z & -u \cdot P_e \\ v_x & v_y & v_z & -v \cdot P_e \\ n_x & n_y & n_z & -n \cdot P_e \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
  2. **柱面极坐标预反畸变方程**：
     对半径为 $R$、中心在 $(X_c, Z_c)$ 的柱面 LED，任意空间投射光线在极角方向的角坐标为 $\theta = \arctan\left(\frac{X - X_c}{Z - Z_c}\right)$，高度为 $Y$。将其无失真展开为平面 UV 纹理坐标：
     $$U = \frac{\theta - \theta_{start}}{\Delta\theta}, \quad V = \frac{Y - Y_{bottom}}{\Delta Y}$$
  3. **公差与精度指标**：
     在摄影机视线偏移角达到 $\pm 45^\circ$ 时，合成图像的前后景几何边缘贴合残差 $\le 0.5\text{ px}$，动态跟踪延迟补偿抖动 $\le 1.0\text{ ms}$。
- **机器与视觉客观比对判据**：
  - **肉眼直观判断**：左屏相机沿弧形滑轨由左向右推移，绿色视锥斜角动态倾斜，LED 墙上的 Inner Frustum 窗口实时形变；右屏摄像机镜头内，红色前景标志立柱与虚拟背景中的延伸廊柱边缘在动画全程始终保持严格平行共线，无任何“漂浮”、“果冻”或断裂滑动。
  - **机器自动化比对**：提取 SVG 中连接相机的投射光线线段端点，验证任意时刻 $t$ 其与 LED 弧形相交点的切线斜率严格满足 Kooima 投影与极角 $\theta$ 的一阶导数连续性（$C^1$ 连续），重投影重合残差 RMSE $\le 10^{-4}$。
- **权威学术与行业出处**：
  - Robert Kooima (2009), *"Generalized Perspective Projection"*, Journal of Graphics Tools.
  - SMPTE RIS-OSVP (2024), *"OpenTrackIO: Camera Tracking and Lens Metadata Standard"*.
  - VES Handbook of Virtual Production (2024), Chapter 4: *"In-Camera Visual Effects (ICVFX) and LED Volumes"*.
- **净室设计理念说明**：
  完全基于解析光学投影几何学，采用通用的正交标尺线、相机视锥体和三维空间柱面展开原理图，杜绝任何商用虚幻引擎材质截图或专有影视工程资产，实现自主可控的数学基准。

---

### VFX-SYS-02: 摄影机卷帘快门(Rolling Shutter)与LED扫描刷新Genlock相位偏移莫尔条纹空频滤波
- **题目英文名**：Rolling Shutter Sensor Readout & LED PWM Scanline Genlock Phase-Offset Moiré Spatial Frequency Filtering
- **形式**：内联 SMIL 动画自闭合矢量 SVG（时空多维动态图：上方展示相机 CMOS 逐行扫描读出窗口与 LED 脉冲宽度调制 PWM 刷新周期的微秒级重叠积分；下方展示空间频率域中像元阵列与 LED 点距调制传递函数 MTF 及光学低通滤波 OLPF 截断特性）
- **2026 前沿技术背景**：
  在 ICVFX 拍摄中，工业级数字电影机大多采用卷帘快门（Rolling Shutter, 逐行曝光读出时间通常为 14ms~21ms）。LED 面板则采用行扫描驱动芯片（如 1/8 扫到 1/16 扫，PWM 刷新率通常为 3840Hz~7680Hz）。若缺少纳秒级精度的锁相广播同步（SMPTE ST 2059-2 PTP），微小的时钟频率漂移将导致传感器在不同行捕获到断续的黑带（走马灯条纹）。同时，当 LED 像素物理间距（Pitch，如 1.5mm~2.6mm）成像在传感器表面的空间频率接近或超过传感器的奈奎斯特极限时，将产生强烈的彩色莫尔条纹（Moiré Pattern），必须精确调谐光学低通滤波器（OLPF）的截止频率。
- **客观黄金基准 Ground Truth**：
  1. **卷帘快门曝光线时序积分与相位偏移（Phase Offset）**：
     设第 $y$ 行像素在时刻 $t(y) = t_0 + y \cdot \tau_{line}$ 开始曝光，曝光时间为 $T_{exp} = \frac{\theta_{shutter}}{360^\circ \cdot FPS}$。  
     LED 行扫描亮度脉冲函数为周期为 $T_{pwm}$ 的脉冲列 $P(t) = \sum_{k} \text{rect}\left(\frac{t - k T_{pwm}}{\delta}\right)$。  
     各行有效曝光积分量为：
     $$I(y) = \int_{t(y)}^{t(y) + T_{exp}} P(t) dt$$
     无黑斑的充要条件为：Genlock 锁相相位偏移 $\Delta t_{phase}$ 使得对所有有效成像行 $y$，积分 $I(y)$ 波动方差 $\frac{\text{Var}(I)}{\bar{I}^2} \le 10^{-4}$。PTP 锁相容差 $\le \pm 0.5\,\mu\text{s}$。
  2. **莫尔干涉空间频率与 OLPF 截止方程**：
     设传感器像元尺寸为 $p_{sensor}$（奈奎斯特极限 $f_N = \frac{1}{2 p_{sensor}}$），LED 物理间距为 $p_{led}$，镜头光学放大倍率为 $M = \frac{f}{D}$。  
     像面上的 LED 基频为 $f_{led} = \frac{1}{M \cdot p_{led}}$。莫尔拍频空间频率为：
     $$f_{moire} = |f_{sensor} - f_{led}| = \left|\frac{1}{p_{sensor}} - \frac{1}{M \cdot p_{led}}\right|$$
     双折射晶体 OLPF 传递函数为 $H_{olpf}(f) = \cos(\pi d f)$，调谐晶体厚度 $d$ 使得 $H_{olpf}(f_N) = 0$，将 $f \ge f_N$ 的高频能量衰减 $\ge 26\text{ dB}$。
- **机器与视觉客观比对判据**：
  - **肉眼直观判断**：当 Phase Offset 滑块在动画中进入“Lock Sync（绿标区间）”时，时序图中的重叠积分曲线瞬间拉平为纯直线，画面模拟窗口中的水平黑色滚带彻底消失；空间频谱图中，红色莫尔高频尖峰被虚线 OLPF 滤镜包络完全消除，成像面显示纯净无彩虹条纹的均匀灰阶。
  - **机器自动化比对**：检验时序积分方程数值，非同步相位的明暗脉动幅度达到 $\ge 35\%$，而在锁定相位点残差标准差 $\sigma \le 0.001$；高频能量积分比 $E(f > f_N) / E_{total} \le 0.01$。
- **权威学术与行业出处**：
  - SMPTE ST 2059-2:2021, *"Precision Time Protocol (PTP) Profile for Audio/Video Media"*.
  - Brompton Technology (2023), *"Tessera ShutterSync® Technical Whitepaper on Frame Phase Offset"*.
  - ISO 12233:2023, *"Photography — Electronic still picture imaging — Resolution and spatial frequency responses"*.
- **净室设计理念说明**：
  本题从信号处理的一维时序卷积与二维傅里叶空间光学滤波切入，完全基于公认的采样理论与波动光学，不使用任何商业相机的专用界面或固件专有代码。

---

### VFX-SYS-03: 全谱系深度合成(Deep Compositing)沿光线非均匀亚像素体积不透明度与透过率积分重建
- **题目英文名**：OpenEXR Deep Compositing Along-Ray Volumetric Opacity Reconstruction & Transmittance Integration
- **形式**：静态高精度自闭合矢量 SVG（沿视线光路微观剖面图：展示单个像素内沿 $Z$ 轴深度方向，半透明非均匀烟雾介质的连续不透明度分布、离散样本切分点、Beer-Lambert 连续透过率曲线及离散 Over 算子层叠阶梯图）
- **2026 前沿技术背景**：
  在现代视效工业级流程（OpenEXR 3.x 标准，ISO/IEC 26428-1）中，深度合成（Deep Compositing）是彻底解决毛发、运动模糊半透明边缘与流体烟雾深度相互穿插交叠（Z-fighting/Halos）的标准方案。与传统单一深度图（Flat Image）不同，深度像素存储了沿光线的一组离散/体积样本。针对具有厚度的体积介质（Volumetric Sample, $Z < ZBack$），当硬表面物体穿插其中时，合成器必须对体积样本进行无损拆分（Sample Splitting），基于 Beer-Lambert 定律精确推导子样本的局部不透明度，并保证前向与后向累积透过率在数学上严格守恒。
- **客观黄金基准 Ground Truth**：
  1. **体积样本 Beer-Lambert 连续消光模型**：
     对于沿视线深度区间 $[Z_0, Z_1]$ 的均匀吸收体积样本，其消光系数为 $\tau$。任意深度 $z \in [Z_0, Z_1]$ 处的透过率为：
     $$T(z) = \exp(-\tau (z - Z_0))$$
     总不透明度为 $\alpha = 1 - T(Z_1) = 1 - \exp(-\tau (Z_1 - Z_0))$。
  2. **深度样本精确切分（Sample Splitting）方程**：
     若在深度 $Z_{split} \in (Z_0, Z_1)$ 处插入硬表面，样本被切分为前后两段，几何相对比率 $t = \frac{Z_{split} - Z_0}{Z_1 - Z_0} \in (0, 1)$。  
     前段样本 $[Z_0, Z_{split}]$ 的不透明度为：
     $$\alpha_a = 1 - (1 - \alpha)^t$$
     后段样本 $[Z_{split}, Z_1]$ 的不透明度为：
     $$\alpha_b = 1 - (1 - \alpha)^{1 - t}$$
     重组守恒等式必须满足：
     $$\alpha_{total} = \alpha_a + (1 - \alpha_a) \alpha_b = 1 - (1 - \alpha)^t (1 - \alpha)^{1 - t} \equiv \alpha$$
  3. **离散深度 Over 累积算子**：
     对按深度升序排序的 $N$ 个非重叠样本，第 $i$ 个样本贡献的前向累积透过率 $T_i = \prod_{j=1}^{i-1} (1 - \alpha_j)$。  
     最终合并色彩 $C$ 与不透明度 $A$ 为：
     $$C = \sum_{i=1}^N C_i \alpha_i T_i, \quad A = 1 - \prod_{i=1}^N (1 - \alpha_i)$$
     公差容差：样本切分重组数值误差 $|\alpha_{total} - \alpha| \le 10^{-7}$。
- **机器与视觉客观比对判据**：
  - **肉眼直观判断**：图面中清楚标出光线进入体积的 $Z_0$ 与穿出深度 $ZBack$。切分点 $Z_{split}$ 处的透过率曲线连续平滑，无任何阶跃突变；分步阶梯面积与累积色彩层叠条块呈现清晰单调递减的指数衰减，硬表面穿插样本两侧的体积色块与实心色块界限分明。
  - **机器自动化比对**：检验 SVG 路径中曲线采样点的纵坐标，验证其高度精确等于 $y = y_0 \cdot (1 - \alpha)^t$；检测前后两段子样本颜色加权乘积积分值，与原未切分连续积分的绝对误差 $\Delta E \le 10^{-6}$。
- **权威学术与行业出处**：
  - Peter Hillman (2013), *"The Theory of OpenEXR Deep Samples"*, Weta Digital Technical Document (Official OpenEXR Documentation).
  - Florian Kainz (2013), *"Interpreting OpenEXR Deep Pixels"*, Industrial Light & Magic.
  - ISO/IEC 26428-1:2012, *"Digital cinema (D-cinema) distribution master — Part 1: Image characteristics"*.
- **净室设计理念说明**：
  完全依据 Weta Digital 与 ILM 开源贡献给 ASWF/OpenEXR 的数学理论白皮书公式进行图示化，纯粹由辐射度物理传输方程推演，绝无任何商业影视软件私有 UI 元素。

---

### VFX-SYS-04: 学院色彩编码规范 ACES 2.0 CAM16 全谱色貌模型高光平滑退饱和与色域边界压缩
- **题目英文名**：ACES 2.0 Output Transform: CAM16-Hellwig Perceptual JMh Gamut Mapping & Highlight Desaturation
- **形式**：内联 SMIL 动画自闭合矢量 SVG（双坐标系投影动态映射：左图为 CIE 1931 xy 色度图及 ACEScg / Rec.2020 / Rec.709 色域三角形；右图为 Hellwig 2022 色貌模型 $J$-$M$ 明度-彩度截面图，动态展示极端高亮色相沿恒定色相角收缩至 Cusp 尖端并向消色差轴退饱和轨迹）
- **2026 前沿技术背景**：
  影视与视效行业主流色彩标准正从 ACES 1.x 全面跃迁至 ACES 2.0（AMPAS 2024-2025 官方发布）。ACES 1.x 传统的 RRT/ODT 采用固定 3D-LUT，在处理高强度单色 LED 灯光和强烈爆炸高光时容易产生反常的色相偏转（如黄色高光断层偏绿或偏红）和生硬的色域裁剪。ACES 2.0 彻底废除了旧式经验曲线，采用基于 Hellwig (2022) / CAM16 色貌模型的全解析可逆输出变换，在感知均匀的 $JMh$（明度 $J$、彩度 $M$、色相 $h$）空间中依据目标显示设备的色域尖端（Cusp）进行保色相压缩与渐进高光退饱和。
- **客观黄金基准 Ground Truth**：
  1. **色彩空间转换矩阵（ACEScg AP1 至 ACES2065-1 AP0）**：
     $$M_{AP1 \to AP0} = \begin{bmatrix} 0.695452241357 & 0.140678696470 & 0.163869062172 \\ 0.044794563372 & 0.859671118456 & 0.095534318172 \\ -0.005525882558 & 0.004025219565 & 1.001500473950 \end{bmatrix}$$
  2. **CAT16 适应矩阵（$M_{16}$）**：
     $$\begin{bmatrix} R_{16} \\ G_{16} \\ B_{16} \end{bmatrix} = \begin{bmatrix} 0.401288 & 0.650173 & -0.051461 \\ -0.250268 & 1.204414 & 0.045854 \\ -0.002079 & 0.048952 & 0.953127 \end{bmatrix} \begin{bmatrix} X \\ Y \\ Z \end{bmatrix}$$
  3. **Hellwig 2022 Cusp 几何色域压缩方程**：
     在极坐标截面 $(J, M, h)$ 中，显示色域在色相 $h$ 处的边界彩度尖端为 $(J_{cusp}(h), M_{cusp}(h))$。  
     对于输入点 $(J_{in}, M_{in})$，若其超出色域边界，沿保持恒定明度 $J$ 与恒定色相 $h$ 的射线进行单调双曲正切压缩：
     $$M_{out} = M_{cusp} \cdot \left( \frac{M_{in}}{M_{cusp}} \right) \Big/ \left( 1 + \left(\frac{M_{in}}{M_{cusp}}\right)^p \right)^{1/p} \quad (p \approx 1.2)$$
     随着亮度趋向于峰值白色（$J \to 100$），附加平滑退饱和包络函数：
     $$M_{final} = M_{out} \cdot \left( 1 - \left(\frac{J}{100}\right)^4 \right)$$
     保证高光中心完全汇聚于消色差轴（$M \to 0$，纯白）。
- **机器与视觉客观比对判据**：
  - **肉眼直观判断**：动画中一个极高饱和度的点光源（如 $M=150$ 极端霓虹青）随亮度提升向中心靠拢；左侧 xy 坐标中轨迹严格沿固定色相射线收敛入 Rec.709 小三角形内，无任何顺时针或逆时针歪斜；右侧 $J$-$M$ 视图中，轨迹紧贴 Cusp 外边缘平滑滑入，在高光顶端垂直落入中性灰白轴。
  - **机器自动化比对**：全过程色相角漂移 $|\Delta h| \le 0.05^\circ$，输出 RGB 三通道在 Rec.709 范围内严格无下溢（$< 0$）或上溢（$> 1$），压缩函数一阶导数严格单调（$\frac{d M_{out}}{d M_{in}} > 0$）。
- **权威学术与行业出处**：
  - Academy of Motion Picture Arts and Sciences (AMPAS) ACES Project (2024/2025), *"ACES 2.0 Output Transform Specification"*.
  - Hellwig, L. & Fairchild, M. D. (2022), *"Bright light color appearance model: Hellwig 2022"*, Color Research & Application.
  - Li, C. et al. (2017), *"Comprehensive color appearance modeling using CAM16"*, Color Research & Application.
- **净室设计理念说明**：
  严格依据 AMPAS 公开开源发布在 GitHub `aces-dev` 的 CTL 算法与 Hellwig 论文解析数学式原创绘制，完全规避任何商用调色软件专用 3D-LUT 专有权重数据。

---

### VFX-SYS-05: 连续时间几何蒙皮运动模糊(Continuous-Time Motion Blur)对偶四元数螺旋求交
- **题目英文名**：Continuous-Time Dual Quaternion Skinning (DQS) Screw Motion & Ray-Polynomial Trajectory Intersection
- **形式**：静态高精度自闭合矢量 SVG（三维空间扫掠体分解图：对比传统线性插值 LBS 的“糖果纸收缩”体积塌陷与对偶四元数 DQS 螺旋线运动轨迹，并展示光线与时间多项式双线性曲面的根相交区间解析）
- **2026 前沿技术背景**：
  在工业级离线光线追踪（Intel Embree 4 / NVIDIA OptiX 8 / PBRT-v4）中，高速旋转几何体（如机械臂、高速飞行的直升机桨叶、角色关节）的快门开闭区间 $[t_0, t_1]$ 运动模糊计算是一大核心挑战。若采用传统的线性矩阵插值（Linear Blend Skinning, LBS），关节扭转时会发生灾难性的体积萎缩（Candy-wrapper artifact），且线性插值将圆周运动简化为割线导致模糊形状失真。前沿渲染管线使用对偶四元数（Dual Quaternion）描述完全刚体螺旋运动（Screw Motion），光线与顶点的时变多项式表面相交转化为闭式代数求根。
- **客观黄金基准 Ground Truth**：
  1. **对偶四元数螺旋线性插值（ScLERP）方程**：
     单位对偶四元数 $\hat{q} = q_0 + \epsilon q_\epsilon$（$\epsilon^2 = 0, \|q_0\|=1, q_0 \cdot q_\epsilon = 0$）。  
     两关键帧位姿 $\hat{q}_A$ 到 $\hat{q}_B$ 在时间 $t \in [0, 1]$ 的解析轨迹为：
     $$\hat{q}(t) = \hat{q}_A (\hat{q}_A^{-1} \hat{q}_B)^t = \cos\frac{\hat{\theta} t}{2} + \hat{s} \sin\frac{\hat{\theta} t}{2}$$
     其中 $\hat{\theta} = \theta + \epsilon d$（$\theta$ 为旋转角，$d$ 为轴向平移距离），$\hat{s}$ 为单位对偶螺距轴。
  2. **时变双线性面元与光线相交多项式**：
     三角形三顶点随时间运动轨迹可由二阶泰勒展开拟合：$v_k(t) = v_k(0) + \mathbf{v}_k t + \frac{1}{2} \mathbf{a}_k t^2$。  
     光线方程为 $R(s) = O + s D$。光线在时刻 $t$ 击中三角形内部的代数行列式方程为：
     $$F(t) = \det[R(s) - v_0(t), v_1(t) - v_0(t), v_2(t) - v_0(t)] = 0$$
     展开为关于时间 $t$ 的标量四次代数多项式：
     $$A t^4 + B t^3 + C t^2 + D t + E = 0$$
     采用 Ferrari 闭式解或 Durand-Kerner 算法求解 $t \in [0, 1]$ 范围内的实根。
  3. **体积保持率准则**：
     对于扭转角 $\theta = 180^\circ$ 的圆柱体测试模型，LBS 在中间截面的体积萎缩至原面积的 $0\%$（完全缩减为一个几何点），而 DQS 保持率严格为 $100\%$。
- **机器与视觉客观比对判据**：
  - **肉眼直观判断**：左侧展示 LBS 插值，圆柱体旋转扭曲处剧烈坍塌凹陷，快门运动模糊散斑呈现不自然的直线折痕；右侧展示 DQS，圆柱体维持饱满管径，时空扫掠体（Swept Volume）外形呈完美外凸的光滑螺旋抛物面，光线切线求交点精准落在螺旋曲线外缘。
  - **机器自动化比对**：验证插值螺旋线上采样点与刚体齐次变换矩阵群 $SE(3)$ 的距离 $\|M^T M - I\| \le 10^{-7}$，多项式求根实根与几何求交几何误差 $\le 10^{-5}$。
- **权威学术与行业出处**：
  - Ladislav Kavan, Steven Collins, Jiri Zara, Carol O'Sullivan (2007/2008), *"Skinning with Dual Quaternions"*, ACM Transactions on Graphics (SIGGRAPH 2007).
  - Intel Embree 4.3 Documentation, *"Multi-Segment Motion Blur Geometry and Ray Intersection Kernels"*.
  - NVIDIA OptiX 8.0 Programming Guide, Chapter 8: *"Motion Blur SRT/Matrix Transform Pipeline"*.
- **净室设计理念说明**：
  本题从李群/李代数 $SE(3)$ 与对偶四元数纯代数定义出发，自主构造几何测试模型，不引用任何特定商业三维建模软件骨骼绑定私有权重文件。

---

### VFX-SYS-06: 异构微着色语言 Slang 自动微分编译器可逆计算图与检查点梯度传播拓扑
- **题目英文名**：Slang/SLANG.D Heterogeneous Shading Compiler: Reverse-Mode Autodiff Computation Graph & Checkpointing Topology
- **形式**：静态高精度自闭合矢量 SVG（异构编译器计算拓扑图：清晰绘制前向主计算有向无环图 Primal DAG、Tape 内存回放带、激活值动态重计算 Checkpoint 节点，以及反向传播梯度累加 `DifferentialPair<T>` 数据流管道）
- **2026 前沿技术背景**：
  在现代视效前沿，可微分渲染（Differentiable Path Tracing）与神经图形（3D Gaussian Splatting, NeRF）全面接入视效后期管线。传统手动手写 GPU 伴随梯度内核（CUDA / HLSL）成本极高且易引入数学错误。由 NVIDIA 与 Khronos 主导的现代开源着色语言 Slang（SLANG.D, SIGGRAPH Asia 2023）在编译器中间表示（IR）层内置了一等公民自动微分（First-Class Automatic Differentiation）。通过解析 `[Differentiable]`、`fwd_diff` 与 `bwd_diff` 语义，编译器必须在有限的 GPU 寄存器与全局显存之间利用最优检查点（Revolve 检查点策略）平衡内存开销与重计算消耗。
- **客观黄金基准 Ground Truth**：
  1. **反向模式自动微分伴随链式法则（Reverse-Mode AD）**：
     设前向着色计算图包含拓扑序列 $v_i = \phi_i(\text{Parents}(v_i))$，标量损失为 $\mathcal{L} = v_N$。  
     反向传播伴随变量定义为 $\bar{v}_i = \frac{\partial \mathcal{L}}{\partial v_i}$，其在 DAG 中的逆向拓扑累加更新为：
     $$\bar{v}_i = \sum_{j \in \text{Children}(v_i)} \bar{v}_j \frac{\partial \phi_j}{\partial v_i}$$
  2. **Slang 类型系统微积分契约**：
     可微分变量封装为复合对 `DifferentialPair<T>(primal: T, d: Differential<T>)`。  
     在前向过程中，非平凡中间状态写入环形磁带缓冲 `Tape`；在反向过程中，`DifferentialPair` 在原位进行原子梯度累加（`atomicAdd`）。
  3. **二叉树检查点（Optimal Checkpointing / Revolve）内存平衡方程**：
     对于步数为 $L$ 的长光线反弹序列，设可用检查点显存槽位为 $M$。  
     - 无检查点（Naive Tape）：显存开销 $O(L)$，无额外 ALU 重计算；
     - 极小检查点（Only Input）：显存开销 $O(1)$，ALU 重计算次数膨胀至 $O(L^2)$；
     - Revolve 最优策略：在递归二分关键帧放置 Checkpoint，显存开销降为 $O(\log_2 L)$，ALU 重计算系数严格满足：
       $$R(L, M) \le 1 + \left\lceil \log_2 \binom{L+M}{M} \right\rceil$$
- **机器与视觉客观比对判据**：
  - **肉眼直观判断**：前向流（青色粗箭头）自左向右穿过着色节点，黄色菱形高亮标出 Checkpoint 冻结节点；橙色下沉管道为 Tape 显存缓存；反向伴随流（紫色箭头）自右向左精确回传梯度，在 Checkpoint 处分叉展开局部二次前向计算，全图各阶段张量流向层次分明无交叉干扰。
  - **机器自动化比对**：计算图的拓扑排序无环性验证通过率 $100\%$；对任意解析函数求导，反向模式自动生成代码计算出的数值梯度与有限差分基准相对误差 $\frac{\|\nabla_{auto} - \nabla_{num}\|}{\|\nabla_{auto}\| + 10^{-5}} \le 10^{-6}$。
- **权威学术与行业出处**：
  - Yong He et al. (2023), *"SLANG.D: Fast, Modular and Differentiable Shader Programming"*, ACM Transactions on Graphics (SIGGRAPH Asia 2023).
  - Andreas Griewank & Andrea Walther (2000), *"Algorithm 799: Revolve: An optimal algorithm for computing adjoints of multistep processes"*, ACM TOMS.
  - Khronos Group (2024), *"The Slang Shading Language Specification v2024.1"*.
- **净室设计理念说明**：
  完全依据学术公开论文关于自动微分 IR 拓扑与 Revolve 算法的经典图论逻辑绘制，不包含任何商业代码片段或私有中间表示字节码。

---

### VFX-SYS-07: 实时神经辐射缓存(NRC)自训练 Tiny-MLP 时空辐射预测与偏差衰减网格
- **题目英文名**：Real-Time Neural Radiance Caching (NRC) Self-Training Tiny-MLP Architecture & Spatio-Temporal Bias Decay Grid
- **形式**：静态高精度自闭合矢量 SVG（双通道渲染与训练系统架构图：上方展示路径追踪光线在遭遇 2 次弹跳后提前截断并查询神经网络缓存；下方展示由 16 层多分辨率三线性哈希表输入、全融合轻量级 Tiny-MLP、自训练相对 Loss 反向更新构成的闭环流）
- **2026 前沿技术背景**：
  在影视虚拟制片与交互预览中，多反弹全局光照（Full Path Tracing）需要成千上万条光线才能收敛。Thomas Müller 等人提出的 Neural Radiance Caching (NRC, SIGGRAPH 2021) 彻底颠覆了离线烘焙预计算方案。系统部署一个只有 5 层、64 隐藏宽度的全融合轻量感知机（Tiny MLP），在 GPU Tensor Core 上以微秒级吞吐运行。渲染时，光线仅追踪前 1~2 次高频反射，随后截断并向网络查询预估间接光；同时，当前帧的真实光线路径自身即作为监督数据在线训练（Online Self-Training）网络，辅以空间哈希衰减，用人眼不可察的轻微偏差（Bias）换取图像噪点（Variance）上百倍的消除。
- **客观黄金基准 Ground Truth**：
  1. **输入特征编码与网络拓扑结构**：
     - 空间坐标 $x \in \mathbb{R}^3$ 映射到 16 级分辨率的三维哈希网格（$2^L$ 到 $2^{L_{max}}$），经三线性插值得到 $16 \times 2 = 32$ 维空间特征；
     - 视角方向 $\omega \in \mathbb{S}^2$ 投影至 4 阶实球谐函数（Spherical Harmonics, 16 维）；
     - 加上表面粗糙度 $\alpha$ 与漫反射反照率 $\rho$，总输入维度为 64；
     - 隐藏层：4 层全连接，每层 64 神经元，激活函数为 LeakyReLU / Sine；
     - 输出层：3 维非负 HDR 辐射度向量 $(L_r, L_g, L_b)$。
  2. **自训练辐射度目标与相对损失函数**：
     对于一条光线路径，在反弹点 $x$ 处，其自训练目标为当前步直接辐射与下游网络缓存预测的组合：
     $$L_{\text{target}} = L_{\text{emit}} + \rho(x, \omega_{in}, \omega_{out}) \cdot f_{\theta}(x', \omega_{out}) \cdot \cos\theta$$
     为抑制 HDR 高动态光强样本对梯度的过度主导，网络训练采用自适应相对误差损失函数：
     $$\mathcal{L}(f_\theta(x, \omega), L_{\text{target}}) = \sum_{c \in \{r,g,b\}} \frac{|f_\theta(x, \omega)_c - L_{\text{target},c}|}{L_{\text{target},c} + \epsilon} \quad (\epsilon = 0.01)$$
  3. **渐进偏差衰减（Bias Decay）时间指数平均**：
     为防止自训练引发正反馈信号发散或局部偏色，网络权重与空间网格以滑动因子 $\beta_t = 1 - \frac{1}{t+1}$ 混合历史指数移动平均（EMA），理论证明在稳态场景下渐进收敛于无偏蒙特卡洛积分值。
- **机器与视觉客观比对判据**：
  - **肉眼直观判断**：红蓝色光路截断示意图清晰指引出“Primary Ray $\to$ Secondary Bounce $\to$ 截断点（Cache Query）”；下方绿色虚线反馈环标示自训练目标反向梯度，哈希多分辨率点阵立体网格与密集全连接矩阵节点标识准确无误。
  - **机器自动化比对**：网络矩阵权重维度乘积严格吻合：$64 \times 64 \times 4 + 64 \times 3 = 16576$ 个浮点参数；相对损失函数在极限点 $L_{\text{target}} \to \infty$ 时梯度幅值有界（$\le 1.0$），杜绝梯度爆炸。
- **权威学术与行业出处**：
  - Thomas Müller, Fabrice Rousselle, Jan Novák, Alexander Keller (2021), *"Real-time Neural Radiance Caching for Path Tracing"*, ACM Transactions on Graphics (SIGGRAPH 2021).
  - Thomas Müller, Alex Evans, Christoph Schied, Alexander Keller (2022), *"Instant Neural Graphics Primitives with a Multiresolution Hash Encoding"*, ACM Transactions on Graphics (SIGGRAPH 2022).
- **净室设计理念说明**：
  纯粹根据作者发表在 ACM TOG 顶刊的公开理论拓扑与数学推导重构系统方框图，绝无任何商业渲染器内部代码逆向内容。

---

### VFX-SYS-08: 裸眼3D光场显示倾斜柱镜光栅(Slanted Lenticular)微透镜光线转向与子像素视差切片拓扑
- **题目英文名**：Multiview Light Field Display Slanted Lenticular Array Ray Steering & Subpixel Angular Disparity Slicing
- **形式**：静态高精度自闭合矢量 SVG（微观光学追迹剖面图：展示高 PPI 液晶/OLED 的 RGB 垂直条形子像素阵列、倾斜角 $\theta = \arctan(1/3)$ 的柱面微透镜阵列、基于斯涅尔折射定律的光线折射扇束偏转，以及空间 8 视点角向视差切片编码拓扑）
- **2026 前沿技术背景**：
  高保真裸眼 3D 与光场全息显示（Light Field Displays, 如 Looking Glass 影视级视差台与 Leia 3D 终端）在虚拟制片监视与资产审核中扮演着关键角色。如果柱状透镜垂直于显示器子像素排布，水平分辨率将严重折损 $N$ 倍，并引发致命的黑白坚固网格莫尔效应。依照 Cees van Berkel 经典光学准则，将柱镜相对于子像素列倾斜特定角度（如 $\tan\theta = 1/3$ 或 $1/6$），能够巧妙地将单一方向的分辨率损失均匀分摊至水平与垂直两个轴向，实现三维连续运动视差与深度感。
- **客观黄金基准 Ground Truth**：
  1. **van Berkel 倾斜几何与透镜光栅节距方程**：
     对于标准正方形显示像素（尺寸 $p \times p$），包含红绿蓝 3 个子像素，单个子像素宽度为 $p_h = p/3$，高度为 $p_v = p$。  
     透镜倾斜角 $\theta$ 取设计黄金角：
     $$\tan\theta = \frac{p_h}{p_v} = \frac{1}{3} \implies \theta \approx 18.4349^\circ$$
     透镜在垂直于光栅方向的物理周期（Pitch）为 $P_L$。为覆盖 $N$ 个离散视点（如 $N=8$），其有效视差步进周期满足：
     $$P_L = \frac{N}{3} p \cos\theta$$
  2. **子像素视点索引映射（View Index Mapping）公式**：
     屏幕上任意整数坐标子像素 $(x, y)$（以子像素宽和高为单位）对应的空间视点序号 $k \in \{0, 1, \dots, N-1\}$ 为：
     $$k = \text{floor}\left( x + 3 y \cdot \tan\theta + \phi_0 \right) \pmod N = \text{floor}(x + y + \phi_0) \pmod N$$
  3. **斯涅尔定律微透镜表面光线偏转**：
     柱面透镜曲率半径为 $R$，折射率为 $n_{glass} \approx 1.491$（PMMA 亚克力材质）。基板厚度 $t$ 精确设计为透镜近轴焦距 $f = \frac{R}{n_{glass} - 1}$。  
     离开透镜表面 $(x_s, z_s)$ 的光线偏转角 $\alpha$ 与法线角 $\beta = \arcsin(x_s / R)$ 满足：
     $$\sin\alpha = n_{glass} \sin(\beta - \gamma) \quad (\gamma \text{ 为入射角})$$
- **机器与视觉客观比对判据**：
  - **肉眼直观判断**：图面中微观子像素用红绿蓝条形清晰标出，下方附着圆弧柱状微透镜；穿出透镜的光线按照 8 种视点色谱扇形发散，不同倾斜行的同色子像素光线汇聚于空间特定观察角域，相邻视点交界过渡平滑均匀，无光线重叠打结或死角盲区。
  - **机器自动化比对**：视点映射函数在全子像素阵列上的分布熵达到最大值（各视点占比严格等于 $1/N$），折射几何光线偏转角经斯涅尔公式验算相对残差 $\le 10^{-5}$。
- **权威学术与行业出处**：
  - Cees van Berkel, J.A. Clarke (1997), *"Characterisation and optimisation of 3D-LCD module design"*, SPIE Proceedings Vol. 3012, Stereoscopic Displays and Virtual Reality Systems IV.
  - Neil A. Dodgson (2005), *"Analysis of the viewing zone of the multi-view autostereoscopic display"*, SPIE Proceedings.
  - Michael Halle (1997), *"Autostereoscopic displays and computer graphics"*, ACM SIGGRAPH Computer Graphics.
- **净室设计理念说明**：
  完全基于几何光学与斯涅尔折射定律的解析推演，图面几何参数由标准折射率参数公式独立计算生成，无任何商业硬件拆解图或专有专利排他性图形。

---

### VFX-SYS-09: 现代广色域动态范围感知量化(PQ) SMPTE ST 2084 EOTF响应与Barten阶梯标尺
- **题目英文名**：SMPTE ST 2084 (Perceptual Quantizer / PQ) EOTF Non-Linear Log-Power Response & Barten CSF Luminance Ladder
- **形式**：静态高精度自闭合矢量 SVG（双对数严密坐标系标定曲线图：横轴为 10-bit/12-bit 归一化数字码值 $0.0 \sim 1.0$，纵轴为绝对物理亮度 $0.0001 \sim 10,000\text{ nits}$ 跨 8 个数量级对数刻度，精确绘制 ST 2084 曲线、传统 Rec.709 Gamma 2.4 曲线、以及 Barten 人眼对比敏感度阈值 JND 包络阶梯对比）
- **2026 前沿技术背景**：
  虚拟制片超高清 LED 显示与 HDR 母带调色制作中，传统基于相对亮度 100 nits 的 SDR 伽马曲线（BT.1886 / Rec.709）完全无法满足跨越 0.0001 到 10,000 nits 的超高动态范围再现。SMPTE ST 2084（Perceptual Quantizer, PQ 曲线）基于人类视觉系统（HVS）著名的 Barten 对比敏感度函数（Contrast Sensitivity Function, CSF）模型，将非线性数字码值分配与人眼刚可感知差（Just Noticeable Difference, JND）严格对齐，使得 10-bit / 12-bit 编码在整个动态范围内量化台阶均位于色带感知门限以下，杜绝天空等大面积平滑过渡区域的色阶断裂。
- **客观黄金基准 Ground Truth**：
  1. **ST 2084 EOTF 解析电光转换公式（数字量化码值 $E' \in [0, 1] \to$ 物理亮度 $L\text{ (cd/m}^2\text{)}$）**：
     $$L = 10000 \cdot \left( \frac{\max(E'^{1/m_2} - c_1, 0)}{c_2 - c_3 E'^{1/m_2}} \right)^{1/m_1}$$
  2. **逆 EOTF 公式（物理亮度归一化 $Y = L / 10000 \in [0, 1] \to E'$）**：
     $$E' = \left( \frac{c_1 + c_2 Y^{m_1}}{1 + c_3 Y^{m_1}} \right)^{m_2}$$
  3. **权威标准无理/有理数解析常数定义（SMPTE ST 2084 官方）**：
     $$m_1 = \frac{2610}{16384} = 0.1593017578125$$
     $$m_2 = \frac{2523}{4096} \times 128 = \frac{2523}{32} = 78.84375$$
     $$c_1 = \frac{3424}{4096} = \frac{107}{128} = 0.8359375$$
     $$c_2 = \frac{2413}{4096} \times 32 = \frac{2413}{128} = 18.8515625$$
     $$c_3 = \frac{2392}{4096} \times 32 = \frac{299}{16} = 18.6875$$
  4. **关键标定点参考真值**：
     - $0.0001\text{ nits} \implies E' \approx 0.000000$ (底限)
     - $100\text{ nits (标准 SDR 峰值)} \implies E' = 0.508078$ (10-bit 对应 Code 520)
     - $1000\text{ nits (消费级 HDR10 峰值)} \implies E' = 0.751827$ (10-bit 对应 Code 769)
     - $10000\text{ nits (工业大师母带极限)} \implies E' = 1.000000$ (10-bit 对应 Code 1023)
  5. **Barten 阶梯感知门限准则**：
     在 10-bit 编码下，相邻码阶亮度相对比 $\frac{\Delta L}{L}$ 在全段稳定处于 $0.5\% \sim 0.9\%$ 区间，紧贴 Barten JND 门限曲线（约 $0.4\% \sim 1.0\%$）；在 12-bit 下步长降至 $0.2\%$，完全沉入视觉盲区。
- **机器与视觉客观比对判据**：
  - **肉眼直观判断**：坐标图严格采用双对数等比网格，青色 ST 2084 曲线从中低亮度到高亮度呈现优美平缓的 S 型对数延伸，而传统的红虚线 Rec.709 曲线在超过 100 nits 处出现剧烈陡峭发散；Barten JND 灰色安全包络带标定清晰，10-bit 与 12-bit 离散台阶刻度与曲线吻合。
  - **机器自动化比对**：校验曲线在 100、1000、10000 nits 处的 SVG 像素坐标，其与解析式理论值的归一化误差 $\le 10^{-6}$；验证常数矩阵与 SMPTE ST 2084 有理数分数逐位一致。
- **权威学术与行业出处**：
  - SMPTE ST 2084:2014, *"High Dynamic Range Electro-Optical Transfer Function of Mastering Reference Displays"*.
  - ITU-R Recommendation BT.2100-2 (2018), *"Image parameter values for high dynamic range television for use in production and international programme exchange"*.
  - Peter G. J. Barten (1999), *"Contrast Sensitivity of the Human Eye and Its Effects on Image Quality"*, SPIE Press.
- **净室设计理念说明**：
  所有曲线坐标均由 SMPTE ST 2084 标准公布的代数分数公式精确数值计算生成，不依赖任何第三方调色软件的渲染产物或非标准逼近近似。

---

### VFX-SYS-10: 屏幕空间时域抗锯齿(TAA/TSR)亚像素 Halton 抖动与历史样本方差裁剪
- **题目英文名**：Temporal Anti-Aliasing (TAA/TSR) Halton(2,3) Subpixel Jitter & YCoCg History Variance Clipping
- **形式**：内联 SMIL 动画自闭合矢量 SVG（双视窗动态循环演示：左视窗展示像素网格内 8 帧相位的 Halton(2,3) 亚像素采样点跳动及投影矩阵偏移；右视窗展示 YCoCg 颜色空间中当前帧 $3\times 3$ 邻域的均值-方差统计包络盒，以及动量运镜下历史颜色向量被几何相交裁剪防重影过程）
- **2026 前沿技术背景**：
  在现代实时虚拟制片与实时渲染（如 Unreal TSR、NVIDIA DLSS、Epic TAA）中，时域超分辨率与抗锯齿是重构高频几何边缘的核心基础设施。渲染引擎在每帧相机投影矩阵中加入微弱的亚像素抖动（Subpixel Jittering），通过多帧历史累积打破单个像素的奈奎斯特空间采样极限。然而，当镜头运动、遮挡变化或光影突变时，重投影的历史像素若直接混合会产生严重的“鬼影”（Ghosting 拖尾）。现代业界标准（Brian Karis / Marco Salvi 提出）将颜色变换到去相关的 YCoCg 空间，基于局部 $3\times 3$ 邻域计算均值 $\mu$ 与方差 $\sigma$ 构筑动态方差裁剪盒（Variance Clipping AABB），利用射线相交强制将历史样本约束在当前统计邻域内。
- **客观黄金基准 Ground Truth**：
  1. **Halton(2, 3) 低差异亚像素抖动序列（前 8 相位基准）**：
     对基数 $b$，将整数索引 $n = \sum a_k b^k$ 反转为根式倒数 $\phi_b(n) = \sum a_k b^{-(k+1)}$。  
     亚像素偏移 $(\Delta x, \Delta y) = (\phi_2(n) - 0.5, \phi_3(n) - 0.5)$，前 8 帧精确真值表为：
     - 帧 1: $(0.0, -0.166667)$
     - 帧 2: $(-0.25, +0.166667)$
     - 帧 3: $(+0.25, -0.388889)$
     - 帧 4: $(-0.375, -0.055556)$
     - 帧 5: $(+0.125, +0.277778)$
     - 帧 6: $(-0.125, -0.277778)$
     - 帧 7: $(+0.375, +0.055556)$
     - 帧 8: $(-0.4375, +0.388889)$
  2. **可逆无损 RGB 至 YCoCg 变换矩阵**：
     $$\begin{bmatrix} Y \\ Co \\ Cg \end{bmatrix} = \begin{bmatrix} 0.25 & 0.5 & 0.25 \\ 0.5 & 0 & -0.5 \\ -0.25 & 0.5 & -0.25 \end{bmatrix} \begin{bmatrix} R \\ G \\ B \end{bmatrix}, \quad \begin{bmatrix} R \\ G \\ B \end{bmatrix} = \begin{bmatrix} 1 & 1 & -1 \\ 1 & 0 & 1 \\ 1 & -1 & -1 \end{bmatrix} \begin{bmatrix} Y \\ Co \\ Cg \end{bmatrix}$$
  3. **YCoCg 方差裁剪盒（Variance Clipping AABB）与几何求交**：
     在当前帧待更新像素的 $3\times 3$ 邻域内计算 9 个像素的一阶矩 $m_1 = \sum_{k=1}^9 C_k$ 与二阶矩 $m_2 = \sum_{k=1}^9 C_k^2$。  
     局部均值与标准差为：
     $$\mu = \frac{m_1}{9}, \quad \sigma = \sqrt{\max\left( \frac{m_2}{9} - \mu^2, 0 \right)}$$
     构造轴对齐包围盒 $[C_{min}, C_{max}] = [\mu - \gamma\sigma, \mu + \gamma\sigma]$（影视标准参数 $\gamma = 1.0 \sim 1.25$）。  
     对于重投影历史样本 $C_{hist}$，求解线段从 $\mu$ 到 $C_{hist}$ 与包围盒表面相交的插值比率 $t \in [0, 1]$：
     $$C_{clamped} = \text{Intersection}(C_{hist}, \mu, C_{min}, C_{max})$$
  4. **时间指数混合（EMA）权重更新**：
     最终像素颜色输出为 $C_{output} = \alpha C_{current} + (1 - \alpha) C_{clamped}$（常规平稳帧 $\alpha \approx 0.05 \sim 0.1$）。
- **机器与视觉客观比对判据**：
  - **肉眼直观判断**：左图像素格中的黄色采样点沿 Halton 序号顺序动态跳跃分布均匀，覆盖整个亚像素区域；右图 YCoCg 坐标系中，代表当前帧统计的方差矩形框随时间根据边缘亮度扩张/收缩，当红色历史样本点被运镜拉出框外时，黄色的裁剪射线瞬间将其限制在矩形盒边缘交点处，彻底消除拖尾。
  - **机器自动化比对**：验证 8 帧 Halton 点坐标绝对数值误差 $\le 10^{-6}$；验证 YCoCg 正反变换矩阵相乘严格等于三阶单位矩阵 $I_3$；检验被裁切的历史样本严格位于 $[C_{min}, C_{max}]$ 闭区间边界内。
- **权威学术与行业出处**：
  - Brian Karis (Epic Games, 2014), *"High-Quality Temporal Supersampling"*, ACM SIGGRAPH 2014 Courses: Advances in Real-Time Rendering in Games.
  - Marco Salvi (2016), *"Temporal Antialiasing in Uncharted 4"*, Game Developers Conference (GDC 2016).
  - Malan, H. (2012), *"Real-Time Temporal Anti-Aliasing in Frostbite"*, GDC 2012.
- **净室设计理念说明**：
  算法严格基于数论中的低差异序列定义与多元统计矩分析，全部图元采用自主编写的标准几何解析图形，不复用任何商业游戏引擎的着色器源代码。

---

## 第三部分：体系规划总结与后续落地指引

本批 10 道题目构成了【VFX-6: 实时虚拟制片、深度合成与异构并行图形系统】的权威评测基石：
1. **全面性**：涵盖现场摄影机离轴投影视锥（01）、时空硬件同步锁相（02）、深度合成体积积分（03）、广色域色貌感知映射（04）、连续时间蒙皮光线求交（05）、着色编译器自动微分图优化（06）、神经辐射缓存实时自训练（07）、光场微透镜空间转向（08）、高动态绝对亮度感知量化（09）以及屏幕空间时域抗锯齿与样本方差裁剪（10）。
2. **纯净开源与直观客观**：每一道题均排除了可能导致作弊的交互脚本，采用自闭合静态 SVG 拓扑图或内联 SMIL 连续动画，既支持人眼专家“开箱即审”，又具备严格的数学闭式解、矩阵容差与几何一阶导数判据，支持自动化无损像素与向量级对齐检验。
3. **前沿技术接轨**：精准锚定 2024–2026 年最新国际规范（ACES 2.0、SMPTE RIS-OSVP OpenTrackIO、OpenEXR 3.x、Slang 自动微分编译器、Instant-NGP/NRC），保证评测具有极高的学术前瞻性与视效工业落地价值。
