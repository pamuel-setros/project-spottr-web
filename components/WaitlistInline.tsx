'use client';

// Standalone waitlist capture for the /get landing page (the homepage has its
// own copy embedded in its tab state). Same /api/waitlist endpoint, same look.

import { useState } from 'react';

export default function WaitlistInline() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'ok' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: '' });
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong — try again.');
      setStatus({ type: 'ok', message: data.message || 'You are on the list!' });
      setEmail('');
    } catch (err) {
      setStatus({ type: 'error', message: err instanceof Error ? err.message : 'Something went wrong — try again.' });
    }
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto p-2 sm:p-1 bg-surface border border-line rounded-lg flex flex-col sm:flex-row items-center shadow-xl gap-2 sm:gap-0"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status.type === 'loading'}
          placeholder="you@email.com"
          className="bg-transparent text-white px-4 py-3 w-full text-sm placeholder-muted disabled:opacity-50 text-center sm:text-left rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ice"
          required
        />
        <button
          type="submit"
          disabled={status.type === 'loading'}
          className="bg-spottr hover:bg-spottr-deep disabled:opacity-50 whitespace-nowrap text-black font-semibold text-sm px-6 py-3 sm:py-2.5 rounded-md transition-colors w-full sm:w-auto sm:mr-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ice focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          {status.type === 'loading' ? 'Joining…' : 'Notify me'}
        </button>
      </form>
      {status.message && (
        <p className={`text-xs mt-4 font-medium text-center ${status.type === 'error' ? 'text-[#ff7b72]' : 'text-spottr'}`}>
          {status.message}
        </p>
      )}
    </div>
  );
}
