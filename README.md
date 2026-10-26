# Joyeeta Biswas — portfolio

Next.js 16 App Router site for Joyeeta’s writing portfolio, with an admin desk for settings and pieces.

## Local

```bash
cp .env.example .env
npm install
npx prisma db push
npx prisma db seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin is at `/admin`.

## Deploy on Vercel

1. Import [github.com/Pratanu123/jb-portfolio](https://github.com/Pratanu123/jb-portfolio) into Vercel.
2. Create a Neon or Vercel Postgres database.
3. Set these project environment variables (Production):

   - `DATABASE_URL` — the Postgres connection string (`postgresql://…`)
   - `AUTH_SECRET` — `openssl rand -base64 32`
   - `AUTH_TRUST_HOST` — `true`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`

4. Deploy. The production build runs `prisma db push` and seeds the live writings if the database is empty.

`postinstall` copies self-hosted TinyMCE into `public/tinymce` (that folder is not in git).
