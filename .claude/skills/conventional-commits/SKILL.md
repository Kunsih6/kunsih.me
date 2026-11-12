---
name: conventional-commits
description: Conventional Commits 1.0.0 rules for writing git commit messages. Use ALWAYS whenever creating, amending, or proposing a git commit in this project.
---

# Conventional Commits

Every commit message in this project MUST follow [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/). Apply this whenever you run `git commit` (including `--amend`) or draft a commit message.

## Format

```
<type>[optional scope][!]: <description>

[optional body]

[optional footer(s)]
```

## Rules

1. The message MUST start with a **type** (a noun such as `feat`, `fix`), followed by an optional **scope**, an optional `!`, and a required colon plus space.
2. `feat` MUST be used when adding a new feature (SemVer MINOR).
3. `fix` MUST be used for a bug fix (SemVer PATCH).
4. A **scope** is optional, a noun describing a section of the codebase, wrapped in parentheses: `fix(layout): ...`.
5. The **description** MUST immediately follow the colon and space. It is a short summary of the change.
6. A **body** is optional. It MUST begin one blank line after the description and is free-form (multiple paragraphs allowed).
7. **Footers** are optional. They MUST begin one blank line after the body. Each is `Token: value` or `Token #value`, with `-` instead of spaces in the token (e.g. `Reviewed-by: Z`, `Refs: #123`). `BREAKING CHANGE` is the only token allowed to contain a space.
8. **Breaking changes** MUST be flagged either by `!` immediately before the colon (`feat!:`, `feat(api)!:`) or by a footer `BREAKING CHANGE: <description>` (uppercase; `BREAKING-CHANGE` is a synonym). They correlate to SemVer MAJOR and can be used with any type.
9. Types are case-insensitive except `BREAKING CHANGE`, which MUST be uppercase. Be consistent: use lowercase types.

## Allowed types

`feat`, `fix`, plus the conventional set recommended by `@commitlint/config-conventional`:

| Type       | Use for                                                    |
| ---------- | ---------------------------------------------------------- |
| `build`    | Build system or dependency changes (pnpm, Astro config)    |
| `chore`    | Maintenance that doesn't touch src or tests                |
| `ci`       | CI configuration and scripts                               |
| `docs`     | Documentation only                                         |
| `style`    | Formatting, whitespace, lint fixes (no behavior change)    |
| `refactor` | Code change that neither fixes a bug nor adds a feature    |
| `perf`     | Performance improvement                                    |
| `test`     | Adding or correcting tests                                 |
| `revert`   | Reverting a previous commit                                |

## Style guidance for this project

- Write the message in English, imperative mood, lowercase description, no trailing period: `feat: add about page`.
- Keep the first line at 72 characters or fewer.
- One logical change per commit. If a change spans several types, split it into several commits.
- Use a scope when it adds clarity (e.g. `eslint`, `deps`, `layout`, `pages`).
- Do NOT add attribution lines (such as `Co-Authored-By`) to commit messages.

## Examples

```
feat: add about page
```

```
fix(layout): correct viewport meta tag
```

```
build(deps): add eslint with antfu config
```

```
docs: correct spelling of README
```

```
feat(api)!: drop support for Node 20

BREAKING CHANGE: Node 22 or newer is now required.
```

```
fix: prevent racing of requests

Introduce a request id and a reference to the latest request.
Dismiss incoming responses other than from the latest request.

Refs: #123
```

## Before committing

1. Review the staged changes (`git diff --staged`) and pick the type that best matches the intent.
2. Write the message following the rules above.
3. Verify it matches the `<type>[scope][!]: <description>` shape before running `git commit`.
