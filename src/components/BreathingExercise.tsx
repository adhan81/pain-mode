import React, { useState, useEffect } from 'react';

interface BreathingExerciseProps {
  onComplete: () => void;
}

export const BreathingExercise: React.FC<BreathingExerciseProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false);
  const [count, setCount] = useState(4);

  const steps = [
    'Take a deep breath in through your nose',
    'Hold for a moment',
    'Exhale slowly through your mouth',
    'Notice how your body feels',
    'Take one more deep breath'
  ];

  useEffect(() => {
    if (isBreathing) {
      const timer = setInterval(() => {
        setCount(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsBreathing(false);
            setStep(prev => {
              if (prev >= steps.length - 1) {
                onComplete();
                return prev;
              }
              return prev + 1;
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isBreathing, steps.length, onComplete]);

  const startBreathing = () => {
    setIsBreathing(true);
  };

  return (
    <div className="p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Quick Grounding</h2>
        <p className="text-lg mb-8">{steps[step]}</p>
        {!isBreathing && step < steps.length - 1 && (
          <button
            onClick={startBreathing}
            className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary-dark transition-colors"
          >
            Start
          </button>
        )}
        {isBreathing && (
          <div className="text-4xl font-bold text-primary">{count}</div>
        )}
      </div>
    </div>
  );
}; 