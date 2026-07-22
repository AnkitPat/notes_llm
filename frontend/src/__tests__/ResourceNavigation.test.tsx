// frontend/src/__tests__/ResourceNavigation.test.tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ResourceNavigation from '@/components/ResourceNavigation';
import { Resource } from '../types/dashboard';
import { vi } from 'vitest';
import { SessionProvider } from 'next-auth/react';

describe('ResourceNavigation', () => {
  const dummyResources: Resource[] = [
    { id: 'doc-1', type: 'Document', title: 'Doc 1', content: '...' },
    { id: 'link-1', type: 'Link', title: 'Link 1', content: '...' },
    { id: 'note-1', type: 'Note', title: 'Note 1', content: '...' },
  ];

  const renderWithSession = (ui: React.ReactElement) => {
    return render(
      <SessionProvider session={null}>
        {ui}
      </SessionProvider>
    );
  };

  it('renders resource types and resources', () => {
    renderWithSession(
      <ResourceNavigation
        resources={dummyResources}
        selectedResource={null}
        onSelectResource={() => {}}
        onAddResource={() => {}}
        onEditResource={() => {}}
        onDeleteResource={() => {}}
        noteId="123"
      />
    );

    expect(screen.getByText('Documents (1)')).toBeInTheDocument();
    expect(screen.getByText('Links (1)')).toBeInTheDocument();
    expect(screen.getByText('Notes (1)')).toBeInTheDocument();
    expect(screen.getByText(/Doc 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Link 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Note 1/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add resource/i })).toBeInTheDocument();
  });

  it('filters resources by type when type is clicked', () => {
    renderWithSession(
      <ResourceNavigation
        resources={dummyResources}
        selectedResource={null}
        onSelectResource={() => {}}
        onAddResource={() => {}}
        onEditResource={() => {}}
        onDeleteResource={() => {}}
        noteId="123"
      />
    );

    fireEvent.click(screen.getByText('Documents (1)'));
    expect(screen.getByText(/Doc 1/i)).toBeInTheDocument();
    expect(screen.queryByText('Link 1')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('All Resources (3)'));
    expect(screen.getByText(/Link 1/i)).toBeInTheDocument();
  });


  it('calls onSelectResource when a resource is clicked', () => {
    const onSelectResourceMock = vi.fn();
    renderWithSession(
      <ResourceNavigation
        resources={dummyResources}
        selectedResource={null}
        onSelectResource={onSelectResourceMock}
        onAddResource={() => {}}
        onEditResource={() => {}}
        onDeleteResource={() => {}}
        noteId="123"
      />
    );

    fireEvent.click(screen.getByText(/Doc 1/i));
    expect(onSelectResourceMock).toHaveBeenCalledTimes(1);
    expect(onSelectResourceMock).toHaveBeenCalledWith(dummyResources[0]);
  });

  it('renders category cards with item counts', () => {
    renderWithSession(
      <ResourceNavigation
        resources={dummyResources}
        selectedResource={null}
        onSelectResource={() => {}}
        onAddResource={() => {}}
        onEditResource={() => {}}
        onDeleteResource={() => {}}
        noteId="123"
      />
    );

    expect(screen.getByText(/All Resources \(3\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Documents \(1\)/i)).toBeInTheDocument();
  });

  it('calls onAddResource when "Create Resource" button is clicked after filling the drawer form', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'new-id' }),
    }));
    const onAddResourceMock = vi.fn();
    renderWithSession(
      <ResourceNavigation
        resources={dummyResources}
        selectedResource={null}
        onSelectResource={() => {}}
        onAddResource={onAddResourceMock}
        onEditResource={() => {}}
        onDeleteResource={() => {}}
        noteId="123"
      />
    );

    // Click "Add Resource" to show the drawer
    fireEvent.click(screen.getByRole('button', { name: /add resource/i }));

    // Find the drawer and fill the form inside it
    
    const titleInput = screen.getByLabelText(/title/i);
    const contentTextarea = screen.getByLabelText(/content/i);

    fireEvent.change(titleInput, { target: { value: 'New Test Note' } });
    
    // Select type
    const select = screen.getByRole('combobox', { name: /type/i });
    fireEvent.mouseDown(select);
    const option = await screen.findByRole('option', { name: 'Note' });
    fireEvent.click(option);

    fireEvent.change(contentTextarea, { target: { value: 'This is the content of the new note.' } });

    // Click "Create" button in the drawer
    fireEvent.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => {
        expect(onAddResourceMock).toHaveBeenCalledTimes(1);
    });
    expect(onAddResourceMock).toHaveBeenCalledWith('Note', 'New Test Note', 'This is the content of the new note.', '');
    vi.unstubAllGlobals();
  });
});
