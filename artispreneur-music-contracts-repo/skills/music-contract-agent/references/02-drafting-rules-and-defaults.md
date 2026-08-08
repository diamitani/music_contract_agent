# Drafting Rules and Artist-Protective Defaults

## Personalization

Use everything available: prompt answers, uploaded contracts, pasted
emails/messages/deal memos, linked materials, artist name, catalog info,
entity details, project metadata.

Replace **every** placeholder before delivery — `[ARTIST NAME]`, `[DATE]`,
`[STATE]`, `[SONG TITLE]`, `[PAYMENT AMOUNT]`, `[TERM]`, `[TERRITORY]`, blank
underscores, and any other sample/default language left over from the
source template.

Never paste raw user answers into the template mechanically. Integrate them
so the result is grammatically correct, legally coherent, commercially
realistic, and internally consistent from the first page to the signature
block.

## Completeness checklist

Each finished agreement should include, when appropriate to the contract
type:

1. Title and effective date
2. Parties and legal capacity
3. Background/recitals where useful
4. Clear definitions
5. Scope of services, project, or rights
6. Deliverables and timelines
7. Payment, royalties, expenses, accounting, and audit rights
8. Ownership and intellectual-property provisions
9. Credits and metadata
10. License scope, if applicable
11. Representations and warranties
12. Approvals and creative control
13. Confidentiality, where needed
14. Term, renewal, termination, and post-termination rights
15. Indemnification and liability allocation
16. Assignment and subcontracting rules
17. Notices
18. Governing law and dispute resolution
19. Entire agreement, amendments, severability, waiver, counterparts, e-signature language
20. Signature blocks for every party
21. Exhibits/schedules for songs, splits, deliverables, payment schedules, project-specific details

Not every clause applies to every contract type — a split sheet doesn't need
an indemnification section. Use judgment; don't pad a one-page release form
into a ten-page document because a checklist exists.

## Artist-protective defaults

Apply these unless the user intentionally chooses otherwise (and note it in
Assumptions/Open Items when they do):

- Preserve artist ownership of masters and compositions.
- Avoid perpetual grants; use defined terms and reasonable reversion rights.
- Limit exclusivity to a specific project, service, time period, territory, and activity.
- Require written approval for expenses charged to the artist.
- Separate recoupable from non-recoupable expenses.
- Do not allow cross-collateralization unless expressly explained and approved.
- Include transparent accounting and reasonable audit rights for royalty deals.
- Define "net receipts" precisely; avoid vague "net profits" language.
- Tie payment to measurable milestones and dates.
- Require proper credits and accurate metadata.
- Include an exit path for material breach, missed deadlines, nonpayment, or failure to exploit rights.
- Prevent assignment without consent except for narrowly defined business-successor situations.
- Make option/renewal provisions narrow, time-limited, and tied to objective performance requirements.
- Avoid rights grants broader than needed for the business purpose.

If the user is drafting from the *other* side of the table (e.g., they are
the label, the brand, the venue, the hiring producer — not the independent
artist), say so plainly and adjust. Stay fair and accurate on both sides;
don't silently apply artist-favoring defaults to someone who isn't the
artist without telling them what you're doing and why.

## The internal build prompt

When actually generating the contract text, hold this framing:

> Create a complete, artist-protective, commercially practical agreement
> using the closest matching template from `references/templates/`. If no
> matching template exists, write an original contract using commonly
> accepted music-business principles and narrowly tailored rights (Missing
> Template Mode).
>
> Integrate all user-provided facts naturally and remove every placeholder.
> Do not create conflicts between payment, ownership, credits, term,
> territory, exclusivity, termination, and signature provisions.
>
> Default toward the independent artist retaining masters, compositions,
> creative control, transparent accounting, approval over recoupable
> expenses, limited exclusivity, and a clear exit path — unless the user
> explicitly directs otherwise.
>
> Use professional contract formatting and plain but precise language.
> After the contract, provide a deal summary, assumptions/open items, a
> plain-English explanation, and negotiation notes. Add the attorney-review
> notice and recommend attorney review where rights, significant money,
> exclusivity, or long-term obligations are involved.

## Producing the actual files

See `SKILL.md` → "File generation" for how to produce `.docx`/`.pdf`
output in a harness-agnostic way — prefer your environment's native
document-generation capability if it has one, and fall back to
`scripts/render_docx.py` if it doesn't. Use professional heading styles, a
real signature block, page breaks between major sections where useful, and
clean exhibit formatting either way. Then follow
`references/06-output-requirements-and-qa.md` for naming, validation, and
delivery order.
