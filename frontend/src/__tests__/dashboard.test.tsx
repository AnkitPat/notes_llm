// frontend/src/__tests__/dashboard.test.tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import DashboardPage from '../app/dashboard/page';
import dummyResources from '../lib/dummy-data/resources';
import { vi } from 'vitest';
import React from 'react';

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

// Mock NextAuth.js
vi.mock('next-auth/react', () => ({
  useSession: vi.fn(() => ({ data: { user: { email: 'test@example.com' } }, status: 'authenticated' })),
  SessionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock ProtectedRoute
vi.mock('@/components/ProtectedRoute', () => ({
  ProtectedRoute: ({ children }: { children: React.ReactNode }) => <div data-testid="protected-route">{children}</div>,
}));

// Mock child components to isolate DashboardPage testing
vi.mock('@/components/ResourceNavigation', () => {
  return {
    default: ({ resources, selectedResource, onSelectResource, onAddResource }: any) => (
      <div data-testid="mock-resource-navigation">
        Mock Resource Navigation
        <button onClick={() => onSelectResource(resources[0])}>Select First Resource</button>
        <button onClick={() => onAddResource('Note', 'New Note', 'New Content')}>Add Note</button>
      </div>
    )
  };
});

vi.mock('@/components/ResourceContentDisplay', () => {
  return {
    default: ({ selectedResource }: any) => (
      <div data-testid="mock-resource-content-display">
        Mock Resource Content Display: {selectedResource?.title || 'None'}
      </div>
    )
  };
});

vi.mock('@/components/ChatQnASection', () => {
  return {
    default: ({ chatHistory, onSendMessage }: any) => (
      <div data-testid="mock-chat-qna-section">
        Mock Chat QnA Section
        {chatHistory.map((msg: any, index: number) => (
          <div key={index}>{msg.message}</div>
        ))}
        <button onClick={() => onSendMessage('Test Message')}>Send Chat</button>
      </div>
    )
  };
});

describe('DashboardPage', () => {
  it('renders the dashboard layout within ProtectedRoute', () => {
    render(<DashboardPage />);

    expect(screen.getByTestId('protected-route')).toBeInTheDocument();
    expect(screen.getByTestId('mock-resource-navigation')).toBeInTheDocument();
    // Initially no resource selected, so content display is not rendered
    expect(screen.queryByTestId('mock-resource-content-display')).not.toBeInTheDocument();
    expect(screen.getByTestId('mock-chat-qna-section')).toBeInTheDocument();
  });

  it('selects a resource and updates content display', () => {
    render(<DashboardPage />);

    // Initially no resource selected
    expect(screen.queryByTestId('mock-resource-content-display')).not.toBeInTheDocument();

    // Simulate selecting the first resource
    fireEvent.click(screen.getByRole('button', { name: /select first resource/i }));

    expect(screen.getByTestId('mock-resource-content-display')).toHaveTextContent(
      `Mock Resource Content Display: ${dummyResources[0].title}`
    );
  });

  it('handles sending a chat message', () => {
    render(<DashboardPage />);
    fireEvent.click(screen.getByRole('button', { name: /select first resource/i }));
    fireEvent.click(screen.getByRole('button', { name: /send chat/i }));
    expect(screen.getByTestId('mock-chat-qna-section')).toHaveTextContent('Test Message');
  });
});
