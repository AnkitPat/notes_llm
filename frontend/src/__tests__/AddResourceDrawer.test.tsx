import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import { AddResourceDrawer } from '../components/AddResourceDrawer';
import { vi } from 'vitest';

describe('AddResourceDrawer', () => {
  const mockOnClose = vi.fn();
  const mockOnAdd = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('calls onAdd with correct parameters when Create is clicked', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'new-id' }),
    });

    render(<AddResourceDrawer open={true} onClose={mockOnClose} onAdd={mockOnAdd} noteId="test-note-id" />);
    
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
        expect(mockOnAdd).toHaveBeenCalledWith('Note', 'Test Title', 'Test Content', '');
    });
  });

  it('shows live preview when user starts typing', () => {
    render(<AddResourceDrawer open={true} onClose={mockOnClose} onAdd={mockOnAdd} noteId="test-note-id" />);
    
    const titleInput = screen.getByLabelText(/Title/i);
    fireEvent.change(titleInput, { target: { value: 'Live Preview Title' } });
    
    const preview = screen.getByTestId('resource-preview');
    // Specify selector to avoid finding multiple elements if necessary
    expect(within(preview).getByText('LIVE PREVIEW', { selector: 'span' })).toBeInTheDocument();
    expect(within(preview).getByText(/Live Preview Title/i)).toBeInTheDocument();
  });

  it('renders rich HTML for note content in preview', () => {
    render(<AddResourceDrawer open={true} onClose={mockOnClose} onAdd={mockOnAdd} noteId="test-note-id" />);
    
    const contentInput = screen.getByLabelText(/Content/i);
    fireEvent.change(contentInput, { target: { value: '<b>Bold Content</b>' } });
    
    const preview = screen.getByTestId('resource-preview');
    // Check if the preview renders the HTML content
    // Use queryByText and tagName check to be more specific
    const boldElement = within(preview).getByText(/Bold Content/i);
    expect(boldElement.tagName).toBe('B');
  });

  it('renders iframe for link resource in preview', () => {
    render(<AddResourceDrawer open={true} onClose={mockOnClose} onAdd={mockOnAdd} noteId="test-note-id" />);
    
    // Change type to Link - MUI Select uses a hidden input
    const typeSelect = screen.getByLabelText(/Type/i);
    fireEvent.mouseDown(typeSelect);
    const option = screen.getByRole('option', { name: /Link/i });
    fireEvent.click(option);
    
    const urlInput = screen.getByLabelText(/URL/i);
    fireEvent.change(urlInput, { target: { value: 'https://example.com' } });
    
    const preview = screen.getByTestId('resource-preview');
    const iframe = within(preview).getByTitle('Resource Preview');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', 'https://example.com');
  });
});
