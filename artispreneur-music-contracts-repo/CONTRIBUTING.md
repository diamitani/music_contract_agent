# Contributing

## Ground rules

1. Every change to `skills/music-contract-agent/references/{templates,questionnaires,contracts}/`
   must keep those three directories in sync — one template, one
   questionnaire, one YAML record, sharing the same slug.
2. YAML records must validate against `schema/contract.schema.json`. No
   exceptions — this is what lets any harness (or non-LLM tool) route
   requests against the library reliably.
3. `references/00-contract-library-index.md` is generated, not
   hand-written. Never edit it directly.
4. Keep the skill harness-agnostic. Don't introduce a reference to a
   specific vendor's tool name (e.g. a specific product's function-call
   name) anywhere in `SKILL.md`, `AGENTS.md`, `soul.md`, or the numbered
   `references/*.md` files. If a step needs "some way to do X," describe
   it generically and let the harness fill in the mechanism.
5. Don't copy contract text verbatim from a third-party source (a
   competitor's site, a paid template pack, etc.) into a new template.
   Synthesize original language from generally known clause structures,
   the way the six `status: original` templates were built. See
   `NOTICE.md` for why this matters.

## Adding or editing a contract type

```bash
# 1. Write/edit the three files for your slug
skills/music-contract-agent/references/templates/<slug>.md
skills/music-contract-agent/references/questionnaires/<slug>-questionnaire.md
skills/music-contract-agent/references/contracts/<slug>.yaml

# 2. Validate
pip install -r requirements.txt
python3 scripts/validate_library.py

# 3. Regenerate the routing table
python3 scripts/generate_index.py

# 4. Re-validate (should now pass, including the "index in sync" check)
python3 scripts/validate_library.py
```

Open a pull request. CI (`.github/workflows/validate.yml`) runs the same
validator automatically — a PR with a schema violation, an orphaned file,
or a stale index will fail the check.

## Style for templates and questionnaires

- Templates use square-bracket placeholders (`[ARTIST NAME]`, `[DATE]`) or
  blank underscores for fill-in fields — pick whichever the existing
  template used as your starting point uses, for consistency within that
  file.
- Questionnaires follow the existing five-part shape: When to use it, What
  it affects, grouped intake questions (Parties/Money/Rights/Control),
  risk patterns with a severity marker, and a delivery checklist. Look at
  an existing questionnaire before writing a new one from scratch.
- Risk flag severities in prose questionnaires use bold markers the YAML
  generator parses: `**Red flag:**`, `**Yellow:**`, `**Green:**`, or
  `**Always [...] attorney [...]:**` for the `always_attorney` severity.
  If you're hand-writing the YAML instead of relying on the (currently
  ad hoc) parser in `gen_contract_yaml.py`, just set `severity` directly.

## Reporting a problem with the legal content

This isn't a law firm and there's no formal legal review process here —
if you're a practicing entertainment attorney and see something
substantively wrong (not just a style preference), please open an issue
describing the specific clause and jurisdiction concern. Please don't
submit unreviewed legal opinions as fact; frame it as "here's what I'd
flag and why" so maintainers can evaluate it.
