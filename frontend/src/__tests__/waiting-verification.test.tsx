import { render, screen } from '@testing-library/react';
import WaitingVerificationPage from '@/app/waiting-verification/page';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { vi } from 'vitest';

vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('WaitingVerificationPage', () => {
  beforeEach(() => {
    (useSession as any).mockReturnValue({ data: { user: { email: 'test@test.com' } } });
    (useRouter as any).mockReturnValue({ push: vi.fn() });
  });

  it('renders the pending message', () => {
    render(<WaitingVerificationPage />);
    expect(screen.getByText(/Verification Pending/i)).toBeInTheDocument();
  });
});
