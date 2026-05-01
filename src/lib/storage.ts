import type { ActiveStudentSession, Progress } from './types'

function normalizeSession(parsed: Partial<ActiveStudentSession>): ActiveStudentSession | null {
  if (!parsed.studentId || !parsed.pin) return null
  const name =
    typeof parsed.displayName === 'string' && parsed.displayName.trim()
      ? parsed.displayName.trim()
      : 'Friend'
  return { studentId: parsed.studentId, pin: parsed.pin, displayName: name }
}

const ACTIVE_STUDENT_KEY = 'sight-word-adventure-active-student'

function cacheKey(studentId: string): string {
  return `sight-word-adventure-progress-cache:${studentId}`
}

export function setActiveStudent(session: ActiveStudentSession | null): void {
  if (!session) {
    localStorage.removeItem(ACTIVE_STUDENT_KEY)
    return
  }
  localStorage.setItem(ACTIVE_STUDENT_KEY, JSON.stringify(session))
}

export function getActiveStudent(): ActiveStudentSession | null {
  try {
    const raw = localStorage.getItem(ACTIVE_STUDENT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<ActiveStudentSession>
    return normalizeSession(parsed)
  } catch {
    return null
  }
}

export function cacheProgress(studentId: string, progress: Progress): void {
  localStorage.setItem(cacheKey(studentId), JSON.stringify(progress))
}

export function loadCachedProgress(studentId: string): Progress | null {
  try {
    const raw = localStorage.getItem(cacheKey(studentId))
    if (!raw) return null
    return JSON.parse(raw) as Progress
  } catch {
    return null
  }
}
