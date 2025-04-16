'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';

interface User {
  _id: string;
  username: string;
  email: string;
}

interface Project {
  _id: string;
  name: string;
  description?: string;
  filename: string;
  deadline: string;
  createdAt: string;
  adminId: User;
  annotators: User[];
}

export default function ProjectDetailsPage() {
  const { ProjectId } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Activating API");
    if (!ProjectId) return;
    const fetchProject = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/project/${ProjectId}`);
        if (!res.ok) throw new Error('Failed to fetch project');
        const data = await res.json();
        setProject(data.project);
      } catch (err) {
        console.error(err);
        setProject(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [ProjectId]);

  if (loading) {
    return (
      <div className="flex h-screen bg-[#0a1522] text-white">
        <Sidebar role="admin" />
        <div className="flex-1 flex items-center justify-center">
          <span className="text-xl">Loading project details...</span>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex h-screen bg-[#0a1522] text-white">
        <Sidebar role="admin" />
        <div className="flex-1 flex items-center justify-center">
          <span className="text-xl text-red-400">Project not found.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0a1522] text-white">
      <Sidebar role="admin" />

      <div className="flex-1 p-10">
        <h1 className="text-3xl font-medium text-[#1d9aaa] mb-10">
          Project Details
        </h1>
        <div className="space-y-6 max-w-xl">
          <div className="flex items-center">
            <span className="text-xl w-36 font-medium">Title -</span>
            <span className="flex-1 text-lg">{project.name}</span>
          </div>
          <div className="flex items-center">
            <span className="text-xl w-36 font-medium">Description -</span>
            <span className="flex-1 text-lg">{project.description || <span className="text-gray-400">No description</span>}</span>
          </div>
          <div className="flex items-center">
            <span className="text-xl w-36 font-medium">Deadline -</span>
            <span className="flex-1 text-lg">{new Date(project.deadline).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <span className="text-xl w-36 font-medium">Created At -</span>
            <span className="flex-1 text-lg">{new Date(project.createdAt).toLocaleString()}</span>
          </div>
          <div className="flex items-center">
            <span className="text-xl w-36 font-medium">File -</span>
            <span className="flex-1 text-lg">{project.filename}</span>
          </div>
          <div className="flex items-center">
            <span className="text-xl w-36 font-medium">Admin -</span>
            <span className="flex-1 text-lg">
              {project.adminId?.username} <span className="text-gray-400">({project.adminId?.email})</span>
            </span>
          </div>
          <div className="flex items-start">
            <span className="text-xl w-36 font-medium">Annotators -</span>
            <div className="flex-1 flex flex-wrap gap-2">
              {project.annotators.length === 0 ? (
                <span className="text-gray-400">No annotators</span>
              ) : (
                project.annotators.map((a) => (
                  <span key={a._id} className="bg-gray-700 px-2 py-1 rounded text-sm">
                    {a.username} <span className="text-gray-400">({a.email})</span>
                  </span>
                ))
              )}
            </div>
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
