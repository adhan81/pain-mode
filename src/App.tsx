import React, { useState } from 'react'
import { WelcomeScreen } from './components/WelcomeScreen'
import { EmotionPills } from './components/EmotionPills'
import { BreathingExercise } from './components/BreathingExercise'
import { NextStep } from './components/PAIN/Next/NextStep'
import { Emotion } from './data/emotions'
import './App.css'

type Step = 'welcome' | 'breathing' | 'emotion' | 'next'

function App() {
  const [currentStep, setCurrentStep] = useState<Step>('welcome')
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null)
  const [desiredEmotion, setDesiredEmotion] = useState<Emotion | null>(null)

  const handleStart = () => {
    setCurrentStep('breathing')
  }

  const handleBreathingComplete = () => {
    setCurrentStep('emotion')
  }

  const handleEmotionSelected = (emotion: Emotion) => {
    setSelectedEmotion(emotion)
    setCurrentStep('next')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto pt-8 pb-8">
        <div className="bg-white rounded-2xl shadow-lg">
          {currentStep === 'welcome' && (
            <WelcomeScreen onStart={handleStart} />
          )}
          
          {currentStep === 'breathing' && (
            <BreathingExercise onComplete={handleBreathingComplete} />
          )}
          
          {currentStep === 'emotion' && (
            <EmotionPills
              onSelect={handleEmotionSelected}
              selectedEmotion={selectedEmotion}
              desiredEmotion={desiredEmotion}
            />
          )}
          
          {currentStep === 'next' && selectedEmotion && (
            <NextStep
              emotion={selectedEmotion}
              onComplete={() => setCurrentStep('welcome')}
            />
          )}
        </div>
        
        {currentStep !== 'welcome' && (
          <div className="mt-4 flex justify-between items-center px-4">
            <button
              onClick={() => setCurrentStep('welcome')}
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
              <div className={`text-lg font-bold ${currentStep === 'emotion' ? 'text-primary' : 'text-gray-300'}`}>P</div>
              <div className={`text-lg font-bold ${currentStep === 'emotion' ? 'text-primary' : 'text-gray-300'}`}>A</div>
              <div className={`text-lg font-bold ${currentStep === 'emotion' ? 'text-primary' : 'text-gray-300'}`}>I</div>
              <div className={`text-lg font-bold ${currentStep === 'emotion' ? 'text-primary' : 'text-gray-300'}`}>N</div>
            </div>
            <div className="w-12"></div> {/* Spacer for alignment */}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
