// frontend/src/__tests__/ResourcePreview.test.tsx
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ResourcePreview } from '../components/ResourcePreview';

describe('ResourcePreview', () => {
  it('renders iframe for Link types', () => {
    render(
      <ResourcePreview
        title="Test Link"
        type="Link"
        content=""
        link="https://example.com"
        showLivePreviewLabel={false}
      />
    );
    // Find the iframe by its title
    const iframe = screen.getByTitle('Test Link');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', 'https://example.com');
  });

  it('renders note content for Note type', () => {
    render(
      <ResourcePreview
        title="My Note"
        type="Note"
        content="<p>Hello World</p>"
        link=""
        showLivePreviewLabel={false}
      />
    );
    // Note uses 'dangerouslySetInnerHTML', check if content is rendered
    expect(screen.getByText(/Hello World/i)).toBeInTheDocument();
    // Ensure iframe is not present for Note
    expect(screen.queryByTitle('My Note')).not.toBeInTheDocument();
  });
});
