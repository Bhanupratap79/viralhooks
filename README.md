# ViralHooks — Social Media Hook Generator

Generate viral-worthy hooks for Instagram, TikTok, YouTube, Twitter, and LinkedIn in seconds.

🔗 **Live:** https://bhanupratap79.github.io/viralhooks/
📦 **Stack:** React 19 + Vite 8 + Tailwind CSS v4 + Supabase Auth

## Quick Start

```bash
npm install
cp .env.example .env   # add your Supabase creds + admin email
npm run dev
```

## Project Status

See [AGENTS.md](./AGENTS.md) for full context — Hermes agents on any machine read this file to pick up where work was left off.

## Build

```bash
GITHUB_PAGES=true npm run build
```

## Admin Access

Set `VITE_ADMIN_EMAIL` in `.env` to your email. The matching user gets auto-promoted to admin on login.
