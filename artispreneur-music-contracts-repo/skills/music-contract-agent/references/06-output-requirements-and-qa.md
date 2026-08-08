# Output Requirements & QA

## Every completed draft delivers all six pieces

### 1. Contract Preview
A clean, fully populated agreement in professional legal-document structure.

### 2. Deal Summary
Parties, agreement type, project, effective date, money/payment structure,
ownership and rights, credits, term and termination, governing law,
important artist-protection provisions.

### 3. Assumptions and Open Items
Every fact that was assumed, not confirmed, or intentionally left for the
user to decide.

### 4. Plain-English Guide
The most important sections explained simply — pull from
`references/04-explain-mode.md`'s style, condensed to the key clauses.

### 5. Negotiation Notes
Where relevant, optional artist-favorable alternatives for: ownership,
royalty percentage, recoupment, term, exclusivity, approval rights, audit
rights, termination, reversion.

### 6. Files
- A `.docx` Word document with professional heading styles, signature
  blocks, page breaks, exhibits, and clean formatting — see `SKILL.md` →
  "File generation" for the preferred-tool-vs-fallback-script guidance.
- A matching `.pdf`.
- An optional editable deal memo or term sheet, if requested.

## File naming convention

```
[Agreement-Type]_[Party-Name]_[Project-Name]_[YYYY-MM-DD].docx
[Agreement-Type]_[Party-Name]_[Project-Name]_[YYYY-MM-DD].pdf
```

Example:
```
Producer-Agreement_Nova-Ray_After-Hours_2026-08-08.docx
Producer-Agreement_Nova-Ray_After-Hours_2026-08-08.pdf
```

## Pre-delivery validation

Before presenting files to the user, check:

- [ ] No unfilled placeholders (`[BRACKETS]`, blank underscores, sample text left over from a source template)
- [ ] Names and pronouns are consistent throughout
- [ ] All dollar amounts and percentages match everywhere they appear
- [ ] Terms and dates do not conflict
- [ ] Ownership provisions do not contradict license provisions
- [ ] Signature blocks match the named parties exactly
- [ ] Exhibits are referenced correctly and actually attached/included
- [ ] The contract is readable without needing this chat for context
- [ ] The attorney-review notice from `references/05-safety-and-legal-boundaries.md` is present
- [ ] Any Red risk flags from a review are called out explicitly, not buried

## Delivery mechanics

1. Generate the `.docx` (see `SKILL.md` → "File generation" for the
   preferred-tool-vs-fallback-script guidance).
2. If possible in your environment, convert to PDF and visually check the
   render before delivering (e.g. `soffice --headless --convert-to pdf`,
   or your harness's native preview capability).
3. Place both files somewhere the person can actually retrieve them, and
   use whatever mechanism your environment provides to hand them off —
   an attachment, a download link, a file card, or a printed local path
   the person can open themselves. A file that's written but never
   surfaced to the person is invisible to them; don't skip this step.
4. Keep the chat response focused on the deal summary, assumptions, and
   plain-English guide — don't re-paste the entire contract text into the
   conversation once it's in the files.
