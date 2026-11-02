# Material 3 / M3 Expressive: tokens and colour engine

- **Vendor**: Google · **Licence**: Apache-2.0 (`LICENSE`, `color-utilities/LICENSE`)
- **Sources**:
  - https://github.com/material-components/material-web, `main` @ `de5470f` (2026-10-29): `tokens/versions/latest/sass/`
  - https://github.com/material-foundation/material-color-utilities, `main` @ `bd811e4` (2026-10-19): `dev_guide/`, `typescript/`
- **Not reachable from this session**: https://m3.material.io (guidance prose, the Expressive research, the motion-theming blog). See [`../blocked-sources.md`](../blocked-sources.md).
- **Retrieved**: 2026-11-01

## Files

| File | What it is |
|---|---|
| `tokens/_md-sys-motion.scss` | Spring tokens (fast, default and slow × spatial and effects, as damping and stiffness) plus legacy duration and easing tokens |
| `tokens/_md-sys-shape.scss` | Corner scale incl. the Expressive "increased" steps (20, 32, 48px) |
| `tokens/_md-sys-typescale.scss`, `_md-sys-typescale-emphasized.scss` | Baseline and emphasized type roles |
| `tokens/_md-sys-color.scss`, `_md-sys-state.scss`, `_md-sys-elevation.scss` | Colour roles (light, default contrast), state-layer opacities, elevation levels |
| `color-utilities/creating_color_scheme.md`, `extracting_colors.md`, `refining_contrast.md` | Google's dev guides for the colour engine |
| `color-utilities/variant.ts` | The ten scheme variants incl. `CMF` (2026) |
| `color-utilities/scheme_cmf.ts` | The new two-seed scheme |
| `color-utilities/contrast_curve.ts` | Contrast targets per contrast level |
| `color-utilities/dislike_analyzer.ts` | The "universally disliked" dark yellow-green rule (Palmer and Schloss 2010) |
| `color-utilities/temperature_cache.ts` | Warm and cool analogous colours and complements |
| `color-utilities/score.ts` | Ranking image-extracted colours for theming |

Analysis: [`../ux-material-3.md`](../ux-material-3.md) and
[`../ux-colour-science.md`](../ux-colour-science.md).
