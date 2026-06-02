import { render, screen, fireEvent } from '@testing-library/react';
import DashboardPage from '../app/dashboard/page';
import * as AuthContext from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import React from 'react';
import { vi } from 'vitest';

// Mock the dependencies
vi.mock('../context/AuthContext');
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

// Mock ProtectedRoute to just render children
vi.mock('../components/ProtectedRoute', () => ({
  ProtectedRoute: ({ children }: { children: React.ReactNode }) => <div data-testid="protected-route">{children}</div>,
}));

describe('DashboardPage', () => {
  const mockLogout = vi.fn();
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ push: mockPush });
  });

  it('renders the dashboard with welcome message and logout button', () => {
    (AuthContext.useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      logout: mockLogout,
    });

    render(<DashboardPage />);

    expect(screen.getByText('Welcome to your dashboard')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  it('is wrapped in ProtectedRoute', () => {
    (AuthContext.useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      logout: mockLogout,
    });

    render(<DashboardPage />);

    expect(screen.getByTestId('protected-route')).toBeInTheDocument();
  });

  it('calls logout when the logout button is clicked', () => {
    (AuthContext.useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      logout: mockLogout,
    });

    render(<DashboardPage />);

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
