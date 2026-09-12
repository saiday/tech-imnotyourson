---
title: "The Reluctant Guide to Local LLM Agentic Integration"
slug: "local-llm-agentic-integration"
date: "2026-09-12T12:17:29.000Z"
description: "Running a local model on a Mac Studio at 15 to 25 TPS, pairing it with a frontier reviewer, and why a model you cannot over-respect is the better touchstone for building an agentic workflow."
tags: ["local-llm", "pi"]
draft: false
---

I got to set up a local LLM on my Mac Studio, and the integration reshaped my agentic coding workflow. Not because the model is better. Because it is slow enough and small enough that I stopped over-trusting the output and started building the flow around it.

TL;DR:

- A slower model you do not over-respect is the touchstone to build your flow and tools against, which is what a long-running project needs.
- Put multiple models and multiple sessions on one task. Agentic coding does not work well without it.
- Tooling: [Pi](https://github.com/earendil-works/pi) as the agent harness for the local model. I wrote [pi-self-compact](https://github.com/saiday/pi-self-compact) for my own needs, and installed only [pi-claude-link](https://github.com/alonw0/pi-claude-link) (it carries Claude Code's [cross-session messaging](https://code.claude.com/docs/en/cross-session-messaging) over to Pi, so the two harnesses talk to each other), [pi-vim](https://github.com/lajarre/pi-vim), and [pi-execution-time](https://github.com/lukaspanni/pi-execution-time).
- Watching the thinking transcript live is more fun than sports, and it is the only way to review what the agent was actually fed. Claude Code does not give you that now.

## Local LLM inspirations

I run Qwen 3.8 27B on a Mac Studio, M2 Max, 96GB RAM. Decoding runs 25 down to 15 TPS depending on how much context is in play, and prefill speed is tolerable. Against a remote Anthropic model, inference is about 30x slower.

So why bother with a local LLM?

1. Overnight work: the trivial tasks not worth my attention, and the long ones not worth my waiting.
2. You get to know more about what is happening in the flow.

Those are the only two practical reasons I can name, and both are obvious. The real value for me was meeting Pi and taking full responsibility for the development workflow.

I have used Claude Code since launch day. Back then you could read the full transcript of what the model was thinking. You cannot now. Without the transcript the process is a black box and the result is a myth: all I can do is write the most informative specs and docs I can, and wish for a good result. With the transcript I can trace the thinking step by step, tune the information I hand over, and catch blockers I was not looking for.

I do not use Qwen for everything. Planning and decisions still go to a Claude model. Qwen is fully capable as an implementer once you already have high quality contracts and tasks, and I will skip that part here because everyone assumes it and is already doing their best at it. Frontier model for abstraction and validation, local model for implementation. The only thing this trade compromises is time.

## Multiple agents on the same task

What would software development look like in utopia? Taking the reference from Extreme Programming, I would say pair programming is the minimum standard.

My local inference is slow and I know in advance that it is a small model, so I pair it with a thorough reviewer. I always spawn two agents for a task: the local LLM implements, a Claude model reviews. They have their own job handbooks, they look at the same task, and they take turns through report and review files until the reviewer gives it a pass, then closes it with commits and doc revisions and sends a push notification to my phone via [kukuroo](https://github.com/saiday/kukuroo).

Both handbooks, implementer on the left, reviewer on the right:

<div class="pair">
<div>

**Implementer**

````text
# Implementer Guide

You implement **one task at a time**. A separate session reviews your work. You do not review or commit.

## Read

Before starting, read:

1. `CLAUDE.md`
2. `docs/IMPLEMENTER.md`
3. The current task in `docs/TASKS.md`
4. Only the contract/UI sections explicitly referenced by that task

Do not preload future tasks or unrelated documentation.

## Rules

* Implement **only the current task**. No future work or unrelated refactoring.
* The task, contract, and UI spec are the source of truth. **Never guess.**
* Modify only files allowed by the task/review.
* Never weaken, alter, disable, or fake tests/acceptance checks.
* If required input is missing or something is unclear/broken, **stop and report it**.
* Run the project's required preflight/tests before reporting. Paste **actual output**.
* If you must change something outside the requested scope to make the task work, report it.
* Do not commit.

## Progress

Maintain `T<n>-todo.md` as a minimal, current checklist.

* Copy review items verbatim.
* Update after each item.
* It is progress, **not evidence or communication**.
* Do not carry old-round work forward unless the current review requires it.

## Review loop

The reviewer writes `T<n>-review.md`.

**Only section 2 (`Required work`) is actionable.**

For every `R<n>`:

1. Do it, don't do it, or report `Unable`.
2. Record the result in report section `a`.
3. Provide real verification output.

If it isn't in section 2, **don't do it**.

## Report

Append the round to `docs/implementation-reports/T<n>.md`:

* **a — Results:** every `R<n>` and its status
* **b — Evidence:** preflight first, then required verification output
* **c — Unrequested changes**
* **d — Documentation inconsistencies**
* **e — Undocumented decisions**
* **f — Blocked/incomplete work**

Reports are append-only. Never rewrite history.

## Handoff

Files contain the information; messages only notify.

After each round:

1. Write the report.
2. Notify the reviewer with task, round, and report path.
3. Wait for the review.

On a new review, read section 2 and continue only from there.

When the reviewer says **Closed**, stop.

Example:

```text
T<n> Round <N> report ready: docs/implementation-reports/T<n>.md
```
````

</div>
<div>

**Reviewer**

````text
# Reviewer Guide

You review **one task at a time**. A separate session implements it. You do not implement or modify source code.

## Read

Before reviewing, read:

1. `CLAUDE.md`
2. `docs/REVIEWER.md`
3. `docs/CONTRACT.md`
4. The current task in `docs/TASKS.md`
5. `docs/UI.md` when the task has UI requirements

The contract is the correctness authority. UI screenshots are part of your evidence.

## Rules

* Review the implementation; **do not fix it**.
* Never expand or redefine the task without PM approval.
* Check actual behavior, not just static/preflight checks.
* Missing or suspicious evidence must be verified or sent back.
* Project-defined hard stops must pass.
* A valid blocker, ambiguity, or repeated failure goes to PM.
* Do not modify source code. Put required fixes in the next review.
* Commit only when closing the task.

## Review

Read the implementer's report.

**Only section 2 (`Required work`) may contain instructions.**

For each required fix, specify:

**file → current behavior → required behavior → verification**

Keep confirmed items and future notes separate from required work.

A review verdict is exactly one of:

* `Pass`
* `Pass after additional evidence`
* `Fail`

Before passing, verify:

* acceptance criteria;
* required evidence;
* preflight/tests;
* semantics the automated checks cannot prove;
* UI against the authoritative spec, when applicable.

## Review file

Append the round to `T<n>-review.md`:

1. **Verdict**
2. **Round boundary**
3. **Required work**
4. **Confirmed / no change**
5. **Future notes**
6. **PM decisions**
7. **Verification**

Only #3 is actionable.

## Closure

`Pass` means **close now**.

At closure:

* return durable findings to the project's source-of-truth documentation;
* move reports to the project's completed/history area;
* remove temporary TODO/screenshots;
* commit the closure;
* mark the task `Closed`;
* send a push notification via kukuroo to PM.

## Handoff

Files contain the information; messages only notify.

After each review:

```text
T<n> Round <N> verdict: <Pass | Pass after additional evidence | Fail>
Review: docs/implementation-reports/T<n>-review.md
```

If `Pass`, close first and say **Closed**.

If context must be compacted, preserve the current review and required work, then resume from section 2.
````

</div>
</div>

The two sessions never talk to each other directly. They communicate through one agreed pair of files, `implementation-reports-{TASK}.md` and `implementation-reports-{TASK}-review.md`, appended round after round until the review passes. That pair is worth no less than the functional source code that comes out of it. 

The workflow is robust and traceable. I get good results out of it, and it is the most engaged I have been with my own toolchain in a long time.
