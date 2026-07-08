# AI Workspace — Production Reconstruction (Phase 6)

## What users immediately notice

When a work session opens — whether it started from AI Workspace's tool
catalog, the Prompt Library, an AI Workflow, or an Academy Journey — the
session header now shows exactly which CKOS knowledge object brought them
here, with a real, clickable link back to it. Previously this connection
existed only in the data passed through `startCompanionWorkspace()` but was
silently dropped once the user landed in the session — the goal and expected
output showed, but the actual Tool/Prompt/Workflow reference disappeared.

## Which work experiences changed

- A session started from a CKOS Tool (e.g. from the AI Toolbox) now shows
  "Công cụ (CKOS): <tool name> →" linking straight back to that tool's real
  detail page.
- A session started from the Prompt Library shows "Prompt (CKOS): <prompt
  title> →" linking to the real prompt detail page (with its when-to-use /
  when-not-to-use / next-step guidance).
- A session started from an AI Workflow shows "Quy trình (CKOS): <workflow
  title> →" linking to the real SOP/Workflow hub.
- A session started from a practice resource (checklist, template,
  cheatsheet) shows "Tài nguyên (CKOS): <resource title> →" linking to that
  resource's real page.
- Sessions started from a work-need, a recommended workspace, or a learning
  path show no reference chip — these item types have no dedicated CKOS
  detail page, so nothing was invented rather than showing a broken or fake
  link.

## Which CTAs became stronger

No CTA was removed or rerouted; the fix closes a visibility gap rather than
changing CTA structure. The session's primary "what should I do first"
signal (Companion's single next-action suggestion) and the completed-session
hand-off into "Hành trình của tôi" were already correct and were left
untouched.

## Which Companion guidance improved

Unchanged in this pass — Companion's Workspace voice (terse next-action
suggestion, single Knowledge Loop nudge back to CKOS/Academy) was already
distinct from Academy's tone and did not duplicate any quoted line from the
other pillar audits.

## Which outputs became clearer

Output descriptions, version history, and the Writer/Reviewer/Companion
agent flow were already output-oriented (real `WorkspaceSession.outputs`
with types like Landing Page, Markdown, Prompt, Code) and did not need
rewriting.

## Which relationships with CKOS became stronger

This is the core of this pass: the real CKOS Tool/Prompt/Workflow/Resource
that started a session is now visibly carried into the session itself, not
just used to launch it. This directly answers "which Tool/Prompt/Workflow
should I use" from inside the working session instead of only before
entering it.

## Which relationships with Academy became stronger

Unchanged — the Academy → Workspace hand-off via `startCompanionWorkspace()`
(module, itemId, title, expectedOutput) already surfaced correctly on
arrival (goal, expected output, source label, breadcrumb back to the origin
module), and the completed-session → Journey link added in a prior pass was
preserved as-is.

## Which parts of Workspace are now production-ready

- Session header (goal, source, expected output, CKOS reference, breadcrumb)
- Execution timeline, task panel, output panel, agent run log, history
- Completed-session hand-off to Hành trình của tôi

## Remaining gaps (honest)

- Learning-path and work-need session starts still have no CKOS/Academy
  detail page to link back to — this is a real content-architecture gap,
  not something Workspace can fabricate a link for.
- Workflow reference always points to the general `/portal/sop` hub because
  individual AI Workflows have no per-item detail route yet; a future SOP
  detail page would let this become a precise deep link instead of a hub
  link.
- Still no real AI Provider call is guaranteed to run (Writer/Reviewer/
  Companion agents fall back to mock mode without a configured API key) —
  this is pre-existing and out of scope for this pass.
