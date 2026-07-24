# Blynk

**A link-in-bio platform for people who don't want their page to look like everyone else's.**

Blynk lets creators, developers, and freelancers build a personal micro-website — not a
generic list of links — with full control over background, typography, buttons, layout,
and motion. Changes render in a live preview as you make them, and the result is published
instantly at a unique, shareable URL.

---

## Table of contents

- [Overview](#overview)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Data model](#data-model)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Firestore security rules](#firestore-security-rules)
- [Project structure](#project-structure)
- [Available scripts](#available-scripts)
- [Deployment](#deployment)
- [Known limitations](#known-limitations)
- [Roadmap](#roadmap)
- [License](#license)

---

## Overview

Existing link-in-bio tools optimize for speed of setup at the cost of individuality: every
page ends up as the same rounded button list on the same gradient. Bento takes the opposite
bet — a small, opinionated set of controls (background, type, buttons, layout, motion) that
compose into a page that actually looks like the person who made it, backed by a live
preview so the editing experience never feels disconnected from the result.

## Features

**Authentication**
- Email/password sign up and sign in via Firebase Authentication
- Atomic username claiming — a Firestore transaction guarantees two people can never claim
  the same username, even under concurrent requests

**Profile management**
- Display name, bio, and avatar (image URL)
- Public, permanent address at `bento.page/{username}`

**Link management**
- Add, edit, and delete links
- Enable/disable a link without deleting it
- Drag-and-drop reordering (`@dnd-kit`)

**Theme customization** — the core of the product
- **Background** — solid color, two-stop gradient with adjustable angle, or image with a
  configurable darken overlay
- **Typography** — independent display and body Google Fonts, text and muted-text colors,
  three size scales
- **Buttons** — shape (sharp / soft / pill), fill (solid / outline / glass), colors, spacing
- **Layout** — stacked list or grid
- **Animation** — none / fade / rise / pop, staggered per link on load
- **Avatar shape** — circle / square / squircle
- **5 built-in presets** (Midnight Ember, Paper & Ink, Citrus Pop, Glass Grid, Mono Terminal)
  as starting points, fully overridable afterward

**Live preview**
- A phone-frame mock in the dashboard reflects every edit in real time from an in-memory
  draft store, with no save step required to see the result
- Profile and theme changes autosave to Firestore ~700ms after the user stops typing; link
  changes save per action

**Public profile page**
- Rendered at `/{username}` using the same rendering engine as the live preview, so what the
  owner sees while editing is exactly what visitors see

## Tech stack

| Layer | Choice |
|---|---|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| State | [Zustand](https://github.com/pmndrs/zustand) (editor draft state) |
| Auth | Firebase Authentication (email/password) |
| Database | Cloud Firestore |
| Drag & drop | [@dnd-kit](https://dndkit.com/) |
| Icons | [lucide-react](https://lucide.dev/) |

## Architecture

```
┌─────────────────────┐        ┌──────────────────────┐
│   Dashboard editor    │──────▶│  Zustand draft store   │
│  (profile/links/theme)│       │  (in-memory, instant)  │
└─────────────────────┘        └───────────┬──────────┘
                                            │ renders
                                            ▼
                                 ┌──────────────────────┐
                                 │   ProfileRenderer      │
                                 │ (theme → real pixels)  │
                                 └───────────┬──────────┘
                                            │ used by both
                       ┌────────────────────┴────────────────────┐
                       ▼                                         ▼
             Live preview (phone frame)                Public page /{username}
                                            
              debounced writes  ▼
                        ┌──────────────┐
                        │   Firestore   │
                        └──────────────┘
```

`ProfileRenderer` is the single source of truth for what a theme looks like — it takes a
`UserProfile`, a list of `LinkItem`s, and a `ThemeConfig`, and produces the same output
whether it's mounted inside the dashboard's phone-frame preview or on the public page. This
guarantees the preview and the published result never drift apart.

## Data model

Firestore collections:

```
/usernames/{username}
  { userId: string }

/users/{userId}
  {
    userId: string
    username: string
    displayName: string
    bio: string
    profilePic: string      // URL
    createdAt: number
    published: boolean
  }

/users/{userId}/links/{linkId}
  {
    title: string
    url: string
    order: number
    isActive: boolean
  }

/themes/{userId}
  {
    userId: string
    presetId: string
    background: { type, color, color2, gradientAngle, imageUrl, overlay }
    font: { family, bodyFamily, color, mutedColor, size }
    button: { shape, fill, bgColor, textColor, borderColor, spacing }
    layout: "stack" | "grid"
    animation: "none" | "fade" | "rise" | "pop"
    avatarShape: "circle" | "square" | "squircle"
  }
```

Full type definitions live in `src/lib/types.ts`.

## Getting started

### Prerequisites

- Node.js 18.18 or later
- A Firebase project ([console.firebase.google.com](https://console.firebase.google.com))

### 1. Clone and install

```bash
git clone <repository-url>
cd linkbio
npm install
```

### 2. Set up Firebase

1. Create a project in the [Firebase Console](https://console.firebase.google.com)
2. Enable **Authentication → Sign-in method → Email/Password**
3. Enable **Firestore Database** (production mode is fine)
4. Under **Project settings → General → Your apps**, register a Web app and copy the config
   object

### 3. Configure environment variables

Copy the example file and fill in the values from step 2:

```bash
cp .env.local.example .env.local
```

### 4. Deploy Firestore security rules

See [Firestore security rules](#firestore-security-rules) below.

### 5. Run the app

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Environment variables

All variables are required and must be prefixed `NEXT_PUBLIC_` since they're consumed by
the client-side Firebase SDK.

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Web API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Cloud Messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID |

## Firestore security rules

The rules in `firestore.rules` enforce:

- Public read access on profiles, links, and themes (required to render `/{username}` pages
  without authentication)
- Write access restricted to the authenticated owner (`request.auth.uid == userId`)
- Immutable usernames — once claimed, a username mapping cannot be updated or deleted
- Prevention of `userId`/`username` tampering on profile updates

**These rules must be published to your Firebase project before writes will succeed.** The
default Firestore rules deny all reads and writes, which surfaces as a
`Missing or insufficient permissions` error in the app if skipped.

Deploy via the CLI:

```bash
npm install -g firebase-tools
firebase login
firebase init firestore   # select the existing project and rules file
firebase deploy --only firestore:rules
```

...or paste the file contents directly into **Firestore Database → Rules** in the console
and click **Publish**.

## Project structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx              # Nav shell + persistent live preview + autosave
│   │   ├── profile/page.tsx
│   │   ├── links/page.tsx
│   │   └── theme/page.tsx
│   └── [username]/page.tsx         # Public profile page
├── components/
│   ├── ProfileRenderer.tsx         # Theme → rendered page (shared by preview & public page)
│   ├── PhoneFrame.tsx
│   ├── SortableLinkRow.tsx
│   ├── GoogleFontLoader.tsx
│   └── ui.tsx                      # Shared form primitives
├── lib/
│   ├── types.ts
│   ├── firebase.ts
│   ├── firestore.ts                # All Firestore reads/writes
│   ├── auth-context.tsx
│   ├── editor-store.ts             # Zustand draft store
│   ├── presets.ts
│   └── fonts.ts
└── hooks/
    └── useDebouncedEffect.ts
firestore.rules
.env.local.example
```

## Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Deployment

The app is a standard Next.js project and deploys cleanly to
[Vercel](https://vercel.com/) or any Node.js hosting environment:

1. Push the repository to your Git provider
2. Import it into Vercel (or run `vercel` from the CLI)
3. Add the six `NEXT_PUBLIC_FIREBASE_*` environment variables in the project settings
4. Deploy

No server-side secrets are required — all Firebase config used here is safe for client
exposure by design.

## Known limitations

- **Public page rendering** — `/{username}` currently fetches data client-side. This is
  sufficient for MVP use but not ideal for SEO or social share previews. Moving this to a
  Server Component with the Firebase Admin SDK, plus per-page `generateMetadata`, is the
  recommended next step.
- **Media uploads** — avatar and background images are entered as URLs rather than uploaded
  directly. Firebase Storage is already initialized in `src/lib/firebase.ts` and ready to
  wire up.
- **No analytics yet** — profile views and link clicks are not currently tracked.

## Roadmap

- Profile view and link click analytics
- Custom content blocks (embedded YouTube, Spotify, etc.)
- Theme preset marketplace, driven from a Firestore collection
- Custom domains
- Direct image upload via Firebase Storage

## License

This project is provided as-is for the purposes of this build. Add a license of your
choice before distributing publicly.