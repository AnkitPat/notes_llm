'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function DashboardPage() {
  const { logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-[calc(100vh-64px-64px)] bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome to your dashboard</h1>
            <button
              onClick={logout}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors shadow-sm"
            >
              Logout
            </button>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-gray-600 italic">
              Dashboard content will be implemented in future tasks.
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
