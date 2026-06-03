// frontend/src/__tests__/ChatQnASection.test.tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest'; // Import vi from vitest
import ChatQnASection from '@/components/ChatQnASection';
import { ChatMessage } from '../types/dashboard';

describe('ChatQnASection', () => {
  const mockChatHistory: ChatMessage[] = [
    { role: 'ai', message: 'Hello, how can I help you?' },
    { role: 'user', message: 'What is this document about?' },
  ];

  it('renders chat history and input field', () => {
    render(<ChatQnASection chatHistory={mockChatHistory} onSendMessage={() => {}} />);

    expect(screen.getByText('Hello, how can I help you?')).toBeInTheDocument();
    expect(screen.getByText('What is this document about?')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ask a question...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('calls onSendMessage with message when send button is clicked', () => {
    const onSendMessageMock = vi.fn();
    render(<ChatQnASection chatHistory={[]} onSendMessage={onSendMessageMock} />);

    const input = screen.getByPlaceholderText('Ask a question...');
    fireEvent.change(input, { target: { value: 'New question' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    expect(onSendMessageMock).toHaveBeenCalledTimes(1);
    expect(onSendMessageMock).toHaveBeenCalledWith('New question');
    expect(input).toHaveValue('');
  });

  it('calls onSendMessage with message when enter key is pressed', () => {
    const onSendMessageMock = vi.fn();
    render(<ChatQnASection chatHistory={[]} onSendMessage={onSendMessageMock} />);

    const input = screen.getByPlaceholderText('Ask a question...');
    fireEvent.change(input, { target: { value: 'Another question' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });

    expect(onSendMessageMock).toHaveBeenCalledTimes(1);
    expect(onSendMessageMock).toHaveBeenCalledWith('Another question');
    expect(input).toHaveValue('');
  });
});
