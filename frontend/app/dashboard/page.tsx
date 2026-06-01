'use client';
import React from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';

const DashboardPage: React.FC = () => {
  return (
    <ProtectedRoute>
      <div style={{ padding: '2rem' }}>
        <h1>Welcome to your Dashboard!</h1>
        <p>You have successfully logged in and are approved.</p>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;
