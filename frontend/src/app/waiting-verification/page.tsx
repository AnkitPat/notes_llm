'use client';

import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function WaitingVerificationPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleRefresh = async () => {
    if (session?.user?.email) {
      try {
        const res = await fetch(`http://localhost:8000/check-status/${session.user.email}`);
        const data = await res.json();
        if (data.verified) {
          router.push('/');
        } else {
          alert("Account not verified yet.");
        }
      } catch (error) {
        console.error('Error checking verification:', error);
        alert("Error checking verification status.");
      }
    }
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
