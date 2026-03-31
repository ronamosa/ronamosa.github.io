---
title: "Debugging Kiro IDE Agent Terminal Hang"
description: "Debugging Kiro IDE's AI agent hanging on terminal commands — root causes were a missing GLIBCXX native library and zsh/Powerlevel10k interfering with shell integration OSC 633 sequences."
keywords: ["kiro ide", "kiro agent", "terminal hang", "osc 633", "shell integration", "powerlevel10k", "libstdc++", "glibcxx", "ubuntu 22.04", "debugging"]
tags: ["ai", "kiro", "debugging", "linux", "ide"]
---

:::info 🤖 AI Collaboration
This post was co-written with AI assistance. All technical testing, troubleshooting, and real-world insights are from the author's direct experience. AI helped with structure, clarity, and documentation formatting.
:::

## Overview

Kiro IDE (Amazon's AI-native IDE built on the VS Code/Electron stack) has an agentic AI chat that executes terminal commands — `git status`, `git diff`, file operations — as part of its reasoning loop. On my Ubuntu 22.04 system, the agent would fire off a command, a terminal would open, the command would visibly run and produce output, but the output never routed back to the chat. The agent hung indefinitely on every command.

This turned out to be three issues stacked on top of each other, each masking the one below it.

---

## The Symptom

Kiro's agent chat uses the integrated terminal to execute commands. It relies on **OSC 633 escape sequences** — a protocol where the shell emits invisible markers (`\e]633;C\a` for command start, `\e]633;D\a` for command complete) so the IDE knows when a command has finished and can capture the output.

When that handshake breaks, the agent sends a command into the void and waits indefinitely.

---

## Investigation

### Layer 1: Obvious Suspects (Eliminated)

First checks:

- **Git lock files** — None present.
- **Stale IPC sockets** — Found 32 orphaned `vscode-git-*.sock` files in `/run/user/1000/` dating back to February. Cleaned them out. No change.
- **Memory pressure** — System was using 28GB/31GB RAM with swap fully exhausted. Killed 60 orphaned Cursor processes, freed 10GB. No change.
- **Duplicate shell integration** — `.zshrc` had a line loading Kiro's shell integration a second time (`kiro --locate-shell-integration-path zsh`) when Kiro already injects it via `ZDOTDIR`. Commented it out. No change.

None of these were the root cause, but the stale sockets and orphaned processes were adding noise and resource pressure.

### Layer 2: Missing Native Library (Partial Fix)

Opened Kiro's Developer Tools (`Ctrl+Shift+I`) and found the console spamming this on every Extension Host process:

```
Error: /lib/x86_64-linux-gnu/libstdc++.so.6: version 'GLIBCXX_3.4.31' not found
(required by spdlog.node)
```

`spdlog` is the native logging library Kiro uses for structured output capture. Ubuntu 22.04 (Jammy) ships `libstdc++6` from GCC 12, which only includes GLIBCXX up to 3.4.30. Kiro v0.11.107 was built against GCC 13+.

**Fix:**

```bash
sudo add-apt-repository ppa:ubuntu-toolchain-r/test -y
sudo apt update
sudo apt install libstdc++6 -y
```

This resolved the spdlog errors, but the agent still hung.

### Layer 3: zsh + Powerlevel10k (Root Cause)

With the native module fixed and the console clean, the agent was still losing terminal output. The breakthrough came from switching the integrated terminal from zsh to bash:

```json
"terminal.integrated.defaultProfile.linux": "bash"
```

Every command routed back to the agent immediately.

**Powerlevel10k and Oh My Zsh** were interfering with the OSC 633 escape sequences that Kiro's shell integration relies on. Despite `KIRO_SHELL_INTEGRATION=1` being set and hooks being registered, p10k's prompt wrapping, precmd/preexec hooks, and the `gitstatusd` background daemon were corrupting or swallowing the invisible terminal markers.

Kiro's shell integration script has special p10k detection:

```zsh
if [ -n "${P9K_SSH:-}" ] || [ -n "${P9K_TTY:-}" ]; then
    builtin printf '\e]633;P;PromptType=p10k\a'
fi
```

On Ubuntu 22.04 with the full oh-my-zsh + p10k stack, this detection was insufficient. The prompt framework's hooks fired in an order that broke the sequence tracking.

---

## Root Cause Summary

Three separate issues were stacked:

1. **32 stale IPC sockets + 60 orphaned Cursor processes** — not the root cause, but added noise and resource pressure
2. **Missing GLIBCXX_3.4.31** — Ubuntu 22.04's libstdc++ was too old for Kiro's native spdlog module, breaking the output capture pipeline at the C++ layer
3. **zsh/p10k vs OSC 633** — Powerlevel10k's prompt hooks interfered with the escape sequence protocol that routes terminal output back to the AI agent

Fix #2 without fix #3 and the agent still hangs. Fix #3 without fix #2 and the native module still can't load. All three needed to be resolved.

:::warning
Any shell framework that hooks into the prompt lifecycle — Powerlevel10k, Oh My Zsh, Starship, custom precmd functions — is a potential source of interference with OSC 633 sequences in AI-native IDEs.
:::

---

## Recommended Configuration

Set bash (or a minimal zsh config) as the IDE terminal profile and keep the full p10k/oh-my-zsh setup for standalone terminals. The IDE terminal and the daily-driver terminal have different requirements — the IDE terminal is an API surface for agent tooling, not just a human interface.

:::tip
You can set this per-IDE without affecting your system shell. In Kiro or VS Code settings:

```json
"terminal.integrated.defaultProfile.linux": "bash"
```

:::

---

## Quick Reference

| Symptom | Check | Fix |
|---------|-------|-----|
| Agent hangs on ALL commands | Shell framework (p10k, omz) | Switch IDE terminal to bash |
| `GLIBCXX_3.4.31 not found` in console | `strings /lib/.../libstdc++.so.6 \| grep GLIBCXX` | Upgrade libstdc++6 from toolchain PPA |
| Intermittent hangs | Stale `vscode-git-*.sock` in `/run/user/` | Delete orphaned sockets, restart IDE |
| Agent hangs on `git diff`/`git log` only | Git pager config | Set `GIT_PAGER=cat` in IDE terminal env |

---

## Environment

- **OS:** Ubuntu 22.04.5 LTS (Jammy)
- **IDE:** Kiro v0.11.107
- **Shell:** zsh with Oh My Zsh + Powerlevel10k
- **Also running:** Cursor, Obsidian, Claude Code
