import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { CreateNoteModal } from '../components/CreateNoteModal';

describe('CreateNoteModal', () => {
  it('renders correctly when open', () => {
    render(<CreateNoteModal isOpen={true} onClose={() => {}} onCreate={async () => {}} />);
    expect(screen.getByText('Create New Note')).toBeDefined();
  });

  it('calls onCreate when form is submitted', async () => {
    const onCreate = vi.fn().mockResolvedValue(undefined);
    render(<CreateNoteModal isOpen={true} onClose={() => {}} onCreate={onCreate} />);
    
    fireEvent.change(screen.getByLabelText('Note Name *'), { target: { value: 'New Note' } });
    fireEvent.click(screen.getByText('Create'));
    
    await waitFor(() => {
        expect(onCreate).toHaveBeenCalledWith('New Note');
    });
  });
});
