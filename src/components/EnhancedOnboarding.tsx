import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EnhancedOnboardingProps {
  onComplete: () => void;
}

export const EnhancedOnboarding: React.FC<EnhancedOnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [showContinue, setShowContinue] = useState(false);

  const steps = [
    {
      title: "Pain exists for a reason.",
      text: "It's not here to punish you—it's here to speak.",
      delay: 0
    },
    {
      title: "Pain is your inner world",
      text: "asking for attention, for care, for change.",
      delay: 2000
    },
    {
      title: "This is a gentle process",
      text: "for meeting that pain—not with fear or avoidance, but with presence.",
      delay: 4000
    },
    {
      title: "A way to listen, to learn",
      text: "and to move toward yourself.",
      delay: 6000
    },
    {
      title: "Toward a state of regulated presence:",
      text: "where you feel safe, steady, and able to choose how you move forward.",
      delay: 8000
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setIsVisible(false);
        setTimeout(() => {
          setCurrentStep(currentStep + 1);
          setIsVisible(true);
        }, 500);
      } else {
        // After the last step, show the continue button
        setShowContinue(true);
      }
    }, steps[currentStep].delay);

    return () => clearTimeout(timer);
  }, [currentStep, steps]);

  const handleContinue = () => {
    onComplete();
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.h1 
              className="text-3xl md:text-4xl font-serif mb-6 text-gray-900"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {steps[currentStep].title}
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-600 font-serif italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {steps[currentStep].text}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        {/* Progress Dots */}
        <div className="flex justify-center space-x-2 mt-8">
          {steps.map((_, index) => (
            <motion.div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentStep ? 'bg-primary' : 'bg-gray-300'
              }`}
              initial={{ scale: 0.8 }}
              animate={{ scale: index === currentStep ? 1.2 : 0.8 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        {/* Continue Button */}
        <AnimatePresence>
          {showContinue && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="mt-8 flex justify-center"
            >
              <button
                onClick={handleContinue}
                className="btn btn-primary px-8 py-3 text-lg flex items-center"
              >
                Continue
                <svg 
                  className="w-5 h-5 ml-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skip Button */}
        <button
          onClick={handleSkip}
          className="mt-4 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Skip introduction
        </button>
      </div>
    </div>
  );
}; 