# Security

> Security practices and architecture for LAUF OS

---

## Overview

LAUF OS handles sensitive data including:
- User authentication credentials
- X (Twitter) OAuth tokens
- Personal content ideas
- Usage analytics

This document outlines the security measures in place to protect this data.

---

## Secrets Management

### Environment Variables

All secrets are stored in environment variables, never in code.

```bash
# .env.local (gitignored)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...  # Server-only
X_CLIENT_ID=...
X_CLIENT_SECRET=...
ENCRYPTION_KEY=...              # For token encryption
CRON_SECRET=...                 # For cron authentication
ANTHROPIC_API_KEY=...
```

### Key Principles

1. **Never commit `.env` files** - All `.env*` files (except `.env.example`) are gitignored
2. **Use Vercel environment variables** - Production secrets are set in Vercel dashboard
3. **Rotate on compromise** - If any key is exposed, rotate immediately
4. **Minimal exposure** - Only expose `NEXT_PUBLIC_*` variables to the client

---

## Supabase Security

### Row Level Security (RLS)

All tables have RLS enabled with policies ensuring users can only access their own data:

```sql
-- Enable RLS
ALTER TABLE content_ideas ENABLE ROW LEVEL SECURITY;

-- Users can only see their own ideas
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

### Client Types

| Client | Key Used | Access Level | Usage |
|--------|----------|--------------|-------|
| Browser | Anon Key | RLS-protected | User-facing operations |
| Server | Anon Key + Cookies | RLS-protected | Server components, API routes |
| Admin | Service Role Key | Full access | Cron jobs only |

### Service Role Key Protection

The service role key bypasses RLS and has full database access.

**Rules:**
- ONLY use in server-side code
- ONLY use for system operations (cron jobs)
- NEVER expose to client
- NEVER import in client components

```typescript
// src/lib/supabase/admin.ts
// ONLY import this in server-side code (API routes, cron)
import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
```

---

## X API Token Security

### Token Encryption

X OAuth tokens are encrypted at rest using AES-256-GCM:

```typescript
// src/lib/utils/encrypt.ts
import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12
const TAG_LENGTH = 16

export function encrypt(text: string): string {
  const key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex')
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  const tag = cipher.getAuthTag()

  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`
}

export function decrypt(encrypted: string): string {
  const [ivHex, tagHex, data] = encrypted.split(':')
  const key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex')
  const iv = Buffer.from(ivHex, 'hex')
  const tag = Buffer.from(tagHex, 'hex')

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(tag)

  let decrypted = decipher.update(data, 'hex', 'utf8')
  decrypted += decipher.final('utf8')

  return decrypted
}
```

### Token Storage

```sql
-- Tokens stored encrypted in users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  x_access_token TEXT,   -- Encrypted
  x_refresh_token TEXT,  -- Encrypted
  ...
);
```

### Token Lifecycle

1. User authenticates with X OAuth
2. Tokens received from X
3. Tokens encrypted before storage
4. Tokens decrypted only when needed for API calls
5. Tokens refreshed when expired
6. Old tokens overwritten with new encrypted tokens

---

## Input Validation

### Zod Validation

All API inputs are validated with Zod schemas:

```typescript
// src/lib/validations/idea.schema.ts
import { z } from 'zod'

export const ideaSchema = z.object({
  title: z.string().min(1).max(500),
  body: z.string().max(10000).optional(),
  pillar: z.enum(['redesign', 'build', 'workflow', 'insight']),
  status: z.enum(['idea', 'in_progress', 'ready', 'scheduled', 'posted']).optional(),
  scheduled_for: z.string().datetime().optional(),
})

export type IdeaInput = z.infer<typeof ideaSchema>
```

### API Route Validation

```typescript
// In API route
const body = await req.json()
const parsed = ideaSchema.safeParse(body)

if (!parsed.success) {
  return apiResponse({ error: parsed.error.message }, 400)
}

// Use parsed.data - guaranteed to match schema
```

---

## XSS Prevention

### Content Sanitization

- User content is escaped before display
- Markdown is rendered with a sanitizing renderer
- Never use `dangerouslySetInnerHTML` with user content

### CSP Headers

Content Security Policy headers are configured in `next.config.js`:

```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  }
]
```

---

## Authentication Security

### Supabase Auth

- Session tokens are HTTP-only cookies
- Tokens are automatically refreshed
- Sessions expire after configurable period

### Protected Routes

Middleware protects dashboard routes:

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { /* cookie handling */ } }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user && request.nextUrl.pathname.startsWith('/(dashboard)')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}
```

---

## Cron Job Security

Cron endpoints are protected with a secret:

```typescript
// src/app/api/cron/post-scheduled/route.ts
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  // Execute cron job...
}
```

Vercel Cron passes this secret automatically when configured.

---

## Database Security

### Soft Deletes

Data is never permanently deleted in normal operations:

```sql
-- Soft delete
UPDATE content_ideas SET deleted_at = NOW() WHERE id = $1;

-- All queries filter out deleted records
SELECT * FROM content_ideas WHERE deleted_at IS NULL;
```

### Audit Fields

All tables have audit fields:

```sql
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW(),
deleted_at TIMESTAMPTZ,
```

### Indexes for Security Queries

```sql
-- Efficient RLS queries
CREATE INDEX idx_ideas_user_id ON content_ideas(user_id);
```

---

## Security Checklist

### Before Deployment

- [ ] All secrets are in environment variables
- [ ] No secrets in git history
- [ ] RLS enabled on all tables
- [ ] RLS policies tested
- [ ] Service role key only used server-side
- [ ] X tokens are encrypted
- [ ] Input validation on all endpoints
- [ ] Cron endpoints are authenticated
- [ ] Auth middleware protects routes

### Ongoing

- [ ] Regular dependency updates
- [ ] Monitor for security advisories
- [ ] Review access logs
- [ ] Rotate secrets periodically

---

## Incident Response

### If Secrets Are Exposed

1. **Immediately rotate the exposed secret**
2. Check git history for exposure
3. Review access logs for unauthorized use
4. Update all affected environment variables
5. Re-deploy application

### If Database Is Compromised

1. Revoke all tokens (X OAuth)
2. Reset user sessions
3. Review RLS policies
4. Audit data access
5. Notify affected users

---

## Security Resources

- [Supabase Security](https://supabase.com/docs/guides/security)
- [Next.js Security Headers](https://nextjs.org/docs/app/api-reference/config/next-config-js/headers)
- [OWASP Top 10](https://owasp.org/Top10/)
- [X OAuth Security](https://developer.twitter.com/en/docs/authentication/oauth-2-0)

---

_Last updated: January 2026_
