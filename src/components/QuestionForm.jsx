import React from 'react';
import { Loader2 } from 'lucide-react';

export default function QuestionForm({ question, setQuestion, onSubmit, loading }) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      onSubmit();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        What's on your mind?
      </label>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Share your question, doubt, or topic you'd like to explore..."
        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        rows="4"
      />
      <div className="mt-4 flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Press Ctrl+Enter to submit
        </p>
        <button
          onClick={onSubmit}
          disabled={loading || !question.trim()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Searching...
            </>
          ) : (
            'Get Resources'
          )}
        </button>
      </div>
    </div>
  );
}
