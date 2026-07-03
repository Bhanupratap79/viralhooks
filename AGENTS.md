# ViralHooks — Micro-SaaS Social Media Hook Generator

## Current State (Last Updated: 2026-07-03)

ViralHooks is a React 19 + Vite 8 + Tailwind v4 static SPA that generates attention-grabbing social media hooks. Fully client-side — no backend needed.

**Live at:** https://bhanupratap79.github.io/viralhooks/
**GitHub:** https://github.com/Bhanupratap79/viralhooks
**Domain to buy:** viralhooks.net (via Cloudflare)

---

## ✅ Completed So Far

### Core App
- Landing page with Hero, Features, How It Works, Pricing, FAQ
- Hook generator engine — 1,296 template variations across 6 platforms × 6 tones × 6 types
- React Context for global state (daily counter, saved hooks)
- localStorage persistence for saved hooks
- Dark theme with glassmorphism, gradients, framer-motion animations
- HashRouter for GitHub Pages compatibility
- Navbar with Login/Dashboard/Admin links for authenticated users

### Supabase Auth (fully integrated)
- Login/Signup with email/password
- Google OAuth
- AuthContext with session management and PKCE callback handling
- Email verification flow works — `exchangeCodeForSession()` on callback

### Admin Panel (secure)
- Located at `/admin` route
- **Only the project owner gets admin access** — checked via `VITE_ADMIN_EMAIL` env var
- On login, if user's email matches `VITE_ADMIN_EMAIL`, their profile role is auto-promoted to 'admin'
- Anyone else sees "Access Denied"
- Admin features: user table with role management, send notifications to all users, stats dashboard

### Deploy
- Built and pushed to `gh-pages` branch
- Live at GitHub Pages URL above
- All code pushed to `master` branch

---

## 🔧 What's Pending / Next Steps

### 1. Supabase Database Setup (HIGH PRIORITY)
SQL exists in `setup.sql` but was **never executed** against Supabase. Run it via Supabase SQL Editor or the Management API. Creates:
- `profiles` table (id, email, display_name, role, created_at)
- `notifications` table (id, user_id, title, message, read, created_at)
- RLS policies
- Trigger `handle_new_user` to auto-create profile on signup

Without this, profile metadata falls back to `{ role: 'free' }` and notifications don't work.

### 2. Premium / Monetization
- Premium page exists at `/premium` — marketing page with comparison table, testimonials
- No payment processing yet (Stripe placeholder says "Coming Soon — $9/mo")
- Need to: integrate Stripe, create premium feature gates in AppContext

### 3. Feature Expansion (saved as skill `viralhooks-feature-plan`)
- Caption generator (multi-line captions with emojis and CTAs)
- Reel scripts generator (short video scripts by duration)
- Thumbnail text generator
- Multi-language support (Hindi + English)
- Bio generator for Instagram/Twitter/LinkedIn
- AI-powered generation via local Ollama (optional)

### 4. Domain Setup
- Buy `viralhooks.net` via Cloudflare
- Point to GitHub Pages
- Update Supabase redirect URLs to custom domain

### 5. YouTube Shorts Automation Project
Two related projects exist:
- `~/youtube-shorts-automation` — old project (paid Kling API pipeline) — should be deleted
- `~/youtube-shorts-factory` — zero-cost pivot dashboard — was accidentally deleted on Jul 2, needs recreation

---

## 🧱 Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 19 |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 (@tailwindcss/vite plugin) |
| Animations | framer-motion |
| Routing | react-router-dom (HashRouter) |
| Icons | lucide-react |
| Auth | Supabase (email/password + Google OAuth) |
| Storage | localStorage (saved hooks, daily counter) |
| State | React Context (AuthContext, AppContext) |

## 📁 Architecture

```
src/
├── components/     # Reusable UI components
│   ├── Navbar.jsx, Hero.jsx, Footer.jsx
│   ├── FeatureCard.jsx, HowItWorks.jsx
│   ├── PricingCard.jsx, Faq.jsx
│   ├── PlatformSelector.jsx, ToneSelector.jsx, HookTypeSelector.jsx
│   ├── HookCard.jsx, ResultsGrid.jsx, SavedHooksPanel.jsx
│   ├── DailyCounter.jsx, PageTransition.jsx, LoginPromptModal.jsx
│   └── NotificationBell.jsx
├── pages/          # Route pages
│   ├── LandingPage.jsx   # /
│   ├── AppPage.jsx       # /app (hook generator)
│   ├── DashboardPage.jsx # /dashboard (user dashboard)
│   ├── AdminPage.jsx     # /admin (secure — owner only)
│   ├── LoginPage.jsx     # /login
│   ├── PremiumPage.jsx   # /premium
│   ├── PrivacyPage.jsx   # /privacy
│   └── TermsPage.jsx     # /terms
├── context/        # State management
│   ├── AuthContext.jsx   # Supabase auth, session, role
│   └── AppContext.jsx    # Global app state
├── data/           # Template data
│   ├── hookTemplates.js  # 1,296 hook templates
│   ├── hashtagBank.js    # Hashtag suggestions
│   └── wordBank.js       # Template fill words
├── utils/          # Logic
│   ├── generator.js      # Hook generation engine
│   └── storage.js        # localStorage helpers
└── lib/
    └── supabase.js       # Supabase client + ADMIN_EMAIL export
```

---

## 🔐 Environment Variables (.env)

```env
VITE_SUPABASE_URL=https://fagduzmqrplbgxvxclrm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...Qokk      # get from existing .env
VITE_ADMIN_EMAIL=you@example.com           # only this email gets admin
```

The `.env` file is gitignored — secrets stay local. Copy `.env.example` to get started.

---

## 🚀 Common Commands

```bash
npm install           # Install deps
npm run dev           # Dev server
npm run build         # Production build
GITHUB_PAGES=true npm run build   # Build with /viralhooks/ base path
```

Deploy: build with `GITHUB_PAGES=true`, then push `dist/` to `gh-pages` branch.

---

## 🧑‍💻 Workflow Notes

- User goes by **Bhanu** (not bhawa — that's the system username)
- Prefers **concise confirmations** — responds "1" to approve
- **Zero-cost preference** — avoids paid APIs, prefers local/free tools
- Decision style: willing to wipe and restart fresh over incremental fixes
- Relationship: "partner, not just tool" — take initiative, lead technically
- Code is built with OpenCode (opencode run) — divide work, make technical decisions without asking permission
