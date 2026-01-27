# Deployment

> Environment setup and deployment guide for LAUF OS

---

## Prerequisites

- Node.js 20+ (LTS recommended)
- npm 10+ or pnpm
- Git
- Supabase account
- Vercel account
- X Developer account (for API access)

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

#### Option A: Supabase Cloud (Recommended)

1. Create a project at [supabase.com](https://supabase.com)
2. Go to Settings → API
3. Copy the URL and anon key to `.env.local`
4. Copy the service role key (keep secret)

#### Option B: Local Supabase

```bash
# Install Supabase CLI
npm install -g supabase

# Start local Supabase
supabase start

# Apply migrations
supabase db push
```

### 4. Database Schema

Run the migrations to create tables:

```bash
npm run db:migrate
```

Generate TypeScript types:

```bash
npm run db:types
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
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Never expose to client

# X API (Twitter)
X_CLIENT_ID=your_x_client_id
X_CLIENT_SECRET=your_x_client_secret

# Token Encryption (32 bytes hex = 64 characters)
# Generate with: openssl rand -hex 32
ENCRYPTION_KEY=your_64_char_hex_string

# Cron Authentication
# Generate with: openssl rand -hex 16
CRON_SECRET=your_cron_secret

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Optional Variables

```bash
# AI Services
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_AI_API_KEY=AIza...  # For Gemini
```

### Generating Secrets

```bash
# Generate ENCRYPTION_KEY (32 bytes = 64 hex chars)
openssl rand -hex 32

# Generate CRON_SECRET
openssl rand -hex 16
```

---

## Supabase Configuration

### Create Tables

Apply the database schema:

```sql
-- See supabase/migrations/ for full schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create content_ideas table with RLS
CREATE TABLE content_ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  pillar TEXT CHECK (pillar IN ('redesign', 'build', 'workflow', 'insight')),
  status TEXT DEFAULT 'idea' CHECK (status IN ('idea', 'in_progress', 'ready', 'scheduled', 'posted')),
  media_urls TEXT[],
  scheduled_for TIMESTAMPTZ,
  posted_at TIMESTAMPTZ,
  x_post_id TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE content_ideas ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own ideas"
  ON content_ideas FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ideas"
  ON content_ideas FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ideas"
  ON content_ideas FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ideas"
  ON content_ideas FOR DELETE USING (auth.uid() = user_id);
```

### Storage Bucket

Create a storage bucket for media uploads:

1. Go to Supabase Dashboard → Storage
2. Create bucket named `media`
3. Set bucket to private
4. Add RLS policies for authenticated uploads

---

## X API Configuration

### 1. Create X Developer App

1. Go to [developer.twitter.com](https://developer.twitter.com)
2. Create a new project and app
3. Enable OAuth 2.0
4. Set callback URL: `https://your-app.vercel.app/api/x/callback`

### 2. Required Scopes

- `tweet.read` - Read your tweets
- `tweet.write` - Post tweets
- `users.read` - Read your profile
- `offline.access` - Refresh tokens

### 3. Get Credentials

Copy from the X Developer Portal:
- Client ID → `X_CLIENT_ID`
- Client Secret → `X_CLIENT_SECRET`

---

## Vercel Deployment

### 1. Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Import your git repository
3. Framework preset: Next.js
4. Root directory: `.` (or `lauf-os` if monorepo)

### 2. Configure Environment Variables

In Vercel project settings, add all environment variables:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service role key |
| `X_CLIENT_ID` | Your X Client ID |
| `X_CLIENT_SECRET` | Your X Client Secret |
| `ENCRYPTION_KEY` | Generated 32-byte hex |
| `CRON_SECRET` | Generated secret |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` |

### 3. Configure Cron Jobs

Create `vercel.json` in project root:

```json
{
  "crons": [
    {
      "path": "/api/cron/post-scheduled",
      "schedule": "* * * * *"
    }
  ]
}
```

This runs the scheduler every minute.

### 4. Deploy

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
- [ ] Supabase RLS policies tested
- [ ] X OAuth callback URL updated for production
- [ ] Database migrations applied to production
- [ ] Storage bucket configured
- [ ] Cron job configured in vercel.json
- [ ] Error monitoring set up (optional: Sentry)

### After Launch

- [ ] Verify login flow works
- [ ] Verify posting to X works
- [ ] Verify scheduled posts work
- [ ] Monitor error logs
- [ ] Check cron job execution

---

## Domain Configuration

### Custom Domain (Optional)

1. In Vercel project settings → Domains
2. Add your domain (e.g., `lauf-os.yoursite.com`)
3. Configure DNS records as instructed
4. Update `NEXT_PUBLIC_APP_URL` environment variable
5. Update X OAuth callback URL

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
- API requests

---

## Troubleshooting

### Common Issues

**"Invalid environment variable" error**
- Check all required variables are set
- Ensure no trailing whitespace in values

**X OAuth fails**
- Verify callback URL matches exactly
- Check Client ID and Secret are correct
- Ensure required scopes are enabled

**Database connection fails**
- Verify Supabase URL and keys
- Check RLS policies allow the operation
- Ensure user is authenticated

**Cron job not running**
- Check vercel.json is in root directory
- Verify CRON_SECRET matches
- Check Vercel cron logs

### Useful Commands

```bash
# Check TypeScript errors
npm run typecheck

# Run linter
npm run lint

# Test database connection
npm run db:types

# Check build locally
npm run build
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

## Security Notes

- Never commit `.env.local` to git
- Use Vercel's encrypted environment variables
- Rotate secrets if exposed
- Keep dependencies updated
- Monitor for security advisories

---

_Last updated: January 2026_
