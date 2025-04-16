'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie'

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [user, setUser ] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
  
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({username, password }),
      });
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      const user = data.user
      if(!user){
      
        console.error("Login failed:", data);
        alert("Invalid credentials or server error");
        return;
      }      
    
      Cookies.set('username', data.user.username); 
      Cookies.set('role', data.user.role);
      Cookies.set('id', data.user.id)

    
      router.push(`/dashboard/${user.role}`);

      
     
    } catch (error) {
      console.error('lOGIN failed:', error);
      setError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  

  };
 
  return (
    <div className="min-h-screen bg-gray-900 flex justify-center items-center p-4">
      <div className="max-w-md w-full bg-gray-900 rounded-lg p-8 border border-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Annotator</h1>
          <p className="text-gray-400 mb-6">
            Linter ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s. After an unknown printer...
          </p>
          
         
          
          {error && (
            <div className="mb-4 p-3 bg-red-500 bg-opacity-10 border border-red-500 text-red-500 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
  <div>
    <input
      type="text"
      placeholder="Username"
      className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 text-white"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      required
    />
  </div>

  <div>
    <input
      type="password"
      placeholder="Password"
      className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 text-white"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />
  </div>

  <button
    type="submit"
    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300"
    disabled={isLoading}
  >
    {isLoading ? 'Logging in...' : 'Login'}
  </button>
</form>

          
          <p className="mt-4 text-gray-400">
            Dont have an account? <Link href="/register" className="text-cyan-400 hover:text-cyan-300">Register</Link>
          </p>
        </div>
        
        <div className="mt-8 text-center text-gray-500 text-sm">
          Copyright © 2025 Annotator Inc.
        </div>
      </div>
    </div>
  );  
}
