'use client';

import { useState, useEffect } from 'react';

type Conversation = {
  id: string;
  title: string;
};

export default function Sidebar() {
  const [convos, setConvos] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  // Load conversation list
  useEffect(() => {
    // TODO: Replace with backend call
    const stored = window.localStorage.getItem('conversations');
    let items: Conversation[] = [];
    if (stored) {
      try { items = JSON.parse(stored); } catch {}
    }
    setConvos(items);
    if (items.length && !selected) setSelected(items[0].id);
  }, [selected]);

  // Add New conversation
  const handleAdd = () => {
    const n = prompt('Conversation title?', 'New chat');
    if (!n) return;
    const newConvo: Conversation = { id: (Date.now() + Math.random()).toString(), title: n };
    const updated = [newConvo, ...convos];
    setConvos(updated);
    window.localStorage.setItem('conversations', JSON.stringify(updated));
    setSelected(newConvo.id);
  };

  // Select a conversation
  const handleSelect = (id: string) => {
    setSelected(id);
    // Could fire event, e.g. via context, Redux, etc.
    // Here: for simplicity, use a custom event
    window.dispatchEvent(new CustomEvent('selectConversation', { detail: id }));
  };

  return (
    <aside className="w-64 min-w-[220px] bg-white border-r border-gray-200 flex flex-col p-4 relative">
      <div className="flex items-center mb-4">
        <span className="text-lg font-bold text-primary flex-1">Conversations</span>
        <button
          aria-label="Add conversation"
          className="ml-2 px-2 py-1 text-accent rounded-full hover:bg-accent/10 transition"
          onClick={handleAdd}
        >＋</button>
      </div>
      <ul className="space-y-2 overflow-auto flex-1" style={{ maxHeight: '65vh' }}>
        {convos.length === 0 ? (
          <li className="text-gray-400">No conversations</li>
        ) : (
          convos.map(c => (
            <li key={c.id}>
              <button
                className={`w-full text-left px-3 py-2 rounded transition ${selected===c.id ? 'bg-accent text-white' : 'hover:bg-secondary text-primary'}`}
                style={selected === c.id ? undefined : { border: '1px solid transparent' }}
                onClick={() => handleSelect(c.id)}
                aria-current={selected === c.id}
              >
                {c.title}
              </button>
            </li>
          ))
        )}
      </ul>
    </aside>
  );
}
