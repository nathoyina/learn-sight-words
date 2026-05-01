import { createContext } from 'react'
import type { GameId, Klass, LevelId, Progress, Student, TeacherInfo } from './types'

export interface ProgressContextValue {
  teacher: TeacherInfo | null
  activeStudentId: string | null
  /** Greeting name from the last kid login (falls back to "Friend" for old sessions). */
  activeDisplayName: string
  progress: Progress
  syncError: string | null
  isSyncing: boolean

  teacherSignUp: (email: string, password: string, name: string) => Promise<string | null>
  teacherSignIn: (email: string, password: string) => Promise<string | null>
  teacherSignOut: () => Promise<void>

  listClasses: () => Promise<Klass[]>
  createClassroom: (name: string) => Promise<Klass>
  updateClassroom: (classId: string, updates: Partial<Pick<Klass, 'allow_self_join' | 'code' | 'name'>>) => Promise<void>
  listStudents: (classId: string) => Promise<Student[]>

  kidLogin: (classCode: string, name: string, pin: string) => Promise<string | null>
  kidSelfJoin: (classCode: string, name: string, pin: string) => Promise<string | null>
  kidLogout: () => void

  setPlacementLevel: (level: LevelId) => void
  awardStars: (gameId: GameId, stars: number) => void
  addSticker: (sticker: string) => void
  setAvatarEmoji: (emoji: string) => void
}

export const ProgressContext = createContext<ProgressContextValue | null>(null)
