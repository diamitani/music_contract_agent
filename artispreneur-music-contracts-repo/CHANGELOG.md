# Changelog

All notable changes to this project are documented here.

## [1.1.0] — Harness-agnostic release

### Added
- `AGENTS.md` entry point for OpenCode/Codex-style harnesses.
- `schema/contract.schema.json` — strict JSON Schema every contract YAML
  record must validate against.
- `references/contracts/*.yaml` — 30 machine-readable contract records,
  the new source of truth for the routing table.
- `scripts/generate_index.py` — regenerates the human-readable index from
  the YAML records.
- `scripts/validate_library.py` — full library validator (schema, file
  existence, orphan detection, index-sync check), runnable locally or in
  CI.
- `scripts/render_docx.py` — harness-agnostic `.docx` fallback renderer
  using `python-docx`, for environments without a native document-
  generation tool.
- `.github/workflows/validate.yml` — CI enforcement of the validator on
  every push and pull request.
- Six original templates: Exclusive Beat License Agreement, Non-Exclusive
  Beat License Agreement, NDA/Non-Circumvention Agreement, Music
  Distribution Agreement, Merchandise License Agreement, Independent
  Contractor Agreement.
- `README.md`, `LICENSE`, `NOTICE.md`, `CONTRIBUTING.md` for public/
  internal repo readiness.

### Changed
- Removed all Claude-specific tool references (`present_files`,
  `ask_user_input_v0`, hardcoded `/mnt/skills/...` paths) from `SKILL.md`
  and every `references/*.md` file — replaced with harness-neutral
  guidance that defers to whatever capability the runtime provides.
- `00-contract-library-index.md` is now a generated file — do not hand-edit.

## [1.0.0] — Initial library

- Initial `music-contract-agent` skill: `SKILL.md`, `soul.md`, and six
  numbered workflow reference files.
- 24 templates extracted from an uploaded document set, each with a
  matching intake questionnaire.
