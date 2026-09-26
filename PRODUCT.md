# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Method authors**: researchers working on video scene text editing who want to know where their method lands, and whether and how to submit a result.
- **Readers and reviewers**: people arriving from the paper (NeurIPS 2026 Evaluations & Datasets track) or the project page who need to grasp the trade-offs between methods quickly, without reading all 13 columns.
- **Practitioners**: people picking an existing editor for a real task, who compare methods on the specific metric or axis that matters to them.

All three audiences use desktop and phone. The page must be comfortable to read on both, in light and dark themes.

## Product Purpose

The public, open-submission leaderboard for ViTeX-Bench, a benchmark for video scene text editing: replacing the text inside a masked region of a real video while leaving the rest of the scene and its motion unchanged. Anyone can evaluate a method on the frozen 157-video evaluation split and submit the resulting `eval.json`. After a maintainer reviews it, the method appears on the board. Success means that visitors come away understanding who leads on which axis and why no single method wins everywhere, and that authors find submitting clear enough to go ahead.

## Positioning

ViTeX-Bench measures text correctness with OCR (does the edited region read as the target string over time?) and evaluates it alongside temporal quality and edit locality. It deliberately has **no weighted aggregate score**. Each axis has one primary metric: SeqAcc ↑ for correctness, Warp<sub>c</sub> ↓ for temporal quality and DreamSim<sub>loc</sub> ↓ for locality. Competition is framed as a **Pareto front** over those three metrics. The leaderboard is competitive ("whose model is best"), but only on those defensible terms. The trade-off story (accurate text, temporal stability and scene preservation are hard to get together) is the thing a generic leaderboard cannot copy.

## Operating Context

- Hosted as a static site on GitHub Pages at `https://vitex-bench.github.io/ViTeX-Bench-Leaderboard/`. The project homepage is at `https://vitex-bench.github.io/`.
- Data lives in `data/submissions.jsonl`, with one JSON object per method. The fields are `method`, `kind` (`editor` | `postprocessed` | `reference`), `family`, `organization`, `paper_url`, `code_url`, `temporal_comparable`, `submitter`, `added`, the 13 metric means and `n_clips`.
- Submission flow: run the [evaluation code](https://github.com/ViTeX-Bench/ViTeX-Bench) on the frozen split of [ViTeX-Dataset](https://huggingface.co/datasets/ViTeX-Bench/ViTeX-Dataset), then open a GitHub issue using `.github/ISSUE_TEMPLATE/submission.yml` and attach `eval.json`. A maintainer runs `scripts/add_submission.py` and pushes.
- Method families: A, per-frame image editing; B, first-frame editing + propagation; C, mask-conditioned video inpainting; D, instruction-guided video editing; plus the reference editor and Other.

## Capabilities and Constraints

- **13 metrics on three axes**:
  - Text correctness: SeqAcc ↑, CharAcc ↑, TTS ↑.
  - Visual/temporal quality: Flicker<sub>f/c</sub> ↓, Warp<sub>f/c</sub> ↓, MUSIQ<sub>f/c</sub> ↑.
  - Edit locality: PSNR<sub>loc</sub> ↑, SSIM<sub>loc</sub> ↑, LPIPS<sub>loc</sub> ↓, DreamSim<sub>loc</sub> ↓.
  - Primaries: SeqAcc, Warp<sub>c</sub>, DreamSim<sub>loc</sub>.
  - The `_f`/`full` suffix means full frame and `_c`/`crop` means text crop.
- **Pareto rule**: a raw editor (`kind: editor` with `temporal_comparable: true`) is on the front unless another eligible editor is at least as good on all three primaries and strictly better on one.
- **Unranked rows**: post-processed outputs (e.g. Composite) and the Source video reference are shown but never ranked. The Source reference has PSNR<sub>loc</sub> = ∞.
- **Non-comparable temporal scores**: VideoPainter's Flicker/Warp come from interpolated frames (`temporal_comparable: false`). They are marked † and excluded from temporal comparison and from the Pareto set.
- **Strict protocol (confirmed)**: no overall #1, no aggregate score. Rankings are allowed per axis and per metric, alongside the Pareto front and the full 13-metric vector.
- **Stack**: plain static HTML/CSS/JS with no build step, served by GitHub Pages. The page reads `submissions.jsonl` at runtime so that adding a row never needs a page change.
- **Homepage coupling**: the homepage currently loads `leaderboard.js` from the live URL and calls `ViTeXLeaderboard.load/render`. The user confirmed the redesign does **not** need to preserve that API; the homepage will be redesigned later to adapt to this leaderboard.

## Brand Commitments

- The name is **ViTeX-Bench**, capitalized exactly that way. The reference editor is **ViTeX-Edit-14B**.
- Existing assets live in the homepage repo: `vitex_icon.png` and the favicon, at `https://vitex-bench.github.io/static/images/`.
- The voice is scholarly and precise. It states what is measured and what is not, and never overclaims.
- Visual commitments the user confirmed on 2026-09-26:
  - Monochrome black and white only, with no blue or red palette.
  - A minimal, airy layout inspired by stars in a dark universe, with little text per screen.
  - Clear, easy-to-read sans-serif type only. No handwritten-looking or script-like italic faces.
  - The three primary axes shown together in one rotatable 3-D space.
- The Pareto set is three-dimensional. No view may draw it as if it were a 2-D frontier.

## Evidence on Hand

- `data/submissions.jsonl` holds 11 real rows: 9 raw editors, 1 post-processed (ViTeX-Edit-14B Composite) and 1 reference (Source video).
- The paper is at `/home/xh/PJ/ViTeX/ViTeX_arxiv/build/paper.pdf`. Its headline finding is that across eight baselines from four families, accurate text, temporal stability and scene preservation remain hard to achieve together. ViTeX-Edit-14B has the highest CharAcc (0.688) among video-native editors and the lowest comparable text-crop Warp among raw editor outputs.
- Dataset facts: 387 real-world 720p videos (1280×720, 120 frames, 24 fps), split into 230 paired training videos and 157 frozen evaluation videos. The evaluation split covers four scripts: Latin, Chinese, Japanese, and Cyrillic.
- Absent: confidence intervals per row, per-clip results on the site, submission dates beyond `added`, and user submissions so far (all rows are `submitter: admin`). None of these may be fabricated.

## Product Principles

1. **Protocol first**: the site shows exactly what the benchmark defends: per-axis leaders, the Pareto front and full vectors. It never invents a single overall score.
2. **Trade-offs are the story**: make it visible within seconds that no method wins on every axis.
3. **Every number is traceable**: each value links back to its metric definition, its direction (↑/↓) and its comparability caveats (†, unranked rows).
4. **Submitting is obvious**: the path from "my method" to "on the board" is short, concrete and always reachable.
5. **Equal on phone and desktop**: every comparison a desktop visitor can make is also possible on a phone.

## Accessibility & Inclusion

- WCAG 2.1 AA contrast in both light and dark themes.
- Direction and status (↑/↓, Pareto, †, unranked) never rely on color alone.
- Full keyboard operability for sorting and filtering.
- Respect `prefers-reduced-motion` and `prefers-color-scheme`.
