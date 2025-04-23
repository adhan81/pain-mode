import React, { useState } from 'react';

interface InsightLLMProps {
  currentEmotion: string;
  onResponse: (response: string) => void;
}

export const InsightLLM: React.FC<InsightLLMProps> = ({
  currentEmotion,
  onResponse,
}) => {
  const [userInput, setUserInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      const response = await fetch('YOUR_API_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentEmotion,
          userInput,
          prompt: `You are a compassionate therapist helping someone who is feeling ${currentEmotion}. 
                  They have shared: "${userInput}"
                  Provide a brief, empathetic response that:
                  1. Acknowledges their feelings
                  2. Validates their experience
                  3. Offers a gentle perspective shift
                  Keep the response under 100 words.`
        }),
      });

      const data = await response.json();
      setAiResponse(data.response);
      onResponse(data.response);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setAiResponse('I hear you. Your feelings are valid, and it\'s okay to feel this way.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 mb-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="userInput" className="block text-sm font-medium text-gray-700 mb-2">
            Would you like to share more about how you're feeling?
          </label>
          <textarea
            id="userInput"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="I'm feeling..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            rows={3}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !userInput.trim()}
          className="button-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Getting Response...' : 'Share & Get Response'}
        </button>
      </form>

      {aiResponse && (
        <div className="bg-primary/5 p-4 rounded-lg">
          <p className="text-gray-700">{aiResponse}</p>
        </div>
      )}
    </div>
  );
}; 