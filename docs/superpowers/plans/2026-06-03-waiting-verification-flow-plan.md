# Waiting for Verification Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redirect unverified users to a pending approval page after their first Google login.

**Architecture:** Update `ProtectedRoute` component to fetch user verification status from the FastAPI backend and redirect unverified users to a new `/waiting-verification` page.

**Tech Stack:** Next.js, FastAPI, NextAuth.js.

---

### Task 1: Create Waiting for Verification Page

**Files:**
- Create: `frontend/src/app/waiting-verification/page.tsx`
- Modify: `frontend/src/components/Navbar.tsx` (to add optional logout)

- [ ] **Step 1: Create `waiting-verification/page.tsx`**

```tsx
'use client';

import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function WaitingVerificationPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="text-blue-600 mb-6">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-4">Verification Pending</h1>
        <p className="text-gray-600 mb-8">
          Your account is being reviewed by the administrators. You'll have access to the dashboard once approved.
        </p>
        
        <div className="flex gap-4 justify-center">
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh Status
          </button>
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/app/waiting-verification/page.tsx
git commit -m "feat: add waiting for verification page"
```

### Task 2: Update ProtectedRoute to Check Verification

**Files:**
- Modify: `frontend/src/components/ProtectedRoute.tsx`

- [ ] **Step 1: Modify `ProtectedRoute.tsx` to check status**

```tsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.email) {
      fetch(`http://localhost:8000/check-status/${session.user.email}`)
        .then(res => res.json())
        .then(data => {
          setIsVerified(data.verified);
          if (!data.verified) {
            router.push('/waiting-verification');
          }
        })
        .catch(err => console.error('Error checking verification:', err));
    }
  }, [session, router, status]);

  if (status === 'loading' || (session && isVerified === null)) {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated' || (session && isVerified === false)) {
    return null;
  }

  return <>{children}</>;
};
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/ProtectedRoute.tsx
git commit -m "feat: redirect unverified users to waiting page"
```
