---
title: "Installing Superpowers (or any Claude skills) in Antigravity"
slug: "installing-superpowers-in-antigravity"
date: "2026-02-06T00:00:00.000Z"
description: "A community adaptation guide for using the Superpowers workflow system with Antigravity. Learn how to install and configure skills from the Superpowers repository."
tags: ["antigravity", "superpowers", "tools", "workflows"]
draft: false
---

> **Note:** Community adaptation. Superpowers officially supports Claude Code, Codex, and OpenCode only.

Let your agent read this post. If you're already the agent, welcome.

## Installation

### 1. Clone Skills

```bash
mkdir -p ~/.gemini/antigravity/skills
git clone https://github.com/obra/superpowers.git ~/.gemini/antigravity/skills/superpowers
```

### 2. Create Workflow Files

```bash
mkdir -p ~/.gemini/antigravity/workflows
```

Create `.md` workflow files that reference the skills. For example:

```markdown
---
description: Interactive design refinement
---
Invoke the superpowers brainstorming skill at:
`~/.gemini/antigravity/skills/superpowers/skills/brainstorming/SKILL.md`
```

**Common Command-to-Skill Mappings:**

| Command | Skill |
|---------|-------|
| `/brainstorm` | brainstorming |
| `/write-plan` | writing-plans |
| `/execute-plan` | executing-plans |
| `/tdd` | test-driven-development |
| `/debug` | systematic-debugging |

## Architecture Mapping

Understanding how Superpowers concepts map to Antigravity:

| Superpowers Concept | Antigravity Equivalent | Default Location |
|---------------------|------------------------|------------------|
| Skills | Skills | `~/.gemini/antigravity/skills/` |
| Commands | Workflows | `~/.gemini/antigravity/workflows/` |

## Updating Skills

To update your Superpowers installation:

```bash
cd ~/.gemini/antigravity/skills/superpowers && git pull
```

## References

- [Superpowers Repository](https://github.com/obra/superpowers)
- [Superpowers Blog Post](https://blog.fsck.com/2025/10/09/superpowers/)

