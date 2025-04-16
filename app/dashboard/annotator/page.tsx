'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/layout/Sidebar';
import {IProject} from '@/models/Project'
import Cookies from 'js-cookie';
 
export default function AnnotatorDashboard() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('');
 
  useEffect(() => {
    const storedUsername = Cookies.get('username');
    setUsername(storedUsername || '');
  }, []);
  
  useEffect(() => {
    const fetchAssignedProjects = async () => {
      try {
        const res = await fetch('/api/dashboard');
 
        if (!res.ok) throw new Error('Failed to fetch assigned projects');
        const data = await res.json();
        setProjects(data.projects || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsLoading(false);
      }
    };
 
    fetchAssignedProjects();
 
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar role="annotator" />

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Welcome back, {username}</h1>
            
            <div className="flex items-center space-x-2">
              <button className="bg-gray-800 p-2 rounded-full">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="white"/>
                </svg>
              </button>
              {/* <div className="bg-cyan-600 rounded-full h-8 w-8 flex items-center justify-center font-bold">
                {username}
              </div> */}
            </div>
          </div>

          {/* Projects Section */}
          <div className="mb-8">
            <div className="mb-4">
              <h2 className="text-xl font-medium">Active Projects</h2>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-cyan-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <div 
                      key={project._id as string} 
                      className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700"
                    >
                      <div className="p-4">
                        <h3 className="text-white font-semibold">{project.name}</h3>
                        <p className="text-gray-400 text-sm mt-1 line-clamp-3">
                          {project.description || 'No description provided'}
                        </p>
                      </div>
                      <div className="bg-gray-700 flex justify-between items-center px-4 py-2">
                        <span className="text-gray-300 text-xs">
                          Created: {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                        <Link href={`/translate/${project._id}`}>
                          <button className="bg-cyan-600 hover:bg-cyan-700 px-3 py-1 rounded text-xs font-medium">
                            Translate
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center text-gray-500 py-10">
                    No projects assigned to you at the moment.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Stats Section */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-center">
              <div className="bg-cyan-600 rounded-full h-12 w-12 flex items-center justify-center text-xl font-bold">
              {projects.length}
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm text-gray-300">
              <div className="flex justify-between">
                <span>Projects:</span>
                <span>{projects.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Assigned Texts:</span>
                <span>42</span>
              </div>
              <div className="flex justify-between">
                <span>Translated:</span>
                <span>28</span>
              </div>
              <div className="flex justify-between">
                <span>Remaining:</span>
                <span>14</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
