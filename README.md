# Tedeset Cafe and Marketplace

Premium, modern cafe and marketplace experience built with Next.js + Sanity.

## Setup

```bash
pnpm install
pnpm dev
```

Run apps individually:

```bash
pnpm dev:web
pnpm dev:studio
```

## Environment Variables

Copy the example files and add your Sanity project credentials:

```bash
cp apps/web/.env.example apps/web/.env.local
cp apps/studio/.env.example apps/studio/.env.local
```

## Deploy

- **Sanity Studio**: `pnpm --filter studio deploy` (or `sanity deploy` inside `apps/studio`)
- **Web (Vercel)**: import `apps/web` into Vercel and set the same env vars.

## Import CSV into Sanity

```bash
cd apps/studio
sanity dataset import path/to/your-file.tar.gz production
```

For CSV imports, convert CSV to NDJSON or use a dataset export. Refer to the Sanity docs for formatting.

## Update DoorDash URL

Open **Sanity Studio → Site Settings → DoorDash URL** and paste the live link.

