import React, { useState } from 'react'
import { WelcomeScreen } from './components/WelcomeScreen'
import EmotionPills from './components/EmotionPills'
import NextStep from './components/PAIN/Next/NextStep'
import { Emotion, challengingEmotions, desiredEmotions } from './data/emotions'
import './App.css'

type Step = 'welcome' | 'current-emotion' | 'desired-emotion' | 'insight' | 'next'

function App() {
  const [currentStep, setCurrentStep] = useState<Step>('welcome')
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | undefined>(undefined)
  const [desiredEmotion, setDesiredEmotion] = useState<Emotion | undefined>(undefined)

  const handleStart = () => {
    setCurrentStep('current-emotion')
  }

  const handleCurrentEmotionSelected = (emotion: Emotion) => {
    setSelectedEmotion(emotion)
    setCurrentStep('desired-emotion')
  }

  const handleDesiredEmotionSelected = (emotion: Emotion) => {
    setDesiredEmotion(emotion)
    setCurrentStep('insight')
  }

  const handleBack = () => {
    if (currentStep === 'next') {
      setCurrentStep('insight')
    } else if (currentStep === 'insight') {
      setCurrentStep('desired-emotion')
    } else if (currentStep === 'desired-emotion') {
      setCurrentStep('current-emotion')
    } else if (currentStep === 'current-emotion') {
      setCurrentStep('welcome')
    }
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomeScreen onStart={handleStart} />;
      case 'current-emotion':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">How are you feeling?</h2>
            <EmotionPills
              emotions={challengingEmotions}
              onSelect={handleCurrentEmotionSelected}
              selectedEmotion={selectedEmotion}
              desiredEmotion={desiredEmotion}
            />
          </div>
        );
      case 'desired-emotion':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">How would you like to feel?</h2>
            <EmotionPills
              emotions={desiredEmotions}
              onSelect={handleDesiredEmotionSelected}
              selectedEmotion={desiredEmotion}
              desiredEmotion={selectedEmotion}
            />
          </div>
        );
      case 'insight':
        return (
          <NextStep
            fromEmotion={selectedEmotion!}
            toEmotion={desiredEmotion!}
            onComplete={() => setCurrentStep('next')}
            showInterventions={false}
          />
        );
      case 'next':
        return (
          <NextStep
            fromEmotion={selectedEmotion!}
            toEmotion={desiredEmotion!}
            onComplete={() => {
              setCurrentStep('welcome');
              setSelectedEmotion(undefined);
              setDesiredEmotion(undefined);
            }}
            showInterventions={true}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto pt-8 pb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {renderCurrentStep()}
        </div>
        
        {currentStep !== 'welcome' && (
          <div className="mt-4 flex justify-between items-center px-4">
            <button
              onClick={handleBack}
              className="text-gray-600 hover:text-gray-900 flex items-center"
            >
              <svg 
                className="w-5 h-5 mr-1" 
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
            <div className="flex space-x-4">
              <div className={`text-lg font-bold ${currentStep === 'current-emotion' ? 'text-primary' : 'text-gray-300'}`}>P</div>
              <div className={`text-lg font-bold ${currentStep === 'desired-emotion' ? 'text-primary' : 'text-gray-300'}`}>A</div>
              <div className={`text-lg font-bold ${currentStep === 'insight' ? 'text-primary' : 'text-gray-300'}`}>I</div>
              <div className={`text-lg font-bold ${currentStep === 'next' ? 'text-primary' : 'text-gray-300'}`}>N</div>
            </div>
            <div className="w-12"></div> {/* Spacer for alignment */}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
