import { render, screen } from '@testing-library/react';
import { EditNoteModal } from '../components/EditNoteModal';
import { vi } from 'vitest';

describe('EditNoteModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSave = vi.fn();

  test('renders with initial name', () => {
    render(
      <EditNoteModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        initialName="My Note"
      />
    );
    const input = screen.getByLabelText(/Note Name/i) as HTMLInputElement;
    expect(input.value).toBe('My Note');
  });
});
