# tedm.dev

Personal site for Ted Mathew dela Cruz — bug bounty writeups, software development notes, and security research.

Built on [Monograph](https://github.com/xocoweb/monograph), a minimal Astro blog theme.

## Tech Stack

- Astro 7
- Tailwind CSS 4
- TypeScript
- Deployed to GitHub Pages

## Requirements

- Node.js `22.12.0` or newer
- npm

## Getting Started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Content

Posts live in `src/content/posts/`. Each post is a folder with an `index.md` and an optional cover image:

```yaml
---
title: "Post title"
excerpt: "Short description."
category: "Security" # must match src/config/categories.ts
date: 2024-02-10
author:
  name: "Ted Mathew dela Cruz"
  role: "Software developer & security researcher"
cover: # optional
  src: "./cover.jpg"
  alt: "Alt text"
featured: false
draft: false
---
```

Categories are defined in `src/config/categories.ts`. The build fails on any frontmatter mismatch, so typos surface before deploy.

## Routes

| Route | Page |
| --- | --- |
| `/` | Latest post, feed, and sidebar |
| `/posts/[page]` | Paginated archive |
| `/post/<slug>/` | Article |
| `/categories/` | Category index |
| `/category/<slug>/` | Posts in one category |
| `/about/`, `/contact/` | Static pages |
| `/rss.xml`, `/sitemap.xml` | Feeds |

## License

MIT
