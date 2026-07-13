import { render, screen, fireEvent } from '@testing-library/react';
import { EditNoteModal } from '../components/EditNoteModal';
import { vi } from 'vitest';

describe('EditNoteModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSave = vi.fn().mockResolvedValue(undefined);

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

  test('calls onSave with updated name', async () => {
    render(
      <EditNoteModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        initialName="My Note"
      />
    );
    const input = screen.getByLabelText(/Note Name/i);
    fireEvent.change(input, { target: { value: 'Updated Note' } });
    const saveButton = screen.getByRole('button', { name: /Save/i });
    fireEvent.click(saveButton);
    expect(mockOnSave).toHaveBeenCalledWith('Updated Note');
  });
});
