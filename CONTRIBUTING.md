# Contribute to Keet Support

Thank you for your interest in contributing to `keet-support-docs`.

[This repository](https://github.com/tetherto/keet-support-docs) is the Keet Support documentation site. It contains the static Next.js + Fumadocs app, docs content, automation scripts, and SEO tooling built on the `@tetherto/docs-seo-*` packages.

## Repository structure

- `src/`: Next.js app, layouts, providers, and shared UI components
- `content/`: MDX documentation content, organized into section folders (for example `installation-and-setup/`, `keet-groups/`, `voice-and-video-calls/`)
- `public/`: Static assets. `public/og/docs/` is generated during Open Graph image builds and is gitignored
- `scripts/`: Automation, including Open Graph generation, image-dimension generation, redirect stubs, and link and heading checks
- `source.config.ts`: Fumadocs MDX collection and the SEO frontmatter schema
- `.source/`: Fumadocs MDX output generated during install; gitignored and not committed

## Development environment setup

### Fork and clone

Fork the repository to your own GitHub account, then clone your fork locally:

```bash
git clone git@github.com:your-username/keet-support-docs.git
cd keet-support-docs
```

Add the upstream repository so you can keep your fork current:

```bash
git remote add upstream git@github.com:m4sterbunny/keet-support-docs.git
```

## Content contributions

Docs pages live in `content/` section folders and are processed by Fumadocs MDX.

Every docs page must include a non-empty `description` frontmatter value.

For built sites, this field is required for page metadata, Open Graph and Twitter cards, and JSON-LD.

Optional SEO frontmatter fields include:

- `noIndex`: Excludes the page from the sitemap and sets robots metadata to `noindex`.
- `ogImage`: Overrides the Open Graph and Twitter image with an absolute URL or site-relative static asset path.
- `schemaType`: Sets the JSON-LD type to `TechArticle`, `APIReference`, or `WebPage`.
- `docType`: Describes the page as `tutorial`, `how-to`, `reference`, `explanation`, `page`, `faq`, or `getting-started`.
- `lastModified`: Sets sitemap `lastmod` and JSON-LD publication metadata.

During `next build` and local development, the SEO helpers may print `[@tetherto/docs-seo]` warnings for missing optional fields. Treat required `description` warnings as blockers before opening a pull request.

## Pull request workflow

### Conventional types

Use Conventional Commits-style types for branch names and pull request titles.

| Type | Use for |
|---|---|
| `feat` | New features |
| `fix` | Bug fixes |
| `docs` | Documentation changes |
| `refactor` | Code refactoring without behavior changes |
| `test` | Test additions or changes |
| `chore` | Tooling, dependencies, and repo maintenance |
| `perf` | Performance improvements |
| `style` | Formatting only, with no behavior changes |
| `ci` | CI configuration changes |
| `build` | Build system or external dependency changes |

### Branch naming convention

Create branches in your fork using this pattern:

```bash
{type}/{short-description}
```

Examples:

- `docs/frontmatter-guidance`
- `fix/og-image-paths`
- `chore/update-fumadocs`

### Pull request steps

1. Sync your fork with upstream `main`.
2. Create a branch from your local `main`.
3. Make your changes.
4. Run the relevant local checks.
5. Commit your changes with meaningful messages.
6. Push the branch to your fork.
7. Open a pull request against `m4sterbunny/keet-support-docs` `main`.

### Pull request checklist

Before submitting your pull request, confirm that:

- [ ] New or updated docs pages include required `description` frontmatter
- [ ] Generated files such as `.source/` and `public/og/docs/` are not committed
- [ ] The relevant local checks pass

### Pull request title format

Use this format:

```bash
{type}({scope}): {description}
```

Examples:

- `docs(readme): clarify local install flow`
- `fix(og): normalize static image paths`
- `chore(deps): update fumadocs`

## Review and merge

Maintainers review pull requests for correctness, maintainability, docs quality, and build safety. Address requested changes in your branch and push updates to the same fork branch.

Maintainers decide the final merge strategy. Prefer small, focused pull requests that are easy to review.

## Code and documentation standards

- Follow the existing TypeScript, React, and Fumadocs patterns in nearby files
- Keep generated artifacts out of commits unless a maintainer explicitly asks to vendor them
- Use clear MDX headings, stable links, and concise examples
- Keep SEO metadata current when adding or moving docs pages
- Avoid adding new abstractions unless they reduce real duplication or match an existing local pattern
- You may follow this opinionated style guide

## Issues and security

Use GitHub issues for bugs, documentation problems, feature requests, and security concerns that can be discussed publicly.

Do not include secrets, private keys, tokens, customer data, or other sensitive material in an issue or pull request.

## Community

Follow the [Code of Conduct](CODE_OF_CONDUCT.md) when participating in this project.

🚀 Thanks for contributing. EVERYBODY appreciates your help improve to `keet-support-docs`.

## Opinionated style guide

### Overview 

- Google developer style
- US English
- Bullet lists no stop  (- Keet not - Keet.)
- umbered lists stop
- Follow Diataxis information architecture
- No positional references ("Swap the filename for any other model from the table” NOT "Swap the filename for any other model from the table above”)
- Links

### Frontmatter and linking strategy

Links are from relevant text NOT "see ..." (do "The [Worker install pattern][install-pattern] defines the per-Worker mechanics." NOT "See the Worker [install pattern][install-pattern] for the per-Worker mechanics.")

Ask maintainer if the page you are building is to be ported to `tether.io`, if so follow reference-style link definitions plus routing comments:

/mdk-prv/docs/reference/maintainers/port-signals.md

### Fixed sections, in order

1. `## Overview` — one paragraph or `## How it works`+ "This page ...
2. `## Next steps` — bullet list, each item `Description — [link](path)`

### Admonitions

Use GFM for markdown pure sites:

- `> [!NOTE]` — context, side info
- `> [!IMPORTANT]` — common failure modes and their fix
- `> [!WARNING]` — security or destructive action

Use Fumadocs admonitions for HTML sites:

<Callout type="info">
This is an **info** callout — use for general information.
</Callout>

<Callout type="warn">
This is a **warn** callout — use for warnings.
</Callout>

<Callout type="warning">
This is a **warning** callout — alias for warn.
</Callout>

<Callout type="error">
This is an **error** callout — use for errors or critical issues.
</Callout>

<Callout type="success">
This is a **success** callout — use for success messages.
</Callout>

<Callout type="idea">
This is an **idea** callout — use for tips or suggestions.
</Callout>


### Code blocks

- Always fenced with language tag (`bash`, `js`, etc.) except terminal session output which uses plain ` ``` `
- Expected output blocks are plain ` ``` ` with a preceding "Expected output" sentence

### Tutorial style

Inherits from the opinionated style, with the following additions:

> [!NOTE]
> description: Style guide for Documentation Guild tutorials
> context: globs: docs/tutorials/**/*.md

#### Tutorial frontmatter

```yaml
title: Verb-first, outcome-focused title
description: From X to Y in Z minutes
```

#### Fixed sections

Select from the following as they are needed, in order:

1. `> [!NOTE]` linking to prerequisite concepts (if needed)
2. `## Overview` — one paragraph + "What you'll have at the end" bullet list + orienting sentence pointing at the example
3. `## Prerequisites` — plain bullet list (`- Tool vX`)
4. `<Steps>` … `</Steps>` — all numbered steps
5. `## What just happened` — numbered list, **bold term** then explanation
6. `## Cleanup` — how to stop and remove state
7. `## Next steps` — bullet list, each item `Description — [link](path)`

#### Steps structure

```md
<Steps>

<Step>

##### Step title

###### N.M Sub-step title

content

</Step>

</Steps>
```

- `###` for each `<Step>` title — no "Step N:" prefix (component numbers automatically)
- `####` for sub-steps — keep the `N.M` prefix e.g. second part of Step 1 is 1.2
- Optional steps: `### (Optional) Title`

#### Code blocks

- Always fenced with language tag (`bash`, `js`, etc.) except terminal session output which uses plain ` ``` `
- Expected output blocks are plain ` ``` ` with a preceding "Expected output" sentence
