import React, { useState } from 'react';
import { Emotion } from '../../EmotionPills';

interface AwarenessStepProps {
  emotion: Emotion;
  onNext: (intensity: 1 | 2 | 3) => void;
  onBack?: () => void;
}

export const AwarenessStep: React.FC<AwarenessStepProps> = ({
  emotion,
  onNext,
  onBack,
}) => {
  const [intensity, setIntensity] = useState<1 | 2 | 3>(2);

  const handleContinue = () => {
    onNext(intensity);
  };

  // Use sentenceForm if available, otherwise use name
  const emotionText = emotion.sentenceForm || emotion.name;

  return (
    <div className="p-6 space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">How strong is your feeling of {emotionText}?</h2>
        <p className="text-gray-600">Rate the intensity of your feeling</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Mild</span>
            <span>Moderate</span>
            <span>Strong</span>
          </div>
          <input
            type="range"
            min="1"
            max="3"
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value) as 1 | 2 | 3)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
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
          className="button-primary ml-auto"
        >
          Continue
        </button>
      </div>
    </div>
  );
}; 