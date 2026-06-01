import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

describe('Home Page', () => {
  it('renders the hero title', () => {
    render(<Home />);
    const heading = screen.getByText(/Organize your thoughts with AI power/i);
    expect(heading).toBeInTheDocument();
  });

  it('renders the get started button', () => {
    render(<Home />);
    const button = screen.getByRole('link', { name: /get started/i });
    expect(button).toBeInTheDocument();
  });
});
