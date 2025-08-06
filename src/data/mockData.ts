import { User, Prompt, GuidedTemplate } from '../types'

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Justin Chen',
    username: 'justin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '2',
    name: 'Amy Rodriguez',
    username: 'amy',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face&auto=format&q=80'
  },
  {
    id: '3',
    name: 'Maya Patel',
    username: 'maya',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '4',
    name: 'Piper Thompson',
    username: 'piper',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face&auto=format&q=80'
  }
]

export const mockTemplates: GuidedTemplate[] = [
  {
    id: 'morning-routine',
    title: 'Morning Routine',
    steps: [
      {
        id: 'step1',
        order: 1,
        title: 'Wake Up',
        description: 'Show us what you look like when you wake up',
        emoji: '😴',
        duration: 10,
        isOptional: false
      },
      {
        id: 'step2',
        order: 2,
        title: 'Breakfast',
        description: "What's for breakfast?",
        emoji: '🍳',
        duration: 15,
        isOptional: false
      },
      {
        id: 'step3',
        order: 3,
        title: 'OOTD',
        description: 'OOTD — let\'s see the fit!',
        emoji: '👗',
        duration: 12,
        isOptional: false
      },
      {
        id: 'step4',
        order: 4,
        title: 'Looking Forward',
        description: 'Say one thing you\'re looking forward to today',
        emoji: '💬',
        duration: 8,
        isOptional: false
      }
    ],
    estimatedDuration: 45
  },
  {
    id: 'work-day',
    title: 'Day at Work',
    steps: [
      {
        id: 'step1',
        order: 1,
        title: 'Commute',
        description: 'Show us your commute to work',
        emoji: '🚇',
        duration: 15,
        isOptional: true
      },
      {
        id: 'step2',
        order: 2,
        title: 'Workspace',
        description: 'Give us a tour of your workspace',
        emoji: '💼',
        duration: 20,
        isOptional: false
      },
      {
        id: 'step3',
        order: 3,
        title: 'Lunch Break',
        description: 'What are you having for lunch?',
        emoji: '🥪',
        duration: 12,
        isOptional: true
      },
      {
        id: 'step4',
        order: 4,
        title: 'Work Highlight',
        description: 'Share one highlight from your work day',
        emoji: '✨',
        duration: 10,
        isOptional: false
      }
    ],
    estimatedDuration: 57
  },
  {
    id: 'gym-session',
    title: 'Gym Session',
    steps: [
      {
        id: 'step1',
        order: 1,
        title: 'Pre-Workout',
        description: 'Show us your pre-workout routine',
        emoji: '💪',
        duration: 12,
        isOptional: true
      },
      {
        id: 'step2',
        order: 2,
        title: 'Workout',
        description: 'Film your main workout exercise',
        emoji: '🏋️',
        duration: 25,
        isOptional: false
      },
      {
        id: 'step3',
        order: 3,
        title: 'Post-Workout',
        description: 'How do you feel after your workout?',
        emoji: '😅',
        duration: 8,
        isOptional: false
      }
    ],
    estimatedDuration: 45
  },
  {
    id: 'night-routine',
    title: 'Night Routine',
    steps: [
      {
        id: 'step1',
        order: 1,
        title: 'Evening Wind Down',
        description: 'Show us how you start winding down for the night',
        emoji: '🌙',
        duration: 12,
        isOptional: false
      },
      {
        id: 'step2',
        order: 2,
        title: 'Skincare Routine',
        description: 'What\'s your evening skincare routine?',
        emoji: '🧴',
        duration: 15,
        isOptional: true
      },
      {
        id: 'step3',
        order: 3,
        title: 'Pajamas',
        description: 'Show us your cozy pajamas!',
        emoji: '🛏️',
        duration: 8,
        isOptional: false
      },
      {
        id: 'step4',
        order: 4,
        title: 'Bedtime Story',
        description: 'What are you reading or watching before bed?',
        emoji: '📚',
        duration: 10,
        isOptional: true
      },
      {
        id: 'step5',
        order: 5,
        title: 'Goodnight',
        description: 'Say goodnight and share one thing you\'re grateful for today',
        emoji: '😴',
        duration: 8,
        isOptional: false
      }
    ],
    estimatedDuration: 53
  }
]

export const mockPrompts: Prompt[] = [
  {
    id: '1',
    title: 'Justin wants to see your morning routine',
    description: 'Justin is curious about how you start your day!',
    fromUser: mockUsers[0],
    toUser: mockUsers[1],
    createdAt: new Date('2024-01-15T08:00:00Z'),
    expiresAt: new Date('2024-01-16T08:00:00Z'),
    isCompleted: false,
    template: mockTemplates[0]
  },
  {
    id: '2',
    title: 'Amy wants to see your day at work',
    description: 'Amy wants to know what your work day looks like!',
    fromUser: mockUsers[1],
    toUser: mockUsers[2],
    createdAt: new Date('2024-01-15T09:30:00Z'),
    expiresAt: new Date('2024-01-16T09:30:00Z'),
    isCompleted: false,
    template: mockTemplates[1]
  },
  {
    id: '3',
    title: 'Maya wants to see your gym session',
    description: 'Maya is inspired by your fitness journey!',
    fromUser: mockUsers[2],
    toUser: mockUsers[0],
    createdAt: new Date('2024-01-15T10:15:00Z'),
    expiresAt: new Date('2024-01-16T10:15:00Z'),
    isCompleted: false,
    template: mockTemplates[2]
  },
  {
    id: '4',
    title: 'Piper wants to see your night routine',
    description: 'Piper wants to know how you wind down for the night!',
    fromUser: mockUsers[3],
    toUser: mockUsers[0],
    createdAt: new Date('2024-01-15T11:00:00Z'),
    expiresAt: new Date('2024-01-16T11:00:00Z'),
    isCompleted: false,
    template: mockTemplates[3]
  }
]
