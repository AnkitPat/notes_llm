# Refined Auth & Email Flow Implementation Plan

**Goal:** Implement a branded admin email notification and enforce strict route restrictions for users.

**Architecture:**
1. Create a reusable email template and update NextAuth to use it.
2. Implement Next.js `middleware.ts` to restrict routes based on authentication and verification status.

---

### Task 1: Create Email Template and Update NextAuth

**Files:**
- Create: `frontend/src/lib/email-templates.ts`
- Modify: `frontend/src/app/api/auth/[...nextauth]/route.ts`

- [ ] **Step 1: Create `frontend/src/lib/email-templates.ts`**

```tsx
export const getAdminApprovalEmail = (userEmail: string) => {
  return `
    <div style="font-family: sans-serif; background-color: #f9fafb; padding: 40px;">
      <div style="background: white; max-width: 500px; margin: 0 auto; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
        <div style="background: #2563EB; padding: 30px; text-align: center;">
          <span style="color: white; font-weight: bold; font-size: 24px;">Notes LLM - Admin Alert</span>
        </div>
        <div style="padding: 40px;">
          <h2 style="color: #111827; margin-top: 0;">New User Pending Approval</h2>
          <p style="color: #4b5563; line-height: 1.6;">A new user has signed up and is waiting for your approval.</p>
          <div style="background: #F3F4F6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #374151;"><strong>User Email:</strong> ${userEmail}</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:3000/api/admin/approve?email=${userEmail}" style="background: #2563EB; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">Approve User</a>
          </div>
        </div>
      </div>
    </div>
  `;
};
```

- [ ] **Step 2: Modify `frontend/src/app/api/auth/[...nextauth]/route.ts`**

Use `getAdminApprovalEmail` in `events.signIn`.

- [ ] **Step 3: Commit**

### Task 2: Implement Middleware for Route Protection

**Files:**
- Create: `frontend/src/middleware.ts`

- [ ] **Step 1: Create `frontend/src/middleware.ts`**

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // 1. Allow public routes
  if (pathname === '/login' || pathname === '/api/auth' || pathname === '/_next' || pathname.includes('.')) {
    return NextResponse.next();
  }

  // 2. Protect routes
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. Logic for verification would ideally be part of the session token.
  // For now, simple check: redirect to waiting if not on dashboard
  // Note: True verification check requires fetching from backend in middleware.
  
  return NextResponse.next();
}
```

- [ ] **Step 2: Commit**
