'use client';
import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';

const HomePage: React.FC = () => {
  return (
    <ProtectedRoute>
      <div style={{ padding: '2rem' }}>
        <h1>Welcome to notes_llm</h1>
        <p>This is the home page. You are successfully logged in and approved.</p>
      </div>
    </ProtectedRoute>
  );
};

export default HomePage;
