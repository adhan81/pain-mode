export interface Emotion {
  name: string;
  sentenceForm?: string;
  color: 'amber' | 'blue' | 'red' | 'green' | 'purple' | 'gray' | 'orange';
  intensity?: 1 | 2 | 3;
}

export const emotions: Emotion[] = [
  {
    name: 'Anxious',
    sentenceForm: 'anxiety',
    color: 'red'
  },
  {
    name: 'Angry',
    sentenceForm: 'anger',
    color: 'red'
  },
  {
    name: 'Sad',
    sentenceForm: 'sadness',
    color: 'blue'
  },
  {
    name: 'Frustrated',
    sentenceForm: 'frustration',
    color: 'red'
  },
  {
    name: 'Overwhelmed',
    sentenceForm: 'overwhelm',
    color: 'purple'
  },
  {
    name: 'Stressed',
    sentenceForm: 'stress',
    color: 'red'
  }
];

// Challenging emotions for the Presence screen
export const challengingEmotions: Emotion[] = [
  { name: 'Anxious', sentenceForm: 'anxiety', color: 'red' },
  { name: 'Overwhelmed', sentenceForm: 'overwhelm', color: 'purple' },
  { name: 'Stressed', sentenceForm: 'stress', color: 'red' },
  { name: 'Angry', sentenceForm: 'anger', color: 'red' },
  { name: 'Sad', sentenceForm: 'sadness', color: 'blue' },
  { name: 'Frustrated', sentenceForm: 'frustration', color: 'red' },
  { name: 'Guilty', color: 'gray' },
  { name: 'Ashamed', color: 'gray' },
  { name: 'Scared', color: 'purple' },
  { name: 'Disconnected', color: 'gray' },
  { name: 'Numb', color: 'gray' },
  { name: 'Empty', color: 'gray' },
  { name: 'Stuck', color: 'gray' },
  { name: 'Restless', color: 'red' },
  { name: 'Scattered', color: 'red' },
  { name: 'Tense', color: 'red' },
  { name: 'Irritated', color: 'red' },
  { name: 'Self-critical', color: 'gray' },
  { name: 'Embarrassed', color: 'purple' },
  { name: 'Hopeless', color: 'gray' },
  { name: 'Nervous', color: 'red' },
  { name: 'Tired', color: 'gray' }
];

// Desired emotions for the Next screen
export const desiredEmotions: Emotion[] = [
  {
    name: 'Calm',
    color: 'blue'
  },
  {
    name: 'Peaceful',
    color: 'green'
  },
  {
    name: 'Hopeful',
    color: 'amber'
  },
  {
    name: 'Grateful',
    color: 'purple'
  },
  {
    name: 'Present',
    color: 'blue'
  },
  {
    name: 'Connected',
    color: 'purple'
  },
  { name: 'Energized', color: 'amber' },
  { name: 'Focused', color: 'blue' },
  { name: 'Confident', color: 'green' },
  { name: 'Empowered', color: 'red' },
  { name: 'Strong', color: 'red' },
  { name: 'Capable', color: 'green' },
  { name: 'Content', color: 'blue' },
  { name: 'Safe', color: 'green' },
  { name: 'Playful', color: 'purple' },
  { name: 'Curious', color: 'purple' },
  { name: 'Accepting', color: 'green' },
  { name: 'Compassionate', color: 'purple' },
  { name: 'Alive', color: 'red' },
  { name: 'Disciplined', color: 'blue' },
  { name: 'Organized', color: 'blue' },
  { name: 'Productive', color: 'green' },
  { name: 'Determined', color: 'red' },
  { name: 'Resilient', color: 'amber' },
  { name: 'Proud', color: 'amber' }
]; 