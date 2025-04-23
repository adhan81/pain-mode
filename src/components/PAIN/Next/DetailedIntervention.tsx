import React from 'react';

interface DetailedInterventionProps {
  title: string;
  type: 'physical' | 'mental' | 'visual' | 'meditation' | 'breathing';
  duration: number; // in minutes
  steps: string[];
  onComplete: () => void;
  onBack: () => void;
}

export const DetailedIntervention: React.FC<DetailedInterventionProps> = ({
  title,
  type,
  duration,
  steps,
  onComplete,
  onBack,
}) => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [timer, setTimer] = React.useState(duration * 60);
  const [isActive, setIsActive] = React.useState(false);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* Progress Indicator */}
      <div className="flex justify-center space-x-2 mb-16">
        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium">
          N
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800 flex items-center"
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
      </div>

      {/* Title and Timer */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold mb-4">{title}</h1>
        <div className="text-2xl font-mono bg-primary/10 text-primary rounded-lg py-3 px-6 inline-block">
          {formatTime(timer)}
        </div>
      </div>

      {/* Current Step */}
      <div className="bg-white rounded-lg p-8 shadow-sm mb-8">
        <div className="text-center mb-6">
          <span className="text-sm text-gray-500">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
        <p className="text-xl text-center mb-8">{steps[currentStep]}</p>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-100 rounded-full h-2 mb-8">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentStep + 1) / steps.length) * 100}%`,
            }}
          />
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4">
          {!isActive ? (
            <button
              onClick={() => setIsActive(true)}
              className="w-full bg-primary text-white rounded-lg py-3 hover:bg-primary-dark transition-colors"
            >
              Start Timer
            </button>
          ) : (
            <button
              onClick={() => setIsActive(false)}
              className="w-full bg-gray-500 text-white rounded-lg py-3 hover:bg-gray-600 transition-colors"
            >
              Pause Timer
            </button>
          )}
          
          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="w-full bg-primary text-white rounded-lg py-3 hover:bg-primary-dark transition-colors"
            >
              Next Step
            </button>
          ) : (
            <button
              onClick={onComplete}
              className="w-full bg-green-500 text-white rounded-lg py-3 hover:bg-green-600 transition-colors"
            >
              Complete Exercise
            </button>
          )}
        </div>
      </div>
    </div>
  );
}; 