import React, { useState, useEffect } from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const [reassuranceMessage, setReassuranceMessage] = useState('you are safe');
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const messages = ['you are safe', 'everything you feel is ok', 'you are loved'];
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      // Fade out
      setIsVisible(false);
      
      // Change message after fade out
      setTimeout(() => {
        currentIndex = (currentIndex + 1) % messages.length;
        setReassuranceMessage(messages[currentIndex]);
        // Fade in
        setIsVisible(true);
      }, 500);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 flex flex-col items-center text-center">
      {/* Heart Icon */}
      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-8">
        <svg 
          className="w-12 h-12 text-primary" 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-semibold mb-2 text-gray-900">
        Welcome
      </h1>
      
      {/* Rotating Reassurance Message */}
      <p 
        className={`text-xl italic text-gray-500 mb-6 font-serif transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {reassuranceMessage}
      </p>

      {/* Subtitle */}
      <p className="text-xl text-gray-600 mb-12 max-w-md">
        A gentle process to help you move through emotional pain or discomfort to regulated presence.
      </p>

      {/* Steps List */}
      <div className="w-full max-w-md space-y-4 mb-12">
        <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
            <span className="text-primary font-medium">P</span>
          </div>
          <div className="text-left">
            <h3 className="font-medium text-gray-900">Presence</h3>
            <p className="text-gray-600">Acknowledge your feelings without judgment.</p>
          </div>
        </div>

        <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
            <span className="text-primary font-medium">A</span>
          </div>
          <div className="text-left">
            <h3 className="font-medium text-gray-900">Awareness</h3>
            <p className="text-gray-600">Explore what's beneath the surface.</p>
          </div>
        </div>

        <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
            <span className="text-primary font-medium">I</span>
          </div>
          <div className="text-left">
            <h3 className="font-medium text-gray-900">Insight</h3>
            <p className="text-gray-600">Choose how you'd like to feel.</p>
          </div>
        </div>

        <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
            <span className="text-primary font-medium">N</span>
          </div>
          <div className="text-left">
            <h3 className="font-medium text-gray-900">Next Step</h3>
            <p className="text-gray-600">Take one small action toward feeling better.</p>
          </div>
        </div>
      </div>

      {/* Begin Button */}
      <button
        onClick={onStart}
        className="btn btn-primary px-12 py-3 text-lg flex items-center"
      >
        Begin
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
    </div>
  );
}; 