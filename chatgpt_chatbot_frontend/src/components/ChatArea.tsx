'use client';

import { useEffect, useRef, useState } from 'react';
import ChatInput from './ChatInput';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
};

function mockAPI(): Promise<Message> {
  // Replace with real API call; for now, simulate GPT response
  return new Promise(resolve => setTimeout(() => {
    resolve({
      id: (Math.random() * 1e15).toString(),
      role: 'assistant',
      content: "This is a mock response from ChatGPT. Replace this with the backend endpoint.",
      timestamp: Date.now(),
    });
  }, 1500));
}

export default function ChatArea() {
  // Now store the chat messages in component state (could sync to backend)
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  // Listen for conversation change events from Sidebar
  useEffect(() => {
    const listener = () => {
      // Could also load messages for new convo
      setMessages([]);
    };
    window.addEventListener('selectConversation', listener);
    return () => window.removeEventListener('selectConversation', listener);
  }, []);

  // Send message
  async function handleSend(msg: string) {
    if (!msg || loading) return;
    setErrMsg(null);
    const userMsg: Message = {
      id: (Math.random() * 1e16).toString(),
      role: 'user',
      content: msg,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    try {
      // Replace with call to backend/chat API
      // See .env for API endpoint and key
      const res = await mockAPI([...messages, userMsg]);
      setMessages(prev => [...prev, res]);
    } catch {
      setErrMsg('Error sending message. Please try again.');
    }
    setLoading(false);
  }

  // Auto-scroll to bottom
  const chatRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className="flex flex-col flex-1 h-full bg-secondary">
      <div ref={chatRef} className="flex-1 overflow-auto p-6" style={{ minHeight: 0 }}>
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-400">
            Start the conversation...
          </div>
        ) : (
          <div className="flex flex-col space-y-6">
            {messages.map(m => (
              <ChatBubble key={m.id} message={m} />
            ))}
            {loading && (
              <div className="flex justify-end text-accent font-semibold animate-pulse">AI is thinking…</div>
            )}
          </div>
        )}
      </div>
      {errMsg && (
        <div className="bg-red-100 text-red-700 px-4 py-2 text-sm text-center">{errMsg}</div>
      )}
      <div className="w-full p-2 bg-secondary border-t border-gray-200">
        <ChatInput onSend={handleSend} disabled={loading}/>
      </div>
    </div>
  );
}

function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full`}>
      <div
        className={`max-w-[68%] px-4 py-2 rounded-xl shadow-sm ${isUser ? 'rounded-br-md bg-accent text-white' : 'bg-primary/10 text-primary'}`}
        style={isUser ? { borderBottomRightRadius: 2 } : undefined}
      >
        <span className="block text-sm">{message.content}</span>
        <span className="block mt-1 text-[10px] opacity-60 text-right">{new Date(message.timestamp).toLocaleTimeString()}</span>
      </div>
    </div>
  );
}
