export interface SentenceItem {
  emoji: string
  words: string[]
  sentence: string
  missing?: string
  options?: string[]
}

export const sentenceBuilderItems: SentenceItem[] = [
  { emoji: '🐶🏃', words: ['dog', 'The', 'runs', 'fast'], sentence: 'The dog runs fast' },
  { emoji: '🐱🛏️', words: ['cat', 'The', 'sleeps'], sentence: 'The cat sleeps' },
  { emoji: '👧📚', words: ['girl', 'The', 'reads'], sentence: 'The girl reads' },
  { emoji: '🧒🍎', words: ['boy', 'eats', 'The', 'an', 'apple'], sentence: 'The boy eats an apple' },
  { emoji: '🐦🎵', words: ['bird', 'sings', 'The'], sentence: 'The bird sings' },
]

export const fillBlankItems: SentenceItem[] = [
  { emoji: '🐱🧺', words: [], sentence: 'The cat ___ on the mat.', missing: 'sat', options: ['sat', 'eat', 'run'] },
  { emoji: '☀️⬆️', words: [], sentence: 'The sun is ___ in the sky.', missing: 'up', options: ['up', 'red', 'small'] },
  { emoji: '👦📖', words: [], sentence: 'He can ___ the book.', missing: 'read', options: ['read', 'jump', 'sleep'] },
  { emoji: '🐶🥛', words: [], sentence: 'My dog likes ___ .', missing: 'milk', options: ['milk', 'shoe', 'pen'] },
  { emoji: '👧🏫', words: [], sentence: 'She goes to ___ .', missing: 'school', options: ['school', 'banana', 'bed'] },
]
