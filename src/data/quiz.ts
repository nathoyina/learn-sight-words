import type { LevelId } from '../lib/types'

interface BaseQuestion {
  prompt: string
  options: string[]
  answer: string
  level: LevelId
}

export type QuizQuestion =
  | (BaseQuestion & { kind: 'audio'; speak: string })
  | (BaseQuestion & { kind: 'picture'; emoji: string })
  | (BaseQuestion & { kind: 'rhyme'; target: string; speak: string })
  | (BaseQuestion & { kind: 'theme' })
  | (BaseQuestion & { kind: 'sentence'; emoji?: string })

export const placementQuiz: QuizQuestion[] = [
  {
    kind: 'audio',
    prompt: 'Listen and tap the word you hear.',
    speak: 'up',
    options: ['of', 'on', 'or', 'up'],
    answer: 'up',
    level: 'l1',
  },
  {
    kind: 'audio',
    prompt: 'Listen and tap the word you hear.',
    speak: 'when',
    options: ['went', 'where', 'when', 'what'],
    answer: 'when',
    level: 'l1',
  },
  {
    kind: 'picture',
    prompt: 'Tap the word that matches the picture.',
    emoji: '🐱',
    options: ['cat', 'cap', 'can', 'car'],
    answer: 'cat',
    level: 'l2',
  },
  {
    kind: 'picture',
    prompt: 'Tap the word that matches the picture.',
    emoji: '🐶',
    options: ['dog', 'dig', 'dug', 'log'],
    answer: 'dog',
    level: 'l2',
  },
  {
    kind: 'rhyme',
    prompt: 'Tap the word that rhymes.',
    target: 'cat',
    speak: 'cat',
    options: ['hat', 'dog', 'pen', 'book'],
    answer: 'hat',
    level: 'l3',
  },
  {
    kind: 'rhyme',
    prompt: 'Tap the word that rhymes.',
    target: 'bake',
    speak: 'bake',
    options: ['lake', 'sun', 'book', 'tree'],
    answer: 'lake',
    level: 'l3',
  },
  {
    kind: 'theme',
    prompt: 'Which word is an animal?',
    options: ['apple', 'tiger', 'chair', 'pencil'],
    answer: 'tiger',
    level: 'l4',
  },
  {
    kind: 'theme',
    prompt: 'Which word is food?',
    options: ['bread', 'ear', 'desk', 'sister'],
    answer: 'bread',
    level: 'l4',
  },
  {
    kind: 'sentence',
    prompt: 'Choose the sentence that sounds right.',
    options: ['Dog the runs', 'The dog runs', 'Runs dog the', 'The runs dog'],
    answer: 'The dog runs',
    level: 'l5',
  },
  {
    kind: 'sentence',
    prompt: 'Pick the best ending: The cat ___ on the mat.',
    options: ['sat', 'book', 'blue', 'tree'],
    answer: 'sat',
    level: 'l5',
  },
]

export const levelOrder: LevelId[] = ['l1', 'l2', 'l3', 'l4', 'l5']
