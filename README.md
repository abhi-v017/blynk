# Bento — a link-in-bio that looks like you

A Linktree alternative with deep visual customization and a real-time live preview.
Next.js 15 (App Router) + Tailwind CSS v4 + Firebase (Auth + Firestore).

## What's built

- **Auth** — email/password sign up (with atomic username claim) and sign in
- **Profile editor** — display name, bio, avatar URL
- **Links editor** — add / edit / delete / enable-disable / drag-to-reorder (dnd-kit)
- **Theme editor** — the core USP:
  - Background: solid color, gradient (2 stops + angle), or image with darken overlay
  - Typography: separate display/body Google Fonts, colors, size scale
  - Buttons: shape (sharp / soft / pill), fill (solid / outline / glass), colors, spacing
  - Layout: stack or grid
  - Animation: none / fade / rise / pop (staggered per link)
  - Avatar shape: circle / square / squircle
  - **5 starting presets** (Midnight Ember, Paper & Ink, Citrus Pop, Glass Grid, Mono Terminal) — pick one, then tweak any control
- **Live preview** — a phone-frame mock in the dashboard renders `ProfileRenderer` with the
  in-memory Zustand draft, so every control updates it instantly, no save/reload needed.
  Profile + theme autosave to Firestore ~700ms after you stop typing; links save per action.
- **Public page** — `/[username]` renders the same `ProfileRenderer` at full size, reading
  straight from Firestore.

## Project structure

```
src/
  app/
    page.tsx                  landing page
    (auth)/login, register    auth pages
    dashboard/
      layout.tsx               shell: nav tabs + persistent live-preview panel, autosave
      profile/, links/, theme/ the three editor tabs
    [username]/page.tsx        public profile page
  components/
    ProfileRenderer.tsx        turns a ThemeConfig into real pixels (shared by preview + public page)
    PhoneFrame.tsx              phone mock for the dashboard preview
    SortableLinkRow.tsx         dnd-kit draggable link row
    GoogleFontLoader.tsx        injects the two Google Fonts a theme needs, at runtime
    ui.tsx                      Field/TextInput/ColorInput/SegmentedControl/Toggle/Panel
  lib/
    types.ts                   UserProfile / LinkItem / ThemeConfig
    firebase.ts                 Firebase app init (reads NEXT_PUBLIC_FIREBASE_* env vars)
    firestore.ts                 all Firestore reads/writes (see schema below)
    auth-context.tsx             React context around Firebase Auth
    editor-store.ts              Zustand draft store that powers the live preview
    presets.ts, fonts.ts         theme preset gallery + curated font list
firestore.rules                Firestore security rules (public read on profiles/links/themes,
                                owner-only writes, immutable usernames)
```

## Firestore schema

```
/usernames/{username}          { userId }
/users/{userId}                { userId, username, displayName, bio, profilePic, createdAt, published }
/users/{userId}/links/{linkId} { title, url, order, isActive }
/themes/{userId}                ThemeConfig (see src/lib/types.ts)
```

Username claiming is done in a Firestore **transaction** (`claimUsernameAndCreateProfile`)
so two people can't grab the same username in a race.

## Getting it running

1. **Create a Firebase project** at https://console.firebase.google.com
   - Enable **Authentication -> Email/Password**
   - Enable **Firestore Database** (start in production mode)
   - In Project settings -> General -> "Your apps", add a Web app and copy the config values

2. **Set env vars** — copy `.env.local.example` to `.env.local` and fill in the six
   `NEXT_PUBLIC_FIREBASE_*` values from step 1.

3. **Deploy the security rules** (or paste `firestore.rules` into the Firestore Rules tab
   in the console):
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init firestore   # point it at this project, keep the existing rules file
   firebase deploy --only firestore:rules
   ```

4. **Install and run**:
   ```bash
   npm install
   npm run dev
   ```
   Open http://localhost:3000, click "Claim your page", and go.

## Known v1 limitations (called out, not hidden)

- The public `/[username]` page fetches client-side rather than via SSR with the Admin SDK —
  fine for MVP, but for real SEO/social-preview cards you'll want to move that fetch into a
  Server Component using `firebase-admin`, plus per-user `generateMetadata` for OG tags.
- Avatar and background-image are URL fields, not file upload — wiring up Firebase Storage
  for direct upload is a natural next step (the `storage` export is already in `lib/firebase.ts`).
- No rate limiting on username-availability checks or profile view counts yet.

## Natural next steps (from your "Future Enhancements")

- Analytics: a `views` counter (increment on public page load) and per-link click counts
  are a small addition to `firestore.ts` + a Cloud Function or client-side increment.
- Custom blocks (YouTube/Spotify embeds): extend `LinkItem` with a `type` field and branch
  in `ProfileRenderer`.
- Theme marketplace: `THEME_PRESETS` is already data-driven — move it to a `presets`
  Firestore collection and it's community-extensible.
