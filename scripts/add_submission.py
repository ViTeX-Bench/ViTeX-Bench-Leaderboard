"""Append a reviewed submission to data/submissions.jsonl.

Reads the eval.json written by the ViTeX-Bench evaluation code
(benchmark/evaluate.py; top-level `aggregate` with the 13 metric means).

Example:
  python3 scripts/add_submission.py eval.json --method "MyEditor" \
      --family "C — mask-conditioned video inpainting" --organization "Doe et al., 2026" \
      --paper-url https://arxiv.org/abs/xxxx --code-url https://github.com/xxx/yyy
"""
import argparse
import datetime
import json
import pathlib

METRIC_KEYS = [
    "SeqAcc", "CharAcc", "TTS",
    "Flicker_full", "Flicker_crop", "Warp_full", "Warp_crop",
    "MUSIQ_full", "MUSIQ_crop",
    "PSNR_loc", "SSIM_loc", "LPIPS_loc", "DreamSim_loc",
]
DATA = pathlib.Path(__file__).resolve().parent.parent / "data" / "submissions.jsonl"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("eval_json")
    ap.add_argument("--method", required=True)
    ap.add_argument("--family", default="")
    ap.add_argument("--organization", default="")
    ap.add_argument("--paper-url", default="")
    ap.add_argument("--code-url", default="")
    ap.add_argument("--kind", choices=["editor", "postprocessed"], default="editor",
                    help="postprocessed = output of a wrapper such as Composite (not ranked)")
    ap.add_argument("--no-temporal", action="store_true",
                    help="temporal metrics are not comparable (e.g. frame interpolation)")
    ap.add_argument("--submitter", choices=["admin", "user"], default="user")
    args = ap.parse_args()

    data = json.loads(pathlib.Path(args.eval_json).read_text())
    agg = data.get("aggregate")
    if not isinstance(agg, dict):
        raise SystemExit("eval.json is missing the top-level `aggregate` field")
    entry = {
        "method": args.method, "kind": args.kind, "family": args.family,
        "organization": args.organization, "paper_url": args.paper_url, "code_url": args.code_url,
        "temporal_comparable": not args.no_temporal, "submitter": args.submitter,
        "added": datetime.date.today().isoformat(),
    }
    for k in METRIC_KEYS:
        v = agg.get(k)
        v = v.get("mean") if isinstance(v, dict) else v
        if v is None:
            raise SystemExit(f"aggregate.{k}.mean is missing")
        entry[k] = float(v)
    per_clip = data.get("per_clip")
    entry["n_clips"] = len(per_clip) if isinstance(per_clip, dict) else None
    if entry["n_clips"] not in (None, 157):
        print(f"warning: eval.json covers {entry['n_clips']} clips, expected 157")

    names = {json.loads(l)["method"] for l in DATA.read_text().splitlines() if l.strip()}
    if args.method in names:
        raise SystemExit(f"method {args.method!r} already exists in {DATA.name}")
    with DATA.open("a") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    print(f"added {args.method}")


if __name__ == "__main__":
    main()
