import type { LocalizedStandardEntry } from "../../../types";

export const VFX_GEOM_LABELS_EN: Readonly<Record<string, string>> = {
  "vfx-geom-v1": "VFX-3: Discrete Differential Geometry & Topology (10-Prompt Suite)",
};

export const VFX_GEOM_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "vfx-geom-v1": {
    coreKey: "Discrete Exterior Calculus (DEC), 4D Tesseract SO(4) Isoclinic Rotation & Non-Euclidean Manifold Immersion",
    groundTruth:
      "Grounded in cotangent Laplace-Beltrami heat-method geodesics, 4D tesseract SO(4) isoclinic double rotation in the Coxeter plane, figure-8 Klein bottle smooth immersion, Hopf fibration nested Villarceau tori, discrete Ricci flow circle-packing conformal parameterization, and Poincaré disk {7,3} hyperbolic tiling.",
    evaluationCriteria:
      "1. Topological invariants: Manifold genus, linking numbers (|Lk|=1), normal holonomy sign flips, and Euler characteristic are exact; 2. Conformal & metric fidelity: 4D rotational symmetry, Tissot circle preservation, zero mean curvature (H=0), and orthogonal boundary arcs are preserved; 3. XML compliance: Strictly well-formed XML with zero JavaScript.",
  },
  "VFX-GEOM-01": {
    coreKey: "Discrete Exterior Calculus (DEC) Triangle-Mesh Heat-Method Geodesic Distance Field & Isoline Reconstruction",
    groundTruth:
      "1. **Cotangent Laplace-Beltrami Operator**: $$L_{ij} = \\frac{1}{2}(\\cot \\alpha_{ij} + \\cot \\beta_{ij}) \\; (i \\neq j), \\quad L_{ii} = -\\sum_{j \\in N(i)} L_{ij}$$ 2. **Lumped Voronoi Dual Mass Matrix**: $$M_{ii} = A_{\\text{Voronoi}}(v_i) = \\frac{1}{8} \\sum_{j \\in N(i)} (\\cot \\alpha_{ij} + \\cot \\beta_{ij}) \\|\\mathbf{e}_{ij}\\|^2$$ 3. **Heat Diffusion & Normalized Gradient Field**: $(M - t L) u = \\delta_{x_0}$ ($t = h^2$ for mean edge length $h$), $X = -\\nabla u / \\|\\nabla u\\|$. 4. **Poisson Geodesic Reconstruction**: $L \\phi = \\nabla \\cdot X$ with $\\phi(x_0) = 0$. 5. **Tolerances**: Eikonal residual $|\\|\\nabla \\phi\\| - 1| \\le 2.5 \\times 10^{-3}$; iso-contours orthogonal to geodesic rays with 0 spurious extrema.",
    evaluationCriteria:
      "- **Machine Check**: Extract 10 equispaced iso-contour loops from SVG paths; geodesic distance RMSE to source $x_0$ $\\le 1.5\\%$; cosine of angle between gradient streamlines and iso-contour normals $|\\cos \\theta| \\le 0.02$. - **Visual Check**: Smooth concentric geodesic bands without jagged breaks, exhibiting hyperbolic fan-out across negative-Gaussian-curvature saddle regions.",
  },
  "VFX-GEOM-02": {
    coreKey: "Neural Implicit Signed Distance Field (NeuS) Eikonal Gradient Constraint & Adaptive Octree Dual Contouring",
    groundTruth:
      "1. **Analytical Polyhedral SDF**: $$f(\\mathbf{x}) = \\min_{k} (\\mathbf{n}_k \\cdot (\\mathbf{x} - \\mathbf{p}_k))$$ 2. **Eikonal Condition & Unit Normal Field**: $$\\|\\nabla f(\\mathbf{x})\\| = 1 \\; \\text{a.e.}, \\quad \\mathbf{n}(\\mathbf{x}) = \\frac{\\nabla f(\\mathbf{x})}{\\|\\nabla f(\\mathbf{x})\\|}$$ 3. **Adaptive Octree Subdivision & QEF Vertex Placement**: Subdivide leaf cell $C$ iff $\\max_{v \\in C} f(v) \\cdot \\min_{v \\in C} f(v) \\le 0$; place optimal Dual Contouring vertex via Quadric Error Function: $$\\mathbf{x}^* = \\arg\\min_{\\mathbf{x}} \\sum_{i \\in \\text{Edges}} (\\mathbf{n}_i \\cdot (\\mathbf{x} - \\mathbf{p}_i))^2$$ 4. **Tolerances**: Zero-isosurface genus $g=0$, surface normal error $\\Delta \\mathbf{n} \\le 1.0^\\circ$, and Eikonal deviation $\\mathbb{E}[(\\|\\nabla f\\| - 1)^2] \\le 1.0 \\times 10^{-4}$.",
    evaluationCriteria:
      "- **Machine Check**: Extracted zero-isosurface polygon vertices satisfy $\\max |f(\\mathbf{x}_k)| \\le 10^{-4}$; Dual Contouring resolves octree T-junctions with 0 non-manifold edges. - **Visual Check**: Crisp inside/outside sign transition (cool blue negative interior, warm red positive exterior), zero-level contour tightly hugging the white zero band, and sharp right-angle corner retention without Marching Cubes chamfering.",
  },
  "VFX-GEOM-03": {
    coreKey: "4D Tesseract (8-Cell) SO(4) Isoclinic Double Rotation & Petrie Octagon Coxeter Plane Projection",
    groundTruth:
      "1. **Polytope Combinatorics**: 16 vertices $(\\pm 1, \\pm 1, \\pm 1, \\pm 1)$, 32 edges, 24 square faces, 8 cubical cells, Euler characteristic $\\chi = V - E + F - C = 16 - 32 + 24 - 8 = 0$. 2. **SO(4) Left-Isoclinic Rotation**: $$R_L(\\theta) = \\begin{pmatrix} \\cos\\theta & -\\sin\\theta & 0 & 0 \\\\ \\sin\\theta & \\cos\\theta & 0 & 0 \\\\ 0 & 0 & \\cos\\theta & -\\sin\\theta \\\\ 0 & 0 & \\sin\\theta & \\cos\\theta \\end{pmatrix}$$ 3. **Coxeter Petrie Octagon Basis**: $$U = \\frac{1}{2}\\left(\\cos \\frac{\\pi}{8}, \\cos \\frac{3\\pi}{8}, \\cos \\frac{5\\pi}{8}, \\cos \\frac{7\\pi}{8}\\right), \\quad V = \\frac{1}{2}\\left(\\sin \\frac{\\pi}{8}, \\sin \\frac{3\\pi}{8}, \\sin \\frac{5\\pi}{8}, \\sin \\frac{7\\pi}{8}\\right)$$ 4. **Tolerances**: 4D edge length invariant $L_{4D} = 2.0$; outer hull converges to a regular octagon at symmetric phases (diagonal symmetry error $< 0.1\\%$).",
    evaluationCriteria:
      "- **Machine Check**: Sample 16 projected vertex coordinates at $t = 0, T/4, T/2$; maximum Euclidean deviation from exact Coxeter projection $\\le 0.5\\text{ px}$, with 32-edge adjacency matching the 4-cube graph. - **Visual Check**: Smooth topological inversion as inner cubical cells turn inside-out while maintaining 8-fold Coxeter rotational symmetry ($h=8$).",
  },
  "VFX-GEOM-04": {
    coreKey: "Klein Bottle 4D Immersion in 3-Space: Figure-8 Closed Non-Orientable Smooth Manifold",
    groundTruth:
      "1. **Figure-8 Immersion Equations** ($u, v \\in [0, 2\\pi), r_0 = 3.0$): $$x(u, v) = \\left( r_0 + \\cos\\frac{u}{2} \\sin v - \\sin\\frac{u}{2} \\sin 2v \\right) \\cos u, \\quad y(u, v) = \\left( r_0 + \\cos\\frac{u}{2} \\sin v - \\sin\\frac{u}{2} \\sin 2v \\right) \\sin u, \\quad z(u, v) = \\sin\\frac{u}{2} \\sin v + \\cos\\frac{u}{2} \\sin 2v$$ 2. **Topology**: Closed non-orientable manifold with $\\chi = 2 - 2g_{\\text{unoriented}} = 0$ (gluing two Möbius bands). 3. **Self-Intersection Locus**: At $v = 0, \\pi$, $x^2 + y^2 = r_0^2$ in plane $z = 0$. 4. **Tolerances**: Integrated Gaussian curvature $\\iint_{\\mathcal{M}} K dA = 2\\pi \\chi = 0$; self-intersection circle coplanarity $\\Delta z < 1.0 \\times 10^{-4}$.",
    evaluationCriteria:
      "- **Machine Check**: Verify normal orientation reversal $\\mathbf{n}(u+2\\pi, v) = -\\mathbf{n}(u, v)$ after one meridian circuit and self-intersection vertices lying on a circle of radius $r_0$. - **Visual Check**: Longitudinal ribs twist smoothly by $180^\\circ$ as the Figure-8 cross-section revolves around the central axis, seamlessly connecting interior and exterior into a single surface.",
  },
  "VFX-GEOM-05": {
    coreKey: "Hopf Fibration ($S^3 \\to S^2$) Nested Coaxial Tori Family & Linked Villarceau Circles",
    groundTruth:
      "1. **Hopf Map & $S^3$ Parameterization**: For $(z_1, z_2) \\in \\mathbb{C}^2$ with $|z_1|^2 + |z_2|^2 = 1$: $$z_1 = \\cos\\eta \\, e^{i(\\xi_1 + \\xi_2)}, \\quad z_2 = \\sin\\eta \\, e^{i(\\xi_1 - \\xi_2)} \\quad (\\eta \\in (0, \\pi/2)), \\quad \\pi(z_1, z_2) = (2 z_1 \\bar{z}_2, |z_1|^2 - |z_2|^2) \\in S^2$$ 2. **Stereographic Projection to $\\mathbb{R}^3$**: $$(x, y, z) = \\frac{1}{1 - \\text{Im}(z_2)} \\left( \\text{Re}(z_1), \\text{Im}(z_1), \\text{Re}(z_2) \\right)$$ Each constant-$\\eta$ preimage is a torus with major radius $R = \\csc(2\\eta)$ and minor radius $r = \\cot(2\\eta)$ ($R/r = \\sec(2\\eta)$). 3. **Linking Invariant**: Any two distinct fibers $F_a, F_b$ are exact circles ($e < 10^{-4}$) with Gauss linking number $\\text{Lk}(F_a, F_b) = \\pm 1$.",
    evaluationCriteria:
      "- **Machine Check**: Parse closed fiber loops to verify pairwise linking number $|\\text{Lk}| = 1$ and coaxial concentricity error $\\le 0.1\\text{ px}$. - **Visual Check**: Coaxially nested inner and outer tori colored smoothly by base $S^2$ coordinates, with Villarceau circle fibers sweeping at inclination $\\theta = \\pm \\arcsin(r/R)$ in interlocked harmony.",
  },
  "VFX-GEOM-06": {
    coreKey: "Discrete Surface Ricci Flow & Circle-Packing Metric Conformal Parameterization with Zero Angular Distortion",
    groundTruth:
      "1. **Circle-Packing Metric**: Edge length $l_{ij}^2 = r_i^2 + r_j^2 + 2 r_i r_j \\cos \\Phi_{ij}$ from vertex circle radii $r_i, r_j$ and intersection angle $\\Phi_{ij}$. 2. **Discrete Ricci Flow**: For log-conformal factor $u_i = \\ln r_i$: $$\\frac{d u_i}{dt} = \\bar{K}_i - K_i, \\quad K_i = 2\\pi - \\sum_{j,k \\in F(i)} \\theta_i^{jk}, \\quad \\sum \\bar{K}_i = 2\\pi \\chi$$ 3. **Zero Angular Distortion (Beltrami Criterion)**: $\\mu(z) = (\\partial f / \\partial \\bar{z}) / (\\partial f / \\partial z) \\equiv 0$. 4. **Tolerances**: Maximum triangle interior-angle distortion $|\\theta_{\\text{planar}} - \\theta_{\\text{manifold}}| \\le 1.2^\\circ$; Tissot indicatrix aspect ratio $a/b \\equiv 1.0 \\pm 0.02$.",
    evaluationCriteria:
      "- **Machine Check**: Measure interior angle differences between 3D and flattened 2D mesh triangles (global variance $\\sigma^2_{\\Delta \\theta} < 0.25$) and verify circular Tissot indicatrices. - **Visual Check**: Parametric grid lines intersect at strict $90^\\circ$ right angles even across high-curvature regions, with isotropic checkerboard cells and zero shear strain.",
  },
  "VFX-GEOM-07": {
    coreKey: "Costa Genus-1 Three-Ended Embedded Minimal Surface Zero-Mean-Curvature ($H=0$) Analytical Wireframe",
    groundTruth:
      "1. **Weierstrass-Enneper Parameterization**: Defined on the square torus $\\mathbb{C}/(\\mathbb{Z} + i\\mathbb{Z})$: $$\\mathbf{x}(\\zeta) = \\text{Re} \\int_0^\\zeta \\left( \\frac{1}{2}(1 - g^2) f, \\; \\frac{i}{2}(1 + g^2) f, \\; g f \\right) dz, \\quad g(z) = \\frac{2\\sqrt{2\\pi}}{a \\wp'(z)}, \\quad f(z) = \\wp(z)$$ with lattice invariants $g_2 \\approx 189.072772, g_3 = 0, e_1 = \\wp(1/2) \\approx 6.87519$. 2. **Asymptotic Ends**: One middle planar end ($z \\to 0$) and two symmetric top/bottom catenoidal ends ($z \\to \\pm 1/2$). 3. **Differential Invariants**: Principal curvatures $k_1 + k_2 = 0 \\implies H(\\mathbf{x}) \\equiv 0$; genus $g=1$, ends $k=3$, total Gaussian curvature $\\iint_{\\mathcal{M}} K dA = -12\\pi$; discrete $\\|H_{\\text{discrete}}\\| \\le 5.0 \\times 10^{-4}$ with $D_4$ symmetry error $< 0.1\\%$.",
    evaluationCriteria:
      "- **Machine Check**: Discrete mean curvature residual $\\sum |H_i| / N \\le 10^{-3}$ across mesh faces; non-contractible first-homology basis loops $\\gamma_1, \\gamma_2$ around the central genus-1 tunnel. - **Visual Check**: Clear central torus pass-through tunnel balanced between the flat middle planar skirt and symmetric flaring upper/lower catenoidal trumpets, everywhere saddle-shaped.",
  },
  "VFX-GEOM-08": {
    coreKey: "Curvature Metric-Tensor Guided Adaptive Anisotropic Mesh Edge Collapse/Flip Equilibrium",
    groundTruth:
      "1. **Curvature Metric Tensor**: From Shape Operator eigendecomposition: $$\\mathcal{M}(\\mathbf{x}) = V \\Lambda V^T, \\quad \\lambda_i = \\max\\left( \\epsilon_{\\text{min}}, \\frac{|k_i|}{\\epsilon_{\\text{tol}}} \\right)$$ 2. **Riemannian Edge Length & Local Operators**: $$L_{\\mathcal{M}}(\\mathbf{e}) \\approx \\sqrt{\\mathbf{e}^T \\bar{\\mathcal{M}}_{ij} \\mathbf{e}}$$ Split if $L_{\\mathcal{M}}(\\mathbf{e}) > \\sqrt{2}$, collapse if $L_{\\mathcal{M}}(\\mathbf{e}) < 1/\\sqrt{2}$, and apply metric Delaunay flips. 3. **Equilibrium Invariants**: Interior vertex valence expectation $\\mathbb{E}[\\text{deg}(v)] = 6$, mean metric edge length $\\bar{L}_{\\mathcal{M}} \\in [0.95, 1.05]$, Hausdorff error $d_H \\le \\epsilon_{\\text{tol}}$, and 0 inverted faces.",
    evaluationCriteria:
      "- **Machine Check**: Project mesh edges onto local curvature tensor ellipsoids to verify $L_{\\mathcal{M}} \\in [0.7, 1.4]$ and valence-6 interior vertex fraction $\\ge 85\\%$. - **Visual Check**: High-aspect-ratio triangles elongated parallel to sharp curvature ridges, transitioning smoothly into equilateral triangles across isotropic flat/spherical regions.",
  },
  "VFX-GEOM-09": {
    coreKey: "Möbius Strip Parallel-Transport Normal Holonomy Inversion & Midline Bifurcation Topological Surgery",
    groundTruth:
      "1. **3D Parametric Embedding** ($R_0 = 4.0, w = 1.0, v \\in [-w, w], u \\in [0, 2\\pi]$): $$\\mathbf{r}(u, v) = \\left( \\left(R_0 + \\frac{v}{2}\\cos\\frac{u}{2}\\right)\\cos u, \\; \\left(R_0 + \\frac{v}{2}\\cos\\frac{u}{2}\\right)\\sin u, \\; \\frac{v}{2}\\sin\\frac{u}{2} \\right)$$ 2. **Normal Holonomy Flip ($v=0$)**: $$\\mathbf{n}(u) = \\left( -\\sin\\frac{u}{2}\\cos u, \\; -\\sin\\frac{u}{2}\\sin u, \\; \\cos\\frac{u}{2} \\right), \\quad \\mathbf{n}(2\\pi) = -\\mathbf{n}(0) \\; (\\Delta \\theta = \\pi)$$ 3. **Midline Topological Surgery**: Pre-cut strip is non-orientable with $B=1$ boundary of length $4\\pi R_0$ ($\\chi_1 = 0$); cutting along midline $v=0$ yields a single connected, **orientable** strip with $4\\pi$ twist, $B=2$ boundaries, double perimeter, and $\\chi_2 = 0$.",
    evaluationCriteria:
      "- **Machine Check**: Normal vector endpoint trajectory satisfies $\\mathbf{n}(2\\pi) \\cdot \\mathbf{n}(0) = -1.000$; connected component count remains 1 before and after midline $v=0$ bisection. - **Visual Check**: Normal arrows tilt continuously along the loop without abrupt mirror jumps; midline bisection unzips the strip into a single doubly-twisted connected loop.",
  },
  "VFX-GEOM-10": {
    coreKey: "Poincaré Disk Hyperbolic Regular {7, 3} Tiling & Circle-Inversion Isometry Condensation",
    groundTruth:
      "1. **Poincaré Metric & Hyperbolic Distance**: $$ds^2 = \\frac{4 (dx^2 + dy^2)}{(1 - x^2 - y^2)^2}, \\quad d_{\\mathbb{H}}(z_1, z_2) = 2 \\operatorname{artanh} \\left| \\frac{z_1 - z_2}{1 - z_1 \\bar{z}_2} \\right|$$ 2. **Hyperbolic Schläfli Condition**: $(p-2)(q-2) > 4$ (for $\\{7, 3\\}: 5 > 4$). 3. **Central Heptagon Euclidean Vertex Radius**: $$\\cosh d_0 = \\frac{\\cos(\\pi/3)}{\\sin(\\pi/7)} \\approx 1.15238 \\implies r_0 = \\tanh(d_0 / 2) \\approx 0.26610$$ 4. **Circle-Inversion Isometry**: $\\sigma(z) = c + R^2 / (\\bar{z} - \\bar{c})$. 5. **Tolerances**: Vertex interior angles strictly $2\\pi/3 = 120.0^\\circ$ ($\\pm 0.1^\\circ$); geodesic arcs intersect the unit circle orthogonally at $90.0^\\circ \\pm 0.05^\\circ$.",
    evaluationCriteria:
      "- **Machine Check**: Geodesic arc endpoints intersect the unit boundary orthogonally (dot-product error $\\le 10^{-4}$), and valence-3 vertex interior angles sum to $\\sum_{k=1}^3 \\theta_k = 360.0^\\circ$. - **Visual Check**: Centered regular hyperbolic heptagon recursively reflected outward with exponential Euclidean foreshortening toward the $|z| \\to 1$ boundary circle.",
  },
};
