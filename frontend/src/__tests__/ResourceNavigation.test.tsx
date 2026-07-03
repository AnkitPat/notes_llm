// frontend/src/__tests__/ResourceNavigation.test.tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import ResourceNavigation from '@/components/ResourceNavigation';
import { Resource } from '../types/dashboard';
import { vi } from 'vitest';

describe('ResourceNavigation', () => {
  const dummyResources: Resource[] = [
    { id: 'doc-1', type: 'Document', title: 'Doc 1', content: '...' },
    { id: 'link-1', type: 'Link', title: 'Link 1', content: '...' },
    { id: 'note-1', type: 'Note', title: 'Note 1', content: '...' },
  ];

  it('renders resource types and resources', () => {
    render(
      <ResourceNavigation
        resources={dummyResources}
        selectedResource={null}
        onSelectResource={() => {}}
        onAddResource={() => {}}
      />
    );

    expect(screen.getByText('Documents')).toBeInTheDocument();
    expect(screen.getByText('Links')).toBeInTheDocument();
    expect(screen.getByText('Notes')).toBeInTheDocument();
    expect(screen.getByText(/Doc 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Link 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Note 1/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add note\/link/i })).toBeInTheDocument();
    expect(screen.getByText(/upload pdf\/doc/i)).toBeInTheDocument();
  });

  it('filters resources by type when type is clicked', () => {
    render(
      <ResourceNavigation
        resources={dummyResources}
        selectedResource={null}
        onSelectResource={() => {}}
        onAddResource={() => {}}
      />
    );

    fireEvent.click(screen.getByText('Documents'));
    expect(screen.getByText(/Doc 1/i)).toBeInTheDocument();
    expect(screen.queryByText('Link 1')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('All Resources'));
    expect(screen.getByText(/Link 1/i)).toBeInTheDocument();
  });


  it('calls onSelectResource when a resource is clicked', () => {
    const onSelectResourceMock = vi.fn();
    render(
      <ResourceNavigation
        resources={dummyResources}
        selectedResource={null}
        onSelectResource={onSelectResourceMock}
        onAddResource={() => {}}
      />
    );

    fireEvent.click(screen.getByText(/Doc 1/i));
    expect(onSelectResourceMock).toHaveBeenCalledTimes(1);
    expect(onSelectResourceMock).toHaveBeenCalledWith(dummyResources[0]);
  });

  it('renders category cards with item counts', () => {
    render(
      <ResourceNavigation
        resources={dummyResources}
        selectedResource={null}
        onSelectResource={() => {}}
        onAddResource={() => {}}
      />
    );

    expect(screen.getByText(/All Resources/i)).toBeInTheDocument();
    expect(screen.getByText(/3/i)).toBeInTheDocument(); // Total count (1 doc, 1 link, 1 note in dummyResources)
    expect(screen.getByText(/Documents/i)).toBeInTheDocument();
    expect(screen.getAllByText(/1/i).length).toBeGreaterThanOrEqual(1); // Counts for categories
  });

  it('calls onAddResource when "Create Resource" button is clicked after filling the drawer form', async () => {
    const onAddResourceMock = vi.fn();
    render(
      <ResourceNavigation
        resources={dummyResources}
        selectedResource={null}
        onSelectResource={() => {}}
        onAddResource={onAddResourceMock}
      />
    );

    // Click "Add Note/Link" to show the drawer
    fireEvent.click(screen.getByRole('button', { name: /add note\/link/i }));

    // Find the drawer and fill the form inside it
    // AddResourceDrawer uses MUI Drawer, which might not be immediately visible in the DOM depending on implementation,
    // but the fields should be accessible.
    
    const titleInput = screen.getByLabelText(/title/i);
    const contentTextarea = screen.getByLabelText(/content/i);

    fireEvent.change(titleInput, { target: { value: 'New Test Note' } });
    
    // Select type
    const select = screen.getByLabelText(/type/i);
    fireEvent.mouseDown(select);
    const option = await screen.findByRole('option', { name: 'Note' });
    fireEvent.click(option);

    fireEvent.change(contentTextarea, { target: { value: 'This is the content of the new note.' } });

    // Click "Create" button in the drawer
    fireEvent.click(screen.getByRole('button', { name: /create/i }));

    expect(onAddResourceMock).toHaveBeenCalledTimes(1);
    expect(onAddResourceMock).toHaveBeenCalledWith('Note', 'New Test Note', 'This is the content of the new note.');
  });
});
