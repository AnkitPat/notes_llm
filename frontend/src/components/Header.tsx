'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white">N</div>
        <span className="font-bold text-xl">NotesApp</span>
      </Link>
      <button
        onClick={() => signOut({ callbackUrl: '/login' })}
        className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium hover:bg-gray-200 transition-colors"
      >
        Logout
      </button>
    </header>
  );
}
