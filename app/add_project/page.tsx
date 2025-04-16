'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import User from '@/models/User';
import Cookies from 'js-cookie';

interface Annotator {
  _id: string;
  name: string;
  email: string;
}

export default function AddProject() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [annotators, setAnnotators] = useState<string[]>([]);
  const [allAnnotators, setAllAnnotators] = useState<Annotator[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAnnotatorList, setShowAnnotatorList] = useState(false);
  const [username, setUsername] = useState('');
  const router = useRouter();
  const annotatorListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUsername = Cookies.get('username');
    setUsername(storedUsername || '');
  }, []);


  // Fetch annotators on mount
  useEffect(() => {
    const fetchAnnotators = async () => {
      try {
        const res = await fetch('/api/get_annotators');
        const data = await res.json();
        setAllAnnotators(data.annotators || []);
      } catch (error) {
        console.error('Error fetching annotators:', error);
      }
    };
    fetchAnnotators();
  }, []);

  // Close annotator dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        annotatorListRef.current &&
        !annotatorListRef.current.contains(event.target as Node)
      ) {
        setShowAnnotatorList(false);
      }
    }
    if (showAnnotatorList) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAnnotatorList]);

  // Handle checkbox changes
  const handleAnnotatorCheckboxChange = (annotatorId: string) => {
    setAnnotators(prev => {
      if (prev.includes(annotatorId)) {
        return prev.filter(id => id !== annotatorId);
      } else {
        return [...prev, annotatorId];
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !file || annotators.length === 0) {
      alert('Please fill all required fields and select at least one annotator.');
      return;
    }
    setIsSubmitting(true);
    try {
      // Fetch admin ID from backend using username
      const adminResponse = await fetch(`/api/get-user-id?username=${encodeURIComponent(username)}`);
      const adminData = await adminResponse.json();
      
      if (!adminResponse.ok) throw new Error(adminData.error || 'Failed to fetch admin ID');
      if (!adminData.userId) throw new Error('Admin user not found');
  
      const formData = new FormData();
      formData.append('name', title);
      formData.append('description', description);
      formData.append('filename', file);
      formData.append('adminId', adminData.userId); // Use fetched admin ID
      formData.append('annotators', JSON.stringify(annotators));
      if (deadline) formData.append('deadline', deadline);
  
      const response = await fetch('/api/add_project', {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create project');
  
      router.push('/dashboard/admin');
    } catch (error) {
      console.error('Error creating project:', error);
      alert(error.message || 'Error creating project. See console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#0a1522] text-white">
      <Sidebar role="admin" />

      {/* Main content */}
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-medium text-[#1d9aaa] mb-10">Add Project</h1>

        <div className="space-y-6 max-w-xl">
          {/* Title */}
          <div className="flex items-center">
            <span className="text-xl w-36 font-medium">Title -</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent border-b border-gray-600 focus:border-[#1d9aaa] outline-none px-2 py-1 flex-1 text-white"
              placeholder="Enter title"
            />
          </div>

          {/* Description */}
          <div className="flex items-center">
            <span className="text-xl w-36 font-medium">Description -</span>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-transparent border-b border-gray-600 focus:border-[#1d9aaa] outline-none px-2 py-1 flex-1 text-white"
              placeholder="Enter description"
            />
          </div>

          {/* Deadline */}
          <div className="flex items-center">
            <span className="text-xl w-36 font-medium">Deadline -</span>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="bg-transparent border-b border-gray-600 focus:border-[#1d9aaa] outline-none px-2 py-1 flex-1 text-white"
            />
          </div>

          {/* Annotators */}
          <div className="flex items-center">
            <span className="text-xl w-36 font-medium">Annotators -</span>
            <div className="relative flex-1" ref={annotatorListRef}>
              <button
                type="button"
                onClick={() => setShowAnnotatorList((prev) => !prev)}
                className="bg-[#1d9aaa] hover:bg-[#168696] text-white py-3 px-8 rounded-full text-lg font-medium w-[180px]"
              >
                Select Annotators
              </button>

              {/* Selected annotators display */}
              {annotators.length > 0 && (
                <div className="mt-2">
                  <span className="text-sm text-gray-400">Selected:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {annotators.map(id => {
                      const annotator = allAnnotators.find(a => a._id === id);
                      return (
                        <span 
                          key={id}
                          className="bg-gray-700 px-2 py-1 rounded text-sm"
                        >
                          {annotator?.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Annotator selection dropdown */}
              {showAnnotatorList && (
                <div className="absolute z-10 mt-2 w-full max-h-60 overflow-y-auto bg-gray-800 rounded-lg shadow-lg p-4">
                  {allAnnotators.length === 0 && (
                    <div className="text-gray-400">No annotators found.</div>
                  )}
                  {allAnnotators.map(annotator => (
                    <label 
                      key={annotator._id}
                      className="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={annotators.includes(annotator._id)}
                        onChange={() => handleAnnotatorCheckboxChange(annotator._id)}
                        className="form-checkbox h-5 w-5 text-[#1d9aaa] rounded focus:ring-[#1d9aaa]"
                      />
                      <div className="flex flex-col">
                        <span className="text-white">{annotator.name}</span>
                        <span className="text-sm text-gray-400">{annotator.email}</span>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* File input */}
          <div className="flex items-center">
            <label className="bg-[#1d9aaa] hover:bg-[#168696] text-white py-3 px-8 rounded-full text-lg font-medium w-[180px] text-center cursor-pointer">
              Add file
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {fileName && (
              <span className="ml-6 text-white">
                File added: {fileName}
              </span>
            )}
          </div>

          {/* Save button */}
          <div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-[#1d9aaa] hover:bg-[#168696] text-white py-3 px-8 rounded-full text-lg font-medium w-[180px]"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      {/* User profile icon */}
      <div className="absolute top-4 right-4">
        <div className="w-12 h-12 bg-white rounded-full"></div>
      </div>
    </div>
  );
}
