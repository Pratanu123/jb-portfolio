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

## Deploy on the inkandvoltage.com VPS

`portfolio.inkandvoltage.com` is served by the existing Docker Nginx in `/opt/blog`. This stack runs Next.js + Postgres only (Caddy is disabled so it does not take ports 80/443). The app joins the `blog_blogcms` network as `jb-portfolio`.

GitHub Actions deploys `main` over SSH by running `scripts/deploy.sh`.

1. Point the `portfolio` A record at the VPS (already `187.127.162.32`).
2. On the VPS:

```bash
git clone https://github.com/Pratanu123/jb-portfolio.git /opt/jb-portfolio
cd /opt/jb-portfolio
cp .env.example .env
```

3. Edit `.env` and set at least:

   - `SITE_HOST` — `portfolio.inkandvoltage.com`
   - `AUTH_URL` — `https://portfolio.inkandvoltage.com`
   - `AUTH_SECRET` — `openssl rand -base64 32`
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD`
   - `POSTGRES_PASSWORD` — long alphanumeric string

4. Start the app (Nginx in `/opt/blog` already proxies the subdomain):

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

First boot creates the database and seeds the writings. Uploads and Postgres data persist in Docker volumes. Postgres is not published to the public internet.

A standalone Caddy edge (`docker compose up` without the prod overlay) is only for a dedicated VPS that does not already bind 80/443.

## Deploy on Vercel

1. Import [github.com/Pratanu123/jb-portfolio](https://github.com/Pratanu123/jb-portfolio) into Vercel.
2. Create a Neon or Vercel Postgres database.
3. Set `DATABASE_URL`, `AUTH_SECRET`, `AUTH_TRUST_HOST=true`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`.
4. Deploy. The production build seeds writings if the database is empty.

`postinstall` copies self-hosted TinyMCE into `public/tinymce` (that folder is not in git).
