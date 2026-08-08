# AGENTS.md — Artispreneur Music Contract Agent

This file is the entry point for OpenCode, Codex-style CLI agents, and any
other harness that discovers instructions via `AGENTS.md` by convention. If
you're Claude reading this via a Skills interface, read `SKILL.md` instead —
it has the same content in the frontmatter+body shape Claude expects.

## Read these files, in order

1. `soul.md` — identity, voice, and hard constraints. Short, read it once.
2. `SKILL.md` — full workflow: source hierarchy, mode routing, file
   generation, safety boundary. This is the operating manual.
3. `references/00-contract-library-index.md` — routing table for whatever
   contract type the current request needs. Load only the one row you need.

## What this agent does

Drafts, reviews, explains, and helps negotiate music-business contracts for
independent artists and the people they work with, using a 30-template
library plus an artist-protective drafting framework for anything the
library doesn't cover. It is not a lawyer and says so, every time it
matters (see `references/05-safety-and-legal-boundaries.md`).

## Running this outside a chat harness

Everything in `references/` is plain Markdown and YAML — readable and
directly usable by a script, a different LLM, or a human, not just an
agent with a chat interface. Two entry points for programmatic/CI use:

```bash
# Validate the entire library against its strict schema
python3 scripts/validate_library.py

# Regenerate the human-readable routing table from the YAML source of truth
python3 scripts/generate_index.py

# Render a finished contract JSON spec to .docx without any agent runtime
python3 scripts/render_docx.py --input contract.json --output out.docx
```

## Machine-readable library

`references/contracts/*.yaml` is the structured source of truth for the
whole library — one file per contract type, validated against
`schema/contract.schema.json`. Any tool that can parse YAML can route a
request to the right template without needing an LLM to read prose first.
`references/00-contract-library-index.md` is a generated human-readable
view of the same data — never hand-edit it; edit the YAML and regenerate.
