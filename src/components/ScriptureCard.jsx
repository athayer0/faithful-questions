import React from 'react';
import { Book } from 'lucide-react';

export default function ScriptureCard({ scripture }) {
  if (!scripture) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start gap-3">
        <Book className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">
            Suggested Scripture
          </h3>
          <p className="text-indigo-600 font-medium mb-2">
            {scripture.reference}
          </p>
          <p className="text-gray-700 italic mb-3">
            "{scripture.text}"
          </p>
          <a
            href={scripture.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Read in Gospel Library →
          </a>
        </div>
      </div>
    </div>
  );
}
