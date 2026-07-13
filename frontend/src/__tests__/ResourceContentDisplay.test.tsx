import { render, screen } from '@testing-library/react';
import ResourceContentDisplay from '../components/ResourceContentDisplay';
import { Resource } from '../types/dashboard';
import { expect, test } from 'vitest';

test('renders iframe for Link type resource', () => {
  const mockResource: Resource = {
    id: '1',
    title: 'Test Link',
    type: 'Link',
    content: 'https://example.com',
  };
  render(<ResourceContentDisplay selectedResource={mockResource} onRemoveResource={() => {}} />);
  
  const iframe = screen.getByTitle('Test Link');
  expect(iframe).toBeInTheDocument();
  expect(iframe).toHaveAttribute('src', 'https://example.com');
});
