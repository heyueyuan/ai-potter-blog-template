# AI-Porter Blog Template

Minimal Next.js blog template designed for AI-Porter.

## Features

- Reads markdown posts from `content/posts`
- Home page lists all posts
- Dynamic route at `posts/[slug]`
- `POST /api/revalidate` for on-demand ISR

## Local development

```bash
npm install
npm run dev
```

## Environment variables

- `REVALIDATE_SECRET`: secret for `/api/revalidate`

## Publish format

The extension should push markdown files to:

- `content/posts/<timestamp>.md`
