export type LevelId = 'l1' | 'l2' | 'l3' | 'l4' | 'l5'

export type GameId =
  | 'l1-flashcards'
  | 'l1-hear-tap'
  | 'l1-word-hunt'
  | 'l2-build-word'
  | 'l2-missing-letter'
  | 'l3-word-family'
  | 'l3-rhyme-match'
  | 'l4-picture-match'
  | 'l4-theme-sort'
  | 'l5-sentence-builder'
  | 'l5-fill-blank'

export interface Progress {
  placementLevel: LevelId | null
  unlockedLevels: number
  stars: Partial<Record<GameId, number>>
  stickers: string[]
  /** Synced profile flair for the kid home screen. */
  avatarEmoji?: string
  /** ISO date `YYYY-MM-DD` of last play (stars earned). */
  lastPlayDate?: string
  /** Soft streak for display; resets gently when a day is missed. */
  streakCount?: number
}

export interface TeacherInfo {
  id: string
  email: string | null
}

export interface Klass {
  id: string
  teacher_id: string
  name: string
  code: string
  allow_self_join: boolean
  created_at: string
}

export interface Student {
  id: string
  class_id: string
  name: string
  progress: Progress
  last_seen_at: string | null
  created_at: string
}

export interface ActiveStudentSession {
  studentId: string
  pin: string
  /** Display name from login/join form (also on server as `students.name`). */
  displayName: string
}

export interface GameMeta {
  id: GameId
  level: number
  title: string
  description: string
  path: string
}
