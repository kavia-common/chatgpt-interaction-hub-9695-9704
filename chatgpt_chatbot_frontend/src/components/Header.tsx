'use client';

import { useAuth } from './AuthProvider';

export default function Header({ minimal = false }: { minimal?: boolean }) {
  const { user, signOut } = useAuth();

  return (
    <header className="flex items-center justify-between bg-primary text-white px-6 py-3 shadow-sm h-16">
      <div className="flex items-center gap-3">
        <span className="font-bold text-lg tracking-tight">ChatHubAI</span>
        <span className="inline-block bg-accent rounded px-2 py-0.5 ml-2 text-xs font-semibold">ChatGPT</span>
      </div>
      {!minimal && (
      <div className="flex items-center gap-4">
        <span className="text-sm">{user?.email}</span>
        <button
          className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded text-white border border-accent transition"
          onClick={() => signOut()}
        >
          Sign out
        </button>
      </div>
      )}
    </header>
  );
}
