# CareOrbit Server

Backend server for the CareOrbit application — TypeScript + Bun + Express + Prisma (Postgres).

## Features
- REST API with authentication and role-based users
- Appointment booking and scheduled tasks (cron)
- Stripe payment integration and webhook handling
- File uploads (local in /uploads, Cloudinary support for production)
- Email notifications (Nodemailer)
- Prisma ORM with migrations and seeds

## Tech stack
- Runtime: Bun (recommended)
- Framework: Express (TypeScript)
- ORM: Prisma with Postgres
- Payments: Stripe
- Media: Cloudinary + multer
- Email: Nodemailer

## Quickstart
1. Clone repository and enter folder:
   git clone <repo-url>
   cd Care_Orbit_Server

2. Install dependencies (Bun recommended):
   bun install
   # or with npm/pnpm if preferred

3. Copy `.env.example` to `.env` and fill required variables (see below).

4. Generate Prisma client and run migrations:
   npx prisma generate
   npx prisma migrate deploy    # use `npx prisma db push` for local dev if preferred

5. (Optional) Seed the database if seed script is present in prisma config:
   npx prisma db seed

6. Run in development:
   bun --watch src/server.ts
   # or npm run dev (script uses Bun in package.json)

## Important environment variables
Set these in `.env` (or your environment):
- NODE_ENV (development/production)
- PORT
- DATABASE_URL (Postgres connection string)
- SALT_ROUND
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- JWT_ACCESS_SECRET
- JWT_ACCESS_EXPIRES_IN
- JWT_REFRESH_SECRET
- JWT_REFRESH_EXPIRES_IN
- JWT_RESET_PASS_SECRET
- JWT_RESET_PASS_TOKEN_EXPIRES_IN
- OPENROUTER_API_KEY
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- EMAIL_USER
- EMAIL_APP_PASSWORD
- RESET_PASS_LINK
- SUPER_ADMIN_EMAIL
- SUPER_ADMIN_PASSWORD

## Stripe webhook
The server exposes a raw-body Stripe webhook endpoint:
- POST /api/v1/payment/webhook
Important: Stripe webhook route expects the raw body (configured accordingly in code).

## Prisma & Database
- Prisma schema and migrations located in `prisma/schema/`.
- Use `npx prisma generate` after changing the schema.
- Migration files are in `prisma/schema/migrations/`.

## Folder highlights
- src/ — application source
  - src/app/modules — features (appointments, payment, auth, etc.)
  - src/app/shared — helpers (prisma client, utilities)
  - src/app/middlewares — global error handler, notFound, etc.
- uploads/ — local media and example files
- prisma/schema/ — Prisma models & migrations

## Notes & cautions
- A cron job is scheduled in the app to run every minute to cancel unpaid appointments — adjust schedule for production.
- Ensure `STRIPE_WEBHOOK_SECRET` is set when enabling webhooks and that your webhook endpoint is reachable (use Stripe CLI or a public URL in development).
- Cloudinary credentials are required for production media uploads.

## Contributing
- Follow TypeScript strict rules and existing code style.
- Run Prisma migrations and seeds locally before opening PRs that change models.

## License
Add your project license here.

