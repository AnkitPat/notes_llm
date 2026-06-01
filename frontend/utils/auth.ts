interface UserSession {
  id: string;
  email: string;
  name: string;
  isApproved: boolean;
}

export const getUserSession = (): UserSession | null => {
  if (typeof window === 'undefined') {
    return null; // Server-side rendering
  }
  const sessionStr = localStorage.getItem('userSession');
  return sessionStr ? JSON.parse(sessionStr) : null;
};

export const setUserSession = (session: UserSession): void => {
  localStorage.setItem('userSession', JSON.stringify(session));
};

export const clearUserSession = (): void => {
  localStorage.removeItem('userSession');
};

export const isAuthenticated = (): boolean => {
  return !!getUserSession();
};

export const isUserApproved = (): boolean => {
  const session = getUserSession();
  return session ? session.isApproved : false;
};
