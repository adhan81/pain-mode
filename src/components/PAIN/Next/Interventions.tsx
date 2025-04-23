import React, { useState } from 'react';
import { Emotion } from '../../../data/emotions';
import { Intervention } from './NextStep';
import { DetailedIntervention } from './DetailedIntervention';

interface InterventionsProps {
  fromEmotion: Emotion;
  toEmotion: Emotion;
  onBack: () => void;
  onComplete: () => void;
}

const sampleInterventions: Intervention[] = [
  {
    id: '1',
    type: 'breathing',
    title: 'Box Breathing',
    description: 'A quick breathing exercise to help you find calm and balance.',
    icon: 'wind',
    isDetailed: true,
    duration: 1,
    steps: [
      'Breathe in for 4 counts',
      'Hold for 4 counts',
      'Breathe out for 4 counts',
      'Hold for 4 counts',
      'Repeat 3 more times'
    ],
    suitableFor: {
      from: ['anxious', 'overwhelmed', 'stressed', 'tense', 'scattered', 'restless'],
      to: ['calm', 'grounded', 'present', 'focused']
    }
  },
  {
    id: '2',
    type: 'physical',
    title: 'Quick Body Scan',
    description: 'A brief mindfulness practice to reconnect with your body.',
    icon: 'anchor',
    isDetailed: true,
    duration: 1,
    steps: [
      'Close your eyes and take a deep breath',
      'Notice any tension in your shoulders - release it',
      'Scan down to your chest and belly - let them soften',
      'Feel your feet on the ground',
      'Take one more deep breath'
    ],
    suitableFor: {
      from: ['disconnected', 'scattered', 'restless', 'numb', 'empty'],
      to: ['present', 'grounded', 'connected', 'calm']
    }
  },
  {
    id: '3',
    type: 'meditation',
    title: 'Gratitude Shift',
    description: 'A quick practice to shift perspective through gratitude.',
    icon: 'anchor',
    isDetailed: true,
    duration: 1,
    steps: [
      'Think of one thing you\'re grateful for right now',
      'Feel that gratitude in your body',
      'Think of a person who supports you',
      'Send them silent thanks'
    ],
    suitableFor: {
      from: ['sad', 'hopeless', 'stuck', 'empty', 'numb'],
      to: ['content', 'peaceful', 'energized', 'hopeful']
    }
  }
];

const Interventions: React.FC<InterventionsProps> = ({ fromEmotion, toEmotion, onBack, onComplete }) => {
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null);

  // Function to find a suitable intervention based on emotions
  const findSuitableIntervention = (from: Emotion, to: Emotion): Intervention | null => {
    // Find interventions that match the emotion transition
    const matchingInterventions = sampleInterventions.filter(intervention => {
      const fromMatch = intervention.suitableFor.from.includes(from.name.toLowerCase());
      const toMatch = intervention.suitableFor.to.includes(to.name.toLowerCase());
      return fromMatch && toMatch;
    });
    
    // If we have matches, return the first one
    if (matchingInterventions.length > 0) {
      return matchingInterventions[0];
    }
    
    // If no exact match, find interventions that match either the from or to emotion
    const partialMatches = sampleInterventions.filter(intervention => {
      const fromMatch = intervention.suitableFor.from.includes(from.name.toLowerCase());
      const toMatch = intervention.suitableFor.to.includes(to.name.toLowerCase());
      return fromMatch || toMatch;
    });
    
    if (partialMatches.length > 0) {
      return partialMatches[0];
    }
    
    // Default to box breathing if no matches found
    return sampleInterventions[0];
  };

  const handleInterventionSelect = (intervention: Intervention) => {
    setSelectedIntervention(intervention);
  };

  if (selectedIntervention) {
    return (
      <DetailedIntervention
        title={selectedIntervention.title}
        type={selectedIntervention.type}
        duration={selectedIntervention.duration || 1}
        steps={selectedIntervention.steps || []}
        onBack={() => setSelectedIntervention(null)}
        onComplete={onComplete}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="text-primary hover:text-primary-dark"
          >
            Back
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-600">Moving toward:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${toEmotion.color}`}>
              {toEmotion.name}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {sampleInterventions.map((intervention) => (
            <div
              key={intervention.id}
              className="border rounded-lg p-4 hover:border-primary cursor-pointer"
              onClick={() => handleInterventionSelect(intervention)}
            >
              <h4 className="font-medium">{intervention.title}</h4>
              <p className="text-sm text-gray-600">{intervention.description}</p>
              <p className="text-xs text-gray-500 mt-2">
                Duration: {intervention.duration} minute{intervention.duration !== 1 ? 's' : ''}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Interventions; 