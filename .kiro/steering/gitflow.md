# Git Workflow

## Branching

- Always work on a feature branch. Never commit directly to `main`.
- Branch naming: `feat/short-description`, `fix/short-description`, `docs/short-description`.
- Push with `-u` to set up tracking on first push.

## Commits

- Commit often — small, focused commits over large batches.
- Follow conventional commit style: `docs:`, `feat:`, `fix:`, `chore:`.
- Stage specific files rather than `git add .`.
- Include changelog updates in the same commit as the related change.

## Pull Requests

- Push to a feature branch and open a PR against `main`.
- Keep PR titles concise (under 70 characters). Use the description for details.
- Use `gh pr create` for GitHub PRs.

## Safety

- Prefer new commits over `--amend`.
- No force pushes, `reset --hard`, or `branch -D` without explicit permission.
- Flag files that may contain secrets before committing (`.env`, credentials, tokens).
