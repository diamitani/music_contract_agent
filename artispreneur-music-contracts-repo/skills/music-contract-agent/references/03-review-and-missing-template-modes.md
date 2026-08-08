# Contract Review Workflow & Missing Template Mode

## Contract Review Workflow

When reviewing a third-party agreement (uploaded, pasted, or linked):

1. Identify the contract type and parties.
2. Extract the core business terms into a **Deal Snapshot**.
3. Flag missing information, ambiguous language, unusual obligations, and
   artist-risk provisions.
4. Explain each material section in plain English.
5. Classify issues:
   - **Green** — generally reasonable or favorable
   - **Yellow** — negotiate, clarify, or limit
   - **Red** — high-risk; seek attorney review before signing
6. Provide specific negotiation language or redline suggestions.
7. State what the user keeps, what they give up, what they owe, and how
   they can exit.
8. Never claim a clause is illegal unless the relevant law clearly supports
   that conclusion — describe practical risk and business consequence
   instead of making legal-validity claims.

### Review output format

```
### Deal Snapshot
- Parties
- Project
- Money
- Rights
- Term
- Exclusivity
- Termination
- Governing law

### What This Means
[Plain-English explanation]

### Risk Flags
- Green / Yellow / Red
- Quote or identify the relevant clause
- Explain the practical consequence
- Give a recommended change

### Negotiation Language
[Polished language the user can send by email or propose as a redline]

### Before You Sign
[Unresolved questions, missing exhibits, dates, payment amounts, ownership
points, and reasons to seek legal counsel]
```

### The internal review prompt

> Review the supplied agreement for an independent artist. Do not provide
> legal advice or claim the agreement is enforceable or unlawful. Identify
> business terms, rights transfers, payments, recoupment, exclusivity, term,
> options, termination, approvals, credits, warranties, indemnities, audit
> rights, governing law, and dispute provisions.
>
> Explain every major clause in plain English. Flag risks as Green, Yellow,
> or Red. For each Yellow or Red issue, explain the practical impact, why it
> matters, and propose concise artist-protective negotiation language.
>
> Prioritize preservation of master and publishing ownership, limited rights
> grants, accounting transparency, consent for expenses, credit, clear
> payment, limited term, and meaningful termination/reversion rights.
>
> End with a list of questions the artist should resolve before signing and
> a concise recommendation for attorney review where appropriate.

---

## Missing Template Mode

Use when the requested agreement type is not in
`references/00-contract-library-index.md`'s in-library list (or a close
adjacent template doesn't reasonably cover it):

1. Tell the user plainly: no exact internal template was available.
2. Identify the closest agreement category, if one exists (the index notes
   these).
3. Draft from the artist-protective framework in
   `references/02-drafting-rules-and-defaults.md` — an original, complete,
   commercially reasonable agreement, not a thin fill-in-the-blank shell.
4. Use narrow, clearly defined rights and artist-protective provisions.
5. Clearly label any assumptions made.
6. Highlight provisions that require the user's confirmation before signature.
7. Add the attorney-review notice to the final delivery
   (`references/05-safety-and-legal-boundaries.md`).

Say this exact framing to the user when delivering:

> "This agreement was generated from an artist-protective music-business
> framework because a matching Artispreneur template was not available.
> Consider having a licensed entertainment attorney review it before
> signing."

Never fabricate a source template or imply one exists when it doesn't.
Never invent numbers, statutes, or industry-standard rates you're not
confident about — say "this varies by deal and market" rather than stating
a fake benchmark as fact.
