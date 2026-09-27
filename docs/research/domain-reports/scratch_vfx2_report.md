# 【VFX-2 领域】波动光学传播、全光谱渲染与显式辐射场（Wave Optics, Spectral Rendering & Radiance Fields）基准评测题目规格报告

---

## 目录
1. 34 轮深度学术检索关键词与检索路径清单
2. VFX-2 领域 10 道基准评测题目全景台账
3. 10 道基准评测题目深度规格规范详件（VFX-OPTICS-01 至 VFX-OPTICS-10）
4. 净室设计哲学与通用视觉/机器对齐判定体系

---

## 一、34 轮深度学术检索关键词与检索路径清单

| 检索轮次 | 检索关键词 (Query) | 检索攻坚目标与核心获取参数 |
| :--- | :--- | :--- |
| **01** | `ReSTIR GI spatiotemporal reservoir resampling MIS weight Bitterli Ouyang Lin` | 获取 ReSTIR 储层时空复用、平衡启发式 MIS 权重数学形式与无偏积分准则 |
| **02** | `ReSTIR "reservoir" update weight "Jacobian" shift mapping Bitterli Lin` | 检索 GRIS 与 ReSTIR PT 中路径重连变换（Shift Mapping）的雅可比行列式补偿公式 |
| **03** | `"ReSTIR" "SIGGRAPH 2024" OR "SIGGRAPH 2025" path tracing reservoir` | 跟踪 SIGGRAPH 2024/2025 在 Area ReSTIR 与 Reservoir Splatting 上的时空重采样前沿 |
| **04** | `"3D Gaussian Splatting" covariance matrix "J W \Sigma W^T J^T" EWA Kerbl SIGGRAPH 2023` | 获取 3DGS 协方差矩阵自三维旋转缩放到二维相机平面的 EWA 滤波投影变换形式 |
| **05** | `3D Gaussian splatting Jacobian J "f_x / t_z" "t_x / t_z^2" 2D covariance ellipse eigenvalues` | 确定透视投影仿射近似雅可比矩阵 $J$ 的分量形式与 2D 椭圆特征值/半轴公式 |
| **06** | `"Spherical Harmonics" "3D Gaussian Splatting" degree 0 1 2 3 color view direction Kerbl` | 检索 3DGS 中 0~3 阶球谐函数视向依赖色彩编码参数与高频瓣辐射机制 |
| **07** | `"4D Gaussian Splatting" OR "Dynamic 3D Gaussians" deformation field "rigidity" polynomial trajectory CVPR 2024 SIGGRAPH 2024` | 检索 4DGS 动态形变场的多项式时空轨迹与局部刚度/等距正则化先验 |
| **08** | `"4D Gaussian" "covariance" time slice marginalization conditional "4D-GS" OR "Spacetime Gaussian"` | 检索四维联合高斯元 $\mathbb{R}^3 \times \mathbb{R}$ 在连续时间戳 $t$ 上的时空条件切片切面理论 |
| **09** | `"Spacetime Gaussian" "conditional" "Schur complement" \Sigma_{xx} - \Sigma_{xt} \Sigma_{tt}^{-1} \Sigma_{tx}` | 确定多维高斯时间切片的 Schur 补条件协方差与均值漂移解析方程 |
| **10** | `"A Practical Extension to Microfacet Theory for the Modeling of Thin-Film Interference" Belcour de Rousiers formula phase delay` | 检索 Belcour-Barla 微表面薄膜波动干涉模型的光程差与艾里相移积分公式 |
| **11** | `"Airy summation" thin film reflectance "r_1^2 + r_2^2 + 2 r_1 r_2 \cos" Born Wolf` | 获取 Born & Wolf《光学原理》分层介质多束光干涉级数求和反射率解析闭式解 |
| **12** | `thin film interference constructive destructive phase condition "2 n d cos" lambda soap bubble` | 检索肥皂泡等薄膜上下界面反射相移（硬反射 vs 软反射，$\pi$ 相移）与消光极值条件 |
| **13** | `"Scratch Iridescence" Werner SIGGRAPH 2017 diffraction grating equation` | 检索微划痕各向异性波动光学非傍轴标量衍射理论模型与相干叠加方程 |
| **14** | `"Jos Stam" "Diffraction Shading" SIGGRAPH 1999 grating equation "m \lambda"` | 检索 Stam 衍射着色器模型与基尔霍夫各向异性光栅衍射方程 $d(\sin\theta_i + \sin\theta_r)=m\lambda$ |
| **15** | `"CIE 1931" color matching functions XYZ to sRGB matrix formula spectral rendering` | 获取全光谱色散积分至 CIE 1931 XYZ 进而转换至线性/伽马校正 sRGB 的标准化矩阵 |
| **16** | `"Jensen" "dipole" BSSRDF "R_d(r)" diffusion profile "z_r" "z_v" "sigma_tr" SIGGRAPH 2001` | 检索 Jensen 偶极子次表面散射扩散剖面 $R_d(r)$、消光系数与虚实镜像源深度标定 |
| **17** | `"Directional Dipole" Frisvad SIGGRAPH 2014 BSSRDF subsurface scattering formula` | 检索 Frisvad 方向性偶极子模型对斜入射折射光束的有向源扩散改进理论 |
| **18** | `"Christensen" "Burley" "Approximate Reflectance Profiles for Efficient Subsurface Scattering" Disney diffusion profile formula` | 检索迪士尼归一化扩散双指数剖面公式与其能量守恒归一化常数项 |
| **19** | `"Gravitational lensing by spinning black holes" James Thorne 2015 Kerr geodesic shadow Carter constant` | 检索《星际穿越》DNGR 渲染器中克尔黑洞零测地线偏折与 Carter 常数解耦方程 |
| **20** | `"Bardeen" 1973 Kerr black hole shadow impact parameters \alpha \beta "r^2 - a^2" spin` | 检索 Bardeen 1973 自旋黑洞阴影边界临界冲击参数 $(\alpha, \beta)$ 解析参数化方程 |
| **21** | `relativistic beaming Doppler boost factor "g^4" accretion disk "I_{obs} = g^4 I_{em}"` | 确认相对论集束效应中微分散射强度 $\delta^3$ 与全波段通量 $\delta^4$（或 $g^4$）的洛伦兹变换幂次 |
| **22** | `relativistic aberration formula "cos \theta'" "\beta" Terrell rotation Penrose 1959` | 检索狭义相对论全天球光行差变换方程与特勒尔-彭罗斯刚体视在旋转效应 |
| **23** | `"Visualization of Relativistic Effects" Weiskopf IEEE TVCG OR "Computer Graphics Forum" relativistic ray tracing` | 检索 Weiskopf 等人在相对论光线追踪、四维时空渲染与头灯效应可视化中的权威基准 |
| **24** | `"Terrell rotation" angle formula "\arcsin(\beta)" OR "arcsin(v/c)" apparent rotation` | 确定高速运动物体滞后光波面形成的视在刚体旋转角 $\theta = \arcsin(\beta)$ 闭式解 |
| **25** | `birefringence "index ellipsoid" "ordinary ray" "extraordinary ray" uniaxial crystal Weidlich Wilkie EGSR 2008` | 检索 Weidlich-Wilkie 单轴晶体双折射渲染框架、折射率椭球与 o-ray / e-ray 斯托克斯矢量 |
| **26** | `"Wollaston prism" divergence angle formula "n_e - n_o" wedge angle` | 检索沃拉斯顿双偏振棱镜界面折射分裂角几何与小角近似公式 $\epsilon \approx 2(n_e - n_o)\tan\alpha$ |
| **27** | `"Catastrophe optics" "Berry" "Upstill" 1980 "hyperbolic umbilic" caustic fold cusp` | 检索 Berry & Upstill 突变光学经典综述中关于焦散线拓扑奇点与衍射折叠的分类学 |
| **28** | `"hyperbolic umbilic" catastrophe potential function "x^3 + y^3" caustic bifurcation set` | 获取双曲脐点（Hyperbolic Umbilic $D_4^+$）三参数通用开折势函数及其分叉集方程 |
| **29** | `manifold next event estimation caustics Hanika SIGGRAPH 2015 OR specular manifold sampling` | 检索 MNEE 与 SMS（高光流形采样）在光滑镜面-漫反射混合焦散链求解中的微分几何原理 |
| **30** | `"wavefront tracing" caustics "principal curvatures" Hessian singularity TOG OR EGSR` | 检索波前跟踪（Wavefront Tracing）中主曲率发散与能量奇点映射关系 |
| **31** | `"wavefront tracking" OR "wavefront tracing" caustic curvature singularity computer graphics` | 进一步核实图形学中波前管截面收缩至零时辐照度极限标度律与等能线构造 |
| **32** | `calcite refractive index "1.6584" "1.4864" 589 nm Wollaston prism ray trace` | 校验方解石晶体在钠 D 线（589.3 nm）下的基准折射率值 $n_o=1.6584, n_e=1.4864$ |
| **33** | `"photon sphere" Kerr formula "2M" "arccos" prograde retrograde Bardeen` | 校验克尔度规下顺行与逆行赤道面光子球半径闭式解公式 $r_{ph}^\pm = 2M [1 + \cos(\frac{2}{3}\arccos(\mp a/M))]$ |
| **34** | `"rigidity loss" "4D Gaussian Splatting" OR "Deformable 3DGS" ARAP isometry formula` | 校验 4D 动态高斯场中 As-Rigid-As-Possible (ARAP) 局部等距损失函数与拓扑不变性条件 |

---

## 二、VFX-2 领域 10 道基准评测题目全景台账

| 题目 ID | 题目名称（中文 / 英文） | 表现形式 | 核心物理学与前沿渲染机制 | 权威学术出处 |
| :--- | :--- | :--- | :--- | :--- |
| `VFX-OPTICS-01` | **时空储层重采样全局光照重连雅可比行列式解析场**<br>*Spatiotemporal Reservoir Resampling (ReSTIR GI) Shift Mapping Jacobian* | 静态矢量 SVG | 路径复用测度变换补偿、无偏蒙特卡洛积分、平衡启发式 MIS | Bitterli et al. (TOG 2020), Ouyang et al. (EGSR 2021), Lin et al. (TOG 2022) |
| `VFX-OPTICS-02` | **显式 3D 高斯泼溅协方差投影与球谐视向辐射场**<br>*3D Gaussian Splatting Covariance EWA Projection and Spherical Harmonics* | 静态矢量 SVG | 透视雅可比线性化、EWA 抗锯齿滤波、3 阶球谐函数视向高频瓣 | Kerbl et al. (TOG 2023), Zwicker et al. (TVCG 2001) |
| `VFX-OPTICS-03` | **4D 时空高斯场连续切片与局部等距刚度正则化**<br>*4D Spatiotemporal Gaussian Field Covariance Slicing & Isometric Rigidity* | 内联 CSS/SMIL 纯动画 | 4D 联合多元高斯 Schur 补切片、ARAP 拓扑刚度保持、时空连续演化 | Wu et al. (CVPR 2024), Yang et al. (CVPR 2024), Sajjadi et al. (SIGGRAPH 2024) |
| `VFX-OPTICS-04` | **纳米级薄膜波动光学干涉与艾里全光谱反射条纹**<br>*Nanoscale Thin-Film Wave Optics Interference and Airy Spectral Fringes* | 静态矢量 SVG | 麦克斯韦边界连续性、多光束相干叠加、硬/软反射相位跳变、Newton 黑斑 | Belcour & Barla (TOG 2017), Born & Wolf (Principles of Optics) |
| `VFX-OPTICS-05` | **各向异性微光栅衍射分光与 CIE 1931 色品图投影**<br>*Anisotropic Micro-Grating Diffraction and Full-Spectrum CIE 1931 Dispersion* | 静态矢量 SVG | 标量基尔霍夫衍射积分、广义光栅方程、CIE 1931 谱色轨迹精确积分 | Stam (SIGGRAPH 1999), Werner et al. (TOG 2017), CIE 15:2004 |
| `VFX-OPTICS-06` | **双偶极子微表面次表面散射 (BSSRDF) 扩散剖面**<br>*Directional Dipole Subsurface Scattering (BSSRDF) Diffusion Profile* | 静态矢量 SVG | 输运近似零通量边界条件、正负偶极子虚实镜像源、空间衰减对数线 | Jensen et al. (SIGGRAPH 2001), Frisvad et al. (TOG 2014), Christensen (2015) |
| `VFX-OPTICS-07` | **克尔度规旋转黑洞测地线透镜畸变与多普勒集束 $g^4$ 极化**<br>*Kerr Black Hole Geodesic Lensing & Relativistic Doppler Beaming ($g^4$)* | 内联 CSS/SMIL 纯动画 | 克尔时空拖拽、Carter 常数测地线、爱因斯坦双重环、相对论集束 $g^4$ | James et al. (CQG 2015), Bardeen (1973), Cunningham & Bardeen (1972) |
| `VFX-OPTICS-08` | **狭义相对论 $0.95c$ 光行差头灯效应与特勒尔几何旋转**<br>*Special Relativistic 0.95c Aberration Headlight & Terrell-Penrose Rotation* | 内联 CSS/SMIL 纯动画 | 洛伦兹时空光锥相交、半角正切角压缩、延迟光波面视在刚体旋转 | Penrose (1959), Terrell (1959), Weiskopf et al. (TVCG 2006) |
| `VFX-OPTICS-09` | **双折射单轴晶体寻常/非常光分解与沃拉斯顿棱镜**<br>*Birefringent Uniaxial Crystal Ray Splitting & Wollaston Polarizing Prism* | 静态矢量 SVG | 各向异性介电张量、折射率椭球波面包络、斯托克斯正交正交线偏振分离 | Weidlich & Wilkie (EGSR 2008), Wollaston (Phil. Trans. R. Soc. 1802) |
| `VFX-OPTICS-10` | **高阶焦散波前法线曲率映射双曲脐点与焦散线包络奇点**<br>*Higher-Order Caustic Bifurcation & Hyperbolic Umbilic ($D_4^+$) Wavefront* | 内联 CSS/SMIL 纯动画 | 托姆突变光学、Hessian 退化包络线、双曲脐点 $D_4^+$ 翼状三尖分叉相变 | Berry & Upstill (Prog. Opt. 1980), Zeltner et al. (TOG 2020 SMS) |

---

## 三、10 道基准评测题目深度规格规范详件

### 1. `VFX-OPTICS-01`: 时空储层重采样全局光照重连雅可比行列式解析场
- **题目 ID**：`VFX-OPTICS-01`
- **中文名**：时空储层重采样全局光照重连雅可比行列式解析场
- **英文名**：Spatiotemporal Reservoir Resampling (ReSTIR GI/PT) Shift Mapping Jacobian
- **表现形式**：静态高精度光路重连采样网格与雅可比权重场矢量 SVG
- **2026 前沿背景**：ReSTIR（时空储层重要性重采样）消除数百万光源噪波。跨非平坦几何表面重连次级散射点时，必须乘以微分面积形式雅可比行列式 $|J|$ 以及平衡启发式 MIS 权重，否则光能失真、几何边缘亮斑撕裂。
- **Ground Truth**：
  $$|J| = \frac{\cos\theta_2'}{\cos\theta_2} \cdot \frac{\|\mathbf{x}_1 - \mathbf{x}_2\|^2}{\|\mathbf{x}_1' - \mathbf{x}_2'\|^2} \approx 2.6247 \pm 0.05$$
- **客观判定**：雅可比行列式绝对公差 $\le 0.05$，立体角微分比值绝对误差 $< 1.5\%$。

### 2. `VFX-OPTICS-02`: 显式 3D 高斯泼溅协方差投影与球谐视向高阶辐射场
- **题目 ID**：`VFX-OPTICS-02`
- **中文名**：显式 3D 高斯泼溅协方差投影与球谐视向高阶辐射场
- **英文名**：3D Gaussian Splatting Covariance EWA Ellipse Projection and Spherical Harmonics
- **表现形式**：静态高精度三维椭球向二维屏幕外接椭圆切线投影与 SH 阶梯辐射瓣矢量 SVG
- **Ground Truth**：
  $\Sigma_{2D} = J W \Sigma W^T J^T + 0.3 I_{2\times 2}$，透视仿射雅可比 $J$ 矩阵计算，2D 投影中心 $(u, v) = (120.0, -80.0)\text{ px}$，半轴 $a, b$ 与 $3\sigma$ 边界，2 阶球谐高光辐射瓣 $Y_2^0$。
- **客观判定**：中心投影坐标绝对公差 $\le 0.5\text{ px}$，半轴长相对误差 $< 1.2\%$，主轴倾斜角偏差 $< 0.4^\circ$。

### 3. `VFX-OPTICS-03`: 4D 动态时空高斯场时空协方差连续切片与局部等距刚度正则化
- **题目 ID**：`VFX-OPTICS-03`
- **中文名**：4D 动态时空高斯场时空协方差连续切片与局部等距刚度正则化
- **英文名**：4D Spatiotemporal Gaussian Field Covariance Slicing and Local Isometric Rigidity
- **表现形式**：纯内联 CSS/SMIL 动力学矢量动画 SVG
- **Ground Truth**：
  4D 联合协方差分块 $\Sigma_{4D}$，Schur 补条件切片 $\Sigma^*(t) = \Sigma_{\mathbf{x}\mathbf{x}} - \Sigma_{\mathbf{x}t}\Sigma_{tt}^{-1}\Sigma_{t\mathbf{x}}$，ARAP 局部等距刚度损失 $\mathcal{L}_{\text{iso}} \le 0.02$。
- **客观判定**：关键帧时刻粒子间距形变误差率 $< 1.8\%$，切片协方差拟合优度 $R^2 \ge 0.985$。

### 4. `VFX-OPTICS-04`: 纳米级多层薄膜波动光学干涉与艾里干涉条纹全光谱反射剖面
- **题目 ID**：`VFX-OPTICS-04`
- **中文名**：纳米级多层薄膜波动光学干涉与艾里干涉条纹全光谱反射剖面
- **英文名**：Nanoscale Multilayer Thin-Film Wave Optics Interference and Airy Spectral Reflectance Profile
- **表现形式**：静态高精度干涉分光波前截面与分色反射图谱矢量 SVG
- **Ground Truth**：
  光程差 $\Delta = 2 n_2 d \cos\theta_2$，艾里级数求和反射率 $R(\lambda)$，硬/软反射界面净相移 $\pi$，$d < 25\text{ nm}$ 处完全相消牛顿黑斑（Newton's Black Film）。
- **客观判定**：黑斑厚度阈值在 $d \le 30\text{ nm}$ 内，各色级极值波长峰位偏差 $< 1.5\%$，$\Delta E^*_{00} < 2.0$。

### 5. `VFX-OPTICS-05`: 各向异性微结构衍射光栅全光谱色散与 CIE 1931 色品图投影
- **题目 ID**：`VFX-OPTICS-05`
- **中文名**：各向异性微结构衍射光栅全光谱色散与 CIE 1931 色品图投影
- **英文名**：Anisotropic Micro-Grating Diffraction and Full-Spectrum CIE 1931 Chromaticity Dispersion
- **表现形式**：静态高精度空间角分光圆锥与色品图马蹄形轨迹映射矢量 SVG
- **Ground Truth**：
  光栅方程 $d(\sin\theta_m - \sin\theta_i) = m\lambda$，$d=1400\text{ nm}, \theta_i=15^\circ$。一阶衍射色散角：紫光(405nm) $33.23^\circ$、绿光(532nm) $39.70^\circ$、橙黄(589nm) $42.80^\circ$、红光(680nm) $48.12^\circ$；CIE 1931 谱色轨迹外轮廓匹配。
- **客观判定**：出射折射角度绝对误差 $< 0.15^\circ$，色度坐标 $(x, y)$ 误差 $\le 0.005$。

### 6. `VFX-OPTICS-06`: 双偶极子微表面次表面散射 (BSSRDF) 空间扩散剖面与透光衰减
- **题目 ID**：`VFX-OPTICS-06`
- **中文名**：双偶极子微表面次表面散射 (BSSRDF) 空间扩散剖面与透光衰减
- **英文名**：Directional Dipole Subsurface Scattering (BSSRDF) Spatial Diffusion Profile and Translucency
- **表现形式**：静态双截面光辐射通量等照度线与径向对数衰减曲线矢量 SVG
- **Ground Truth**：
  输运消光系数 $\sigma'_{tr} = \sqrt{3\sigma_a\sigma'_t}$，正实源深度 $z_r = 1/\sigma'_t$，负虚源深度 $z_v = z_r + 4AD$，解析漫反射剖面 $R_d(r)$。
- **客观判定**：半高宽 FWHM 匹配误差 $< 1.0\%$，渐近衰减斜率误差 $< 0.8\%$，能量守恒误差 $\le 0.5\%$。

### 7. `VFX-OPTICS-07`: 广义相对论克尔度规旋转黑洞测地线透镜畸变与多普勒集束 $g^4$ 极化场
- **题目 ID**：`VFX-OPTICS-07`
- **中文名**：广义相对论克尔度规旋转黑洞测地线透镜畸变与多普勒集束 $g^4$ 极化场
- **英文名**：Kerr Metric Black Hole Geodesic Lensing, Photon Sphere Shadow and Relativistic Doppler Beaming
- **表现形式**：纯内联 CSS/SMIL 旋转吸积盘相对论光流动画矢量 SVG
- **Ground Truth**：
  自旋 $a=0.94M$。顺行光子轨道 $1.543M$，逆行 $3.826M$；Bardeen 1973 冲击参数“D”形阴影；多普勒集束通量 $I_{\text{obs}} = g^4 I_{\text{em}}$，迎侧蓝移增亮 11.7 倍，背侧消光暗化至 0.09 倍；开普勒角速度 $\Omega_K$ 旋转。
- **客观判定**：黑洞阴影边界吻合度 $\ge 98.5\%$，左右盘面辐射亮度比在 $12.0 \sim 15.0$ 之间，光子环半径绝对误差 $< 0.8\%$。

### 8. `VFX-OPTICS-08`: 狭义相对论 $0.95c$ 超高速巡航全天球相对论光行差与特勒尔几何旋转
- **题目 ID**：`VFX-OPTICS-08`
- **中文名**：狭义相对论 $0.95c$ 超高速巡航全天球相对论光行差与特勒尔几何旋转
- **英文名**：Special Relativistic 0.95c Aberration Headlight Effect and Terrell-Penrose Rotation
- **表现形式**：纯内联 CSS/SMIL 巡航加速度与视场畸变动画矢量 SVG
- **Ground Truth**：
  $\beta=0.95, \gamma=3.2026$。半角正切公式 $\tan(\theta_{\text{obs}}/2) = 0.1601 \tan(\theta_{\text{src}}/2)$，正侧方 $90^\circ$ 压缩至 $18.20^\circ$；特勒尔视在旋转角 $\theta_{\text{rot}} = \arcsin(0.95) \approx 71.80^\circ$。
- **客观判定**：$90^\circ$ 压缩半角严格处于 $18.2^\circ \pm 0.3^\circ$，视在旋转角误差 $< 1.0^\circ$。

### 9. `VFX-OPTICS-09`: 双折射单轴晶体寻常光与非常光偏振分解与沃拉斯顿棱镜光路
- **题目 ID**：`VFX-OPTICS-09`
- **中文名**：双折射单轴晶体寻常光与非常光偏振分解与沃拉斯顿棱镜光路
- **英文名**：Birefringent Uniaxial Crystal Ordinary/Extraordinary Ray Splitting and Wollaston Prism
- **表现形式**：静态高精度双偏振分束光路与折射率椭球截面矢量 SVG
- **Ground Truth**：
  方解石晶体 $n_o=1.6584, n_e=1.4864$；沃拉斯顿双直角楔形棱镜（楔角 $30^\circ$），界面身份互换折射，两束出射光正交线偏振总分离角 $\epsilon = 11.38^\circ \pm 0.05^\circ$。
- **客观判定**：总分离张角误差 $< 0.1^\circ$，折射率比值计算误差 $< 0.2\%$，偏振矢量方向误差 $0^\circ$。

### 10. `VFX-OPTICS-10`: 高阶焦散波前法线曲率映射双曲脐点与焦散线包络奇点
- **题目 ID**：`VFX-OPTICS-10`
- **中文名**：高阶焦散波前法线曲率映射双曲脐点与焦散线包络奇点
- **英文名**：Higher-Order Caustic Bifurcation, Hyperbolic Umbilic ($D_4^+$) Wavefront Singularity
- **表现形式**：纯内联 CSS/SMIL 波前曲率扰动与焦散线分叉演化动画矢量 SVG
- **Ground Truth**：
  开折势 $V(x, y; \xi, \eta, \zeta) = x^3 + y^3 + \zeta xy - \xi x - \eta y$，Hessian 行列式奇异条件 $36xy - \zeta^2 = 0$，分叉集呈现经典三尖点翼状包络面（Winged Cusp-Fold Network）。
- **客观判定**：三尖点对称轴夹角误差 $< 0.5^\circ$，尖点奇点辐照度峰值标度律误差 $< 2.0\%$。
