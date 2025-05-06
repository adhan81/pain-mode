import React, { useState, useMemo } from 'react';
import { Emotion } from '../../../data/emotions';
import { Intervention } from './NextStep';
import { DetailedIntervention } from './DetailedIntervention';

interface InterventionsProps {
  fromEmotion: Emotion;
  toEmotion: Emotion;
  onBack: () => void;
  onComplete: () => void;
}

const allInterventions: Intervention[] = [
  // Interventions for specific current emotions
  {
    id: 'shame-release',
    type: 'mental',
    title: 'Existential Kink',
    description: 'A playful practice to transform shame through radical acceptance.',
    icon: 'heart',
    isDetailed: true,
    duration: 2,
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
    id: 'anxiety-release',
    type: 'physical',
    title: 'Tension Release',
    description: 'A physical practice to release anxiety from the body.',
    icon: 'wind',
    isDetailed: true,
    duration: 2,
    steps: [
      'Tense and release each muscle group',
      'Shake out your limbs',
      'Take deep belly breaths',
      'Move your body freely',
      'Notice the release of tension'
    ],
    suitableFor: {
      from: ['anxious', 'nervous', 'stressed', 'tense'],
      to: ['calm', 'peaceful', 'present']
    }
  },
  {
    id: 'sadness-release',
    type: 'mental',
    title: 'Tears of Release',
    description: 'A gentle practice to honor and release sadness.',
    icon: 'heart',
    isDetailed: true,
    duration: 3,
    steps: [
      'Find a safe, private space',
      'Place a hand on your heart',
      'Allow any tears to flow',
      'Breathe deeply through the emotion',
      'Notice the space that opens up'
    ],
    suitableFor: {
      from: ['sad', 'empty', 'numb', 'disconnected'],
      to: ['connected', 'compassionate', 'present']
    }
  },
  {
    id: 'anger-release',
    type: 'physical',
    title: 'Fire Release',
    description: 'A powerful practice to transform anger into energy.',
    icon: 'heart',
    isDetailed: true,
    duration: 2,
    steps: [
      'Stand in a strong stance',
      'Clench and release your fists',
      'Make a sound with each release',
      'Visualize the anger as fire',
      'Transform it into determination'
    ],
    suitableFor: {
      from: ['angry', 'frustrated', 'irritated'],
      to: ['determined', 'empowered', 'strong']
    }
  },
  {
    id: 'overwhelm-release',
    type: 'mental',
    title: 'Container Practice',
    description: 'A visualization to contain and organize overwhelming feelings.',
    icon: 'book',
    isDetailed: true,
    duration: 2,
    steps: [
      'Imagine a container of your choice',
      'Place each overwhelming thought/feeling inside',
      'Organize them however feels right',
      'Close the container securely',
      'Know you can return to it later'
    ],
    suitableFor: {
      from: ['overwhelmed', 'scattered', 'stressed'],
      to: ['organized', 'focused', 'capable']
    }
  },
  {
    id: 'fear-release',
    type: 'physical',
    title: 'Safe Space Visualization',
    description: 'A practice to create an inner sanctuary of safety.',
    icon: 'heart',
    isDetailed: true,
    duration: 3,
    steps: [
      'Close your eyes and imagine a safe place',
      'Notice all the details of this space',
      'Feel the safety in your body',
      'Create a protective boundary',
      'Know you can return here anytime'
    ],
    suitableFor: {
      from: ['scared', 'nervous', 'anxious'],
      to: ['safe', 'calm', 'peaceful']
    }
  },
  {
    id: 'numbness-release',
    type: 'physical',
    title: 'Sensation Exploration',
    description: 'A gentle practice to reconnect with physical sensations.',
    icon: 'heart',
    isDetailed: true,
    duration: 2,
    steps: [
      'Start with your hands',
      'Notice temperature, texture, pressure',
      'Move to different body parts',
      'Describe each sensation',
      'Notice any emotional responses'
    ],
    suitableFor: {
      from: ['numb', 'disconnected', 'empty'],
      to: ['present', 'alive', 'connected']
    }
  },

  // Interventions for specific desired emotions
  {
    id: 'confidence-building',
    type: 'physical',
    title: 'Power Pose',
    description: 'A body language technique to embody confidence.',
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
      from: ['anxious', 'nervous', 'scared', 'disconnected'],
      to: ['confident', 'empowered', 'strong', 'capable']
    }
  },
  {
    id: 'peace-cultivation',
    type: 'meditation',
    title: 'Peaceful Presence',
    description: 'A mindfulness practice to cultivate inner peace.',
    icon: 'book',
    isDetailed: true,
    duration: 3,
    steps: [
      'Find a comfortable seated position',
      'Close your eyes and breathe deeply',
      'Imagine a peaceful scene',
      'Feel the peace in your body',
      'Carry this peace with you'
    ],
    suitableFor: {
      from: ['anxious', 'stressed', 'overwhelmed'],
      to: ['peaceful', 'calm', 'present']
    }
  },
  {
    id: 'joy-activation',
    type: 'physical',
    title: 'Joyful Movement',
    description: 'A playful practice to activate joy.',
    icon: 'heart',
    isDetailed: true,
    duration: 2,
    steps: [
      'Put on uplifting music',
      'Move your body freely',
      'Smile and laugh',
      'Feel the joy in your cells',
      'Let it spread through you'
    ],
    suitableFor: {
      from: ['sad', 'numb', 'disconnected'],
      to: ['joyful', 'playful', 'alive']
    }
  },
  {
    id: 'pride-cultivation',
    type: 'mental',
    title: 'Accomplishment Reflection',
    description: 'A practice to cultivate pride in your achievements.',
    icon: 'heart',
    isDetailed: true,
    duration: 2,
    steps: [
      'List 3 things you have accomplished',
      'Feel the pride in your body',
      'Acknowledge your effort',
      'Celebrate your growth',
      'Carry this pride forward'
    ],
    suitableFor: {
      from: ['self-critical', 'ashamed', 'disconnected'],
      to: ['proud', 'confident', 'empowered']
    }
  },
  {
    id: 'gratitude-cultivation',
    type: 'mental',
    title: 'Gratitude Practice',
    description: 'A practice to cultivate gratitude and appreciation.',
    icon: 'heart',
    isDetailed: true,
    duration: 2,
    steps: [
      'List 5 things you are grateful for',
      'Feel the gratitude in your body',
      'Express thanks silently or aloud',
      'Notice how it shifts your perspective',
      'Carry this gratitude with you'
    ],
    suitableFor: {
      from: ['sad', 'empty', 'disconnected'],
      to: ['grateful', 'connected', 'peaceful']
    }
  },
  {
    id: 'focus-cultivation',
    type: 'mental',
    title: 'Single-Pointed Focus',
    description: 'A practice to cultivate focused attention.',
    icon: 'book',
    isDetailed: true,
    duration: 2,
    steps: [
      'Choose a single point of focus',
      'Bring your attention to it fully',
      'When your mind wanders, gently return',
      'Notice the quality of your focus',
      'Carry this focus into your day'
    ],
    suitableFor: {
      from: ['scattered', 'overwhelmed', 'anxious'],
      to: ['focused', 'present', 'capable']
    }
  },
  {
    id: 'compassion-cultivation',
    type: 'mental',
    title: 'Loving-Kindness Practice',
    description: 'A practice to cultivate compassion for self and others.',
    icon: 'heart',
    isDetailed: true,
    duration: 3,
    steps: [
      'Start with yourself',
      'Repeat kind phrases silently',
      'Extend to others',
      'Feel the warmth of compassion',
      'Let it fill your heart'
    ],
    suitableFor: {
      from: ['angry', 'frustrated', 'disconnected'],
      to: ['compassionate', 'connected', 'peaceful']
    }
  },

  // General emotional regulation practices
  {
    id: 'grounding',
    type: 'physical',
    title: 'Grounding Practice',
    description: 'A quick physical practice to anchor yourself in the present moment.',
    icon: 'anchor',
    isDetailed: true,
    duration: 1,
    steps: [
      'Stand with feet shoulder-width apart',
      'Press your feet firmly into the ground',
      'Notice 5 things you can see around you',
      'Notice 4 things you can touch or feel',
      'Notice 3 things you can hear',
      'Take 2 deep breaths',
      'Notice 1 thing you can smell or taste'
    ],
    suitableFor: {
      from: ['anxious', 'angry', 'sad', 'frustrated', 'overwhelmed', 'stressed', 'guilty', 'ashamed', 'scared', 'disconnected', 'numb', 'empty', 'stuck', 'restless', 'scattered', 'tense', 'irritated', 'self-critical', 'embarrassed', 'hopeless', 'nervous', 'tired'],
      to: ['calm', 'peaceful', 'hopeful', 'grateful', 'present', 'connected', 'energized', 'focused', 'confident', 'empowered', 'strong', 'capable', 'content', 'safe', 'playful', 'curious', 'accepting', 'compassionate', 'alive', 'disciplined', 'organized', 'productive', 'determined', 'resilient', 'proud']
    }
  },
  {
    id: 'breath-work',
    type: 'physical',
    title: 'Box Breathing',
    description: 'A simple breathing technique to regulate your nervous system.',
    icon: 'wind',
    isDetailed: true,
    duration: 1,
    steps: [
      'Inhale for 4 counts',
      'Hold for 4 counts',
      'Exhale for 4 counts',
      'Hold for 4 counts',
      'Repeat 4 times'
    ],
    suitableFor: {
      from: ['anxious', 'angry', 'sad', 'frustrated', 'overwhelmed', 'stressed', 'guilty', 'ashamed', 'scared', 'disconnected', 'numb', 'empty', 'stuck', 'restless', 'scattered', 'tense', 'irritated', 'self-critical', 'embarrassed', 'hopeless', 'nervous', 'tired'],
      to: ['calm', 'peaceful', 'hopeful', 'grateful', 'present', 'connected', 'energized', 'focused', 'confident', 'empowered', 'strong', 'capable', 'content', 'safe', 'playful', 'curious', 'accepting', 'compassionate', 'alive', 'disciplined', 'organized', 'productive', 'determined', 'resilient', 'proud']
    }
  },
  {
    id: 'memory-palace',
    type: 'mental',
    title: 'Memory Palace of Joy',
    description: 'Create a detailed mental space filled with happy memories and positive emotions.',
    icon: 'book',
    isDetailed: true,
    duration: 3,
    steps: [
      'Close your eyes and imagine a beautiful space',
      'Fill it with objects that bring you joy',
      'Add details like colors, textures, and scents',
      'Place happy memories in different rooms',
      'Know you can visit this place anytime'
    ],
    suitableFor: {
      from: ['sad', 'numb', 'disconnected', 'empty', 'hopeless'],
      to: ['joyful', 'connected', 'alive', 'peaceful', 'hopeful']
    }
  },
  {
    id: 'gratitude-letter',
    type: 'mental',
    title: 'Gratitude Letter',
    description: 'Write a letter expressing gratitude to someone who has positively impacted your life.',
    icon: 'book',
    isDetailed: true,
    duration: 4,
    steps: [
      'Choose someone you feel grateful for',
      'Write about specific ways they helped you',
      'Describe how their actions affected you',
      'Express your appreciation in detail',
      'Read the letter to yourself'
    ],
    suitableFor: {
      from: ['sad', 'empty', 'disconnected', 'numb', 'self-critical'],
      to: ['grateful', 'connected', 'compassionate', 'peaceful', 'hopeful']
    }
  },
  {
    id: 'linguini-visualization',
    type: 'mental',
    title: 'Transformative Linguini',
    description: 'A playful visualization exercise to practice acceptance of change.',
    icon: 'heart',
    isDetailed: true,
    duration: 3,
    steps: [
      'Imagine a long piece of linguini',
      'Notice how the sauce changes every 10 seconds',
      'Observe your reactions to each change',
      'Practice accepting each new flavor',
      'Notice how change can be delicious'
    ],
    suitableFor: {
      from: ['anxious', 'stressed', 'overwhelmed', 'stuck', 'nervous'],
      to: ['playful', 'accepting', 'present', 'curious', 'peaceful']
    }
  }
];

const Interventions: React.FC<InterventionsProps> = ({ fromEmotion, toEmotion, onBack, onComplete }) => {
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null);

  // Find interventions that match the emotion transition
  const matchingInterventions = useMemo(() => {
    const fromEmotionName = fromEmotion.name.toLowerCase();
    const toEmotionName = toEmotion.name.toLowerCase();

    // Find an intervention specifically for the current emotion
    const fromEmotionIntervention = allInterventions.find(intervention => 
      intervention.suitableFor.from.includes(fromEmotionName)
    );

    // Find an intervention specifically for the desired emotion
    const toEmotionIntervention = allInterventions.find(intervention => 
      intervention.suitableFor.to.includes(toEmotionName)
    );

    // Get a general emotional regulation practice
    const generalIntervention = allInterventions.find(intervention => 
      intervention.id === 'grounding' || intervention.id === 'breath-work'
    );

    // Combine the interventions, removing duplicates and undefined values
    const interventions: Intervention[] = [];
    const seenIds = new Set<string>();

    [fromEmotionIntervention, toEmotionIntervention, generalIntervention].forEach(intervention => {
      if (intervention && !seenIds.has(intervention.id)) {
        interventions.push(intervention);
        seenIds.add(intervention.id);
      }
    });

    return interventions;
  }, [fromEmotion, toEmotion]);

  const handleInterventionSelect = (intervention: Intervention) => {
    setSelectedIntervention(intervention);
  };

  if (selectedIntervention) {
    return (
      <DetailedIntervention
        title={selectedIntervention.title}
        type={selectedIntervention.type}
        duration={selectedIntervention.duration || 1}
        steps={selectedIntervention.steps || []}
        onBack={() => setSelectedIntervention(null)}
        onComplete={onComplete}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="text-primary hover:text-primary-dark"
          >
            Back
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-600">Moving toward:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${toEmotion.color}`}>
              {toEmotion.name}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {matchingInterventions.map((intervention) => (
            <div
              key={intervention.id}
              className="border rounded-lg p-4 hover:border-primary cursor-pointer"
              onClick={() => handleInterventionSelect(intervention)}
            >
              <h4 className="font-medium">{intervention.title}</h4>
              <p className="text-sm text-gray-600">{intervention.description}</p>
              <p className="text-xs text-gray-500 mt-2">
                Duration: {intervention.duration} minute{intervention.duration !== 1 ? 's' : ''}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Interventions; 