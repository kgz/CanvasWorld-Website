## Context

`Base` renders particles, GPU line strips, or a fullscreen shader. Lorenz is the only 3D page and uses a line trail. Calabi–Yau is a surface: Hanson 1994 complex superquadric for \(z_1^n + z_2^n = 1\), \(n \times n\) Riemann patches, orthogonal mix of imaginary parts into the third axis.

## Goals / Non-Goals

**Goals:** Lit triangle mesh of the classic quintic slice; catalog card under `misc`; OD chrome; gallery thumb; About math matches code.

**Non-Goals:** Full 6-real CY3; raymarching; wireframe-only; point-cloud fallback; new `geometry` category.

## Decisions

1. **Hanson cos/sin (not cosh/sinh).** \(z_1^n + z_2^n = 1\) with \(z_1 = e^{2\pi i k_1/n}[\cos(x+iy)]^{2/n}\), \(z_2 = e^{2\pi i k_2/n}[\sin(x+iy)]^{2/n}\). \(x \in [0,\pi/2]\), \(y \in [-\pi/2,\pi/2]\). Matches the Wikipedia / NOVA look. Cosh/sinh solves \(z_1^n - z_2^n = 1\) instead.
2. **All patches.** Loop \(k_1,k_2 \in \{0,\dots,n-1\}\). Color by patch (k1→red, k2→green) so the 25 quintic sheets read.
3. **New `drawMode: 'mesh'` on `Base`.** Indexed BufferGeometry + `MeshStandardMaterial` vertex colors, double-sided, ambient + two directional lights. Not a one-off Canvas inside the page (screenshot tagging and OrbitControls stay in `Base`).
4. **Transport `n` reveals triangles** (`geometry.setDrawRange`), same as Lorenz trail length. Screenshot mode draws the full mesh immediately.
5. **UI params:** `n` (degree, default 5), `a` (projection mix, default ~0.4), `res` (grid per patch). Hand-rolled page like Lorenz (`createAttractorPage` is 2D-only).
6. **Category `misc`.** No new gallery taxonomy.

## Risks / Trade-offs

- [Complex power branch cuts at \(\cos/\sin \approx 0\)] → nudge domain off exact endpoints; treat \(r < \varepsilon\) as zero.
- [High `n` × `res` vertex count] → cap `res`; rebuild mesh only when params change.
- [Double-sided lighting looks flat] → two opposing lights; roughness ~0.45.
- [Thumb of a 3D mesh is pose-dependent] → disable autoRotate in screenshot mode (existing Lorenz pattern); fixed camera.
