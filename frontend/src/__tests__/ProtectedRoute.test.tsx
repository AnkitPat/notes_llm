import { render, screen } from '@testing-library/react';
import { ProtectedRoute } from '../components/ProtectedRoute';
import * as AuthContext from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import React from 'react';
import { vi } from 'vitest';

// Mock the dependencies
vi.mock('../context/AuthContext');
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('ProtectedRoute', () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    (useRouter as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ push: mockPush });
  });

  it('should render children when authenticated', () => {
    (AuthContext.useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ isAuthenticated: true });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should redirect to /login when unauthenticated', () => {
    (AuthContext.useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ isAuthenticated: false });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(mockPush).toHaveBeenCalledWith('/login');
  });
});
