# US1: Initial Frontend Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Initialize a feature-ready Next.js application in the `frontend/` directory with Tailwind CSS, TypeScript, and Vitest.

**Architecture:** A Next.js 14+ application using the App Router, with a clear separation of concerns in the `src/` directory. It includes a global layout with Navbar and Footer components.

**Tech Stack:** Next.js, TypeScript, Tailwind CSS, Lucide React, Vitest, React Testing Library.

---

### Task 1: Initialize Next.js Application

**Files:**
- Create: `frontend/` (via create-next-app)

- [ ] **Step 1: Run create-next-app**

Run: `npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm`
Expected: Next.js app initialized in `frontend/`.

- [ ] **Step 2: Commit initialization**

```bash
git add frontend/
git commit -m "chore: initialize next.js frontend"
```

---

### Task 2: Clean Up Boilerplate & Set Up Directory Structure

**Files:**
- Modify: `frontend/src/app/page.tsx`
- Modify: `frontend/src/app/globals.css`
- Create: `frontend/src/components/.gitkeep`
- Create: `frontend/src/lib/.gitkeep`
- Create: `frontend/src/hooks/.gitkeep`
- Create: `frontend/src/types/.gitkeep`

- [ ] **Step 1: Simplify globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}
```

- [ ] **Step 2: Simplify page.tsx**

```tsx
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Welcome to Notes LLM</h1>
    </main>
  );
}
```

- [ ] **Step 3: Create directory structure**

Run: `mkdir -p frontend/src/components frontend/src/lib frontend/src/hooks frontend/src/types`
Expected: Directories created.

- [ ] **Step 4: Commit cleanup**

```bash
git add frontend/src/app/page.tsx frontend/src/app/globals.css
git commit -m "chore: clean up boilerplate and create directory structure"
```

---

### Task 3: Implement Layout Components (Navbar & Footer)

**Files:**
- Create: `frontend/src/components/Navbar.tsx`
- Create: `frontend/src/components/Footer.tsx`
- Modify: `frontend/src/app/layout.tsx`

- [ ] **Step 1: Create Navbar component**

```tsx
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-blue-600">
              Notes LLM
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <Link href="/" className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
              Home
            </Link>
            <Link href="/notes" className="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium">
              Notes
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Create Footer component**

```tsx
export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Notes LLM. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Update Root Layout**

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Notes LLM",
  description: "Manage your notes with AI power",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Commit layout components**

```bash
git add frontend/src/components/Navbar.tsx frontend/src/components/Footer.tsx frontend/src/app/layout.tsx
git commit -m "feat: add navbar and footer to global layout"
```

---

### Task 4: Implement Hero Section on Home Page

**Files:**
- Modify: `frontend/src/app/page.tsx`

- [ ] **Step 1: Update page.tsx with Hero section**

```tsx
export default function Home() {
  return (
    <div className="bg-white">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Organize your thoughts with AI power
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Notes LLM helps you capture, organize, and query your notes using advanced language models. 
              Turn your unstructured thoughts into a powerful knowledge base.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="#"
                className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Get started
              </a>
              <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit Home page update**

```bash
git add frontend/src/app/page.tsx
git commit -m "feat: implement hero section on home page"
```

---

### Task 5: Set Up Vitest & Testing Environment

**Files:**
- Modify: `frontend/package.json`
- Create: `frontend/vitest.config.ts`
- Create: `frontend/src/__tests__/setup.ts`

- [ ] **Step 1: Install testing dependencies**

Run: `cd frontend && npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom`
Expected: Dependencies installed.

- [ ] **Step 2: Create vitest.config.ts**

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/__tests__/setup.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

- [ ] **Step 3: Create setup.ts**

```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 4: Add test script to package.json**

```json
"scripts": {
  ...
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 5: Commit testing setup**

```bash
git add frontend/package.json frontend/vitest.config.ts frontend/src/__tests__/setup.ts
git commit -m "chore: set up vitest and testing environment"
```

---

### Task 6: Write Unit Tests for Home Page

**Files:**
- Create: `frontend/src/__tests__/page.test.tsx`

- [ ] **Step 1: Write the home page test**

```tsx
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

describe('Home Page', () => {
  it('renders the hero title', () => {
    render(<Home />);
    const heading = screen.getByText(/Organize your thoughts with AI power/i);
    expect(heading).toBeInTheDocument();
  });

  it('renders the get started button', () => {
    render(<Home />);
    const button = screen.getByRole('link', { name: /get started/i });
    expect(button).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they pass**

Run: `cd frontend && npm test`
Expected: 2 tests passed.

- [ ] **Step 3: Commit tests**

```bash
git add frontend/src/__tests__/page.test.tsx
git commit -m "test: add unit tests for home page"
```

---

### Task 7: Final Verification

- [ ] **Step 1: Run linting**

Run: `cd frontend && npm run lint`
Expected: PASS

- [ ] **Step 2: Run build**

Run: `cd frontend && npm run build`
Expected: PASS

- [ ] **Step 3: Run tests one last time**

Run: `cd frontend && npm test`
Expected: PASS
