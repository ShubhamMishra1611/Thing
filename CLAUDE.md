# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"quanta-log" — Shubham Mishra's personal blog/landing page. Static HTML/CSS/JS site (no build step, no framework). Deployed to GitHub Pages from the `quanta-log/` directory.

## Architecture

All site content lives under `quanta-log/`:
- `index.html` — landing page
- `posts/*.html` — individual blog posts (hand-authored HTML)
- `assets/style.css` — single stylesheet, dark/light theme via CSS custom properties on `[data-theme]`
- `assets/theme.js` — IIFE that reads/writes `localStorage('ql-theme')` and exposes `toggleTheme()`

Posts use CDN-loaded KaTeX for math and highlight.js for code blocks. No local build or bundling.

## Deployment

GitHub Actions workflow at `quanta-log/.github/workflows/deploy.yml` deploys `quanta-log/` to GitHub Pages on push to `main`.

## Development

No install/build/test commands — open HTML files directly in a browser. To add a post, create a new `.html` file in `quanta-log/posts/` following the structure of `native-sparse-attention.html` (include `class="post-page"` on body, link `../assets/style.css` and `../assets/theme.js`).

## Style conventions

- Fonts: Literata (body), Geist Mono (UI/code)
- Colour tokens defined in `:root` / `[data-theme="light"]` blocks in `style.css`
- Inline styles used in `index.html` for layout; reusable classes (`.featured`, `.post-item`, `.tag`, etc.) in `style.css`
