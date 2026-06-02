import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '@/app/login/page';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';
import React from 'react';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('@/context/AuthContext', async () => {
  const actual = await vi.importActual<typeof import('@/context/AuthContext')>('@/context/AuthContext');
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

describe('LoginPage', () => {
  const push = vi.fn();
  const login = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ push });
    (useAuth as Mock).mockReturnValue({
      isAuthenticated: false,
      login,
      logout: vi.fn(),
    });
  });

  it('renders login page UI elements', () => {
    render(<Login />);

    expect(screen.getByText('Notes LLM')).toBeInTheDocument();
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.getByText('Sign in to continue')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login with google/i })).toBeInTheDocument();
  });

  it('calls login function when login button is clicked', async () => {
    render(<Login />);

    const loginButton = screen.getByRole('button', { name: /login with google/i });
    fireEvent.click(loginButton);

    expect(login).toHaveBeenCalled();
  });

  it('redirects to /dashboard if already authenticated', async () => {
    (useAuth as Mock).mockReturnValue({
      isAuthenticated: true,
      login,
      logout: vi.fn(),
    });

    render(<Login />);

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/dashboard');
    });
  });
});
