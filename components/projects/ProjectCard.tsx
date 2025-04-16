import React from 'react';
import Link from 'next/link';
import { IProject } from '@/models/Project'
 
type ProjectCardProp = {
  project : IProject
  role: 'admin' | 'annotator'
}
 

export default function ProjectCard({ project, role } : ProjectCardProp) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
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
        {role === 'admin' ? (
          <Link href={`/project/${project._id}`}>
            <button className="bg-cyan-600 hover:bg-cyan-700 px-3 py-1 rounded text-xs font-medium">
              View Details
            </button>
          </Link>
        ) : (
          <Link href={`/translate?projectId=${project._id}`}>
            <button className="bg-cyan-600 hover:bg-cyan-700 px-3 py-1 rounded text-xs font-medium">
              Translate
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}
