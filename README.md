# Bharat Global Education

University comparison portal + admin panel. A single Next.js 15 monolith (App Router, TypeScript) with PostgreSQL (Prisma) and Resend for email.

## What's inside

**Public site** (`/`)
- Program filter chips, search, fee-budget filter, sort, reset
- University cards → Compare / Fee Details / Apply Now
- Sticky compare tray (max 3) → side-by-side comparison matrix
- "Find your best university in 30 seconds" quiz
- Lead forms (Free Counseling, Brochure, Apply, Talk to an Expert) → saved to Postgres + emailed via Resend
- WhatsApp button, footer driven by admin settings

**Admin panel** (`/admin`, login required)
- Dashboard: counts, recent leads, leads by source
- Universities: add / edit / hide / delete, fees, badges, programs, highlights
- Programs: the filter chips (name, icon, duration, order)
- Leads: search, filter by status, update status + notes, CSV export
- Settings: helpline phone/email/WhatsApp/address, lead-notification inbox, change password, add admin users

## Setup

```bash
cp .env.example .env          # fill in DATABASE_URL, ADMIN_*, AUTH_SECRET, RESEND_*
npm install
npm run db:migrate            # creates tables
npm run db:seed               # 7 programs, 10 universities, site settings, first admin user
npm run dev                   # http://localhost:3000  ·  admin: http://localhost:3000/admin
```

`AUTH_SECRET`: any random string of 32+ characters (`openssl rand -hex 32`).

### Email (Resend)
1. Create an API key at resend.com, put it in `RESEND_API_KEY`.
2. Verify your domain in Resend and set `EMAIL_FROM`, e.g. `Bharat Global Education <admissions@yourdomain.in>`.
3. Set the "Send new-lead emails to" inbox in **Admin → Settings**.

Without `RESEND_API_KEY`, emails are only logged to the server console (handy in development). Each lead triggers an admin alert and, if the student gave an email, a confirmation to the student. A failed email never blocks the lead from being saved.

## Deploy
Any Node host works (Vercel, Railway, Render, a VPS). Postgres options: Neon, Supabase, RDS, Railway.

```bash
npm run build                 # the homepage is pre-rendered, so DATABASE_URL must be reachable at build time
npm run db:deploy             # apply migrations in production
npm run start
```

The homepage revalidates every 60 s, and immediately whenever an admin saves a change.

## Project layout
```
prisma/            schema.prisma, migrations, seed.ts
src/app/(site)/    public homepage
src/app/actions/   submitLead server action (validation, rate limit, DB, email)
src/app/admin/     login, panel pages, admin server actions, CSV export route
src/components/    site/ (public UI) and admin/ (panel UI)
src/lib/           db, auth (JWT cookie), email (Resend), validation (zod), data loaders
src/middleware.ts  protects /admin/*
```
