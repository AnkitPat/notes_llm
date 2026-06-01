import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../pages/login';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('Login Page', () => {
  test('renders login screen with correct elements', () => {
    render(<Login />);
    
    // Verify welcome message
    expect(screen.getByText(/Your personal knowledge hub/i)).toBeInTheDocument();
    
    // Verify Google login button
    expect(screen.getByRole('button', { name: /Login with Google/i })).toBeInTheDocument();
    
    // Verify placeholder for image (this might need to be more specific based on implementation)
    // For now, let's assume there's an accessible element for the image area
    expect(screen.getByTestId('login-image-area')).toBeInTheDocument(); 
  });
});
