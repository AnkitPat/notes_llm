import { render, screen, waitFor } from '@testing-library/react';
import Home from '@/app/page';
import { SessionProvider } from 'next-auth/react';
import { vi } from 'vitest';
import * as navigation from 'next/navigation';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
  useSearchParams: vi.fn(),
}));

describe('Home Page', () => {
  it('renders the hero title', async () => {
    (navigation.useRouter as any).mockReturnValue({ push: vi.fn() });
    
    // We need a mock session to satisfy ProtectedRoute and avoid infinite loading
    const mockSession = {
      user: { email: 'test@example.com' },
      expires: new Date(Date.now() + 86400).toISOString(),
    };

    // Need to mock the fetch call in ProtectedRoute
    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({ verified: true }),
    });

    render(
      <SessionProvider session={mockSession as any}>
        <Home />
      </SessionProvider>
    );
    
    await waitFor(() => {
        expect(screen.getByText(/Your Notes/i)).toBeInTheDocument();
    });
  });
});
