import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import { UpsertResourceDrawer } from '../components/UpsertResourceDrawer';
import { vi } from 'vitest';

describe('UpsertResourceDrawer', () => {
  const mockOnClose = vi.fn();
  const mockOnUpsert = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('calls onUpsert with correct parameters when Create is clicked', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'new-id' }),
    });

    render(<UpsertResourceDrawer open={true} onClose={mockOnClose} onUpsert={mockOnUpsert} noteId="test-note-id" mode="create" />);
    
    // Fill title
    const titleInput = screen.getByLabelText(/Title/i);
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    
    // Fill content
    const contentInput = screen.getByLabelText(/Content/i);
    fireEvent.change(contentInput, { target: { value: 'Test Content' } });
    
    // Click Create
    const createButton = screen.getByText(/Create/i);
    fireEvent.click(createButton);
    
    await waitFor(() => {
        expect(mockOnUpsert).toHaveBeenCalledWith(expect.objectContaining({type: 'Note', title: 'Test Title', content: 'Test Content'}));
    });
  });

  it('calls onUpsert with correct parameters when Update is clicked in edit mode', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'existing-id' }),
    });

    const initialData = { id: 'existing-id', title: 'Old Title', type: 'Note' as any, content: 'Old Content' };
    
    render(<UpsertResourceDrawer open={true} onClose={mockOnClose} onUpsert={mockOnUpsert} noteId="test-note-id" mode="edit" initialData={initialData as any} />);
    
    // Update title
    const titleInput = screen.getByLabelText(/Title/i);
    fireEvent.change(titleInput, { target: { value: 'New Title' } });
    
    // Click Update
    const updateButton = screen.getByText(/Update/i);
    fireEvent.click(updateButton);
    
    await waitFor(() => {
        expect(mockOnUpsert).toHaveBeenCalledWith(expect.objectContaining({id: 'existing-id', title: 'New Title'}));
    });
  });
});
