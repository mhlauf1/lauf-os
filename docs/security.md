# Security

> Security practices and architecture for LAUF OS

---

## Overview

LAUF OS handles sensitive data including:
- User authentication credentials
- Client information and credentials (encrypted)
- Financial data (contract values, retainers)
- Personal productivity data

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

# Database (Prisma)
DATABASE_URL=...               # Pooled connection
DIRECT_URL=...                 # Direct connection for migrations

# App
NEXT_PUBLIC_APP_URL=...
ANTHROPIC_API_KEY=...
```

### Key Principles

1. **Never commit `.env` files** - All `.env*` files (except `.env.example`) are gitignored
2. **Use Vercel environment variables** - Production secrets are set in Vercel dashboard
3. **Rotate on compromise** - If any key is exposed, rotate immediately
4. **Minimal exposure** - Only expose `NEXT_PUBLIC_*` variables to the client

---

## Authentication

### Supabase Auth

LAUF OS uses Supabase Auth for authentication:

- **Email/Password** - Traditional sign up and sign in
- **Magic Links** - Passwordless authentication via email
- **Session Management** - HTTP-only cookies for secure sessions

### User Trigger

When a user signs up, a database trigger creates the corresponding record in `public.users`:

```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Protected Routes

Middleware protects dashboard routes:

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const supabase = createServerClient(...)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user && request.nextUrl.pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}
```

---

## Database Security

### Prisma + Supabase

- **Prisma** - Type-safe database queries
- **Supabase PostgreSQL** - Managed database with connection pooling
- **Service Role** - Only used server-side for admin operations

### Data Isolation

All queries filter by `userId` to ensure users only access their own data:

```typescript
const tasks = await prisma.task.findMany({
  where: { userId: user.id },
})
```

### Encrypted Credentials

Client credentials are encrypted before storage:

```typescript
// src/lib/utils/encrypt.ts
import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'

export function encrypt(text: string): string {
  const key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex')
  const iv = crypto.randomBytes(12)
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

---

## Input Validation

### Zod Validation

All API inputs are validated with Zod schemas:

```typescript
import { z } from 'zod'

export const taskSchema = z.object({
  title: z.string().min(1).max(500),
  category: z.enum(['DESIGN', 'CODE', 'CLIENT', ...]),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  scheduledDate: z.string().datetime().optional(),
})
```

### API Route Validation

```typescript
const body = await req.json()
const parsed = taskSchema.safeParse(body)

if (!parsed.success) {
  return NextResponse.json({ error: parsed.error.message }, { status: 400 })
}
```

---

## XSS Prevention

### Content Sanitization

- User content is escaped before display
- Never use `dangerouslySetInnerHTML` with user content
- React's JSX automatically escapes values

---

## Security Checklist

### Before Deployment

- [ ] All secrets are in environment variables
- [ ] No secrets in git history
- [ ] Database queries filter by userId
- [ ] Input validation on all endpoints
- [ ] Auth middleware protects routes
- [ ] Client credentials are encrypted

### Ongoing

- [ ] Regular dependency updates
- [ ] Monitor for security advisories
- [ ] Rotate secrets periodically
- [ ] Review access logs

---

## Incident Response

### If Secrets Are Exposed

1. **Immediately rotate the exposed secret**
2. Check git history for exposure
3. Review access logs for unauthorized use
4. Update all affected environment variables
5. Re-deploy application

### If Database Is Compromised

1. Revoke all sessions
2. Reset user passwords
3. Review database queries
4. Audit data access
5. Notify affected users

---

## Security Resources

- [Supabase Security](https://supabase.com/docs/guides/security)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy)
- [OWASP Top 10](https://owasp.org/Top10/)
- [Prisma Security](https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access)

---

_Last updated: January 2026_
