# Database Schema

> Detailed database schema for LAUF OS with migration strategy

---

## Overview

LAUF OS uses PostgreSQL via Supabase with Row Level Security (RLS) enabled on all tables. The schema is designed for:

- Single-user MVP (you only)
- Soft deletes for data recovery
- Audit trails with timestamps
- Efficient queries with proper indexes

---

## Status

| Table | Status | RLS | Notes |
|-------|--------|-----|-------|
| `users` | Planned | Yes | Extended from Supabase auth.users |
| `content_ideas` | Planned | Yes | Core content table |
| `post_metrics` | Planned (V0.3) | Yes | X post performance |
| `feed_sources` | Planned (V0.2) | Yes | RSS and X account sources |
| `feed_items` | Planned (V0.2) | Yes | Ingested feed content |
| `learning_logs` | Planned (V0.2) | Yes | Learning session records |
| `follower_snapshots` | Planned (V0.3) | Yes | Historical follower counts |

---

## Core Types

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom enum types
CREATE TYPE pillar_type AS ENUM ('redesign', 'build', 'workflow', 'insight');
CREATE TYPE status_type AS ENUM ('idea', 'in_progress', 'ready', 'scheduled', 'posted');
CREATE TYPE feed_source_type AS ENUM ('rss', 'x_account');
CREATE TYPE feed_category AS ENUM ('ai', 'design', 'dev', 'indie', 'general');
```

---

## Tables

### users

Extended user profile linked to Supabase auth.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  x_username TEXT,
  x_access_token TEXT,      -- Encrypted
  x_refresh_token TEXT,     -- Encrypted
  x_token_expires_at TIMESTAMPTZ,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);

-- RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);
```

### content_ideas

The core content idea bank.

```sql
CREATE TABLE content_ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  pillar pillar_type NOT NULL,
  status status_type DEFAULT 'idea',
  media_urls TEXT[],
  scheduled_for TIMESTAMPTZ,
  posted_at TIMESTAMPTZ,
  x_post_id TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,

  -- Constraints
  CONSTRAINT valid_schedule CHECK (
    (status != 'scheduled') OR (scheduled_for IS NOT NULL)
  ),
  CONSTRAINT valid_posted CHECK (
    (status != 'posted') OR (posted_at IS NOT NULL)
  )
);

-- Indexes
CREATE INDEX idx_ideas_user_id ON content_ideas(user_id);
CREATE INDEX idx_ideas_status ON content_ideas(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_ideas_pillar ON content_ideas(pillar) WHERE deleted_at IS NULL;
CREATE INDEX idx_ideas_scheduled ON content_ideas(scheduled_for)
  WHERE status = 'scheduled' AND deleted_at IS NULL;
CREATE INDEX idx_ideas_sort ON content_ideas(user_id, sort_order)
  WHERE deleted_at IS NULL;

-- RLS
ALTER TABLE content_ideas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own ideas"
  ON content_ideas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ideas"
  ON content_ideas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ideas"
  ON content_ideas FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ideas"
  ON content_ideas FOR DELETE
  USING (auth.uid() = user_id);
```

### post_metrics (V0.3)

X post performance data.

```sql
CREATE TABLE post_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID NOT NULL REFERENCES content_ideas(id) ON DELETE CASCADE,
  impressions INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  replies INTEGER DEFAULT 0,
  retweets INTEGER DEFAULT 0,
  bookmarks INTEGER DEFAULT 0,
  quotes INTEGER DEFAULT 0,
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_metrics_idea_id ON post_metrics(idea_id);
CREATE INDEX idx_metrics_fetched ON post_metrics(fetched_at DESC);

-- RLS
ALTER TABLE post_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view metrics for own ideas"
  ON post_metrics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM content_ideas
      WHERE content_ideas.id = post_metrics.idea_id
      AND content_ideas.user_id = auth.uid()
    )
  );
```

### feed_sources (V0.2)

RSS feeds and X accounts to follow.

```sql
CREATE TABLE feed_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type feed_source_type NOT NULL,
  url TEXT NOT NULL,
  category feed_category DEFAULT 'general',
  is_active BOOLEAN DEFAULT true,
  last_fetched_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_sources_user_id ON feed_sources(user_id);
CREATE INDEX idx_sources_active ON feed_sources(is_active) WHERE is_active = true;

-- RLS
ALTER TABLE feed_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own sources"
  ON feed_sources FOR ALL
  USING (auth.uid() = user_id);
```

### feed_items (V0.2)

Ingested content from feed sources.

```sql
CREATE TABLE feed_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID NOT NULL REFERENCES feed_sources(id) ON DELETE CASCADE,
  external_id TEXT,          -- Original ID from source
  title TEXT,
  content TEXT,
  url TEXT,
  image_url TEXT,
  author TEXT,
  published_at TIMESTAMPTZ,
  is_read BOOLEAN DEFAULT false,
  is_saved BOOLEAN DEFAULT false,
  is_dismissed BOOLEAN DEFAULT false,
  converted_to_idea_id UUID REFERENCES content_ideas(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(source_id, external_id)
);

-- Indexes
CREATE INDEX idx_items_source_id ON feed_items(source_id);
CREATE INDEX idx_items_unread ON feed_items(is_read, created_at DESC)
  WHERE is_read = false AND is_dismissed = false;
CREATE INDEX idx_items_saved ON feed_items(is_saved) WHERE is_saved = true;

-- RLS
ALTER TABLE feed_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view items from own sources"
  ON feed_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM feed_sources
      WHERE feed_sources.id = feed_items.source_id
      AND feed_sources.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update items from own sources"
  ON feed_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM feed_sources
      WHERE feed_sources.id = feed_items.source_id
      AND feed_sources.user_id = auth.uid()
    )
  );
```

### learning_logs (V0.2)

Learning session records.

```sql
CREATE TABLE learning_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  topic TEXT NOT NULL,
  duration_minutes INTEGER,
  notes TEXT,
  tags TEXT[],
  resource_urls TEXT[],
  converted_to_idea_id UUID REFERENCES content_ideas(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_logs_user_id ON learning_logs(user_id);
CREATE INDEX idx_logs_date ON learning_logs(date DESC);

-- RLS
ALTER TABLE learning_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own logs"
  ON learning_logs FOR ALL
  USING (auth.uid() = user_id);
```

### follower_snapshots (V0.3)

Historical follower counts for growth tracking.

```sql
CREATE TABLE follower_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  count INTEGER NOT NULL,
  recorded_at DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, recorded_at)
);

-- Indexes
CREATE INDEX idx_snapshots_user_date ON follower_snapshots(user_id, recorded_at DESC);

-- RLS
ALTER TABLE follower_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own snapshots"
  ON follower_snapshots FOR ALL
  USING (auth.uid() = user_id);
```

---

## Triggers

### Auto-update updated_at

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables with updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON content_ideas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON feed_sources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON learning_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

---

## Functions

### Soft delete ideas

```sql
CREATE OR REPLACE FUNCTION soft_delete_idea(idea_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE content_ideas
  SET deleted_at = NOW()
  WHERE id = idea_id
  AND user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Get scheduled posts for cron

```sql
CREATE OR REPLACE FUNCTION get_due_scheduled_posts()
RETURNS TABLE (
  id UUID,
  user_id UUID,
  title TEXT,
  body TEXT,
  media_urls TEXT[],
  scheduled_for TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ci.id,
    ci.user_id,
    ci.title,
    ci.body,
    ci.media_urls,
    ci.scheduled_for
  FROM content_ideas ci
  WHERE ci.status = 'scheduled'
  AND ci.scheduled_for <= NOW()
  AND ci.deleted_at IS NULL
  ORDER BY ci.scheduled_for ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Storage Buckets

### media

For post images and attachments.

```sql
-- Create bucket (done via Supabase dashboard or API)
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', false);

-- RLS policies for storage
CREATE POLICY "Users can upload own media"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'media'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own media"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'media'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own media"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'media'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

---

## Migration Strategy

### File Naming Convention

```
supabase/migrations/
├── 20260126000000_create_types.sql
├── 20260126000001_create_users.sql
├── 20260126000002_create_content_ideas.sql
├── 20260126000003_create_triggers.sql
├── 20260126000004_create_functions.sql
└── 20260126000005_create_storage.sql
```

### Commands

```bash
# Generate types after migration
npm run db:types

# Push migrations to database
npm run db:migrate

# Reset database (development only)
npm run db:reset
```

---

## Query Examples

### Get ideas by pillar

```sql
SELECT * FROM content_ideas
WHERE user_id = auth.uid()
AND pillar = 'build'
AND deleted_at IS NULL
ORDER BY sort_order ASC;
```

### Get ready ideas for scheduling

```sql
SELECT * FROM content_ideas
WHERE user_id = auth.uid()
AND status = 'ready'
AND deleted_at IS NULL
ORDER BY created_at DESC;
```

### Get this week's scheduled posts

```sql
SELECT * FROM content_ideas
WHERE user_id = auth.uid()
AND status = 'scheduled'
AND scheduled_for >= date_trunc('week', NOW())
AND scheduled_for < date_trunc('week', NOW()) + INTERVAL '1 week'
AND deleted_at IS NULL
ORDER BY scheduled_for ASC;
```

### Get pillar counts

```sql
SELECT pillar, COUNT(*) as count
FROM content_ideas
WHERE user_id = auth.uid()
AND deleted_at IS NULL
GROUP BY pillar;
```

---

_Last updated: 2026-01-26_
