import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  role: 'admin' | 'annotator';
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/');
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to log out');
      }
      window.location.href = '/'; // Redirect to home page after successful logout
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="w-16 md:w-64 bg-gray-800 text-white flex flex-col">
      {/* Logo */}
      <div className="p-4 flex items-center justify-center md:justify-start">
        <span className="hidden md:block text-xl font-bold text-cyan-500">
          {role === 'admin' ? 'Admin Dashboard' : 'Annotator Dashboard'}
        </span>
        <span className="block md:hidden text-xl font-bold text-cyan-500">
          {role === 'admin' ? 'A' : 'U'}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <ul className="space-y-2">
          {/* Dashboard */}
          <li>
            <Link 
              href={role === 'admin' ? '/dashboard/admin' : '/dashboard/annotator'}
              className={`flex items-center p-2 rounded-lg ${
                isActive(role === 'admin' ? '/dashboard/admin' : '/dashboard/annotator') 
                  ? 'bg-gray-900 text-cyan-500' 
                  : 'hover:bg-gray-700'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              <span className="ml-3 hidden md:block">Dashboard</span>
            </Link>
          </li>

          {/* Projects */}
          {role === 'admin' && (
            <li>
              <Link 
                href="/add_project"
                className={`flex items-center p-2 rounded-lg ${
                  isActive('/projects/add') 
                    ? 'bg-gray-900 text-cyan-500' 
                    : 'hover:bg-gray-700'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                <span className="ml-3 hidden md:block">Add Project</span>
              </Link>
            </li>
          )}

          {/* Logout */}
          <li className="mt-auto">
            <button 
              onClick={handleLogout}
              className="flex items-center p-2 rounded-lg hover:bg-gray-700 w-full text-left"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              <span className="ml-3 hidden md:block">Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
