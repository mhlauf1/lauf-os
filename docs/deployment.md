# Deployment

> Environment setup and deployment guide for LAUF OS

---

## Prerequisites

- Node.js 20+ (LTS recommended)
- npm 10+ or pnpm
- Git
- Supabase account
- Vercel account

---

## Local Development Setup

### 1. Clone and Install

```bash
git clone <repo-url>
cd lauf-os
npm install
```

### 2. Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Fill in your values (see Environment Variables section below).

### 3. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to Settings → API
3. Copy the URL and anon key to `.env.local`
4. Go to Settings → Database → Connection string
5. Copy the pooled URL (Transaction mode) to `DATABASE_URL`
6. Copy the direct URL (Session mode) to `DIRECT_URL`

### 4. Database Schema

Push the Prisma schema to your database:

```bash
npx prisma db push
```

Run the user trigger migration:

```bash
node scripts/run-migration.mjs
```

### 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

### Required Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Database (Prisma)
DATABASE_URL="postgresql://postgres.xxx:password@xxx.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Optional Variables

```bash
# AI Services
ANTHROPIC_API_KEY=sk-ant-...

# Encryption (for client credentials)
# Generate with: openssl rand -hex 32
ENCRYPTION_KEY=your_64_char_hex_string
```

### Generating Secrets

```bash
# Generate ENCRYPTION_KEY (32 bytes = 64 hex chars)
openssl rand -hex 32
```

---

## Prisma Configuration

### prisma.config.ts

Prisma 7 uses a config file for CLI settings:

```typescript
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: {
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"],
  },
});
```

### Commands

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Open Prisma Studio
npx prisma studio

# Create migration
npx prisma migrate dev --name <name>
```

---

## Vercel Deployment

### 1. Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Import your git repository
3. Framework preset: Next.js
4. Root directory: `.`

### 2. Configure Environment Variables

In Vercel project settings, add all environment variables:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service role key |
| `DATABASE_URL` | Pooled connection string |
| `DIRECT_URL` | Direct connection string |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` |
| `ANTHROPIC_API_KEY` | Your API key (optional) |

### 3. Deploy

```bash
# Deploy to production
vercel --prod

# Or push to main branch for automatic deployment
git push origin main
```

---

## Production Checklist

### Before Launch

- [ ] All environment variables set in Vercel
- [ ] Database schema pushed to production
- [ ] User trigger migration applied
- [ ] Test login flow works
- [ ] Test creating tasks works
- [ ] Test creating clients works

### After Launch

- [ ] Verify authentication works
- [ ] Verify data creation works
- [ ] Monitor error logs
- [ ] Check database connections

---

## Domain Configuration

### Custom Domain (Optional)

1. In Vercel project settings → Domains
2. Add your domain
3. Configure DNS records as instructed
4. Update `NEXT_PUBLIC_APP_URL` environment variable

---

## Monitoring

### Vercel Analytics

Enable in Vercel project settings for:
- Page performance
- Web vitals
- Error tracking

### Supabase Dashboard

Monitor in Supabase dashboard:
- Database queries
- Auth events
- Storage usage

---

## Troubleshooting

### Common Issues

**"Invalid environment variable" error**
- Check all required variables are set
- Ensure no trailing whitespace in values

**Database connection fails**
- Verify DATABASE_URL and DIRECT_URL are correct
- Check Supabase project is running
- Ensure user is authenticated

**Prisma generate fails**
- Run `npx prisma generate` after schema changes
- Check prisma.config.ts is correct

**User creation fails**
- Verify the user trigger is installed
- Run `node scripts/run-migration.mjs`

### Useful Commands

```bash
# Check TypeScript errors
npm run typecheck

# Run linter
npm run lint

# Check build locally
npm run build

# Open Prisma Studio
npx prisma studio
```

---

## Rollback Procedure

If a deployment has issues:

1. In Vercel dashboard, go to Deployments
2. Find the last working deployment
3. Click "..." → "Promote to Production"
4. Fix the issue in development
5. Re-deploy when ready

---

_Last updated: January 2026_
