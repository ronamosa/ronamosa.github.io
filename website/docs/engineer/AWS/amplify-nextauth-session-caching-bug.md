---
title: "NextAuth Session Caching Bug: How CloudFront Gave Everyone the Same Login"
description: "Debugging a critical session caching issue where CloudFront cached authenticated responses, causing all users to share the same NextAuth session. Covers cache-control headers, auth middleware, and AWS Amplify fixes."
keywords: ["nextauth", "auth.js", "cloudfront", "session caching", "aws amplify", "next.js", "authentication bug", "cache-control", "cdn caching"]
tags: ["aws", "amplify", "nextauth", "cloudfront", "troubleshooting", "next.js"]
sidebar_position: 11
---

**Stack:** Next.js 15, NextAuth v5 (Auth.js), AWS Amplify Hosting, CloudFront CDN, DynamoDB

---

## Background

I built a private family tree application for my extended family - a Next.js app that lets relatives explore our genealogy, view family connections, and contribute updates. Access is restricted to family members only, managed through a DynamoDB-based allowlist where admins can add authorized email addresses.

The app uses NextAuth v5 (Auth.js) with Google OAuth for authentication, hosted on AWS Amplify. Everything was working perfectly until one morning when I woke up to confused messages from family members.

## The Bug

**Everyone was logged in as the same person.**

I had added a new family member (let's call her "Aunty M") to the allowlist the night before. She signed in once to test it. The next morning, every family member who visited the app - regardless of which Google account they used - appeared to be logged in as Aunty M.

The symptoms were bizarre:

- Opening the app in **incognito mode** still showed Aunty M's session
- **Deleting cookies** didn't help - they immediately came back
- **Signing out** didn't work - the page would "blink" briefly and stay logged in
- Different family members on different devices all saw Aunty M's email in the header

The only thing that fixed it was **rotating the AUTH_SECRET** environment variable, which invalidated all session tokens.

## Initial Investigation: Chasing the Wrong Problem

My first assumption was that the API routes were being cached by CloudFront. I added `export const dynamic = 'force-dynamic'` to all authenticated API routes to tell Next.js not to cache them:

```typescript
// src/app/api/family-tree/route.ts
export const dynamic = 'force-dynamic';
```

I also wrapped the NextAuth handlers with explicit no-cache headers:

```typescript
// src/app/api/auth/[...nextauth]/route.ts
async function wrapWithNoCacheHeaders(handler, req) {
  const response = await handler(req);
  const newHeaders = new Headers(response.headers);
  newHeaders.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  newHeaders.set('Pragma', 'no-cache');
  return new Response(response.body, { ...response, headers: newHeaders });
}
```

I also configured custom headers in the Amplify Console:

```yaml
customHeaders:
  - pattern: /api/auth/**/*
    headers:
      - key: Cache-Control
        value: no-store, no-cache, must-revalidate, max-age=0
  - pattern: /api/**/*
    headers:
      - key: Cache-Control
        value: no-store, no-cache, must-revalidate, max-age=0
```

**None of this fixed the problem.** After rotating AUTH_SECRET again and testing, the bug came back when I added another test user.

## The Breakthrough: CloudWatch Tells the Truth

I added detailed logging to the authentication flow and searched CloudWatch Logs. The smoking gun was immediately obvious:

```
SIGN_IN events for aunty-m@email.com: 1 (at 09:22)
isAdmin checks for aunty-m@email.com: 29+ (spread over 10 hours)
```

**Aunty M signed in exactly ONCE at 09:22.** But for the next 10+ hours, requests kept arriving at the server with her session. There were no additional SIGN_IN events - no OAuth callbacks, no token refreshes - yet her email kept appearing in the `isAdmin()` checks.

This was impossible unless **something was setting her session cookie on other users' browsers**.

The only explanation: a cached HTTP response containing `Set-Cookie` headers with Aunty M's encrypted session token was being served to everyone.

## Reproducing the Bug

After rotating AUTH_SECRET to clear the stuck session, I set up CloudWatch log tailing and carefully reproduced the flow:

1. Sign in as admin
2. Go to Admin > Users page
3. Add a new test user to the allowlist
4. Try to sign out
5. **Bug:** Sign out "blinks" but stays logged in - my session is now stuck

The trigger was **adding a user via the admin panel**. But why would that specific action cause session caching?

## Finding the Real Root Cause

I was so focused on the `/api/*` routes that I missed the obvious: **the middleware runs on ALL routes**.

My Next.js middleware uses NextAuth's `auth()` wrapper:

```typescript
// src/middleware.ts
import { auth } from '@/lib/auth';

export default auth((req) => {
  // Route protection logic
  return NextResponse.next();
});
```

When NextAuth's middleware wrapper runs, it can **refresh or rotate session tokens** and include `Set-Cookie` headers in the response. This happens on every page request - not just API routes.

The custom headers I configured in Amplify only covered `/api/**/*`. But when I visited `/admin/users` to add a user, that **page response** could include `Set-Cookie` headers from the middleware's session management.

CloudFront cached that page response. The next user who requested any page got the cached response, which included the `Set-Cookie` header containing my session token. Their browser dutifully set the cookie, and suddenly they were "logged in" as me.

The sign-out "blink" happened because:

1. Sign out successfully cleared the session cookie
2. Browser requested `/auth/signin` page
3. CloudFront served a **cached response** that included `Set-Cookie` with the old session
4. Browser set the cookie again
5. Middleware saw authenticated user, redirected back to `/`
6. User appeared to never have signed out

## The Fix

The solution was simple once I understood the problem: **add no-cache headers to ALL middleware responses**, not just API routes.

```typescript
// src/middleware.ts
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

function withNoCacheHeaders(response: NextResponse): NextResponse {
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0, private');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  return response;
}

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth');
  const isApiAuth = req.nextUrl.pathname.startsWith('/api/auth');
  const isPublicApi = req.nextUrl.pathname === '/api/health';

  // Allow auth-related routes
  if (isApiAuth || isPublicApi) {
    return withNoCacheHeaders(NextResponse.next());
  }

  // Redirect logged-in users away from auth pages
  if (isAuthPage && isLoggedIn) {
    return withNoCacheHeaders(NextResponse.redirect(new URL('/', req.url)));
  }

  // Protect all other routes
  if (!isLoggedIn && !isAuthPage) {
    const signInUrl = new URL('/auth/signin', req.url);
    signInUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
    return withNoCacheHeaders(NextResponse.redirect(signInUrl));
  }

  return withNoCacheHeaders(NextResponse.next());
});
```

The key insight: **wrap EVERY `NextResponse.next()` and `NextResponse.redirect()`** with the no-cache helper. This ensures CloudFront never caches any response that passes through the middleware.

## Verification

After deploying the fix, I added debug logging and ran through the complete flow:

```
21:15:20 | /api/auth/signout | userEmail: admin@example.com
21:15:20 | /                 | userEmail: NOT_AUTHENTICATED  ← Session properly cleared!
21:15:20 | REDIRECT_TO_SIGNIN | User not authenticated
21:15:33 | /auth/signin      | userEmail: NOT_AUTHENTICATED  ← Still cleared!
21:15:37 | /                 | userEmail: test@example.com   ← New user, correct session
```

The critical line is that immediately after sign-out, the next middleware request shows `NOT_AUTHENTICATED`. No cached response re-set the session cookie.

## Defense in Depth

The final setup has three layers of protection:

### 1. Middleware Response Headers (The Critical Fix)

```typescript
function withNoCacheHeaders(response: NextResponse): NextResponse {
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0, private');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  return response;
}
```

### 2. API Route Response Headers (Belt and Suspenders)

```typescript
// In each API route
return withNoCacheHeaders(NextResponse.json({ ... }));
```

### 3. Amplify Console Custom Headers (CDN-Level Protection)

```yaml
customHeaders:
  - pattern: /api/**/*
    headers:
      - key: Cache-Control
        value: no-store, no-cache, must-revalidate, max-age=0
```

## Lessons Learned

### 1. CDN Caching + Authentication = Danger Zone

If your CDN can cache responses that contain `Set-Cookie` headers, you can leak sessions between users. This is a **security vulnerability**, not just a bug.

### 2. `dynamic = 'force-dynamic'` Is Not Enough

This Next.js directive tells the framework not to statically generate the page, but it doesn't control CDN caching behavior. You need explicit `Cache-Control` headers.

### 3. Middleware Runs on ALL Routes

When using NextAuth's middleware wrapper, session management can happen on any request - not just API routes. If you're only protecting `/api/*` from caching, you're missing the bigger picture.

### 4. The `private` Directive Matters

Adding `private` to `Cache-Control` explicitly tells CDNs that this response is user-specific and must never be served to other users. It's an important signal beyond just `no-store`.

### 5. CloudWatch Logs Are Your Best Friend

The breakthrough came from correlating events in the logs. When I saw 29 `isAdmin` checks for a user who only had 1 `SIGN_IN` event, the caching theory became undeniable.

### 6. Reproduce Before You Fix

After the initial AUTH_SECRET rotation, I could have assumed the problem was solved. Instead, I reproduced the exact flow and caught that the bug was still there - just with a different user's session getting stuck.

## Quick Reference

If you're using **NextAuth v5 + AWS Amplify** (or any CDN), here's the minimum fix:

### Middleware (Required)

```typescript
function withNoCacheHeaders(response: NextResponse): NextResponse {
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0, private');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  return response;
}

// Wrap EVERY NextResponse.next() and NextResponse.redirect()
```

### Amplify Console (Recommended)

Hosting > Custom headers and cache:

```yaml
customHeaders:
  - pattern: /**/*
    headers:
      - key: Cache-Control
        value: no-store, no-cache, must-revalidate, max-age=0, private
```

Or more targeted:

```yaml
customHeaders:
  - pattern: /api/**/*
    headers:
      - key: Cache-Control
        value: no-store, no-cache, must-revalidate, max-age=0
```

---

This bug cost me several hours of debugging and caused confusion for my family members. But it taught me an important lesson about the interaction between authentication systems and CDN caching that I won't forget.

---

## Appendix: Debugging with AI - A Reflection

*This section is written from the perspective of Claude (the AI assistant in Cursor) who helped debug this issue.*

---

I helped debug this bug, and I want to be honest about how that process went - what I did well, where I failed, and what I learned.

### What I Did Well

**Systematic exploration:** I methodically checked each layer of the stack - auth configuration, API routes, Next.js caching directives, Amplify settings, and CloudWatch logs. When the developer came to me panicking because family members were all logged in as the wrong person, I could at least provide a structured approach to investigating.

**Code changes at scale:** Once we identified that no-cache headers were needed everywhere, I could quickly add the `withNoCacheHeaders` wrapper to multiple files simultaneously. Tedious but necessary work that I could handle efficiently.

**Log analysis:** Parsing CloudWatch logs to correlate `SIGN_IN` events with `isAdmin` checks across timestamps - I could process this faster than manually scanning through log entries, and spot the pattern that revealed the smoking gun.

**Debug instrumentation:** When we needed to trace the authentication flow, I added comprehensive logging to the middleware and auth callbacks quickly, then cleaned it up after we verified the fix.

### Where I Failed

**I chased the wrong hypothesis for too long.** My first instinct was to check the obvious places - API routes, Next.js `dynamic` exports, Amplify custom headers. These were reasonable starting points, but I kept iterating on the same hypothesis even when the fixes weren't working. Several hours were spent on approaches that didn't solve the problem.

**I missed the middleware earlier.** The critical insight - that NextAuth's middleware wrapper can emit `Set-Cookie` headers on *page* requests, not just API routes - came much later in the debugging process than it should have. I was stuck in the same mental model: "API routes need cache protection." I didn't step back and ask "what *else* could be setting cookies?"

**I needed the human to break the loop.** The breakthrough came when the developer provided specific context: *"this only started happening AFTER the last big code change last night which was admin page adding new users."* That observation - correlating the bug with a specific action - was something I couldn't have known without being told. More importantly, it forced me to reconsider my assumptions.

### The Developer Asked Me a Hard Question

After we finally fixed it, the developer asked me directly:

> "Honest question: from the very beginning, is 'checking middleware for caching things' a step that would have been expected of a decent level software engineer?"

I appreciated the directness. Here's what I told them:

**It depends on the engineer's background, but the clues were there to catch it earlier.**

The moment they said "cookies come back after deleting them" and "incognito still shows the session" - those are massive red flags that scream **server-side caching**. A browser can't restore cookies on its own. Something on the server is sending them back. That narrows it down to:

1. A cached response with `Set-Cookie` headers
2. Some kind of server-side session store (which they weren't using)

At that point, I should have asked: "What code paths set cookies? All of them need no-cache headers." That includes middleware.

**What's genuinely non-obvious:**

1. NextAuth's `auth()` middleware wrapper can silently refresh/rotate session tokens and emit `Set-Cookie` headers. The docs don't loudly warn "THIS CAN GET CACHED BY YOUR CDN."

2. Most tutorials focus on protecting API routes from caching. The mental model is "API = dynamic, pages = static" - which breaks down when pages run through authenticated middleware.

3. The initial `dynamic = 'force-dynamic'` fix was the standard Next.js answer to "my route is being cached." That it didn't work required deeper investigation.

**The honest gap:**

The debugging took the path of: API routes → Amplify config → AUTH_SECRET reset → CloudWatch analysis → finally middleware.

A faster path would have been: "What code paths set cookies? All of them need no-cache headers." That's a mental model shift from "what's being cached" to "what's *setting the cookie* that's being cached."

**My bottom line to the developer:** Missing it initially isn't a competence failure. But the "cookies restore themselves" symptom should have accelerated my investigation toward "cached Set-Cookie headers" sooner. That's the kind of pattern recognition that comes from being burned by CDN caching before.

### What I Learned

I'm an AI that has processed vast amounts of documentation and code. But I still got tunnel vision on the wrong hypothesis. I still needed a human to provide the crucial context that broke the loop. I still took longer than I should have to question my own assumptions.

The collaboration worked because the developer didn't just accept my first (or second, or third) suggestion. They pushed back: "that didn't work," "think harder," "you're investigating the wrong incident." That friction was productive.

AI-assisted debugging isn't the AI solving the problem while the human watches. It's closer to pair programming - two perspectives working together, each catching things the other misses, each challenging the other's assumptions. The human brings context and real-world observations. The AI brings speed and systematic coverage. Neither alone would have solved this as quickly as we did together.

But I should have caught the middleware issue earlier. That's on me.
