
# Premium Wedding Invitation Website

A luxury, mobile-first wedding invitation site with cinematic animations, an opening "envelope" intro, music, countdown, RSVP, and a full admin panel powered by Lovable Cloud.

## Visual Direction

- Palette: ivory/cream background, deep emerald + champagne gold accents, soft rose blush highlights (placeholder — easily themable from admin later)
- Typography: Cormorant Garamond / Playfair Display for headings, Inter for body
- Treatments: glassmorphism cards, subtle gold gradient borders, grain/paper texture, parallax florals
- Motion: Framer Motion — fade-up, scale-in, parallax, stagger reveals, intersection-triggered section reveals

## Public Site Sections

1. **Loading screen** — animated monogram, progress shimmer
2. **Intro / "Open Invitation"** — fullscreen, animated envelope/seal that opens on tap, reveals greeting `Welcome, {name}` (from `?name=` URL param, defaults to "Dear Guest")
3. **Hero** — couple names, date, parallax background image, scroll cue
4. **About / Our Story** — timeline of the couple
5. **Event Details** — ceremony + reception cards with date, time, dress code
6. **Timeline** — day-of schedule
7. **Gallery** — responsive masonry grid with lightbox + hover zoom
8. **RSVP** — name, attending y/n, guest count, message → stored in DB
9. **Location** — embedded Google Maps + directions button
10. **Contact** — call, WhatsApp, email buttons
11. **Footer** — monogram, share row

## Interactive Features

- **Background music player** — floating bottom-right pill, play/pause, auto-prompt after intro open
- **Countdown timer** — days/hours/minutes/seconds to event
- **Share** — native share API + WhatsApp deep link + copy link (with toast)
- **Personalized greeting** — `?name=Vinoth` → "Welcome Vinoth"

## Admin Panel (`/admin`)

Lovable Cloud auth (email/password). Single admin role enforced via `user_roles` table + `has_role()` security-definer function.

Admin tabs:
- **Content** — edit couple names, date, story text, event details, timeline items, contact info, map URL, music URL
- **Gallery** — upload/delete images (Lovable Cloud Storage, public bucket `gallery`)
- **RSVPs** — table of submissions, export to Excel (.xlsx via `xlsx` lib)
- **Settings** — change music track, hero image

All admin pages live under `_authenticated/admin/*` with role gate.

## Data Model (Lovable Cloud / Supabase)

Tables (all with GRANTs + RLS):
- `site_content` — singleton row, all editable text/urls (JSONB sections)
- `gallery_images` — id, storage_path, caption, sort_order, created_at
- `timeline_events` — id, time, title, description, sort_order
- `rsvps` — id, name, attending, guest_count, message, created_at
- `user_roles` — id, user_id, role (enum: admin)

RLS:
- `site_content`, `gallery_images`, `timeline_events`: public SELECT, admin-only write
- `rsvps`: public INSERT, admin-only SELECT
- `user_roles`: authenticated SELECT own, admin write via SQL only

Storage bucket: `gallery` (public read).

## Technical Stack

- TanStack Start + React + TypeScript (existing template)
- Tailwind v4 + shadcn/ui (existing)
- Framer Motion (install)
- Lovable Cloud (Supabase) for DB / Auth / Storage
- `xlsx` for Excel export
- `embla-carousel` (already in shadcn) for gallery lightbox
- React Query (already wired) for data fetching

## Route Architecture

```
src/routes/
  __root.tsx                 # head defaults, providers
  index.tsx                  # public invitation (single long page, sections)
  auth.tsx                   # admin login
  _authenticated/
    route.tsx                # integration-managed auth gate
    admin/
      route.tsx              # admin layout + role check
      index.tsx              # dashboard
      content.tsx
      gallery.tsx
      rsvps.tsx
```

The public invitation lives on `/` as a single scroll experience (per the reference UX of premium invite sites — sections flow as one cinematic page with smooth scroll anchors).

## Build Order

1. Enable Lovable Cloud
2. Create DB schema + storage bucket + RLS
3. Install Framer Motion + xlsx
4. Build design tokens (styles.css) + shared motion primitives
5. Build public sections (loading → intro → hero → ... → footer) with placeholder content sourced from `site_content`
6. Music player, countdown, share, personalized greeting, RSVP form
7. Auth page + admin layout with role gate
8. Admin: content editor, gallery manager, RSVP viewer + Excel export
9. SEO meta on `/`, responsive QA at 390px / 768px / 1280px

## Notes / Trade-offs

- The reference video wasn't attached, so I'll target the standard "premium Indian/luxury wedding invite" aesthetic (gold + emerald, envelope intro, parallax florals). Easy to retheme after — palette and fonts are tokens.
- Background music will use a royalty-free placeholder track URL; admin can swap it.
- Google Maps uses a plain `iframe` embed URL (no API key needed).
- Admin user is created by signing up at `/auth`, then promoted via a one-time SQL insert into `user_roles` (I'll surface the exact SQL after signup).
