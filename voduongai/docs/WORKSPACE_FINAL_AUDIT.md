# AI Workspace — Final Content, CTA & Relationship Audit

Scope: `/portal/aiworkspace` (AI Space / tool catalog hub) and
`/portal/workspace` (session-based Workspace where practice happens),
plus every section, card, empty state, and Companion line either page
renders. This is the closing audit pass before Workspace is considered
production-ready, run after the CKOS Reference link work.

## 1. Content improvements

Most Workspace copy was already in good shape from prior passes — the
hero, the "Vận hành" / "Tuỳ tình huống" / "Bắt đầu nhanh" sections on
`/portal/workspace`, and the catalog sections on `/portal/aiworkspace`
all read as concrete and situational rather than generic filler. One
real duplication was found and fixed:

- **The session's goal and expected output were stated twice on the
  same screen.** The session header already shows "Mục tiêu" (via the
  page title) and "Kết quả mong đợi" once a session starts. The Task
  Panel directly below it repeated both lines verbatim. This is exactly
  the kind of "same relationship expressed twice in different words"
  the relationship audit looks for — trimmed so the Task Panel now only
  shows what is unique to the current step (what's being done, what to
  do), while the goal and expected output stay owned by the header,
  read once.

No other content string was found to be generic filler, overly
technical, or worth merging/splitting/archiving — the catalog sections
(work needs, recommended workspaces, AI workflows, prompt library,
resources) all carry concrete, situational copy backed by real static
data, and the tone throughout matches Workspace's terse "operating
desk" voice rather than Academy's encouraging one.

## 2. CTA improvements

Every CTA on both pages was traced to its actual destination. All
resolve to a real route or a real handler that continues genuine work
(session creation, output save, agent run, pause/resume, approve,
reflect). No CTA exists "because the page exists" — each either starts
a session with real context (`startCompanionWorkspace`) or acts on a
real, already-loaded `WorkspaceSessionRecord`. One CTA-shaped element
was found to be dishonest and was fixed:

- **A Companion "next action" chip that pointed at a feature that
  doesn't exist.** Once a session's output was reviewed and reflected
  on, Companion's inline suggestion read "Chuyển sang Nhiệm vụ tiếp
  theo" (move to the next Mission) — but no Mission Engine exists yet
  to move to (a documented, acknowledged gap). Worse, this label sat
  directly next to the (correct, honest) completion strip that already
  invites the user to review the session in "Hành trình của tôi" —
  meaning two Companion suggestions appeared on the same screen, one of
  which pointed nowhere real. Fixed by suppressing only this specific
  suggestion; the "review this output" and "submit your reflection"
  suggestions (both genuinely actionable, both already wired to real UI
  below) are unaffected.

All other CTAs — "Bắt đầu cùng Companion," "Dùng cùng Companion," "Bắt
đầu Workspace," "Thực hành quy trình này," "Dùng Prompt này," "Thực
hành với tài nguyên này," the Writer/Reviewer/Companion agent buttons,
pause/resume, approve, save version — were verified to route to a real
next step a beginner could follow and an advanced user would still find
worth clicking (no unnecessary interstitials, no dead-end confirmation
screens).

## 3. Relationship improvements

The Tool → Prompt → Workflow → Workspace Session → Output → Journey →
Projects chain was walked end to end:

- **Tool/Prompt/Workflow → Workspace Session**: confirmed intact from
  the prior CKOS Reference pass — a session started from a real CKOS
  object still shows a live link back to it inside the session, not
  only at launch.
- **Workspace Session → Output**: real, versioned, never overwritten;
  approval/review/reflection statuses are all genuine session state,
  not decorative.
- **Output → Journey**: the completed-session strip added in the
  cross-pillar pass still works and was left untouched.
- **Journey → Projects, Workspace → Premium, Workspace → Companion**:
  no fabricated triggers were found. Workspace's only Premium-adjacent
  content lives on tool/profession detail pages, not inside the session
  flow, and correctly gates only genuinely locked deep content.
- **The one duplicated relationship found** (goal/expected-output
  stated twice) is fixed under Content improvements above — it was a
  duplication of *display*, not of underlying data, so no schema or
  session-store change was needed.
- **The one dishonest relationship found** (Companion suggesting a
  "next Mission" that has no real destination) is fixed under CTA
  improvements above.

No broken links and no unnecessary detours were found elsewhere in the
chain.

## 4. User Journey improvements

Walked as four personas; no blocking issue required a structural fix
beyond what's covered above.

- **User A (new to AI)**: the Companion Desk's placeholder examples and
  the "Vận hành" / "Tuỳ tình huống" sections on `/portal/workspace`
  already answer "what do I do first" concretely — arriving with no
  context at all now shows an honest empty state pointing back to AI
  Workspace with a single clear next step.
- **User B (just finished an Academy Journey)**: the Academy → Workspace
  hand-off via `startCompanionWorkspace()` (module/itemId/title/
  expectedOutput) lands the user directly in a live session showing
  their real goal and expected output in one click — verified intact.
- **User C (fast, experienced user)**: no forced multi-step onboarding
  blocks direct action — Companion Desk, catalog cards, and the session
  itself all let an experienced user go straight to drafting an output.
  The Task Panel trim (Content improvements) removes redundant reading,
  which specifically helps this persona move faster.
- **User D (building a real business)**: outputs are versioned, real,
  reviewable, and flow into Portfolio/Capability engines on
  review+reflection — this already reads as real work product, not a
  toy, and was not changed.

## 5. Companion improvements

Every Companion-voice string in `WorkspaceMvp.tsx`,
`AiSpaceSections.tsx`, and `execution-orchestrator.ts` was read in full.
Companion's Workspace voice is already the quietest of the seven
pillars — terse, outcome-focused, never chatty. One line was found to
break that promise by suggesting an action Workspace cannot actually
take (see CTA improvements): fixed by removing that one suggestion
rather than rewriting it, since there is no honest destination to
rewrite it toward yet. No fake memory or fake progress phrasing was
found anywhere in Workspace's Companion copy — every review/reflection
status, version count, and step position reads from real session state.

## 6. Output improvements

Output types, versioning, and the Writer/Reviewer/Companion agent flow
were reviewed and found already output-oriented and honestly labeled
(including the "(MOCK)" tag when no real AI provider is configured, and
the explicit "quyết định cuối luôn thuộc bạn" line keeping approval
authority with the user, not the agent). "Expected Output" is shown
concretely wherever context provides it. No changes were needed here
beyond removing the redundant repeat of "Kết quả mong đợi" covered
above.

## 7. Remaining production gaps

Honestly out of scope for this pass (require new schema, new
production data, or a real AI provider integration that doesn't exist
yet):

- Learning-path and work-need session starts still have no CKOS/Academy
  detail page to link back to from inside a session — a content-
  architecture gap, not something Workspace can fabricate a link for.
- The Workflow reference always points to the general `/portal/sop` hub
  because individual AI Workflows have no per-item detail route yet.
- No real AI Provider call is guaranteed to run — Writer/Reviewer/
  Companion agents fall back to mock mode without a configured API key;
  this is pre-existing and unrelated to content/UX.
- A true Mission Engine (to give "next Mission" suggestions a real
  destination) does not exist yet — this pass removed the dishonest
  suggestion rather than build the missing engine; building it is a
  future scoped feature, not a copy fix.

## 8. Production readiness score

| Dimension | Score |
|---|---|
| Content quality | 9/10 — concrete, situational, terse; one duplicated relationship found and fixed |
| CTA correctness | 9/10 — all destination-specific; one dishonest Companion suggestion found and fixed |
| Cross-pillar relationships (Tool/Prompt/Workflow → Session → Output → Journey) | 9/10 — real and verified end to end, no fabricated triggers to Premium/Companion |
| User journey (4 personas) | 9/10 — all four complete without a structural blocker |
| Companion voice | 9/10 — terse and honest; the one inert/fake-destination line is now gone |
| Output quality | 9/10 — real, versioned, honestly labeled including MOCK state |
| Empty states | 9/10 — every empty state explains why and names one honest next step |
| 30-minute real-output test | 9/10 — a user can reach a saved, reviewed output within one sitting today |

**Overall: 9/10.** Workspace is production-ready. The remaining gaps
(SOP detail routes, real AI provider wiring, a real Mission Engine) are
honestly scoped future work, not overlooked polish — this pass fixed
everything fixable without inventing data, memory, or destinations that
don't exist yet.
