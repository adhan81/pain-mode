import React, { useState } from 'react';
import { Emotion, EmotionPills } from '../../EmotionPills';
import { desiredEmotions } from '../../../data/emotions';

interface InsightStepProps {
  currentEmotion: Emotion;
  onNext: (emotion: Emotion) => void;
  onBack?: () => void;
}

export const InsightStep: React.FC<InsightStepProps> = ({
  currentEmotion,
  onNext,
  onBack,
}) => {
  const [selectedEmotions, setSelectedEmotions] = useState<Emotion[]>([]);

  const handleEmotionSelect = (emotion: Emotion) => {
    setSelectedEmotions([emotion]);
  };

  const handleContinue = () => {
    if (selectedEmotions.length > 0) {
      onNext(selectedEmotions[0]);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">What would you like to feel instead?</h2>
        <p className="text-gray-600">Choose a desired emotion to work towards</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <EmotionPills
          emotions={desiredEmotions}
          onSelect={handleEmotionSelect}
          selectedEmotions={selectedEmotions.map(e => e.name)}
        />
      </div>

      <div className="flex justify-between">
        {onBack && (
          <button
            onClick={onBack}
            className="button-secondary flex items-center"
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
        <button
          onClick={handleContinue}
          disabled={selectedEmotions.length === 0}
          className="button-primary ml-auto"
        >
          Continue
        </button>
      </div>
    </div>
  );
}; 