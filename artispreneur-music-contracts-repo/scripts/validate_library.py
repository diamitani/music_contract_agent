#!/usr/bin/env python3
"""
Validates the entire music-contract-agent library against its strict contract:

1. Every references/contracts/*.yaml file validates against schema/contract.schema.json.
2. Every record's template_file exists in references/templates/.
3. Every record's questionnaire_file exists in references/questionnaires/.
4. Every file in references/templates/ has a matching YAML record (no orphans).
5. Every file in references/questionnaires/ has a matching YAML record (no orphans).
6. references/00-contract-library-index.md matches what generate_index.py would
   produce right now (catches stale hand-edits).

Exit code 0 = pass, 1 = fail. Designed to run identically on a laptop, in CI,
or inside any agent harness that can execute Python — this script has no
dependency on Claude, OpenCode, or any other specific runtime.

Usage: python3 scripts/validate_library.py
"""
import glob
import json
import os
import re
import sys

import yaml
from jsonschema import Draft7Validator

MAX_DESCRIPTION_LENGTH = 1024

HERE = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.dirname(HERE)
SKILL_DIR = os.path.join(REPO_ROOT, "skills", "music-contract-agent")
REFS = os.path.join(SKILL_DIR, "references")
YAML_DIR = os.path.join(REFS, "contracts")
TEMPLATES_DIR = os.path.join(REFS, "templates")
QUESTIONNAIRES_DIR = os.path.join(REFS, "questionnaires")
SCHEMA_PATH = os.path.join(REPO_ROOT, "schema", "contract.schema.json")
INDEX_PATH = os.path.join(REFS, "00-contract-library-index.md")

errors = []


def fail(msg):
    errors.append(msg)


def main():
    with open(SCHEMA_PATH, encoding="utf-8") as f:
        schema = json.load(f)
    validator = Draft7Validator(schema)

    yaml_files = sorted(glob.glob(os.path.join(YAML_DIR, "*.yaml")))
    if not yaml_files:
        fail(f"No YAML records found in {YAML_DIR}")

    known_templates = set()
    known_questionnaires = set()

    for path in yaml_files:
        stem = os.path.splitext(os.path.basename(path))[0]
        with open(path, encoding="utf-8") as f:
            record = yaml.safe_load(f)

        schema_errors = sorted(validator.iter_errors(record), key=lambda e: e.path)
        for e in schema_errors:
            fail(f"[schema] {path}: {e.message} (at {'/'.join(str(p) for p in e.path)})")

        if record.get("id") != stem:
            fail(f"[id mismatch] {path}: id field '{record.get('id')}' != filename stem '{stem}'")

        tmpl = record.get("template_file", "")
        if tmpl:
            tmpl_path = os.path.join(TEMPLATES_DIR, tmpl)
            if not os.path.isfile(tmpl_path):
                fail(f"[missing file] {path}: template_file '{tmpl}' not found in templates/")
            known_templates.add(tmpl)

        qf = record.get("questionnaire_file", "")
        if qf:
            qf_path = os.path.join(QUESTIONNAIRES_DIR, qf)
            if not os.path.isfile(qf_path):
                fail(f"[missing file] {path}: questionnaire_file '{qf}' not found in questionnaires/")
            known_questionnaires.add(qf)

    actual_templates = {os.path.basename(p) for p in glob.glob(os.path.join(TEMPLATES_DIR, "*.md"))}
    actual_questionnaires = {os.path.basename(p) for p in glob.glob(os.path.join(QUESTIONNAIRES_DIR, "*.md"))}

    for orphan in actual_templates - known_templates:
        fail(f"[orphan] templates/{orphan} has no YAML record referencing it")
    for orphan in actual_questionnaires - known_questionnaires:
        fail(f"[orphan] questionnaires/{orphan} has no YAML record referencing it")

    # Check the index file is up to date with the YAML source of truth
    sys.path.insert(0, os.path.join(REPO_ROOT, "scripts"))
    import generate_index  # noqa: E402

    records = generate_index.load_records()
    expected = generate_index.render(records)
    with open(INDEX_PATH, encoding="utf-8") as f:
        actual = f.read()
    if expected != actual:
        fail(
            "[stale index] 00-contract-library-index.md does not match the YAML "
            "source of truth. Run: python3 scripts/generate_index.py"
        )

    # Check SKILL.md frontmatter description stays within common platform limits
    skill_md_path = os.path.join(SKILL_DIR, "SKILL.md")
    with open(skill_md_path, encoding="utf-8") as f:
        skill_text = f.read()
    desc_match = re.search(r'^description:\s*"(.*?)"\s*$', skill_text, re.MULTILINE | re.DOTALL)
    if not desc_match:
        fail(f"[frontmatter] Could not find a quoted description: field in {skill_md_path}")
    else:
        desc_len = len(desc_match.group(1))
        if desc_len > MAX_DESCRIPTION_LENGTH:
            fail(
                f"[description too long] SKILL.md frontmatter description is "
                f"{desc_len} characters, over the {MAX_DESCRIPTION_LENGTH}-character "
                f"limit enforced by this project. Trim it."
            )

    if errors:
        print(f"FAILED — {len(errors)} issue(s):\n")
        for e in errors:
            print(f"  - {e}")
        sys.exit(1)

    print(f"PASSED — {len(yaml_files)} contract records validated, "
          f"{len(actual_templates)} templates, {len(actual_questionnaires)} questionnaires, "
          f"index in sync.")
    sys.exit(0)


if __name__ == "__main__":
    main()
