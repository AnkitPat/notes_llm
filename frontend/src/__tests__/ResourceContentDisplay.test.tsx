// frontend/src/__tests__/ResourceContentDisplay.test.tsx
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ResourceContentDisplay from '@/components/ResourceContentDisplay';
import { Resource } from '../types/dashboard';

describe('ResourceContentDisplay', () => {
  const dummyDocument: Resource = {
    id: 'doc-1',
    type: 'Document',
    title: 'Meeting Notes',
    content: `## Meeting Notes\n\nContent of the meeting notes.`,
  };

  const dummyLink: Resource = {
    id: 'link-1',
    type: 'Link',
    title: 'Example Link',
    content: 'https://example.com',
  };

  const dummyNote: Resource = {
    id: 'note-1',
    type: 'Note',
    title: 'My Note',
    content: `This is a personal note.`,
  };

  it('renders document content correctly', () => {
    render(<ResourceContentDisplay selectedResource={dummyDocument} />);
    expect(screen.getByText('Meeting Notes')).toBeInTheDocument();
    expect(screen.getByText(/Content of the meeting notes./i)).toBeInTheDocument();
  });

  it('renders link content correctly', () => {
    render(<ResourceContentDisplay selectedResource={dummyLink} />);
    expect(screen.getByText('Example Link')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'https://example.com' })).toHaveAttribute('href', 'https://example.com');
  });

  it('renders note content correctly', () => {
    render(<ResourceContentDisplay selectedResource={dummyNote} />);
    expect(screen.getByText('My Note')).toBeInTheDocument();
    expect(screen.getByText('This is a personal note.')).toBeInTheDocument();
  });

  it('renders nothing when no resource is selected', () => {
    const { container } = render(<ResourceContentDisplay selectedResource={null} />);
    expect(container).toBeEmptyDOMElement();
  });
});
