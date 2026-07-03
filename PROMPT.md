# ViralHooks - Social Media Hook Generator (Micro-SaaS)

## Project Overview
Build a complete React micro-SaaS web app called **ViralHooks** — a tool that generates attention-grabbing hooks/captions for social media content. The MVP works fully offline using built-in templates/patterns (no external API needed). Premium tier concept for future monetization.

## Tech Stack
- React 19 + Vite 8
- Tailwind CSS v4 (with @tailwindcss/vite plugin — already configured)
- framer-motion for animations
- react-router-dom for routing (HashRouter)
- lucide-react for icons

## Design Requirements

### Visual Style
- **Color palette:** Deep purple (#6C3CE1) as primary, hot pink (#FF3366) as accent, dark navy (#0F0F23) for backgrounds, white/light gray for text
- **Dark theme** by default with glassmorphism effects (backdrop-blur, semi-transparent backgrounds)
- **Gradients** throughout — purple-to-pink gradient for CTAs, buttons, hero sections
- **Smooth animations** — page transitions, card hover effects, loading skeletons, micro-interactions
- **Modern typography** — system font stack with clean hierarchy
- **Rounded corners** (12px-24px) on cards, buttons, inputs
- **Responsive** — mobile-first, works perfectly on all screen sizes

### Pages

#### 1. Landing Page (/) — The main hook
- **Hero section**: Animated gradient background, headline "Create Viral-Worthy Hooks in Seconds", subheading explaining the value, two CTA buttons ("Start Generating" → /app, "See Examples" scrolls down)
- **How It Works**: 3-step visual (Choose Platform → Enter Topic → Get Hooks) with icon cards and subtle animations
- **Features Grid**: 6 feature cards with icons — Multi-Platform, Tone Customization, One-Click Copy, Save Favorites, Bulk Generate (Premium), Analytics (Premium)
- **Preview/Demo**: An interactive mini-demo showing the generator in action (a live preview of hook generation with sample data)
- **Pricing Section**: Free (5 hooks/day) and Premium ($9/mo — Unlimited hooks, bulk export, analytics, priority support) — clean comparison cards with gradient on Premium
- **FAQ**: Accordion-style with 5-6 common questions
- **Footer**: Links, copyright

#### 2. Generator App (/app) — The main tool
- **Platform Selector**: Visual cards/buttons for Instagram, TikTok, YouTube, Twitter/X, LinkedIn, Facebook — with platform icons and colors
- **Topic Input**: Text input with placeholder examples, character counter
- **Tone Selector**: Pill-shaped toggle buttons — Professional, Casual, Funny, Inspirational, Dramatic, Witty
- **Hook Type**: Dropdown or pills — Question Hook, Story Hook, Statistic Hook, Bold Statement, How-To, List
- **Generate Button**: Large gradient button with loading animation
- **Results Area**: Card-based layout showing generated hooks with:
  - Hook text displayed prominently
  - Platform badge
  - Tone badge
  - Copy button (with "Copied!" toast notification)
  - Save button (heart/favorite icon)
  - Suggested hashtags (3-5 per hook)
- **Saved Hooks Panel**: Sidebar (desktop) / drawer (mobile) showing saved favorites, stored in localStorage
- **Daily Counter**: Shows "5/5 free hooks used today" with upgrade CTA

#### 3. Premium Page (/premium) — Marketing page for paid tier
- Beautiful comparison table
- Feature highlights with animations
- Stripe checkout placeholder (button that says "Coming Soon - $9/mo")
- Testimonials section (3-4 fictional but realistic testimonials)
- Money-back guarantee badge

## Data & Logic

### Hook Templates (client-side, no API needed)
Create a rich dataset of hook templates organized by:
- platform (instagram, tiktok, youtube, twitter, linkedin, facebook)
- tone (professional, casual, funny, inspirational, dramatic, witty)
- type (question, story, statistic, bold_statement, how_to, list)

Each template is a string with placeholders like `{topic}`, `{number}`, `{pain_point}`, `{benefit}`.

Example structure in `/src/data/hookTemplates.js`:
```js
export const hookTemplates = {
  instagram: {
    question: {
      professional: [
        "Stop scrolling if {topic} matters to you. Here's what you need to know...",
        // ...more
      ],
      casual: [
        "OK but can we talk about {topic} for a sec?",
        // ...more
      ],
      // ...more tones
    },
    // ...more types
  },
  // ...more platforms
};
```

Include at least 200+ template variations across all platforms/tones/types.

### Generation Logic (in `/src/utils/generator.js`)
- Function `generateHooks(topic, platform, tone, type, count = 5)` that:
  1. Matches templates for the given platform, tone, and type
  2. Randomly selects `count` templates
  3. Fills in `{topic}` with user's topic, `{number}` with random numbers, `{pain_point}` and `{benefit}` with contextually relevant words from a word bank
  4. Returns array of hook objects: `{ id, text, platform, tone, type, hashtags: [], saved: false }`
- Hashtag generator: for each hook, generate 3-5 relevant hashtags from a hashtag bank organized by topic category

### State Management
- Use React Context for global state (daily hook count, saved hooks, theme)
- Saved hooks persist to localStorage
- Daily counter resets based on date

## Component Architecture

### `/src/components/`
- `Navbar.jsx` — Sticky nav with logo, links, CTA button, mobile hamburger menu
- `Hero.jsx` — Animated hero section for landing page
- `FeatureCard.jsx` — Reusable feature card with icon, title, description
- `HowItWorks.jsx` — 3-step process section
- `PricingCard.jsx` — Pricing tier card
- `Faq.jsx` — Accordion FAQ
- `Footer.jsx` — Site footer
- `PlatformSelector.jsx` — Visual platform picker
- `ToneSelector.jsx` — Tone pill buttons
- `HookTypeSelector.jsx` — Hook type selector
- `HookCard.jsx` — Individual hook result card with copy/save
- `ResultsGrid.jsx` — Grid of HookCards
- `SavedHooksPanel.jsx` — Sidebar/drawer of saved hooks
- `Toast.jsx` — Toast notification for copied/saved
- `DailyCounter.jsx` — Shows hook usage count
- `LoadingSkeleton.jsx` — For generate loading state
- `PageTransition.jsx` — Framer motion page wrapper

### `/src/pages/`
- `LandingPage.jsx` — Main marketing page
- `AppPage.jsx` — The generator tool
- `PremiumPage.jsx` — Premium upsell page

### `/src/context/`
- `AppContext.jsx` — Global state provider

### `/src/data/`
- `hookTemplates.js` — 200+ hook templates
- `hashtagBank.js` — Hashtag suggestions by category
- `wordBank.js` — Words for template population (pain points, benefits, etc.)

### `/src/utils/`
- `generator.js` — Hook generation logic
- `storage.js` — localStorage helpers

## Quality & Error-Proofing
- Every component must handle loading, empty, and error states
- Form validation on all inputs (topic required, min 3 chars)
- Rate limiting via daily counter
- Graceful degradation if localStorage is full
- Proper React key usage in lists
- No console.log in production code
- All text content in the generation templates must be in English and grammatically correct
- Edge cases: empty topic, switching platform mid-generation, rapid clicking

## Responsive Breakpoints
- Mobile: 0-639px (single column, hamburger menu)
- Tablet: 640-1023px (2 columns for features/pricing)
- Desktop: 1024px+ (full layout with sidebar)

## Performance
- Lazy load the /app route
- Image optimization (use SVG icons from lucide-react, no heavy images)
- Debounced generate button (no double-clicks)
- CSS animations over JS where possible

## What to Build
Build ALL of the above. Every component, every page, every data file, every utility. The app should be a complete, working MVP that looks like a polished product ready to launch. Use HashRouter (not BrowserRouter) for GitHub Pages / static hosting compatibility.

After building, verify that `npm run build` succeeds with no errors.
