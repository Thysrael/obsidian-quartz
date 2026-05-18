# Repo Guide

## What This Repo Is

- This repo is an already-initialized Quartz 4 site fork, not a fresh Quartz starter. Normal work happens in `content/`, `quartz.config.ts`, and `quartz.layout.ts`.
- `docs/` is the upstream Quartz documentation site content. Do not confuse it with this site's notes content.

## Commands

- Use Node `22` and npm `>=10.9.2`. The repo enforces this with `.node-version`, `package.json`, and `.npmrc` (`engine-strict=true`).
- Install dependencies with `npm ci`.
- Local site preview: `npx quartz build --serve`. In this repo, `--serve` also turns on watch mode.
- One-off production-style build: `npx quartz build`.
- Full checks: `npm run check`.
- Full test suite: `npm test`.
- Single test file: `npm test -- quartz/util/path.test.ts`.
- Profiling build: `npm run profile`.
- Do not use `npx quartz create` for normal repo work; that command is for initializing content in a new Quartz setup.
- Do not use `npm run docs` unless you intentionally want to build the upstream Quartz docs from `docs/` instead of this site's content.

## Repo Layout

- `content/` is the published note tree. `content/index.md` is the home page.
- `quartz.config.ts` controls site behavior, plugins, ignored content, theme, analytics, and the deployed `baseUrl`.
- `quartz.layout.ts` controls page composition and site-specific UI pieces like footer links, search, graph, explorer, and reader mode.
- `quartz/` contains the Quartz engine itself, including the CLI, build pipeline, plugins, components, and the existing test files.

## Build And Content Quirks

- Default Quartz input/output are in use: build reads from `content/` and writes to `public/`.
- `npx quartz build` deletes `public/` before rebuilding. Do not hand-edit `public/`.
- `.quartz-cache/` and `public/` are generated and ignored.
- Content under `private/`, `templates/`, and `.obsidian` is ignored by Quartz config. Drafts are also filtered by `Plugin.RemoveDrafts()`.
- If you change deploy paths or site URLs, keep `quartz.config.ts` `baseUrl` aligned with the GitHub Pages project path.

## CI And Deploy

- The upstream Quartz CI workflows in `.github/workflows/ci.yaml`, `build-preview.yaml`, and `deploy-preview.yaml` are gated to `jackyzha0/quartz` and/or branch `v4`; they are not the authoritative check path for this fork.
- This fork's site deploy is `.github/workflows/deploy.yml`: pushes to `main`, runs `npm ci`, then `npx quartz build`, and publishes `public/` to GitHub Pages.
- The Dockerfile runs `npx quartz build --serve`, so container behavior is preview-server oriented, not a static artifact-only build.
