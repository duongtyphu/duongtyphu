# Academy Final Relationship Audit — Report

## What this covers

Following the Academy Production Reconstruction, this pass went one level
deeper: every CTA, internal link, breadcrumb, "related" reference, Companion
line, Workspace hand-off, CKOS link, and Journey link across the entire
Academy surface was traced to its real destination and checked against six
questions — does it exist, is it the best destination for that moment, is a
better one obviously missing, does a learner naturally continue from here,
would a beginner be confused, would an advanced learner feel patronized.

## Verified already correct

The overwhelming majority of Academy's relationships were already sound. The
Journey cards' every claim (persona, what-you'll-gain, prerequisite notice,
expected output, next-journey suggestion) reads live from the current CKOS
Seed/Collection — none of it is invented copy. The single shared
`startCompanionWorkspace()` hand-off is used consistently by the Journey
cards, the Mission pilot, and the "Học theo nhu cầu" section — no second,
ad-hoc hand-off mechanism exists anywhere in Academy. Companion's Academy
lines are stage-specific, non-repeating, and — checked again against the
CKOS and cross-pillar audits' documented lines — do not duplicate any
sentence used elsewhere in Portal. The "next journey" link only appears once
a journey is genuinely complete and only ever points at a real CKOS
Collection; it correctly stays silent (not fabricated) when CKOS has no
further collection to suggest. The closing "Học xong, đừng dừng lại" strip
and the mentoring CTA both give a learner a real, honest next move instead of
ending the page cold.

## Broken destination found and fixed

The "Xem tất cả công cụ" link inside Academy's "Học AI theo công cụ" section
pointed at `/portal/aiworkspace/cong-cu` — a route that does not exist. That
path falls through to the AI Workspace catalog's own not-found page, so a
learner clicking "see all tools" from Academy landed on a dead "not found"
screen instead of a tool listing. The same broken link was found on the AI
Workspace hub's own "AI Toolbox" section header (the two pages share this
exact bug, independently of each other). Both were corrected to point at the
real, already-existing anchor on the AI Workspace hub (`/portal/aiworkspace#ai-toolbox`),
which is the actual full tool grid this link always meant to reach — no new
page or fabricated data was introduced, just a correct pointer to content
that already exists.

## Relationships rewritten/restructured

None of the remaining relationships needed restructuring beyond the fix
above. The Journey card's dual-CTA pattern (one reference link back to CKOS,
one primary "Bắt đầu Nhiệm vụ" action) already serves both a beginner
(reference link, low commitment) and an advanced learner (jump straight into
practice) without either feeling blocked or patronized, so no reordering was
needed there.

## Beginner vs. advanced learner tension

Checked specifically on the Journey list: when several journeys are all at
"Chuẩn bị," the existing copy already tells an advanced-feeling learner not
to open several at once — this reads as guidance, not gatekeeping, since it
explains *why* (early parallel starts signal not-yet-ready, not fast
progress) rather than just disabling anything. No change was needed; this
was judged acceptable as-is, matching the same conclusion reached in the
prior reconstruction pass.

## Removed for being forced or fake

None found this pass. No "related" reference on any Journey card or tool
card was discovered to lack a genuine backing relationship.

## Added because genuinely missing

None. The audit did not find a real, already-existing relationship that
should be surfaced but currently isn't.

## Does Academy feel like one continuous experience now?

Yes, with the fix above the flow end-to-end (Understand → Practice → Apply →
Reflect → Grow, then Workspace/CKOS/Case Study/Community) resolves cleanly at
every hop checked — no remaining dead links or contradicted destinations were
found anywhere in Academy's live surface. The two intentionally deferred
gaps below are honest limitations, not fragmentation in the flow itself.

## Remaining gaps needing real future data

- "Học theo công cụ" and "Học theo nhu cầu" remain discovery entry points
  without an Expected Output/next-step promise, because there is no real
  per-item completion data behind them yet — unchanged conclusion from the
  prior reconstruction report.
- The Growth Checkpoint's self-readiness confirmation has no forward signal
  of its own beyond the page-level closing strip when CKOS has no next
  Collection to suggest; closing that would need a real "what's next after
  the last journey" data source, not more UI.
