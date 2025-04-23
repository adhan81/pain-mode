import { Emotion } from '../components/EmotionPills';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
  message: string;
  error?: string;
}

// Get the API key from environment variables
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const API_URL = 'https://api.openai.com/v1/chat/completions';

// For development/testing when API key is not available
const SIMULATE_RESPONSES = !OPENAI_API_KEY;

export async function getAIResponse(
  messages: Message[],
  fromEmotion: Emotion,
  toEmotion: Emotion
): Promise<OpenAIResponse> {
  // If no API key is available, use simulated responses
  if (SIMULATE_RESPONSES) {
    console.log('Using simulated responses (no API key available)');
    return generateSimulatedResponse(fromEmotion, toEmotion, messages[messages.length - 1].content);
  }

  try {
    console.log('Sending request to OpenAI API...');
    
    // Determine the conversation step based on message count
    const step = messages.length <= 2 ? 'initial' : 
                messages.length <= 4 ? 'why' : 
                messages.length <= 6 ? 'insight' : 'intervention';
    
    // Create a system message based on the conversation step
    let systemMessage = '';
    
    if (step === 'initial') {
      systemMessage = `You are a compassionate emotional support assistant. The user is feeling ${fromEmotion.name.toLowerCase()} and wants to feel more ${toEmotion.name.toLowerCase()}. 
      Your role is to:
      1. Acknowledge their feelings briefly
      2. Ask a single, focused question about why they're feeling this way
      3. Keep your response under 50 words
      4. Be warm and empathetic
      5. Don't provide advice or solutions yet - just listen and ask about the cause`;
    } else if (step === 'why') {
      systemMessage = `You are a compassionate emotional support assistant. The user is feeling ${fromEmotion.name.toLowerCase()} and wants to feel more ${toEmotion.name.toLowerCase()}. 
      Your role is to:
      1. Acknowledge what they've shared about why they're feeling this way
      2. Provide a brief insight (1-2 sentences) about their emotional state
      3. Suggest that a guided intervention might help them feel more ${toEmotion.name.toLowerCase()}
      4. Keep your response under 100 words
      5. Be warm and encouraging
      6. End with the question: "Would you like to take one small step together towards feeling more ${toEmotion.name.toLowerCase()}?"`;
    } else if (step === 'insight') {
      systemMessage = `You are a compassionate emotional support assistant. The user is feeling ${fromEmotion.name.toLowerCase()} and wants to feel more ${toEmotion.name.toLowerCase()}. 
      Your role is to:
      1. Acknowledge their response
      2. Encourage them to try a guided intervention
      3. Keep your response under 50 words
      4. Be warm and encouraging
      5. Guide them toward trying an intervention`;
    } else {
      systemMessage = `You are a compassionate emotional support assistant. The user is feeling ${fromEmotion.name.toLowerCase()} and wants to feel more ${toEmotion.name.toLowerCase()}. 
      Your role is to:
      1. Acknowledge their response
      2. Encourage them to try a guided intervention
      3. Keep your response under 50 words
      4. Be warm and encouraging
      5. Guide them toward trying an intervention`;
    }
    
    // Check for duplicate messages
    const lastUserMessage = messages[messages.length - 1].content;
    const previousUserMessage = messages.length > 2 ? messages[messages.length - 3].content : '';
    
    if (lastUserMessage === previousUserMessage) {
      return {
        message: "I understand you're feeling this way. Could you tell me more about what triggered these feelings?"
      };
    }
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: systemMessage
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 150
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Received response from OpenAI API');
    return {
      message: data.choices[0].message.content.trim()
    };
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return {
      message: "I apologize, but I'm having trouble responding right now. Would you like to try one of our guided interventions instead?",
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Simulated responses for when API key is not available
function generateSimulatedResponse(fromEmotion: Emotion, toEmotion: Emotion, userInput: string): OpenAIResponse {
  console.log('Generating simulated response');
  
  const responses = {
    anxious: [
      "It sounds like you're dealing with a lot of uncertainty right now. Anxiety often comes from our minds trying to protect us from potential threats, even when those threats aren't immediate. Would you like to take one small step together towards feeling more calm?",
      "When we feel anxious, our bodies go into fight-or-flight mode, which can make everything feel more intense. Would you like to take one small step together towards feeling more grounded?",
      "Sometimes anxiety can make us feel like we need to solve everything at once. Would you like to take one small step together towards feeling more in control?"
    ],
    angry: [
      "Anger is a powerful emotion that often masks deeper feelings. Would you like to take one small step together towards feeling more peaceful?",
      "Your anger is valid - it's telling you that something matters to you. Would you like to take one small step together towards feeling more centered?",
      "When we're angry, it can be hard to see other perspectives. Would you like to take one small step together towards feeling more balanced?"
    ],
    sad: [
      "Sadness is a natural part of being human. Would you like to take one small step together towards feeling more hopeful?",
      "It's okay to feel sad. Would you like to take one small step together towards feeling more at peace?",
      "When we're sad, it can feel like that's all there is. Would you like to take one small step together towards feeling more uplifted?"
    ],
    overwhelmed: [
      "Feeling overwhelmed can make everything seem too big to handle. Would you like to take one small step together towards feeling more focused?",
      "When we're overwhelmed, it's like too many tabs are open in our minds. Would you like to take one small step together towards feeling more clear?",
      "Overwhelm can make us feel disconnected from ourselves. Would you like to take one small step together towards feeling more present?"
    ],
    stuck: [
      "Feeling stuck often comes from a lack of movement or clarity. Would you like to take one small step together towards feeling more energized?",
      "Being stuck can feel permanent, but it's often temporary. Would you like to take one small step together towards feeling more inspired?",
      "Sometimes being stuck is a sign we need a fresh perspective. Would you like to take one small step together towards feeling more motivated?"
    ]
  };
  
  // Get a random response based on the emotion
  const emotionResponses = responses[fromEmotion.name.toLowerCase() as keyof typeof responses] || [
    "Thank you for sharing that. It sounds like you're going through a challenging time. Would you like to take one small step together towards feeling more " + toEmotion.name.toLowerCase() + "?",
    "I hear you. Emotions can be complex and sometimes confusing. Would you like to take one small step together towards feeling more " + toEmotion.name.toLowerCase() + "?",
    "It sounds like you're dealing with a lot. Would you like to take one small step together towards feeling more " + toEmotion.name.toLowerCase() + "?"
  ];
  
  return {
    message: emotionResponses[Math.floor(Math.random() * emotionResponses.length)]
  };
} 