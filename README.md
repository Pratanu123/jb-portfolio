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

## Deploy on a VPS (Docker)

The subdomain reaches Caddy. Caddy proxies the app. Postgres stays on the Docker network and is not published.

1. Point the subdomain A/AAAA record at the VPS (ports 80 and 443 open).
2. On the VPS:

```bash
git clone https://github.com/Pratanu123/jb-portfolio.git
cd jb-portfolio
cp .env.example .env
```

3. Edit `.env` and set at least:

   - `SITE_HOST` — `portfolio.yourdomain.com` (no `https://`)
   - `ACME_EMAIL` — for Let’s Encrypt
   - `AUTH_URL` — `https://portfolio.yourdomain.com`
   - `AUTH_SECRET` — `openssl rand -base64 32`
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD`
   - `POSTGRES_PASSWORD` — long alphanumeric string

4. Start the stack:

```bash
docker compose up -d --build
```

First boot creates the database, seeds the writings, and Caddy issues a certificate for the subdomain. Uploads and Postgres data persist in Docker volumes.

`http://SITE_HOST` and `https://SITE_HOST` both hit the same app. Postgres is not reachable from the public internet.

## Deploy on Vercel

1. Import [github.com/Pratanu123/jb-portfolio](https://github.com/Pratanu123/jb-portfolio) into Vercel.
2. Create a Neon or Vercel Postgres database.
3. Set `DATABASE_URL`, `AUTH_SECRET`, `AUTH_TRUST_HOST=true`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`.
4. Deploy. The production build seeds writings if the database is empty.

`postinstall` copies self-hosted TinyMCE into `public/tinymce` (that folder is not in git).
