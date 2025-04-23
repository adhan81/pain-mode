import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { DetailedIntervention } from './DetailedIntervention';
import { Emotion } from '../../../data/emotions';
import { desiredEmotions } from '../../../data/emotions';
import { getAIResponse } from '../../../services/openai';
import Interventions from './Interventions';

interface NextStepProps {
  fromEmotion: Emotion;
  toEmotion: Emotion;
  onBack?: () => void;
  onComplete: () => void;
  showInterventions: boolean;
}

export type InterventionType = 'physical' | 'mental' | 'visual' | 'meditation' | 'breathing';

export interface Intervention {
  id: string;
  type: InterventionType;
  title: string;
  description: string;
  icon: 'wind' | 'heart' | 'anchor' | 'book' | 'video';
  suitableFor: {
    from: string[];
    to: string[];
  };
  isDetailed?: boolean;
  duration?: number;
  steps?: string[];
  liked?: boolean;
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
  },
  {
    id: '4',
    type: 'physical',
    title: 'Energy Release',
    description: 'A brief physical practice to release stuck energy.',
    icon: 'wind',
    isDetailed: true,
    duration: 1,
    steps: [
      'Stand up and shake out your hands',
      'Roll your shoulders back and forth',
      'Take 3 deep breaths with strong exhales',
      'Gently tap your body from head to toe'
    ],
    suitableFor: {
      from: ['angry', 'frustrated', 'irritated', 'tense', 'stressed'],
      to: ['energized', 'playful', 'confident', 'calm']
    }
  },
  {
    id: '5',
    type: 'mental',
    title: 'Quick Grounding',
    description: 'A rapid technique to feel more present and centered.',
    icon: 'book',
    isDetailed: true,
    duration: 1,
    steps: [
      'Name 3 things you can see',
      'Name 2 things you can hear',
      'Name 1 thing you can feel',
      'Take a deep centering breath'
    ],
    suitableFor: {
      from: ['anxious', 'scattered', 'overwhelmed', 'disconnected'],
      to: ['present', 'grounded', 'energized', 'focused']
    }
  },
  {
    id: '6',
    type: 'meditation',
    title: 'Heart Opening',
    description: 'A gentle practice to open to positive emotions.',
    icon: 'heart',
    isDetailed: true,
    duration: 1,
    steps: [
      'Place your hand on your heart',
      'Feel its steady rhythm',
      'Imagine warmth flowing from your hand',
      'Take 3 heart-opening breaths'
    ],
    suitableFor: {
      from: ['numb', 'disconnected', 'empty', 'sad', 'hopeless'],
      to: ['compassionate', 'connected', 'peaceful', 'hopeful']
    }
  },
  {
    id: '7',
    type: 'mental',
    title: 'Tension Release',
    description: 'Quick progressive relaxation for immediate relief.',
    icon: 'wind',
    isDetailed: true,
    duration: 1,
    steps: [
      'Tighten all muscles for 5 seconds',
      'Release and feel the difference',
      'Repeat with upper body',
      'Repeat with lower body',
      'Final full-body release'
    ],
    suitableFor: {
      from: ['tense', 'stressed', 'anxious', 'frustrated', 'irritated'],
      to: ['relaxed', 'calm', 'energized', 'peaceful']
    }
  },
  {
    id: '8',
    type: 'mental',
    title: 'Self-Compassion Pause',
    description: 'A brief moment of kindness for yourself.',
    icon: 'heart',
    isDetailed: true,
    duration: 1,
    steps: [
      'Acknowledge your difficulty',
      'Remember others feel this too',
      'Send yourself understanding',
      'Take a self-compassion breath'
    ],
    suitableFor: {
      from: ['guilty', 'ashamed', 'self-critical', 'sad', 'hopeless'],
      to: ['content', 'peaceful', 'safe', 'hopeful']
    }
  },
  {
    id: '9',
    type: 'mental',
    title: 'Existential Kink',
    description: 'A playful practice to transform shame through radical acceptance.',
    icon: 'heart',
    isDetailed: true,
    duration: 1,
    steps: [
      'Notice the shame without judgment',
      'Imagine it as a character in a story',
      'Give it a silly name and voice',
      'Thank it for trying to protect you',
      'Let it transform into curiosity'
    ],
    suitableFor: {
      from: ['guilty', 'ashamed', 'self-critical', 'embarrassed'],
      to: ['playful', 'curious', 'accepting', 'empowered']
    }
  },
  {
    id: '10',
    type: 'breathing',
    title: 'Wim Hof Breathing',
    description: 'A powerful breathing technique to boost energy and clarity.',
    icon: 'wind',
    isDetailed: true,
    duration: 1,
    steps: [
      'Take 30 deep, fast breaths',
      'Hold your breath after the last exhale',
      'Take a deep breath and hold for 15 seconds',
      'Repeat 2 more times',
      'Feel the energy flowing through you'
    ],
    suitableFor: {
      from: ['tired', 'numb', 'disconnected', 'stuck'],
      to: ['energized', 'alive', 'focused', 'present']
    }
  },
  {
    id: '11',
    type: 'mental',
    title: 'Power Pose',
    description: 'A quick body language technique to boost confidence.',
    icon: 'anchor',
    isDetailed: true,
    duration: 1,
    steps: [
      'Stand with feet shoulder-width apart',
      'Place hands on hips with elbows out',
      'Lift your chin slightly',
      'Take 3 deep breaths',
      'Feel your power growing'
    ],
    suitableFor: {
      from: ['angry', 'frustrated', 'anxious', 'nervous'],
      to: ['confident', 'empowered', 'strong', 'capable']
    }
  },
  {
    id: '12',
    type: 'breathing',
    title: 'Victory Breath',
    description: 'A breathing technique to channel anger into confidence.',
    icon: 'wind',
    isDetailed: true,
    duration: 2,
    steps: [
      'Take a deep breath in through your nose',
      'Hold for 3 seconds',
      'Exhale forcefully through your mouth with a "HA" sound',
      'Repeat 5 times, getting louder each time',
      'End with a triumphant pose'
    ],
    suitableFor: {
      from: ['angry', 'frustrated', 'irritated'],
      to: ['confident', 'empowered', 'strong']
    }
  }
];

type ConversationStep = 'initial' | 'why' | 'insight' | 'intervention';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const NextStep: React.FC<NextStepProps> = ({ fromEmotion, toEmotion, onBack, onComplete, showInterventions: initialShowInterventions }) => {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showInterventions, setShowInterventions] = useState(initialShowInterventions);
  const [showInterventionButton, setShowInterventionButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Update showInterventions when the prop changes
  useEffect(() => {
    setShowInterventions(initialShowInterventions);
  }, [initialShowInterventions]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  // Initialize conversation
  useEffect(() => {
    const initialMessage: Message = {
      role: 'user',
      content: `I'm feeling ${fromEmotion.name.toLowerCase()}.`
    };
    
    setConversation([initialMessage]);
    
    const getInitialResponse = async () => {
      setIsLoading(true);
      try {
        const response = await getAIResponse([initialMessage], fromEmotion, toEmotion);
        const assistantMessage: Message = {
          role: 'assistant',
          content: response.message
        };
        setConversation([initialMessage, assistantMessage]);
      } catch (error) {
        console.error('Error getting initial AI response:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    getInitialResponse();
  }, []);

  const handleSendMessage = () => {
    if (!userInput.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: userInput.trim()
    };

    setConversation(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    // Get AI response
    const getAIResponseAsync = async () => {
      try {
        const response = await getAIResponse([...conversation, userMessage], fromEmotion, toEmotion);
        const assistantMessage: Message = {
          role: 'assistant',
          content: response.message
        };
        setConversation(prev => [...prev, assistantMessage]);
        
        // Show intervention button after the first AI response to user input
        if (conversation.length >= 2) {
          setShowInterventionButton(true);
        }
      } catch (error) {
        console.error('Error getting AI response:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getAIResponseAsync();
  };

  const handleInterventionClick = () => {
    onComplete();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleBack = () => {
    setShowInterventions(false);
  };

  if (showInterventions) {
    return (
      <Interventions
        fromEmotion={fromEmotion}
        toEmotion={toEmotion}
        onBack={handleBack}
        onComplete={onComplete}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Chat Interface */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-600">Moving toward:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${toEmotion.color}`}>
              {toEmotion.name}
            </span>
          </div>
          <div className="space-y-4">
            {conversation.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 rounded-lg p-3">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Intervention Button */}
        {showInterventionButton && (
          <div className="mt-4">
            <button
              onClick={handleInterventionClick}
              className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Start Intervention
            </button>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !userInput.trim()}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default NextStep;