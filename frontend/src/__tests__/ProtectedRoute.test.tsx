import { render, screen, waitFor } from '@testing-library/react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';

vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

global.fetch = vi.fn();

describe('ProtectedRoute', () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    (useRouter as Mock).mockReturnValue({ push: mockPush });
    vi.clearAllMocks();
  });

  it('redirects to login if unauthenticated', () => {
    (useSession as Mock).mockReturnValue({ data: null, status: 'unauthenticated' });
    render(<ProtectedRoute>Content</ProtectedRoute>);
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('redirects to waiting-verification if unverified', async () => {
    (useSession as Mock).mockReturnValue({ data: { user: { email: 'user@test.com' } }, status: 'authenticated' });
    (global.fetch as Mock).mockResolvedValue({
      json: vi.fn().mockResolvedValue({ verified: false }),
    });

    render(<ProtectedRoute>Content</ProtectedRoute>);
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/waiting-verification'));
  });

  it('renders children if verified', async () => {
    (useSession as Mock).mockReturnValue({ data: { user: { email: 'user@test.com' } }, status: 'authenticated' });
    (global.fetch as Mock).mockResolvedValue({
      json: vi.fn().mockResolvedValue({ verified: true }),
    });

    render(<ProtectedRoute>Content</ProtectedRoute>);
    await waitFor(() => expect(screen.getByText('Content')).toBeInTheDocument());
  });
});
