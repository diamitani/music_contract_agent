# Artispreneur Music Contract Agent

An open, harness-agnostic AI agent skill for drafting, reviewing, and
explaining music-business contracts — built for independent artists,
producers, songwriters, managers, and the small businesses around them.

Works in **Claude** (claude.ai, Claude Code, Claude Cowork), **OpenCode** /
Codex-style CLI agents, or any other LLM harness that can read local files.
No vendor lock-in: the instructions don't assume any single tool name, and
the contract library is machine-readable YAML underneath the human-readable
Markdown, so even non-LLM tooling can route requests against it.

> **Not legal advice.** This project helps people understand and draft
> contracts. It is not a substitute for a licensed attorney. See
> [`NOTICE.md`](./NOTICE.md) and
> `skills/music-contract-agent/references/05-safety-and-legal-boundaries.md`.

## What's in here

```
.
├── skills/music-contract-agent/     ← the portable skill itself
│   ├── SKILL.md                     ← Claude Skills entry point
│   ├── AGENTS.md                    ← OpenCode/Codex-style entry point
│   ├── soul.md                      ← identity, voice, hard constraints
│   └── references/
│       ├── 00-contract-library-index.md   ← GENERATED routing table
│       ├── 01–06-*.md               ← workflow, drafting rules, safety, QA
│       ├── contracts/*.yaml         ← 30 strict, schema-validated records (source of truth)
│       ├── templates/*.md           ← 30 contract templates
│       └── questionnaires/*.md      ← 30 matching intake guides
├── schema/contract.schema.json      ← the strict contract every YAML record must satisfy
├── scripts/
│   ├── validate_library.py          ← run this before every commit / in CI
│   ├── generate_index.py            ← regenerates the routing table from YAML
│   └── render_docx.py               ← harness-agnostic .docx fallback renderer
└── .github/workflows/validate.yml   ← CI enforcement of the above
```

## Quickstart by harness

### Claude (claude.ai Projects, Claude Code, Claude Cowork)

- **claude.ai Project**: upload the contents of `skills/music-contract-agent/`
  into a Project's knowledge, or upload the whole repo as a Project's file
  set. Claude will read `SKILL.md`'s frontmatter and trigger on relevant
  requests.
- **Claude Code / Cowork (skills)**: copy or symlink
  `skills/music-contract-agent/` into wherever your Claude environment
  loads skills from (e.g. a `skills/` directory it's configured to scan).

### OpenCode / Codex-style CLI agents

Point the agent at this repo (or copy `skills/music-contract-agent/` into
your project). These harnesses look for `AGENTS.md` by convention — it's a
thin pointer into `SKILL.md` and `soul.md`, written the way these tools
expect.

### Any other agent / bring your own runner

Everything is plain Markdown and YAML. Feed `SKILL.md`, `soul.md`, and the
relevant `references/` files into whatever context-loading mechanism your
system uses. Nothing in here calls a tool by a vendor-specific name — see
the "Harness compatibility" section of `SKILL.md`.

### Just want the contracts, no agent at all

`skills/music-contract-agent/references/templates/*.md` are readable,
fillable templates on their own. `references/contracts/*.yaml` gives you
the structured metadata (parties, risk flags, required questions) if you're
building your own tool against this library instead of using an LLM.

## Validating the library

Before committing any change to a template, questionnaire, or YAML record:

```bash
pip install -r requirements.txt
python3 scripts/validate_library.py
```

This checks: every YAML record validates against
`schema/contract.schema.json`, every referenced template/questionnaire file
exists, there are no orphan files, and the generated index is in sync. CI
runs this on every push and pull request.

If you edit a YAML record, regenerate the human-readable index before
committing:

```bash
python3 scripts/generate_index.py
```

## Adding a new contract type

1. Write the template: `skills/music-contract-agent/references/templates/<slug>.md`.
2. Write the matching questionnaire: `.../references/questionnaires/<slug>-questionnaire.md`.
3. Write the YAML record: `.../references/contracts/<slug>.yaml`, following
   `schema/contract.schema.json` (see any existing record for the shape).
4. Run `python3 scripts/validate_library.py` — fix anything it flags.
5. Run `python3 scripts/generate_index.py` to update the routing table.
6. Open a pull request. CI re-runs the validator automatically.

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for more detail.

## License

Code, scripts, and schema: [MIT](./LICENSE).

Contract templates and their licensing status: see
[`NOTICE.md`](./NOTICE.md) — **read this before you make the repo public**,
it flags an important provenance question you need to resolve first.
