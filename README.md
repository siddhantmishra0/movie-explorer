This is a Next.js 15 + TypeScript + Tailwind Movie Explorer app.

## Getting Started

Setup

1. Create `.env.local` in the project root:

```
JWT_SECRET=replace-with-a-long-random-secret
TMDB_API_KEY=replace-with-your-tmdb-api-key
NEXT_PUBLIC_TMDB_IMAGE_BASE=https://image.tmdb.org/t/p
```

2. Install and run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

Features

- JWT auth (login/register), cookie stored, guarded routes via middleware
- Popular movies, search, pagination
- Movie detail with ISR (revalidate 5m)
- Favorites (localStorage) and Favorites page
- Responsive UI, `next/image`, loading skeletons
- Dark mode toggle with persisted preference

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

1. Push to a Git repository (GitHub).
2. Import to Vercel and set these environment variables for all environments:
   - `JWT_SECRET`
   - `TMDB_API_KEY`
   - `NEXT_PUBLIC_TMDB_IMAGE_BASE`
3. Deploy.
