import { render, screen, fireEvent } from '@testing-library/react';
import { AddResourceDrawer } from '../components/AddResourceDrawer';
import { vi } from 'vitest';

describe('AddResourceDrawer', () => {
  const mockOnClose = vi.fn();
  const mockOnAdd = vi.fn();

  it('calls onAdd with correct parameters when Create is clicked', () => {
    render(<AddResourceDrawer open={true} onClose={mockOnClose} onAdd={mockOnAdd} />);
    
    // Fill title
    const titleInput = screen.getByLabelText(/Title/i);
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    
    // Fill content
    const contentInput = screen.getByLabelText(/Content/i);
    fireEvent.change(contentInput, { target: { value: 'Test Content' } });
    
    // Click Create
    const createButton = screen.getByText(/Create/i);
    fireEvent.click(createButton);
    
    expect(mockOnAdd).toHaveBeenCalledWith('Note', 'Test Title', 'Test Content');
    expect(mockOnClose).toHaveBeenCalled();
  });
});
