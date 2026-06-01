import React from 'react';

const AuthStatusPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center', padding: '2rem' }}>
      <h1>Account Pending Approval</h1>
      <p>Your account is currently pending approval by the administrator.</p>
      <p>An email has been sent to the administrator (siddeshgandhe@gmail.com) for review.</p>
      <p>You will be notified once your access has been granted.</p>
      <p style={{ marginTop: '2rem' }}>Thank you for your patience!</p>
    </div>
  );
};

export default AuthStatusPage;
