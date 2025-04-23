import React from 'react';
import { Emotion } from '../data/emotions';

interface EmotionPillsProps {
  emotions: Emotion[];
  selectedEmotion?: Emotion;
  desiredEmotion?: Emotion;
  onSelect: (emotion: Emotion) => void;
}

export default function EmotionPills({ emotions, selectedEmotion, desiredEmotion, onSelect }: EmotionPillsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {emotions.map((emotion) => {
        const isSelected = selectedEmotion?.name === emotion.name;
        const isDesired = desiredEmotion?.name === emotion.name;
        
        return (
          <button
            key={emotion.name}
            onClick={() => onSelect(emotion)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${isSelected ? `bg-${emotion.color}-500 text-white` : 
                isDesired ? `bg-${emotion.color}-100 text-${emotion.color}-800` :
                `bg-${emotion.color}-50 text-${emotion.color}-700 hover:bg-${emotion.color}-100`}
            `}
          >
            {emotion.name}
            {emotion.intensity && (
              <span className="ml-1 text-xs opacity-75">
                ({emotion.intensity}/3)
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
} 