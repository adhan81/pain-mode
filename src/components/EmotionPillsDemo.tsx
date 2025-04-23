import React, { useState } from 'react';
import { EmotionPills, Emotion } from './EmotionPills';

const demoEmotions: Emotion[] = [
  { id: '1', label: 'Happy', color: 'amber', intensity: 'light' },
  { id: '2', label: 'Sad', color: 'blue', intensity: 'medium' },
  { id: '3', label: 'Angry', color: 'red', intensity: 'dark' },
  { id: '4', label: 'Calm', color: 'green', intensity: 'light' },
  { id: '5', label: 'Excited', color: 'purple', intensity: 'medium' },
];

export const EmotionPillsDemo: React.FC = () => {
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);

  const handleEmotionSelect = (emotion: Emotion) => {
    setSelectedEmotions(prev => {
      if (prev.includes(emotion.id)) {
        return prev.filter(id => id !== emotion.id);
      }
      return [...prev, emotion.id];
    });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">How are you feeling?</h2>
      <EmotionPills
        emotions={demoEmotions}
        onSelect={handleEmotionSelect}
        selectedEmotions={selectedEmotions}
      />
      {selectedEmotions.length > 0 && (
        <div className="mt-4">
          <p className="text-gray-600">Selected emotions:</p>
          <p className="text-primary font-medium">
            {selectedEmotions
              .map(id => demoEmotions.find(e => e.id === id)?.label)
              .join(', ')}
          </p>
        </div>
      )}
    </div>
  );
}; 