import React, { useState } from 'react';
import QuestionForm from './components/QuestionForm';
import ValidationCard from './components/ValidationCard';
import ScriptureCard from './components/ScriptureCard';
import ResourcesCard from './components/ResourcesCard';

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

        <QuestionForm
          question={question}
          setQuestion={setQuestion}
          onSubmit={handleSubmit}
          loading={loading}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {response && (
          <div className="space-y-6">
            <ValidationCard validation={response.validation} />
            <ScriptureCard scripture={response.scripture} />
            <ResourcesCard resources={response.resources} />
          </div>
        )}
      </div>
    </div>
  );
}
