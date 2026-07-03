import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { ResourceNavigationItem } from '../components/ResourceNavigationItem';
import { vi } from 'vitest';

describe('ResourceNavigationItem', () => {
  const dummyResource = { id: 'doc-1', type: 'Document', title: 'Test Document', content: '...' };

  it('renders the resource title', () => {
    render(<ResourceNavigationItem resource={dummyResource} selected={false} onClick={() => {}} />);
    expect(screen.getByText('Test Document')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClickMock = vi.fn();
    render(<ResourceNavigationItem resource={dummyResource} selected={false} onClick={onClickMock} />);
    fireEvent.click(screen.getByText('Test Document'));
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('applies selected styling when selected', () => {
    const { container } = render(<ResourceNavigationItem resource={dummyResource} selected={true} onClick={() => {}} />);
    const button = container.querySelector('.MuiListItemButton-root');
    expect(button).toHaveClass('Mui-selected');
  });
});
