import React, { useState } from 'react';
import { Emotion, EmotionPills } from '../../EmotionPills';

interface WordPickerProps {
  emotions: Emotion[];
  onSelect: (emotion: Emotion) => void;
  onBack?: () => void;
}

export const WordPicker: React.FC<WordPickerProps> = ({
  emotions,
  onSelect,
  onBack,
}) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customEmotion, setCustomEmotion] = useState('');
  const [error, setError] = useState('');

  const validateCustomEmotion = (emotion: string): boolean => {
    // Reset error
    setError('');

    // Check if empty
    if (!emotion.trim()) {
      setError('Please enter a feeling');
      return false;
    }

    // Check minimum length
    if (emotion.trim().length < 2) {
      setError('Please enter at least 2 characters');
      return false;
    }

    // Check maximum length
    if (emotion.trim().length > 20) {
      setError('Please keep it under 20 characters');
      return false;
    }

    // Check for valid characters (letters, spaces, and hyphens)
    if (!/^[a-zA-Z\s-]+$/.test(emotion)) {
      setError('Please use only letters, spaces, and hyphens');
      return false;
    }

    // Check if it's already in the list
    if (emotions.some(e => e.name.toLowerCase() === emotion.trim().toLowerCase())) {
      setError('This feeling is already in the list');
      return false;
    }

    return true;
  };

  const handleCustomEmotionSubmit = () => {
    if (validateCustomEmotion(customEmotion)) {
      onSelect({
        name: customEmotion.trim(),
        color: 'gray',
        intensity: 2
      });
    }
  };

  return (
    <div className="p-6 space-y-8">
      {!showCustomInput ? (
        <>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">What are you feeling?</h2>
            <p className="text-gray-600">Select the emotion that best describes your current state</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <EmotionPills
              emotions={emotions}
              onSelect={onSelect}
            />
          </div>

          <button
            onClick={() => setShowCustomInput(true)}
            className="text-primary hover:text-primary-dark transition-colors mt-4"
          >
            I don't see my feeling
          </button>
        </>
      ) : (
        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Type your feeling..."
              value={customEmotion}
              onChange={(e) => {
                setCustomEmotion(e.target.value);
                setError('');
              }}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setShowCustomInput(false)}
              className="button-secondary"
            >
              Back to suggestions
            </button>
            <button
              onClick={handleCustomEmotionSubmit}
              disabled={!customEmotion.trim()}
              className="button-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {onBack && (
        <button
          onClick={onBack}
          className="button-secondary mt-6 flex items-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>
      )}
    </div>
  );
}; 