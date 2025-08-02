'use client';

import { useRef, useState } from 'react';

type Props = {
  onSend: (msg: string) => void;
  disabled?: boolean;
};

/**
 * PUBLIC_INTERFACE
 * A chat input component for sending messages to the chatbot.
 */
export default function ChatInput({ onSend, disabled }: Props) {
  const [val, setVal] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSend() {
    if (val.trim() && !disabled) {
      onSend(val.trim());
      setVal('');
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex gap-3 items-end bg-secondary rounded-xl w-full px-2 py-2">
      <textarea
        ref={textareaRef}
        className="flex-1 min-h-[38px] max-h-36 resize-none rounded px-3 py-2 border border-gray-200 focus:ring-accent focus:ring-2 outline-none text-gray-900 text-base shadow-sm transition"
        placeholder="Type your message and press Enter…"
        value={val}
        disabled={disabled}
        rows={1}
        onChange={e => setVal(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{ background: 'white' }}
      />
      <button
        type="button"
        disabled={disabled || !val.trim()}
        className="bg-primary hover:bg-accent text-white px-4 py-[10px] rounded transition font-semibold text-base disabled:opacity-60"
        onClick={handleSend}
        aria-label="Send"
      >
        Send
      </button>
    </div>
  );
}
