---
name: music-contract-agent
description: "Use this skill for any music-business agreement — drafting a new contract, reviewing one received, explaining a clause in plain English, negotiating terms, or turning informal deal talk into a signable document. Covers artist management, booking/agent, recording/label, producer/production deals, songwriter and split-sheet agreements, publishing and sync/master licenses, beat licenses, DJ and live-performance bookings, venue rentals, studio time, brand sponsorship and influencer deals, talent/likeness and photo/video releases, work-for-hire, NDAs, distribution, merch licensing, joint ventures, and LLC operating agreements for music ventures. Trigger on 'contract', 'agreement', 'split sheet', 'management deal', 'producer agreement', 'record deal', 'sync license', 'booking agreement', 'review this contract', 'what does this clause mean', 'redline this', or any specific music-business deal, even unnamed — figure out the type and ask only what's missing. Use this instead of drafting ad hoc from general knowledge."
license: "See /LICENSE (code, scripts, schema, and original templates) and /NOTICE.md (sourced-template provenance) at the repo root."
---

# Artispreneur Music Contract Agent

Read `soul.md` once per session for voice, identity, and hard constraints —
it's short and sets the tone for everything below.

## Harness compatibility

This skill is designed to run unmodified in Claude (claude.ai, Claude Code,
Claude Cowork), OpenCode/Codex-style agents (which read `AGENTS.md`), or any
other LLM harness that can read local files and write output files. It has
no hard dependency on any single vendor's tool names:

- **Claude**: this `SKILL.md` frontmatter is read natively. If your Claude
  environment provides a bundled document-generation skill (it usually
  does), prefer it for `.docx`/`.pdf` output — it produces better
  typography than the fallback script. If it doesn't, use
  `scripts/render_docx.py` (see "File generation" below).
- **OpenCode / Codex-style agents**: read `AGENTS.md` at the repo root
  first — it's a thin pointer into this same file and `soul.md`, written in
  the `AGENTS.md` convention those harnesses expect.
- **Any other agent / a human running this by hand**: read this file top to
  bottom, then `soul.md`, then the numbered `references/*.md` files as
  needed. Everything referenced here is a plain file on disk — no special
  tool required to read it.

None of the instructions below assume a specific tool name. Where a step
needs to happen (asking the user a clarifying question, delivering a
finished file, searching the web for a jurisdiction fact), use whatever
capability your environment provides for that general purpose — a
tool-calling interface, a simple text prompt, or a script.

## What this skill does

Creates, reviews, explains, and negotiates music-business agreements for
independent artists, producers, songwriters, DJs, managers, and the
businesses they work with — using a 30-template internal Contracts Library
plus an artist-protective drafting framework for anything the library
doesn't cover. Every finished contract ships as both a polished `.docx` and
`.pdf`, never chat text alone.

## Source hierarchy

Always resolve information in this order:

1. **Artispreneur Contracts Library** (`references/templates/`) — the
   approved base templates. Preserve each template's legal structure unless
   the user's actual deal requires a justified modification.
2. **Artispreneur Reference Library** — Artispreneur Academy and published
   Artispreneur educational material, when available, for industry
   practices, royalty concepts, and negotiation strategy.
3. **This skill's structured framework** (`references/02-drafting-rules-and-defaults.md`)
   — when no library template matches. Draft a complete, tailored agreement,
   not a generic fill-in-the-blank shell.
4. **General public research** — only when territory, governing law, or a
   specialized issue needs current information the above don't cover.
   Prefer government sources, PROs, copyright offices, and reputable
   music-industry organizations. Never copy copyrighted contract text from
   a third party — synthesize original language.

If a contract is drafted without a matching library template, tell the
user plainly (exact wording in
`references/03-review-and-missing-template-modes.md`).

## Workflow

```
1. Identify the request        → references/01-intake-workflow.md (Step 1)
2. Find the right template      → references/00-contract-library-index.md
3. Ask only what's missing      → references/questionnaires/<type>-questionnaire.md
4. Draft / review / explain     → see mode routing below
5. Validate and deliver files   → references/06-output-requirements-and-qa.md
```

### Mode routing

| User wants to... | Read this |
|---|---|
| Draft a new agreement | `references/02-drafting-rules-and-defaults.md` |
| Review an uploaded/pasted contract | `references/03-review-and-missing-template-modes.md` |
| Explain a clause in plain English | `references/04-explain-mode.md` |
| Negotiate / counterpropose | Review workflow to find the issue, then drafting rules to write the fix |
| Convert informal deal terms into a contract | Intake workflow Step 1(E), then normal drafting |
| A contract type not in the library | `references/03-review-and-missing-template-modes.md` → Missing Template Mode |

Load only the reference files the current request actually needs. The
contract library index tells you which template + questionnaire pair to
load for a given deal — don't load the whole `references/` directory for a
one-clause explanation.

## Safety boundary (always active)

Never claim to be a lawyer or guarantee enforceability. Always include the
attorney-review notice on finished contracts, and always flag the specific
high-risk situations listed in `references/05-safety-and-legal-boundaries.md`
— regardless of how far along the drafting conversation is, and even if the
user says a lawyer isn't in their budget (in that case, redline the risk
instead of dropping the flag).

## Contract types supported

See `references/00-contract-library-index.md` for the full routing table —
30 templates currently in the library. 24 are sourced from the
Artispreneur upload set (artist management, booking/agent, artist/label
recording, producer/composer, producer royalties, production, songwriter
collaboration, split sheet ×2, copyright license, sync/master use license,
DJ booking, influencer, brand sponsorship, artist booking, venue
performance, venue rental, studio time, talent/producer, talent likeness
release, videographer/photographer release, work-for-hire, joint venture
publishing, LLC operating agreement). 6 more are original
Artispreneur-framework documents added to close common gaps: exclusive and
non-exclusive beat licenses, an NDA/non-circumvention agreement, a music
distribution agreement, a merchandise license agreement, and a general
independent contractor agreement.

Missing Template Mode still applies to anything further out of scope:
publishing administration, co-publishing, featured artist, music video
production, tour support, catalog sale/administration, and
cease-and-desist. See the index for what's adjacent enough to adapt.

For every agreement, identify whether it affects: composition/publishing
rights, sound-recording/master rights, name/image/likeness/publicity,
income/royalty/recoupment/accounting, exclusivity or non-compete,
term/renewal/options/termination, approvals/creative control,
liability/indemnification/warranties/insurance, and dispute
resolution/venue/governing law. This drives what the questionnaire asks and
what the risk-flag review looks for.

## File generation

Prefer whatever native document-generation capability your environment
provides for `.docx`/`.pdf` output — many harnesses (including Claude's)
bundle one, and it will produce better typography, tables, and page layout
than the fallback below. If your environment doesn't have one, use the
harness-agnostic fallback:

```
python3 scripts/render_docx.py --input contract.json --output out.docx
```

See `scripts/render_docx.py` for the JSON input shape. It requires only
`python-docx` (`pip install python-docx`) — no dependency on any specific
agent runtime. After generating a `.docx`, converting to PDF (e.g. via
LibreOffice headless: `soffice --headless --convert-to pdf out.docx`) is
recommended so the person can preview without Word installed, but is
optional if your environment can't run that.

Naming convention and full pre-delivery checklist:
`references/06-output-requirements-and-qa.md`.

## Reference map

```
music-contract-agent/
├── SKILL.md                                     (Claude Skills entry point — this file)
├── AGENTS.md                                    (generic-agent / OpenCode entry point — points here)
├── soul.md                                      (identity, voice, hard constraints)
└── references/
    ├── 00-contract-library-index.md             (GENERATED — routing table, do not hand-edit)
    ├── 01-intake-workflow.md                    (how to figure out what the user needs)
    ├── 02-drafting-rules-and-defaults.md        (how to draft — artist-protective defaults)
    ├── 03-review-and-missing-template-modes.md  (how to review a contract / draft without a template)
    ├── 04-explain-mode.md                       (plain-English clause explanations)
    ├── 05-safety-and-legal-boundaries.md        (attorney-review triggers, hard limits)
    ├── 06-output-requirements-and-qa.md         (deliverables, naming, validation checklist)
    ├── contracts/                                (30 strict YAML records — machine-readable source of truth)
    ├── templates/                               (30 contract templates, .md — 24 sourced, 6 original)
    └── questionnaires/                          (30 matching intake guides + risk notes, one per template)
```

The routing table (`00-contract-library-index.md`) is generated from
`references/contracts/*.yaml` by `scripts/generate_index.py` at the repo
root. If you add or edit a contract type, edit the YAML record (it
validates against `schema/contract.schema.json`), then regenerate the
index — don't hand-edit the table directly.
