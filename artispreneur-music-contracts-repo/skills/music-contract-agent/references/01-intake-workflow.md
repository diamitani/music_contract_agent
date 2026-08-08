# Intake Workflow

## Step 1: Identify the request type

Determine whether the user wants to:

- **A. Draft a new agreement**
- **B. Review an existing agreement** (they upload or paste one)
- **C. Explain one clause or section**
- **D. Negotiate or prepare a counterproposal**
- **E. Convert informal deal terms** (texts, emails, voice-note summary) into a contract
- **F. Create a deal memo, term sheet, split sheet, or release** before a full agreement

If files, pasted text, links, or screenshots are already in the conversation,
extract every relevant fact from them before asking the user anything —
never ask for information that's already sitting in the context.

## Step 2: Find the best template

1. Open `references/00-contract-library-index.md` and match the request to a row.
2. Load that row's template and questionnaire file.
3. If more than one template plausibly fits, briefly explain the difference
   (the index has a "Choosing between similar contract types" section for
   the common overlaps) and recommend the best option — don't just ask the
   user to pick blind.
4. If nothing fits, switch to Missing Template Mode
   (`references/03-review-and-missing-template-modes.md`).
5. If jurisdiction-specific language materially matters (recoupment rules,
   right-of-publicity statutes, non-compete enforceability), ask for the
   governing state/country before finalizing — don't guess and don't leave
   `[State]` unresolved in a final deliverable.

## Step 3: Ask only essential questions

Do not run a giant questionnaire. Ask only for facts that are:
- Missing from the conversation, AND
- Actually needed to produce a coherent, signable draft

Use the grouped question sets in the matching questionnaire file
(`references/questionnaires/<type>-questionnaire.md`), organized as:

**Parties** — legal names, stage/business names, addresses, signatory authority
**Project** — contract type, deliverables, deadlines, territory/platforms
**Money** — fee/advance/royalty, payment schedule, expenses, recoupment, accounting
**Rights** — master ownership, publishing ownership, license scope, credits, reversion
**Control and Risk** — approvals, exclusivity, confidentiality, term/termination, dispute resolution

When the user doesn't know an answer, don't leave it blank — present 2-3
plain-English options with a recommended artist-first default and explain
the tradeoff in one sentence. Example:

> "Should the producer get ownership or a license? For most independent
> projects, I'd default to: the artist owns the master, and the producer
> gets a defined fee plus negotiated royalty points, with no ownership
> transfer unless you both deliberately want that. Want me to go with that,
> or handle it differently?"

If your environment offers a structured way to present a small number of
multiple-choice options (a form, buttons, a picker), it's fine to use it for
a narrow, genuinely open decision — don't use it to replace the grouped
questions above wholesale, and never fire it for something already answered
in the conversation. If no such capability exists, just ask the question in
plain text.

## Step 4: Route to the right mode

- New draft → `references/02-drafting-rules-and-defaults.md`
- Reviewing an uploaded/pasted contract → `references/03-review-and-missing-template-modes.md`
- Explaining a clause → `references/04-explain-mode.md`
- Negotiating/counterproposal → drafting rules + review workflow together:
  identify the risk, then draft the replacement language
- No exact template exists → `references/03-review-and-missing-template-modes.md` (Missing Template Mode section)

Every path ends at `references/06-output-requirements-and-qa.md` before
anything is delivered to the user.
