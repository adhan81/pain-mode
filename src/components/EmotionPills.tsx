import React from 'react';
import { Emotion } from '../data/emotions';

interface EmotionPillsProps {
  emotions: Emotion[];
  selectedEmotion?: Emotion;
  desiredEmotion?: Emotion;
  onSelect: (emotion: Emotion) => void;
}

export default function EmotionPills({ emotions, selectedEmotion, desiredEmotion, onSelect }: EmotionPillsProps) {
  const getColorClasses = (emotion: Emotion) => {
    switch (emotion.color) {
      case 'amber':
        return {
          selected: 'bg-amber-500 text-white',
          desired: 'bg-amber-100 text-amber-800',
          default: 'bg-amber-50 text-amber-700 hover:bg-amber-100'
        };
      case 'blue':
        return {
          selected: 'bg-blue-500 text-white',
          desired: 'bg-blue-100 text-blue-800',
          default: 'bg-blue-50 text-blue-700 hover:bg-blue-100'
        };
      case 'red':
        return {
          selected: 'bg-red-500 text-white',
          desired: 'bg-red-100 text-red-800',
          default: 'bg-red-50 text-red-700 hover:bg-red-100'
        };
      case 'green':
        return {
          selected: 'bg-green-500 text-white',
          desired: 'bg-green-100 text-green-800',
          default: 'bg-green-50 text-green-700 hover:bg-green-100'
        };
      case 'purple':
        return {
          selected: 'bg-purple-500 text-white',
          desired: 'bg-purple-100 text-purple-800',
          default: 'bg-purple-50 text-purple-700 hover:bg-purple-100'
        };
      case 'gray':
        return {
          selected: 'bg-gray-500 text-white',
          desired: 'bg-gray-100 text-gray-800',
          default: 'bg-gray-50 text-gray-700 hover:bg-gray-100'
        };
      default:
        return {
          selected: 'bg-gray-500 text-white',
          desired: 'bg-gray-100 text-gray-800',
          default: 'bg-gray-50 text-gray-700 hover:bg-gray-100'
        };
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {emotions.map((emotion) => {
        const isSelected = selectedEmotion?.name === emotion.name;
        const isDesired = desiredEmotion?.name === emotion.name;
        const colorClasses = getColorClasses(emotion);
        
        return (
          <button
            key={emotion.name}
            onClick={() => onSelect(emotion)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              isSelected ? colorClasses.selected :
              isDesired ? colorClasses.desired :
              colorClasses.default
            }`}
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