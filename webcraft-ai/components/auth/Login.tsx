// components/auth/Login.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [username, setUsername] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });

    if (res.ok) {
      // For Liveblocks, you'd typically get a token and use that.
      // For simplicity, we'll just store the username and redirect.
      localStorage.setItem('username', username);
      router.push(`/editor/${username}`); // Redirect to a user-specific editor
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleLogin} className="p-8 bg-white shadow-md rounded">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <button type="submit" className="w-full bg-violet-600 text-white p-2 rounded">
          Enter Editor
        </button>
      </form>
    </div>
  );
}
