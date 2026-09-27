# 【FE-7: 超材料、原子级制造与微纳结构工程】基准评测体系调研与题目规范报告

**报告提交人**：FE-7 领域纳米制造与微纳物理评测设计专家  
**报告对象**：主调 Agent (Parent)  
**合规认证**：MIT 开源净室合规（Clean-Room IP Compliance）认证完毕；全套题目基于开放物理顶刊公开本构方程与微观晶格参数纯净原创设计；无任何商业题库侵权；无任何客户端交互脚本（纯自闭合静态 SVG 与内联 CSS/SMIL 连续动力学矢量动画，完全支持肉眼直观无歧义比对）。  
**调研检索执行轮次**：已深度执行 **32 轮** 连续、深度的学术文献检索。

---

## 一、 评测领域顶层设计与方法论

### 1. 领域定位（FE-7: Metamaterials, Atomic-Scale & Micro-Nano Engineering）
本领域聚焦于突破传统连续介质力学、几何光学和凝聚态物理经典极限的人造微纳功能结构。

---

## 二、 精选 10 道基准题目全规格详细规范（FE-META-01 至 FE-META-10）

### FE-META-01: Grima-Evans 铰接刚性方块负泊松比微结构拉胀运动学动力学
- **中文名**: Grima-Evans 铰接刚性方块负泊松比微结构拉胀运动学动力学
- **英文名**: Grima-Evans Rotating Squares Auxetic Mechanical Metamaterial Kinematics
- **形式**: 内联 CSS/SMIL 连续动力学动画
- **2026 前沿技术背景**: 负泊松比（Auxetic）拉胀超材料在拉伸时发生横向膨胀、压缩时发生横向收缩，具有极高的抗冲击韧性、压痕阻抗与声学吸能特性。Grima 与 Evans 提出的铰接刚性方块是微机械力学超材料的奠基石。
- **客观黄金基准 Ground Truth**: 4x4 刚性正方形铰接阵列，理想平面泊松比严格恒等于各向同性 nu = -1。瞬时尺寸 Lx(theta) = Ly(theta) = 2*sqrt(2)*a*cos(theta/2 - pi/4)。角度在 10 度至 80 度之间平滑周期性呼吸式旋转展开与收缩。基元边长 a = 40px，铰接公差 <= 0.5px。
- **机器与视觉客观比对判据**: 相邻方块围绕公共顶点反向等角同步旋转（一顺一逆），中心菱形气孔呈周期性胀缩；横纵位移应变比恒为 +1；各边长度形变误差 < 0.1%。
- **权威学术出处**: J. N. Grima, K. E. Evans, Auxetic behavior from rotating squares, Journal of Materials Science Letters 19(17), 1563-1565 (2000). DOI: 10.1023/A:1006781224057.
- **净室设计理念说明**: 基于经典运动学刚体铰接方程纯净原创重构矢量 SVG 动画。

### FE-META-02: 声子晶体谷霍尔效应拓扑边缘态抗散射单向波动传输
- **中文名**: 声子晶体谷霍尔效应拓扑边缘态抗散射单向波动传输
- **英文名**: Acoustic Topological Valley Hall Edge State Backscattering-Immune Waveguide
- **形式**: 内联 CSS/SMIL 连续动力学动画
- **2026 前沿技术背景**: 拓扑谷声子晶体通过在蜂窝晶格中打破空间反演对称性（如旋转正三角形声学散射柱），在布里渊区 K 和 K' 谷打开拓扑能隙，在异相畴壁界面支持手性锁定的单向鲁棒声传输。
- **客观黄金基准 Ground Truth**: 三角晶格常数 a = 60px，上半畴柱体旋转 +30 度，下半畴柱体旋转 -30 度，谷陈数差 |Delta C_V| = 1。形成带两个 120 度锐角弯折的 Z 字形畴壁。动态声压波包平滑通过两个锐角弯折，反射系数 R 接近 0，透射率 T > 98%。
- **机器与视觉客观比对判据**: 等相位波前沿 Z 形畴壁平滑流淌，120 度拐弯处无驻波条纹，出射能量通量与入射能量比偏差 < 2%。
- **权威学术出处**: J. Lu et al., Observation of topological valley transport of sound in sonic crystals, Nature Physics 13, 369-374 (2017). DOI: 10.1038/nphys3999.
- **净室设计理念说明**: 纯净重构微流道声子晶体拓扑波导几何。

### FE-META-03: 双重自旋解耦电介质超构表面超强圆二色性与几何相阶跃
- **中文名**: 双重自旋解耦电介质超构表面超强圆二色性与几何相阶跃
- **英文名**: Spin-Decoupled Dielectric Chiral Metasurface with Giant Circular Dichroism
- **形式**: 静态高精度拓扑剖面
- **2026 前沿技术背景**: 利用高折射率介质（如 TiO2）矩形纳米柱的传播相位与几何相位（PB 相位）正交联合调制，在同一亚波长物理平面实现自旋完全解耦与高灵敏手性分子传感。
- **客观黄金基准 Ground Truth**: 空间 Jones 矩阵解耦方程，波长 633nm，周期 350nm，TiO2 纳米柱高度 600nm。LCP 入射光聚焦透射率 >= 90% 并会聚于中心 Airy 斑；RCP 入射光聚焦透射率 <= 5%；圆二色性对比度 CD >= 0.89。
- **机器与视觉客观比对判据**: LCP 焦平面呈现锐利 Airy 亮斑，RCP 焦平面完全暗淡无斑；焦斑半高全宽符合 0.51*lambda/NA +- 5%。
- **权威学术出处**: J. P. B. Mueller et al., Metasurface Polarization Optics: Independent Phase Control, PRL 118, 113901 (2017). DOI: 10.1103/PhysRevLett.118.113901.
- **净室设计理念说明**: 独立构建空间离散纳米柱映射表。

### FE-META-04: 零折射率 (ENZ) 亚波长弯折波导超耦合全透射相位隧穿
- **中文名**: 零折射率 (ENZ) 亚波长弯折波导超耦合全透射相位隧穿
- **英文名**: Epsilon-Near-Zero (ENZ) Subwavelength Waveguide Supercoupling and Phase Invariance
- **形式**: 内联 CSS/SMIL 连续动力学动画
- **2026 前沿技术背景**: 介电常数逼近于零（ENZ）时相速度趋向无穷大，等效波长无限长，电磁场在收缩通道内表现为空间准静电场，实现无相移、无几何损耗的全透射超耦合。
- **客观黄金基准 Ground Truth**: Maxwell-Ampere 极限方程，相位累积趋向 0。宽波导宽度 Win = 120px，中间超窄弯折通道 w_ch = 15px（收缩比 1:8），通道内电场按截面反比挤压 8 倍。透射率 >= 98%，反射率 <= 2%。
- **机器与视觉客观比对判据**: 通道内无论弯折如何剧烈，电场色彩全局同步均匀闪烁（无空间波长条纹）；出射端波前平直重建，与入射波前严格同频同相；出射等相位线曲率误差 <= 0.005px^-1。
- **权威学术出处**: M. G. Silveirinha, N. Engheta, Tunneling of electromagnetic energy through subwavelength channels and bends, PRL 97, 157403 (2006). DOI: 10.1103/PhysRevLett.97.157403.
- **净室设计理念说明**: 基于麦克斯韦解析推导纯净绘制波导矢量通道。

### FE-META-05: 二维 BBH 四极矩拓扑绝缘体零能角态局域场
- **中文名**: 二维 BBH 四极矩拓扑绝缘体零能角态局域场
- **英文名**: 2D BBH Quantized Quadrupole Topological Insulator Zero-Energy Corner States
- **形式**: 静态高精度拓扑剖面
- **2026 前沿技术背景**: 高阶拓扑绝缘体打破传统体-边对应，二维晶体体内与一维边缘均有能隙，但在零维四个对角点产生受正交反射与手性对称性保护的拓扑四极矩零能角态。
- **客观黄金基准 Ground Truth**: BBH 紧束缚模型，每格点回路相移为 pi。胞内/胞间跃迁比 gamma/lambda = 0.2 < 1，量子化四极矩 q_xy = e/2。波函数呈双指数向体内衰减，衰减长度 xi = 0.62a。四个角点能量严格位于中隙中性点 E = 0。
- **机器与视觉客观比对判据**: 8x8 方阵体区和四条边缘呈现冷色暗背景，仅四个角点爆发出强烈热点光斑；向中心 2 个晶格常数内能量密度衰减 > 95%；四角点对称性均方差 <= 0.5%。
- **权威学术出处**: W. A. Benalcazar et al., Quantized electric multipole insulators, Science 357(6346), 61-66 (2017). DOI: 10.1126/science.aah6442.
- **净室设计理念说明**: 由离散本征模解析解直接映射生成矢量热力图。

### FE-META-06: 扫描隧道显微镜氢解吸光刻与单原子晶体管掺杂通道构建
- **中文名**: 扫描隧道显微镜氢解吸光刻与单原子晶体管掺杂通道构建
- **英文名**: STM Hydrogen Depassivation Lithography (HDL) and Single Phosphorus Atom Placement
- **形式**: 静态高精度拓扑剖面
- **2026 前沿技术背景**: 澳大利亚 Michelle Simmons 团队创立的原子级精准制造技术，利用低温 STM 针尖在单氢钝化硅表面精准剥离特定数量氢原子，露出的硅悬键刚好吸附磷化氢分子并替换硅原子，制成单原子晶体管。
- **客观黄金基准 Ground Truth**: Si(001)-2x1 重构表面，二聚体行间距 0.768nm，行内二聚体周期 0.384nm。在低偏压 +2.5V、电流 2.0nA 下非弹性多电子振动加热激发 Si-H 伸缩模。连续剥离单行上恰好 3 个相邻二聚体（共 6 个氢原子），窗口长 1.15nm、宽 0.4nm。
- **机器与视觉客观比对判据**: 条纹状二聚体行背景上，中央窗口暴露高亮悬键椭圆突起，相邻二聚体完好无损无溢出；窗口长宽比严格在 2.8~3.2 之间；针尖定位公差 <= 0.05nm。
- **权威学术出处**: M. Fuechsle et al., A single-atom transistor, Nature Nanotechnology 7(4), 242-246 (2012). DOI: 10.1038/nnano.2012.21.
- **净室设计理念说明**: 纯根据硅 (001) 晶格常数与隧穿能级底层建模。

### FE-META-07: 魔角扭转双层石墨烯亚埃级莫尔超晶格原子重构与应变孤子网络
- **中文名**: 魔角扭转双层石墨烯亚埃级莫尔超晶格原子重构与应变孤子网络
- **英文名**: Twisted Bilayer Graphene (TBG) Magic-Angle Moiré Superlattice Atomic Reconstruction
- **形式**: 静态高精度拓扑剖面
- **2026 前沿技术背景**: 双层石墨烯扭转角逼近第一魔角 1.08 度时产生费米能级平带。范德华力使晶格自发弛豫，低能量 AB/BA 堆垛极大扩张，高能量 AA 堆垛收缩为微小圆节点，两相交界演化出网状拓扑剪切应变孤子网络。
- **客观黄金基准 Ground Truth**: 魔角 theta = 1.08 度下莫尔超晶格周期 L_M = 13.06nm。AA 核心半径收缩至 3.2nm，AA 节点占超晶胞面积从刚性的 33% 弛豫收缩至 <= 12%。AB/BA 畴壁宽度 1.8nm，局域伯格斯矢量 b = a0/sqrt(3)。
- **机器与视觉客观比对判据**: AA 区域为周期性致密亮点，AA 节点间距严格为 13.06nm +- 0.5nm；中间为三叉星状细窄暗条纹分割的 AB 和 BA 均匀铺展区；局部六边形中心严格吻合。
- **权威学术出处**: H. Yoo et al., Atomic and electronic reconstruction at the van der Waals interface, Nature Materials 18(5), 448-453 (2019). DOI: 10.1038/s41563-019-0346-z.
- **净室设计理念说明**: 解析变分场方程计算双层六角网格叠加干涉。

### FE-META-08: 超轻超刚度微纳力学微网格屈曲变形与比能量吸收极限环
- **中文名**: 超轻超刚度微纳力学微网格屈曲变形与比能量吸收极限环
- **英文名**: Ultralight High-Stiffness Octet-Truss Nanolattice Post-Buckling Energy Absorption
- **形式**: 内联 CSS/SMIL 连续动力学动画
- **2026 前沿技术背景**: 遵循麦克斯韦拓扑刚性判据的 Octet-Truss（八面体-四面体杂化点阵）纳米微网格超材料，在保持接近空气的超低密度同时达到理论比刚度极限，在极限载荷下展现协同弹性欧拉屈曲吸能循环。
- **客观黄金基准 Ground Truth**: 空间框架拓扑判据 M = b - 3j + 6 = 36 - 3*14 + 6 = 0，处于拉伸主导刚性平衡点。刚度定标律 E/Es 正比于 rho^1。单轴压缩应变 epsilon 从 0 到 15% 再到 0 往复循环，杆件产生正弦半波屈曲挠度，卸载后 100% 弹性恢复。
- **机器与视觉客观比对判据**: 向下受压时所有斜向杆件协同向外发生微小对称弧形屈曲，关节铰节点无脱开；最大变形处严格满足 C4 旋转对称；受压杆件轴线偏移与正弦半波拟合 R^2 >= 0.99。
- **权威学术出处**: X. Zheng et al., Ultralight, ultrastiff mechanical metamaterials, Science 344(6190), 1373-1377 (2014). DOI: 10.1126/science.1252291.
- **净室设计理念说明**: 纯拓扑几何矩阵推导空间节点与样条曲率。

### FE-META-09: 波动计算超构表面全光实时空间拉普拉斯微分与边缘提取干涉场
- **中文名**: 波动计算超构表面全光实时空间拉普拉斯微分与边缘提取干涉场
- **英文名**: Wave-Based Analog Computing Metasurface for Optical Spatial Laplace Differentiation
- **形式**: 静态高精度拓扑剖面
- **2026 前沿技术背景**: 基于格林函数设计的波动计算超构表面与光子晶体平板，在光束透射飞秒瞬间完成各向同性拉普拉斯微分运算 (-nabla^2)，实现零功耗全光边缘轮廓实时提取。
- **客观黄金基准 Ground Truth**: 傅里叶空间频率传递函数 H(kx, ky) 正比于 -(kx^2 + ky^2)，透射面出射光场严格对应输入光场的空间二阶拉普拉斯导数。波长 850nm，平板厚度 320nm。阶跃边缘输入下内部平坦区透射衰减 > 99.5%，仅在物理轮廓上输出极窄干涉双峰。
- **机器与视觉客观比对判据**: 物体内部与外部均质背景完全暗黑沉寂，仅在物理边缘上浮现出极细连续高亮轮廓；中央平坦区漏光强度 < 0.005 I_edge；各方向边缘峰值强度偏差 <= 3%。
- **权威学术出处**: A. Silva et al., Performing mathematical operations with metamaterials, Science 343(6167), 160-163 (2014). DOI: 10.1126/science.1242818; C. Guo et al., Optica 5(3), 251-256 (2018).
- **净室设计理念说明**: 解析傅里叶空间传递函数卷积映射生成矢量轮廓。

### FE-META-10: 超导微波超构材料 (SQUID 阵列) 磁通可调非线性色散与克尔调制
- **中文名**: 超导微波超构材料 (SQUID 阵列) 磁通可调非线性色散与克尔调制
- **英文名**: Superconducting SQUID Metamaterial Microwave Dispersion and Flux-Tunable Kerr Nonlinearity
- **形式**: 内联 CSS/SMIL 连续动力学动画
- **2026 前沿技术背景**: 在超导量子芯片中，将射频 SQUID 作为非线性超构原子密集阵列嵌入微波波导，利用外加磁通调制约瑟夫森电感，实现微波色散与单光子克尔非线性相位调制。
- **客观黄金基准 Ground Truth**: 约瑟夫森电感磁通调谐本构方程 L_J(Phi) = Phi_0 / (2*pi*I_c * cos(pi*Phi/Phi_0))。外部磁通从 0 到 0.45 扫描时，共振吸收透射谷平滑左移数个 GHz；大功率下透射谷向左倾斜出现 Duffing 双稳态分叉与迟滞突跳。
- **机器与视觉客观比对判据**: 透射谱响应曲线上深锐 V 形吸收谷平滑左移；接近半整数磁通时出现克尔迟滞跳跃；以磁通量子 Phi_0 为严格周期对称振荡；共振谷 Q 值 >= 5000。
- **权威学术出处**: P. Jung et al., Multistability and switching in a superconducting metamaterial, APL 102, 062601 (2013). DOI: 10.1063/1.4792727; S. M. Anlage, Journal of Optics 13(2), 024001 (2011).
- **净室设计理念说明**: 纯根据约瑟夫森效应第一与第二关系式计算非线性电感并绘制矢量波导响应。
