# SHOOT — Pose-match camera

> **Real-time AI guidance for Instagram-worthy photos.** Pick a pose, match it in-camera, capture without the awkward retakes.

**Built for BTG ProdHacks 2026.**

---

## Demo & Deck

| | Link |
|---|---|
| **Video demo** | [Watch on Google Drive](https://drive.google.com/file/d/1zIAynD3_I4ejBdAsEmFbPaBl8LqqqpAk/view?usp=sharing) |
| **Pitch deck** | [View slides (PDF)](https://drive.google.com/file/d/1BAjRsNkFfpugn3x7tTL9EdwCc6gIz6he/view?usp=drive_link) |

---

## Features

- **Pose templates** — Browse or upload a reference pose; AI extracts the skeleton
- **Real-time overlay** — Ghost stickman guides alignment as you pose
- **Match score** — Live percentage + “Move left / Come closer” feedback
- **Reference photo toggle** — Optional transparent overlay of the original image
- **Side-by-side comparison** — Compare your capture to the reference before sharing
- **Supabase auth & storage** — Saved templates and gallery captures
- **Mobile-first** — Rear camera default, viewport-aware layout, share-to-roll

---

## Tech stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router) |
| **UI** | React 19, TypeScript, Tailwind CSS 4 |
| **Pose detection** | MediaPipe Pose — `@mediapipe/pose`, `@mediapipe/camera_utils`, `@mediapipe/drawing_utils` |
| **Auth & DB** | Supabase (SSR, Row Level Security) |
| **Deployment** | Vercel |

All pose analysis runs **on-device**; no server-side ML.

---

## Prerequisites

- **Node.js** 20+
- **npm**
- **Supabase** project (free tier)

---

## Quick setup

### 1. Clone & install

```bash
git clone https://github.com/medhareddy321/SHOOT.git
cd SHOOT
npm install
```

### 2. Environment variables

Copy the example env and add your Supabase keys:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Get these in [Supabase](https://supabase.com) → Project Settings → API.

### 3. Database tables

In Supabase → **SQL Editor**, run:

```sql
create table if not exists saved_photos (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  photo_data text not null,
  pose_name text not null,
  match_score integer not null,
  created_at timestamp default now()
);
alter table saved_photos enable row level security;
create policy "view saved"   on saved_photos for select using (auth.uid() = user_id);
create policy "insert saved" on saved_photos for insert with check (auth.uid() = user_id);
create policy "delete saved" on saved_photos for delete using (auth.uid() = user_id);

create table if not exists gallery_photos (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  photo_data text not null,
  pose_name text not null,
  match_score integer not null,
  capture_type text not null check (capture_type in ('auto','manual')),
  created_at timestamp default now()
);
alter table gallery_photos enable row level security;
create policy "view gallery"   on gallery_photos for select using (auth.uid() = user_id);
create policy "insert gallery" on gallery_photos for insert with check (auth.uid() = user_id);
create policy "delete gallery" on gallery_photos for delete using (auth.uid() = user_id);
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Allow camera access when you open the camera page.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run deploy` | Deploy to Vercel |
| `npm run lint` | Run ESLint |

---

## Deploy to Vercel

1. Push to GitHub and [import the repo](https://vercel.com/new).
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel → Settings → Environment Variables.
3. Deploy. Or run `npm run deploy` from your machine.

See [DEPLOY.md](./DEPLOY.md) for details.

---

## Project structure

```
├── app/
│   ├── camera/       # Pose-matching camera flow
│   ├── gallery/      # Captured photos
│   ├── saved/        # Saved pose templates
│   ├── login/        # Supabase auth
│   └── layout.tsx
├── components/
├── lib/              # Supabase client, storage, poses
├── public/poses/     # Seed pose images
└── middleware.ts     # Route protection
```

---

## Notes

- **Auth:** Supabase email/password via `/login`. Middleware protects `/camera`, `/saved`, `/gallery` when env vars are set.
- **Poses:** Seed templates in `lib/poses.ts` and `public/poses/`.
- **Camera:** Rear-facing by default on mobile; zoom/exposure sliders when supported by the device.

---

## Contributors

Built for [BTG ProdHacks 2026](https://prodHacks.com).  
Team: [@medhareddy321](https://github.com/medhareddy321), [@zenxol](https://github.com/zenxol).
