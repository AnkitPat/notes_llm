import React from 'react';

interface AuthLayoutProps {
  imageComponent: React.ReactNode;
  formComponent: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ imageComponent, formComponent }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div data-testid="login-image-area" style={{ flex: 1, backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {imageComponent}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        {formComponent}
      </div>
    </div>
  );
};

export default AuthLayout;
