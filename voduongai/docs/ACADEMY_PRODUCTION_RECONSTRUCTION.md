# Academy Production Reconstruction — Report

## What this covers

Academy (`/portal/hocvienai`) was audited end-to-end against the standard: it must be
a Learning Experience that *consumes* the Hệ tri thức AI (CKOS), never a second copy of
it. Two earlier sprints (Learning Journey Engine, Content Audit, Unlockable Assets pilot)
had already rebuilt most of Academy correctly. This pass verified that work, checked it
against 8 honesty questions per journey (who is it for, why learn it, what to know first,
what will you build, where to practice, how do you know you're done, what comes next),
and removed the one piece of content that failed the audit.

## What users immediately notice

The "Lộ trình học AI" block — a row of five cards claiming a fixed number of missions
per level ("6 mission", "8 mission", "10 mission"...) — is gone from the Academy hub.
That block was a leftover static curriculum sitting right above the real journey list,
and it competed with it: two "learning paths" on one page, one real and one invented.
Now there is exactly one place on the page that says "here is your journey" — the
CKOS-backed journey cards — instead of two conflicting ones.

## Which learning journeys became clearer

Every real journey on the page already satisfies the 8-question test because it is a
direct, live projection of a CKOS Collection, not hand-written Academy copy:
- **Who it's for** and **what you'll gain** come straight from the current Knowledge
  Seed's real `persona` / `whatYouWillGain` fields.
- **What to know first** is the real prerequisite computed from CKOS step completion,
  shown as an amber notice only when one genuinely exists.
- **What you'll build** is the seed's real `exercise` field, labeled "Kết quả mong đợi"
  — never "finish reading."
- **What comes after** only appears once a journey is actually done, and only points to
  a real next CKOS Collection — no journey is ever invented to fill the slot.

Removing the fake curriculum row means a learner scanning the page no longer has to
figure out which of two "journey" lists to trust.

## Which CTAs became stronger

Each journey card carries exactly one primary action ("Bắt đầu Nhiệm vụ") that hands a
real goal and expected output into AI Workspace, plus one secondary reference link back
to the matching CKOS Collection — a look-up, not a competing CTA. The fake curriculum
row previously offered a *second*, parallel "Bắt đầu học" / "Thực hành cùng Companion"
pair pointing at hardcoded routes (one of which looped back to the very page the user
was already on); removing it eliminates that redundant, weaker CTA pair entirely.

## Which Companion guidance improved

Companion's lines on this page were already stage-specific and non-repeating (a
different sentence for Preparation, Learning, Practice, Application, Reflection,
Growth, Ready), and phrased as a quiet mentor ("Đừng vội — hiểu chắc từng phần rồi hẵng
thực hành", "Bạn đã đi được một chặng dài. Dành 2 phút nhìn lại...") rather than a
lecturer. No change was needed there; the audit's job here was confirming no duplicate
sentence existed against the fake curriculum copy that got removed (it didn't route
through Companion at all, so no overlap existed, but it did dilute where a learner's
attention should go).

## Which relationships with CKOS became stronger

Confirmed Academy still does not own or re-explain any Lesson content: journeys are
computed 1:1 from CKOS Collections, "what you'll know first" and "what you'll build"
are read live from the current Seed, and the reference link always goes to the real
CKOS Collection page. Removing the static curriculum row also removes the only place
on the page that suggested a second, non-CKOS notion of "path" existed.

## Which relationships with Workspace became stronger

The one remaining action mechanism is the shared `startCompanionWorkspace()` call
already used everywhere else in the product — journeys, the Mission pilot, and the
"Học theo nhu cầu" section all hand off through the same function with real module
context (`module: "academy"`, real `itemId`/`title`/`expectedOutput`). No second,
ad-hoc hand-off mechanism was introduced or left behind.

## Which educational content was rewritten

Only one content change: the "Lộ trình học AI" section was removed from the Academy
hub, along with its invented mission counts and levels, because it was a static,
non-CKOS-backed curriculum duplicating the real journey list one scroll below it. No
other Academy copy needed rewriting — the hero, FAQ, prerequisites/completion-criteria
section, and Companion lines were already written in capability-outcome language
("một bài học tốt không kết thúc bằng việc bạn đọc xong — nó kết thúc bằng việc bạn làm
ra một kết quả"), not course-catalog language.

## Which parts of Academy are now production-ready

- The journey list, journey cards, timeline, Companion guidance, and growth checkpoint
  flow — all read real data, degrade honestly to real empty states, and hand off to
  Workspace correctly.
- The empty state ("Chưa có hành trình nào ở đây") correctly explains the CKOS
  dependency and does not fabricate a placeholder journey.
- The Mission pilot, "Học theo nhu cầu", and "Học theo công cụ" sections all use real
  data sources and a single consistent hand-off mechanism.
- `npx tsc --noEmit`, `npx eslint` on the changed file, and a full
  `rm -rf .next && npm run build` all pass with zero errors.

## Remaining gaps (honest, not papered over)

- The "Học theo công cụ" and "Học theo nhu cầu" sections are discovery entry points,
  not CKOS-backed journeys — they intentionally don't carry an "Expected Output" or
  "what comes after," because there is no real per-item completion data behind them yet.
  That's an honest limitation, not a bug, but if this is meant to feel journey-grade,
  it will need real backing data before it can carry the same promises as the CKOS
  journey cards.
- The audit found no other CKOS/Journey content to independently document under
  `/portal/ai-academy` or `/portal/vdai-academy` — both already redirect or serve a
  genuinely separate real feature (live lessons/live classes), so they were left as-is.
