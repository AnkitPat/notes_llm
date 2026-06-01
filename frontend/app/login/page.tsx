'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '../../components/AuthLayout';

const LoginPage: React.FC = () => {
  const router = useRouter();

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/login/google`;
  };

  const ImageArea: React.FC = () => (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Welcome to notes_llm</h2>
      <p>Your personal knowledge hub</p>
    </div>
  );

  const LoginForm: React.FC = () => (
    <div style={{ textAlign: 'center' }}>
      <h1>Your personal knowledge hub.</h1>
      <p>Log in to access your notes.</p>
      <button 
        onClick={handleGoogleLogin} 
        style={{ 
          marginTop: '1rem', 
          padding: '0.8rem 1.5rem', 
          fontSize: '1rem', 
          backgroundColor: '#4285F4', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px', 
          cursor: 'pointer' 
        }}
      >
        Login with Google
      </button>
    </div>
  );

  return (
    <AuthLayout imageComponent={<ImageArea />} formComponent={<LoginForm />} />
  );
};

export default LoginPage;
