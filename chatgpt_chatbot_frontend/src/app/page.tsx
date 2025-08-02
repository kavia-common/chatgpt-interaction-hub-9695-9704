'use client';

import { useState } from 'react';
import { AuthProvider, useAuth } from '@/components/AuthProvider';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import ChatArea from '@/components/ChatArea';

export default function Home() {
  return (
    <AuthProvider>
      <PageLayout />
    </AuthProvider>
  );
}

function PageLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Header minimal />
        <LoginPanel />
      </div>
    );
  }

  return (
    <div className="bg-secondary min-h-screen flex flex-col">
      <Header />
      <main className="flex flex-1 overflow-hidden">
        <Sidebar />
        <section className="flex-1 flex flex-col h-full">
          <ChatArea />
        </section>
      </main>
    </div>
  );
}

function LoginPanel() {
  const { signIn, error } = useAuth();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [inProgress, setInProgress] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInProgress(true);
    await signIn(email);
    setInProgress(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-md p-8 w-full max-w-sm flex flex-col gap-6"
      style={{ borderTop: '4px solid #22d3ee' }}
    >
      <h2 className="text-xl font-semibold text-primary mb-2 text-center">Sign In</h2>
      <input
        type="email"
        required
        placeholder="Email"
        className="rounded px-3 py-2 border border-gray-200 focus:ring-2 focus:ring-accent outline-none transition"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        required
        placeholder="Password"
        className="rounded px-3 py-2 border border-gray-200 focus:ring-2 focus:ring-accent outline-none transition"
        value={pw}
        onChange={e => setPw(e.target.value)}
      />
      <button
        type="submit"
        disabled={inProgress}
        className="bg-accent w-full py-2 rounded text-white font-medium disabled:opacity-60"
      >
        {inProgress ? 'Signing in...' : 'Login'}
      </button>
      {error && <div className="text-center text-red-500 text-sm">{error}</div>}
    </form>
  );
}
