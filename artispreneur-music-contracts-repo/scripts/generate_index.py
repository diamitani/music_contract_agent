"""
Regenerates references/00-contract-library-index.md from the strict YAML
records in references/contracts/*.yaml.

This makes the YAML the single source of truth. Never hand-edit the routing
table in 00-contract-library-index.md directly — edit the YAML record and
re-run this script. CI (.github/workflows/validate.yml) checks that the
committed index file matches what this script would generate, so a stale
hand-edit fails the build.

Usage: python3 scripts/generate_index.py
"""
import os, glob, yaml

HERE = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.dirname(HERE)
REFS = os.path.join(REPO_ROOT, "skills", "music-contract-agent", "references")
YAML_DIR = os.path.join(REFS, "contracts")
INDEX_PATH = os.path.join(REFS, "00-contract-library-index.md")

CATEGORY_LABELS = {
    "management_and_booking": "Management & Booking",
    "recording_and_production": "Recording & Production",
    "songwriting_and_publishing": "Songwriting & Publishing",
    "licensing": "Licensing",
    "live_performance_and_venue": "Live Performance & Venue",
    "brand_and_content": "Brand & Content",
    "release_forms": "Release Forms",
    "business_formation": "Business Formation",
    "protective_and_general": "Protective & General",
}

CATEGORY_ORDER = list(CATEGORY_LABELS.keys())

STATUS_LABELS = {
    "sourced": "Sourced from Artispreneur upload set",
    "original": "Original Artispreneur-framework document",
    "adapted": "Adapted from a nearby library template",
}

MISSING = [
    ("Independent label services agreement", None),
    ("Music publishing administration agreement", None),
    ("Co-publishing agreement", None),
    ("Featured artist agreement", None),
    ("Vocalist/session musician agreement", "independent-contractor-agreement.md + talent-producer-agreement.md"),
    ("Music video production agreement", "production-agreement.md + videographer-photographer-release.md"),
    ("Tour support agreement", None),
    ("Public relations agreement", "independent-contractor-agreement.md"),
    ("Marketing services agreement", "independent-contractor-agreement.md"),
    ("Social-media management agreement", "independent-contractor-agreement.md"),
    ("Catalog sale or acquisition term sheet", None),
    ("Catalog administration agreement", None),
    ("Artist name, likeness, and publicity release (long-form)", "talent-likeness-release-form.md"),
    ("Cease-and-desist or demand-letter draft", None),
]


def load_records():
    records = []
    for path in sorted(glob.glob(os.path.join(YAML_DIR, "*.yaml"))):
        with open(path, encoding="utf-8") as f:
            records.append(yaml.safe_load(f))
    return records


def render(records):
    by_cat = {c: [] for c in CATEGORY_ORDER}
    for r in records:
        by_cat[r["category"]].append(r)
    for c in by_cat:
        by_cat[c].sort(key=lambda r: r["title"])

    lines = []
    lines.append("# Artispreneur Contracts Library — Index")
    lines.append("")
    lines.append(
        "**Generated file — do not hand-edit.** This table is generated from the strict "
        "YAML records in `references/contracts/*.yaml` by `scripts/generate_index.py`. "
        "To change a routing entry, edit the YAML record and re-run that script. "
        "CI checks that this file matches the YAML; a stale hand-edit fails the build."
    )
    lines.append("")
    lines.append(
        "This is the routing table. Read this first when a user asks for any music "
        "agreement, review, or explanation — it tells you which template and "
        "questionnaire to load, and flags where no template exists so you switch to "
        "**Missing Template Mode** (`references/03-review-and-missing-template-modes.md`)."
    )
    lines.append("")
    lines.append(
        "Load only the template and its matching questionnaire for the row that "
        "matches the request — don't load the whole library into context for one deal."
    )
    lines.append("")
    lines.append(f"## In the library ({len(records)} templates)")
    lines.append("")

    n = 1
    for cat in CATEGORY_ORDER:
        rows = by_cat[cat]
        if not rows:
            continue
        lines.append(f"### {CATEGORY_LABELS[cat]}")
        lines.append("")
        lines.append("| # | Contract Type | Status | Rights Affected | Template | Questionnaire | YAML Record |")
        lines.append("|---|---|---|---|---|---|---|")
        for r in rows:
            rights = ", ".join(r["rights_affected"])
            lines.append(
                f"| {n} | {r['title']} | {STATUS_LABELS[r['status']]} | {rights} | "
                f"`references/templates/{r['template_file']}` | "
                f"`references/questionnaires/{r['questionnaire_file']}` | "
                f"`references/contracts/{r['id']}.yaml` |"
            )
            n += 1
        lines.append("")

    lines.append("## Not in the library — use Missing Template Mode")
    lines.append("")
    lines.append(
        "These contract types are named in the skill's supported scope but have no "
        "template on file. Do not fabricate a source or claim a template exists. "
        "Tell the user, then draft from the artist-protective framework in "
        "`references/02-drafting-rules-and-defaults.md`."
    )
    lines.append("")
    for name, adapt in MISSING:
        if adapt:
            lines.append(f"- {name} (adapt from `{adapt}`)")
        else:
            lines.append(f"- {name}")
    lines.append("")
    lines.append(
        "When one of these is requested, check first whether an adjacent template in "
        "the library is close enough to adapt (noted above where a reasonable starting "
        "point exists). Say so explicitly: \"There's no exact Artispreneur template for "
        "X, but Y is close and I'm using it as a starting structure.\" Never present an "
        "adapted or original draft as if it came from an approved template it didn't "
        "come from."
    )
    lines.append("")
    return "\n".join(lines) + "\n"


if __name__ == "__main__":
    records = load_records()
    content = render(records)
    with open(INDEX_PATH, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Regenerated {INDEX_PATH} from {len(records)} YAML records.")
