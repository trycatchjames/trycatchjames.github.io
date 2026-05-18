# Notes to Self - James Harvey

A public AI learning journal and digital garden built with VitePress. The site is Markdown-first: add notes as `.md` files under `docs/`, link them together, and use `<AutoIndex />` pages to keep indexes current.

The production site is published at <https://trycatchjames.github.io>.

## Install

```sh
npm install
```

## Run Locally

```sh
npm run dev
```

Build and preview the static output:

```sh
npm run build
npm run preview
```

## Add a Note

Create a Markdown file anywhere under `docs/`:

```text
docs/concepts/agents/planning.md
```

Add frontmatter when useful:

```md
---
title: Planning Agents
date: 2026-05-16
description: Notes on decomposition, tool use, and evaluation loops.
tags:
  - agents
  - planning
---

# Planning Agents

Your note starts here.
```

VitePress routing is file-based:

- `docs/foo.md` is available at `/foo`
- `docs/foo/index.md` is available at `/foo/`
- `docs/concepts/agents/tool-calling.md` is available at `/concepts/agents/tool-calling`

## Link Between Notes

Use normal Markdown links without `.md` extensions:

```md
[Tool Calling](./tool-calling)
[Agents](./agents/)
[Concepts](../concepts/)
```

## AutoIndex

`<AutoIndex />` creates dynamic Markdown listings from files under `docs/`. Patterns are resolved relative to the Markdown page where the component is used.

```md
<AutoIndex pattern="./*.md" />
```

More options:

```md
<AutoIndex
  pattern="./**/*.md"
  showDate
  showExcerpt
  showTags
  sort="date-desc"
/>
```

Supported props:

```ts
type AutoIndexProps = {
  pattern: string;
  recursive?: boolean;
  showDate?: boolean;
  showExcerpt?: boolean;
  showTags?: boolean;
  compact?: boolean;
  card?: boolean;
  sort?: "title" | "date-desc" | "date-asc";
  limit?: number;
};
```

By default, `AutoIndex` excludes `index.md`, `404.md`, and the current page. It understands both `note.md` and `note/index.md` route forms.

## Deployment

GitHub Actions deploys the site from `.github/workflows/deploy.yml` on pushes to `main`.

The workflow:

1. Uses Node 20
2. Installs dependencies with `npm ci`
3. Runs `npm run build`
4. Uploads `docs/.vitepress/dist`
5. Deploys through GitHub Pages

In repository settings, Pages should use **GitHub Actions** as the source.

Because this repository is the GitHub Pages user site `trycatchjames.github.io`, VitePress must use:

```ts
base: "/";
```
