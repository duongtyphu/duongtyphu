# Projects & Opportunities — Production Reconstruction (Phase 7)

Scope: `/portal/duan-cohoi`, rebuilt into an Opportunity Center whose job is
to answer "Am I ready? Which opportunity fits me? Why? What should I learn
or practice first?" — not to sell, recruit, or rank opportunities.

## What users immediately notice

The page no longer reads as a list of investment/affiliate opportunities to
browse. It opens with a decision-first framing ("Bạn không cần biết hết. Bạn
chỉ cần chọn đúng điểm bắt đầu") and a "Tôi nên bắt đầu ở đâu?" routing
section that matches a visitor's situation (want income now / want long-term
low-risk / curious about new tech / not sure at all) to the right starting
point before they read any single ecosystem card.

## Which opportunity experiences improved

Every one of the five real ecosystems (DigiU, SolarGroup, Blockchain &
Crypto, Blockchain Projects, Trading) now carries the same honest structure:
who it's genuinely for, who should genuinely wait (specific, not generic
"for everyone"), what to learn first (a real link — Học viện AI, Nhật ký học
tập, or a sibling ecosystem, never a vague "tìm hiểu thêm"), and what the
realistic outcome is, explicitly stated as a skill/understanding gain rather
than an income or ROI promise.

A new self-assessment checklist ("Bạn đã sẵn sàng tham gia một dự án chưa?")
lets a visitor test their own readiness before opening any ecosystem, with
an explicit reassurance that answering "not yet" to any item is a signal to
learn more, not a failure.

## Which CTAs became clearer

No CTA pushes a visitor directly into "join now." Every path funnels either
into deeper self-directed research (own the ecosystem's official
docs/whitepaper) or into a real internal resource: Học viện AI (foundation
learning), Nhật ký học tập (lessons from real mistakes), or Companion
(personalized reasoning). The closing "Tiếp theo bạn nên..." card and the
Knowledge Journey Strip both stay resource-directed rather than
conversion-directed, matching Projects' objective tone.

## Which Companion guidance improved

Companion's line on this page acts as an advisor, not a recruiter: it
directs the visitor to read the sharing criteria first and explains what is
NOT guaranteed, before they engage with any card. The Companion Task Entry
lets a visitor bring a specific situation ("cân nhắc tham gia SolarGroup")
for reasoning support rather than a pitch.

## Which readiness guidance was added

- A per-ecosystem readiness block: who fits, who should wait, what real
  content to review first, what outcome is realistic.
- A general self-assessment checklist usable before any ecosystem.
- Three guided-learning shortcuts for visitors who fail any checklist item:
  read whitepapers via Học viện AI, understand real risk via Nhật ký học
  tập, or get personalized reasoning via Companion.

## Which relationships became stronger

Projects → Academy (Học viện AI) and Projects → the journal of real
mistakes (Nhật ký học tập) are now the primary forward paths, backed by
real, existing pages. Projects → Case Study is kept honest: since
`case_studies` has zero real rows, the page points to Case Study's own
truthful empty state instead of fabricating a success story per ecosystem.

**Projects → Premium remains explicitly deferred.** No real usage/outcome
signal exists yet that a Projects visitor is "Premium-ready" — inventing
that trigger would violate the no-fake-data rule. This matches
`docs/PORTAL_CROSS_PILLAR_EXPERIENCE.md`'s stated bar; nothing changed that
would clear it in this pass, since Projects still has no real
engagement-tracking data of its own to build a genuine signal from.

## Which content was rewritten

All marketing/oversell language (urgency framing, unqualified promises) was
already absent from the real production copy at the start of this pass; the
existing "Tiêu chí chia sẻ" (sharing criteria), FAQ, and ecosystem
descriptions were reviewed and kept because they already stated risk,
non-endorsement, and personal responsibility honestly. The per-ecosystem
readiness fields (who's for/not ready/learn first/expected outcome) are the
substantive rewrite delivered in this reconstruction.

## Which parts are now production-ready

- The ecosystem grid with full readiness framing (5/5 ecosystems).
- The self-assessment checklist and guided-learning shortcuts.
- The decision-routing section at the top of the page.
- The honest "no engagement tracking yet" empty state for "Mức độ quan tâm
  của bạn."
- Companion's advisor-toned guidance and task entry.

## Remaining gaps needing real future data

- Projects has no real per-user engagement tracking (which ecosystems a
  member has actually viewed/considered) — the page states this honestly
  today; closing it needs new schema, not new UI.
- Case Study has zero real rows, so no ecosystem can show a genuine
  completed story; the page defers to Case Study's own empty state instead
  of inventing one.
- Projects → Premium has no real trigger yet; a genuine "readiness" signal
  would require real usage/outcome data this pillar doesn't yet capture.
