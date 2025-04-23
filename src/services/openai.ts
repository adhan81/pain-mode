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
      3. Keep your response under 75 words
      4. Be warm and empathetic
      5. Don't provide advice or solutions yet - just offer insight`;
    } else if (step === 'insight') {
      systemMessage = `You are a compassionate emotional support assistant. The user is feeling ${fromEmotion.name.toLowerCase()} and wants to feel more ${toEmotion.name.toLowerCase()}. 
      Your role is to:
      1. Acknowledge their response to your insight
      2. Suggest that a guided intervention might help them feel more ${toEmotion.name.toLowerCase()}
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
      "It sounds like you're dealing with a lot of uncertainty right now. Anxiety often comes from our minds trying to protect us from potential threats, even when those threats aren't immediate. What specific situation is triggering this anxiety?",
      "When we feel anxious, our bodies go into fight-or-flight mode, which can make everything feel more intense. Have you noticed any physical sensations along with your anxiety?",
      "Sometimes anxiety can make us feel like we need to solve everything at once. What's one small thing you could focus on right now that might help you feel more in control?"
    ],
    angry: [
      "Anger is a powerful emotion that often masks deeper feelings. What triggered this anger? Sometimes when we explore what's beneath the surface, we find that we're actually feeling hurt, scared, or frustrated in a different way.",
      "Your anger is valid - it's telling you that something matters to you. What boundary or value do you feel has been crossed? Understanding this can help you process your feelings constructively.",
      "When we're angry, it can be hard to see other perspectives. What would help you feel heard in this situation without escalating the conflict?"
    ],
    sad: [
      "Sadness is a natural part of being human. What's making you feel this way? Sometimes when we give ourselves permission to feel sad and talk about why, we can find glimmers of hope in unexpected places.",
      "It's okay to feel sad. What's weighing on your heart right now? Sometimes simply acknowledging our feelings and sharing them can bring a sense of peace.",
      "When we're sad, it can feel like that's all there is. What small things in your life right now can you appreciate, even alongside this sadness?"
    ],
    overwhelmed: [
      "Feeling overwhelmed can make everything seem too big to handle. What's the most pressing thing on your mind right now? Breaking things down into smaller steps can help us feel more focused and capable.",
      "When we're overwhelmed, it's like too many tabs are open in our minds. What's the main source of this overwhelm? Sometimes identifying the root cause can help us find calm in knowing what to address first.",
      "Overwhelm can make us feel disconnected from ourselves. What's one small thing you can do right now to feel more present? Even taking a deep breath or feeling your feet on the ground can help."
    ],
    stuck: [
      "Feeling stuck often comes from a lack of movement or clarity. What's making you feel this way? Sometimes even small actions can create momentum and help us feel more energized.",
      "Being stuck can feel permanent, but it's often temporary. What would feeling unstuck look like for you? Imagining this can help us find hope and direction.",
      "Sometimes being stuck is a sign we need a fresh perspective. What's one thing you haven't tried yet? Exploring new approaches can spark inspiration."
    ]
  };
  
  // Get a random response based on the emotion
  const emotionResponses = responses[fromEmotion.name.toLowerCase() as keyof typeof responses] || [
    "Thank you for sharing that. It sounds like you're going through a challenging time. What's one small step you could take toward feeling more " + toEmotion.name.toLowerCase() + "?",
    "I hear you. Emotions can be complex and sometimes confusing. What would help you feel more " + toEmotion.name.toLowerCase() + " right now?",
    "It sounds like you're dealing with a lot. What's one thing that usually helps you when you're feeling this way?"
  ];
  
  return {
    message: emotionResponses[Math.floor(Math.random() * emotionResponses.length)]
  };
} 