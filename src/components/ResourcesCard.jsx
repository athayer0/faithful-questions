import React from 'react';
import { Video } from 'lucide-react';

export default function ResourcesCard({ resources }) {
  if (!resources || resources.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start gap-3 mb-4">
        <Video className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
        <h3 className="font-semibold text-gray-900">
          Recommended Talks & Resources
        </h3>
      </div>
      <div className="space-y-4">
        {resources.map((resource, idx) => (
          <div
            key={idx}
            className="border-l-4 border-purple-300 pl-4 py-2"
          >
            <h4 className="font-medium text-gray-900 mb-1">
              {resource.title}
            </h4>
            <p className="text-sm text-gray-600 mb-2">
              {resource.author} • {resource.type} • {resource.year}
            </p>
            <a
              href={resource.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Read or Watch →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
