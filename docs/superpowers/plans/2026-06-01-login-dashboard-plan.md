# US2: Login & Dashboard UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Login and Dashboard page UI with simulated authentication flow.

**Architecture:**
- Use a `AuthContext` to manage simulated `isAuthenticated` state.
- Implement a `ProtectedRoute` wrapper for the Dashboard.
- Use simple redirect logic for auth simulation.

**Tech Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Lucide React (for icons).

---

### Task 1: Setup Auth Context & Protected Route Wrapper

**Files:**
- Create: `frontend/src/context/AuthContext.tsx`
- Create: `frontend/src/components/ProtectedRoute.tsx`

- [ ] **Step 1: Create AuthContext**

```tsx
'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

- [ ] **Step 2: Create ProtectedRoute component**

```tsx
'use client';
import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      redirect('/login');
    }
  }, [isAuthenticated]);

  return <>{children}</>;
}
```

- [ ] **Step 3: Update Root Layout to wrap with AuthProvider**

```tsx
// frontend/src/app/layout.tsx
import { AuthProvider } from '@/context/AuthContext';
// ... existing imports

export default function RootLayout(...) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
        </AuthProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Commit auth setup**

```bash
git add frontend/src/context/AuthContext.tsx frontend/src/components/ProtectedRoute.tsx frontend/src/app/layout.tsx
git commit -m "feat: setup auth context and protected route"
```

---

### Task 2: Implement Login Page UI

**Files:**
- Create: `frontend/src/app/login/page.tsx`

- [ ] **Step 1: Create Login Page**

```tsx
'use client';
import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();

  useEffect(() => {
    if (isAuthenticated) redirect('/dashboard');
  }, [isAuthenticated]);

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex w-1/2 bg-gray-200 items-center justify-center">
        <p className="text-gray-500">Illustration Placeholder</p>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Notes LLM</h1>
            <h2 className="text-xl font-semibold text-gray-800">Welcome back</h2>
            <p className="text-gray-600">Sign in to continue</p>
          </div>
          <button
            onClick={login}
            className="w-full flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            {/* Replace with actual Google icon from lucide-react later if needed */}
            Login with Google
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit login page**

```bash
git add frontend/src/app/login/page.tsx
git commit -m "feat: implement login page UI"
```

---

### Task 3: Implement Dashboard Page UI

**Files:**
- Create: `frontend/src/app/dashboard/page.tsx`

- [ ] **Step 1: Create Dashboard Page**

```tsx
'use client';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function DashboardPage() {
  const { logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Welcome to your dashboard</h1>
        <button
          onClick={logout}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
        >
          Logout
        </button>
      </div>
    </ProtectedRoute>
  );
}
```

- [ ] **Step 2: Commit dashboard page**

```bash
git add frontend/src/app/dashboard/page.tsx
git commit -m "feat: implement dashboard page UI"
```

---

### Task 4: Final Verification

- [ ] **Step 1: Run linting**

Run: `cd frontend && npm run lint`
Expected: PASS

- [ ] **Step 2: Run build**

Run: `cd frontend && npm run build`
Expected: PASS
