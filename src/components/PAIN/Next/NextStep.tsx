import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { DetailedIntervention } from './DetailedIntervention';
import { Emotion } from '../../../data/emotions';
import { desiredEmotions } from '../../../data/emotions';
import { getAIResponse } from '../../../services/openai';

interface NextStepProps {
  fromEmotion: Emotion;
  toEmotion: Emotion;
  onBack?: () => void;
  onComplete: () => void;
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

const NextStep: React.FC<NextStepProps> = ({ fromEmotion, toEmotion, onBack, onComplete }) => {
  const [conversationStep, setConversationStep] = useState<ConversationStep>('initial');
  const [conversation, setConversation] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showIntervention, setShowIntervention] = useState(false);
  const [showInterventionButton, setShowInterventionButton] = useState(false);
  const [showInterventionSelection, setShowInterventionSelection] = useState(false);
  const [currentInterventionIndex, setCurrentInterventionIndex] = useState(0);
  const [currentIntervention, setCurrentIntervention] = useState<{
    title: string;
    type: 'physical' | 'mental' | 'visual' | 'meditation' | 'breathing';
    duration: number;
    steps: string[];
  }>({
    title: 'Guided Breathing Exercise',
    type: 'breathing',
    duration: 1,
    steps: [
      'Find a comfortable position and close your eyes',
      'Take a deep breath in through your nose for 4 counts',
      'Hold your breath for 4 counts',
      'Slowly exhale through your mouth for 6 counts',
      'Repeat this cycle for the duration of the exercise'
    ]
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedDesiredEmotion, setSelectedDesiredEmotion] = useState<Emotion | null>(null);
  const [inputValue, setInputValue] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  // Initialize conversation only once when component mounts
  useEffect(() => {
    // Create initial user message
    const initialMessage: Message = {
      role: 'user',
      content: `I'm feeling ${fromEmotion.name.toLowerCase()} and I want to feel more ${toEmotion.name.toLowerCase()}. Can you help me?`
    };
    
    // Set initial conversation state
    setConversation([initialMessage]);
    
    // Get AI response for initial message
    const getInitialResponse = async () => {
      setIsLoading(true);
      try {
        // Only send the initial message to the API
        const response = await getAIResponse([initialMessage], fromEmotion, toEmotion);
        
        // Add the AI response to the conversation
        const assistantMessage: Message = {
          role: 'assistant',
          content: response.message
        };
        
        // Update conversation with both messages
        setConversation([initialMessage, assistantMessage]);
      } catch (error) {
        console.error('Error getting initial AI response:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Call the function to get the initial response
    getInitialResponse();
  }, []);

  const handleAIResponse = async (userMessage: Message) => {
    // Prevent duplicate messages
    if (isLoading) return;
    
    // Check if this is a duplicate of the last user message
    const lastMessage = conversation[conversation.length - 1];
    if (lastMessage && lastMessage.role === 'user' && lastMessage.content === userMessage.content) {
      console.log('Duplicate message detected, skipping AI response');
      return;
    }
    
    setIsLoading(true);
    try {
      // Get AI response for the new message
      const response = await getAIResponse([...conversation, userMessage], fromEmotion, toEmotion);
      
      // Add the AI response to the conversation
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.message
      };
      
      // Update conversation with the new messages
      setConversation(prev => [...prev, assistantMessage]);
      
      // After the second message (user's response), show the intervention button
      if (conversation.length >= 2) {
        // Add a small delay before showing the intervention button
        setTimeout(() => {
          setShowInterventionButton(true);
          
          // Select an appropriate intervention based on the emotions
          const suitableIntervention = findSuitableIntervention(fromEmotion, toEmotion);
          if (suitableIntervention) {
            setCurrentIntervention({
              title: suitableIntervention.title,
              type: suitableIntervention.type,
              duration: suitableIntervention.duration || 1,
              steps: suitableIntervention.steps || []
            });
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      setShowIntervention(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!userInput.trim() || isLoading) return;
    
    const userMessage: Message = {
      role: 'user',
      content: userInput.trim()
    };
    
    setConversation(prev => [...prev, userMessage]);
    setUserInput('');
    handleAIResponse(userMessage);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTryIntervention = () => {
    setShowInterventionSelection(true);
  };

  // Function to shuffle to a different intervention
  const shuffleIntervention = () => {
    // Get a random index that's different from the current one
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * sampleInterventions.length);
    } while (newIndex === currentInterventionIndex && sampleInterventions.length > 1);
    
    setCurrentInterventionIndex(newIndex);
  };
  
  // Function to select the current intervention
  const handleSelectCurrentIntervention = () => {
    const intervention = sampleInterventions[currentInterventionIndex];
    setCurrentIntervention({
      title: intervention.title,
      type: intervention.type,
      duration: intervention.duration || 1,
      steps: intervention.steps || []
    });
    setShowInterventionSelection(false);
    setShowIntervention(true);
  };

  const handleInterventionComplete = () => {
    setShowIntervention(false);
    onComplete?.();
  };

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

  const handleInterventionClick = () => {
    setShowIntervention(true);
  };

  const handleDesiredEmotionClick = (emotion: Emotion) => {
    setSelectedDesiredEmotion(emotion);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Desired Emotion Selection */}
        {!selectedDesiredEmotion && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">How would you like to feel?</h2>
            <div className="flex flex-wrap gap-2">
              {desiredEmotions.map((emotion) => (
                <button
                  key={emotion.name}
                  onClick={() => handleDesiredEmotionClick(emotion)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${emotion.color}`}
                >
                  {emotion.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Interface */}
        {selectedDesiredEmotion && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">Moving toward:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${selectedDesiredEmotion.color}`}>
                {selectedDesiredEmotion.name}
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
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 rounded-lg p-3">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Intervention Selection */}
        {showInterventionButton && (
          <div className="mt-4">
            <button
              onClick={handleInterventionClick}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Start Intervention
            </button>
          </div>
        )}
      </div>

      {/* Input Area */}
      {selectedDesiredEmotion && !showInterventionButton && (
        <div className="border-t border-gray-200 p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NextStep;