'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type User = {
  id: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initial auth check: e.g., from localStorage or backend
  useEffect(() => {
    setLoading(true);
    // Simulated: try to fetch session or user
    (async () => {
      try {
        // TODO: replace with backend session check
        // Simulate user from localStorage
        const u = window.localStorage.getItem('user');
        if (u) setUser(JSON.parse(u));
        setLoading(false);
      } catch {
        setUser(null);
        setLoading(false);
      }
    })();
  }, []);

  // PUBLIC_INTERFACE
  async function signIn(email: string) {
    setLoading(true);
    setError(null);
    try {
      // Mocked authentication logic: Replace with real API call!
      // e.g. await fetch(`${process.env.NEXT_PUBLIC_AUTH_API}/login`, ...)
      // For demonstration, login for any credentials, but email must contain @
      await new Promise(r => setTimeout(r, 1000));
      if (!email.includes('@')) throw new Error('Invalid email');
      const user: User = { id: 'user1', email };
      setUser(user);
      window.localStorage.setItem('user', JSON.stringify(user));
      setLoading(false);
    } catch (e: unknown) {
      setUser(null);
      setLoading(false);
      if (e instanceof Error) {
        setError(e.message || 'Login failed.');
      } else {
        setError('Login failed.');
      }
    }
  }

  // PUBLIC_INTERFACE
  async function signOut() {
    setUser(null);
    window.localStorage.removeItem('user');
    setLoading(false);
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useAuth() {
  return useContext(AuthContext);
}
