export interface VocabItem {
  word: string
  emoji: string
  theme: 'Animals' | 'Food' | 'Body' | 'Family' | 'School'
}

export const vocabulary: VocabItem[] = [
  { word: 'dog', emoji: '🐶', theme: 'Animals' },
  { word: 'cat', emoji: '🐱', theme: 'Animals' },
  { word: 'tiger', emoji: '🐯', theme: 'Animals' },
  { word: 'bird', emoji: '🐦', theme: 'Animals' },
  { word: 'fish', emoji: '🐟', theme: 'Animals' },
  { word: 'apple', emoji: '🍎', theme: 'Food' },
  { word: 'banana', emoji: '🍌', theme: 'Food' },
  { word: 'rice', emoji: '🍚', theme: 'Food' },
  { word: 'bread', emoji: '🍞', theme: 'Food' },
  { word: 'milk', emoji: '🥛', theme: 'Food' },
  { word: 'hand', emoji: '✋', theme: 'Body' },
  { word: 'eye', emoji: '👁️', theme: 'Body' },
  { word: 'nose', emoji: '👃', theme: 'Body' },
  { word: 'ear', emoji: '👂', theme: 'Body' },
  { word: 'foot', emoji: '🦶', theme: 'Body' },
  { word: 'mom', emoji: '👩', theme: 'Family' },
  { word: 'dad', emoji: '👨', theme: 'Family' },
  { word: 'sister', emoji: '👧', theme: 'Family' },
  { word: 'brother', emoji: '👦', theme: 'Family' },
  { word: 'baby', emoji: '👶', theme: 'Family' },
  { word: 'book', emoji: '📚', theme: 'School' },
  { word: 'pen', emoji: '🖊️', theme: 'School' },
  { word: 'bag', emoji: '🎒', theme: 'School' },
  { word: 'desk', emoji: '🪑', theme: 'School' },
  { word: 'bus', emoji: '🚌', theme: 'School' },
]

export const themes = ['Animals', 'Food', 'Body', 'Family', 'School'] as const
