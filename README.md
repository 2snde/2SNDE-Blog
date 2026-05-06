# 2snde.pro

> Personal site of **Steve Senade** — Sales & Tech B2B.  
> Posts · Creations · Talks

[![Live](https://img.shields.io/badge/site-2snde.pro-4f9cf9?style=flat-square)](https://2snde.pro)
[![Linktree](https://img.shields.io/badge/linktree-stevesenade-34d399?style=flat-square)](https://linktr.ee/stevesenade)

---

## What is this?

This is the source code of [2snde.pro](https://2snde.pro), my personal site built with React. It serves as a home for three types of content:

- **Posts** — Articles on sales strategy, tech, and field insights. Written in Markdown with full formatting support (bold, headers, code blocks, images, quotes).
- **Creations** — Open-source prototypes, tools and apps I build at the intersection of sales and technology.
- **Talks** — Podcasts, recorded calls, vlogs and interviews.

All content is bilingual 🇫🇷 FR / 🇬🇧 EN — articles stay in their original language, the interface toggles between both.

---

## Stack

| Layer | Tech |
|---|---|
| Framework | React 18 |
| Styling | Pure CSS (CSS variables, no framework) |
| Typography | Syne + IBM Plex Serif + IBM Plex Mono |
| Content | Markdown (custom parser) |
| Storage | localStorage (client-side) |
| Deploy | Cloudflare Pages |

No backend. No database. No build-time CMS. Everything runs in the browser.

---

## Project structure

```
2snde-pro/
├── public/
│   └── index.html          # HTML entry point + SEO meta tags
├── src/
│   ├── App.jsx             # Main app — all sections, data, components
│   └── index.js            # React root mount
├── .gitignore
├── package.json
└── README.md
```

---

## Run locally

```bash
# Clone
git clone https://github.com/stevesenade/2snde-pro.git
cd 2snde-pro

# Install
npm install

# Start dev server
npm start
# → http://localhost:3000
```

---


| Setting | Value |
|---|---|
| Framework preset | `Create React App` |
| Build command | `npm run build` |
| Build output directory | `build` |
| Root directory | *(leave empty)* |

4. Click **Save and Deploy** → live at `*.pages.dev`
5. Add custom domain `2snde.pro` in Pages settings

---

## Features

- ✍️ Markdown editor with live preview (split / write / preview modes)
- 🖼️ Image upload (PNG, JPEG, GIF, WebP) in posts and creations
- 🔗 Share to LinkedIn & X on every piece of content
- 🌐 FR / EN toggle — interface + per-content language tag
- 📌 Pin a featured post ("À la une")
- 📋 Table of contents auto-generated on long articles
- 💾 Auto-save drafts to localStorage
- ⌨️ `⌘S` keyboard shortcut to publish
- 🔊 Audio/video embed or file upload for Talks
- 📬 Contact section → [linktr.ee/stevesenade](https://linktr.ee/stevesenade)

---

## Content types

### Posts
Markdown articles with tags, reading time, language badge, images, and related articles.

### Creations
Projects with category (Prototype / Tool / App), status (Live / In progress), tech stack, links, and media gallery.

### Talks
Audio and video content with type (Podcast / Call / Vlog / Interview), source/show, duration, and audio embed or file.

---

## License

MIT — feel free to fork and adapt for your own personal site.

---

*Built by Steve Senade · [2snde.pro](https://2snde.pro) · [linktr.ee/stevesenade](https://linktr.ee/stevesenade)*
