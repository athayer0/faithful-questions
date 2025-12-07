import React, { useState } from 'react';
import { Book, MessageCircle, Video, Loader2 } from 'lucide-react';

export default function App() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setError('');
    setResponse(null);

    try {
//    const apiResponse = await fetch('http://localhost:3001/api/query', {
      const apiResponse = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      const data = await apiResponse.json();

      if (!apiResponse.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      setResponse(data);
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent newline
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Gospel Question Helper
          </h1>
          <p className="text-gray-600">
            A compassionate space to explore your questions about faith
          </p>
        </div>

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
              Press Enter to submit
            </p>
            <button
              onClick={handleSubmit}
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

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {response && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <MessageCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">A Thought for You</h3>
                  <p className="text-gray-700 leading-relaxed">{response.validation}</p>
                </div>
              </div>
            </div>

            {response.scripture && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start gap-3">
                  <Book className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Suggested Scripture
                    </h3>
                    <p className="text-indigo-600 font-medium mb-2">
                      {response.scripture.reference}
                    </p>
                    <p className="text-gray-700 italic mb-3">
                      "{response.scripture.text}"
                    </p>
                    <a
                      href={response.scripture.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Read in Gospel Library →
                    </a>
                  </div>
                </div>
              </div>
            )}

            {response.resources && response.resources.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start gap-3 mb-4">
                  <Video className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <h3 className="font-semibold text-gray-900">
                    Recommended Talks & Resources
                  </h3>
                </div>
                <div className="space-y-4">
                  {response.resources.map((resource, idx) => (
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}
