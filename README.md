# ViTeX-Bench Leaderboard

Public leaderboard for [ViTeX-Bench](https://vitex-bench.github.io/) ([paper](https://arxiv.org/abs/2609.40356)), a benchmark for video scene text editing.

**View:** https://vitex-bench.github.io/ViTeX-Bench-Leaderboard/

The site is static (no build step): `index.html`, `assets/site.css` and `assets/app.js` render a rotatable 3-D space of the three primary metrics (with face views for each pair of axes), the per-axis leaders, a sortable leaderboard of all 13 metrics, and the protocol. Fonts are self-hosted in `assets/fonts/`. Views are deep-linkable, e.g. `#view=cl&m=textctrl&sort=Warp_crop`. `leaderboard.js` loads `data/submissions.jsonl` and marks the Pareto set. Preview locally with `python3 -m http.server` and open http://localhost:8000/.

## Submitting

1. Run the [evaluation code](https://github.com/taco-group/ViTeX-Bench) on the frozen 157-video evaluation split of [ViTeX-Dataset](https://huggingface.co/datasets/ViTeX-Bench/ViTeX-Dataset). It writes an `eval.json`.
2. [Open a submission issue](https://github.com/ViTeX-Bench/ViTeX-Bench-Leaderboard/issues/new?template=submission.yml) and attach the `eval.json`.
3. After review, a maintainer adds the entry and closes the issue.

## Reporting

Every method is listed with the full 13-metric vector. The primary metrics are SeqAcc (text correctness), Warp<sub>c</sub> (temporal quality), and DreamSim<sub>loc</sub> (edit locality). Instead of a weighted aggregate, the table marks the Pareto set of raw editors on these three primaries. Post-processed outputs (e.g. Composite) and the Source reference are shown but not ranked. Methods whose temporal scores are not comparable (e.g. frame interpolation) are excluded from the Pareto comparison.

## For maintainers

```bash
python3 scripts/add_submission.py eval.json --method "Name" --family "C — mask-conditioned video inpainting" \
    --organization "Authors, 2026" --paper-url URL --code-url URL
git commit -am "Add Name" && git push
```

`data/submissions.jsonl` has one JSON object per method. The `kind` field is `editor`, `postprocessed`, or `reference`. `temporal_comparable` marks whether Flicker/Warp are comparable. The 13 metric fields hold video-level means. The project homepage reads this same file.
