import React from 'react';
import { render, screen } from '@testing-library/react';
import AuthStatusPage from '../pages/auth-status';

describe('Auth Status Page', () => {
  test('renders waiting for approval message', () => {
    render(<AuthStatusPage />);
    expect(screen.getByText(/Account Pending Approval/i)).toBeInTheDocument();
    expect(screen.getByText(/admin/i)).toBeInTheDocument();
  });
});
