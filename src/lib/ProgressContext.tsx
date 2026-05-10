import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { supabase } from './supabase'
import {
  createClass,
  getTeacherUser,
  kidGetClassCode,
  kidGetProgress,
  kidLogin,
  kidSelfJoin,
  kidUpdateProgress,
  listClasses as apiListClasses,
  listStudents as apiListStudents,
  teacherSignIn as apiTeacherSignIn,
  teacherSignOut as apiTeacherSignOut,
  teacherSignUp as apiTeacherSignUp,
  updateClass as apiUpdateClass,
} from './api'
import { cacheProgress, getActiveStudent, getLastClassCode, loadCachedProgress, setActiveStudent, setLastClassCode } from './storage'
import type { ActiveStudentSession, LevelId, Progress, TeacherInfo } from './types'
import { ProgressContext } from './progress-context'
import type { ProgressContextValue } from './progress-context'

const defaultProgress: Progress = {
  placementLevel: null,
  unlockedLevels: 1,
  stars: {},
  stickers: [],
}

function localDateString(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Soft streak: +1 when playing on consecutive calendar days; resets to 1 after a gap. */
function bumpPlayActivity(prev: Progress): Pick<Progress, 'lastPlayDate' | 'streakCount'> {
  const today = localDateString(new Date())
  const last = prev.lastPlayDate
  const prevCount = prev.streakCount ?? 0
  if (last === today) {
    return { lastPlayDate: today, streakCount: Math.max(prevCount, 1) }
  }
  if (!last) {
    return { lastPlayDate: today, streakCount: 1 }
  }
  const y = new Date()
  y.setDate(y.getDate() - 1)
  const yStr = localDateString(y)
  if (last === yStr) {
    return { lastPlayDate: today, streakCount: prevCount + 1 }
  }
  return { lastPlayDate: today, streakCount: 1 }
}

function levelToNumber(level: LevelId): number {
  return Number(level.replace('l', ''))
}

function normalizeProgress(value: Partial<Progress> | null | undefined): Progress {
  return {
    placementLevel: value?.placementLevel ?? null,
    unlockedLevels: value?.unlockedLevels ?? 1,
    stars: value?.stars ?? {},
    stickers: value?.stickers ?? [],
    avatarEmoji: value?.avatarEmoji,
    lastPlayDate: value?.lastPlayDate,
    streakCount: value?.streakCount,
  }
}

function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) {
    const msg = String((error as { message?: string }).message ?? '')
    if (msg) return msg
  }
  return String(error ?? '')
}

function mapKidJoinError(error: unknown): string {
  const msg = getErrorMessage(error)
  if (msg.includes('class_not_found')) return 'Class code not found. Please check the code.'
  if (msg.includes('self_join_disabled')) return 'This class does not allow self sign-up. Ask your teacher to enable self-join.'
  if (msg.includes('name_taken')) return 'That name is already taken in this class. Try another name.'
  return 'Unable to create profile for this class. Check code and try another name.'
}

function mapKidLoginError(error: unknown): string {
  const msg = getErrorMessage(error)
  if (msg.includes('ambiguous_login')) {
    return 'More than one profile matches that name and PIN. Ask your teacher for your class code, then use “Create My Profile” or contact support.'
  }
  if (msg.includes('invalid_login')) return 'Invalid name or PIN. Check with your teacher if you forgot them.'
  if (msg.includes('student_not_found')) return 'Student profile not found. Please create a profile first.'
  return 'Unable to log in right now. Please try again.'
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [teacher, setTeacher] = useState<TeacherInfo | null>(null)
  const [activeStudent, setActiveStudentState] = useState<ActiveStudentSession | null>(() => getActiveStudent())
  const [progress, setProgress] = useState<Progress>(defaultProgress)
  const [syncError, setSyncError] = useState<string | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)
  const syncTimerRef = useRef<number | null>(null)

  const hydrateTeacher = useCallback(async () => {
    const user = await getTeacherUser()
    setTeacher(user ? { id: user.id, email: user.email ?? null } : null)
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void hydrateTeacher()
    const { data } = supabase.auth.onAuthStateChange(() => {
      void hydrateTeacher()
    })
    return () => {
      data.subscription.unsubscribe()
    }
  }, [hydrateTeacher])

  const hydrateKidProgress = useCallback(async (session: ActiveStudentSession) => {
    try {
      const serverProgress = await kidGetProgress(session.studentId, session.pin)
      const normalized = normalizeProgress(serverProgress)
      setProgress(normalized)
      cacheProgress(session.studentId, normalized)
      setSyncError(null)

      if (!getLastClassCode()) {
        try {
          const code = await kidGetClassCode(session.studentId, session.pin)
          if (code) setLastClassCode(code)
        } catch {
          // Non-fatal: class code backfill will retry on next hydration.
        }
      }
    } catch {
      const cached = loadCachedProgress(session.studentId)
      if (cached) {
        setProgress(normalizeProgress(cached))
      } else {
        setProgress(defaultProgress)
      }
      setSyncError('Using offline cached progress. Will sync when online.')
    }
  }, [])

  useEffect(() => {
    if (!activeStudent) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void hydrateKidProgress(activeStudent)
  }, [activeStudent, hydrateKidProgress])

  const scheduleSync = useCallback((nextProgress: Progress, session: ActiveStudentSession | null) => {
    if (!session) return
    cacheProgress(session.studentId, nextProgress)
    if (syncTimerRef.current) {
      window.clearTimeout(syncTimerRef.current)
    }
    syncTimerRef.current = window.setTimeout(async () => {
      setIsSyncing(true)
      try {
        await kidUpdateProgress(session.studentId, session.pin, nextProgress)
        setSyncError(null)
      } catch {
        setSyncError('Cloud sync failed. Changes are saved locally and will retry next update.')
      } finally {
        setIsSyncing(false)
      }
    }, 500)
  }, [])

  useEffect(() => {
    return () => {
      if (syncTimerRef.current) {
        window.clearTimeout(syncTimerRef.current)
      }
    }
  }, [])

  const updateProgress = useCallback(
    (updater: (current: Progress) => Progress) => {
      setProgress((current) => {
        const next = normalizeProgress(updater(current))
        scheduleSync(next, activeStudent)
        return next
      })
    },
    [activeStudent, scheduleSync],
  )

  const value = useMemo<ProgressContextValue>(
    () => ({
      teacher,
      activeStudentId: activeStudent?.studentId ?? null,
      activeDisplayName: activeStudent?.displayName ?? 'Friend',
      progress,
      syncError,
      isSyncing,

      teacherSignUp: async (email, password, name) => {
        const error = await apiTeacherSignUp(email, password, name)
        await hydrateTeacher()
        return error
      },
      teacherSignIn: async (email, password) => {
        const error = await apiTeacherSignIn(email, password)
        await hydrateTeacher()
        return error
      },
      teacherSignOut: async () => {
        await apiTeacherSignOut()
        setTeacher(null)
      },

      listClasses: async () => apiListClasses(),
      createClassroom: async (name) => createClass(name),
      updateClassroom: async (classId, updates) => apiUpdateClass(classId, updates),
      listStudents: async (classId) => apiListStudents(classId),

      kidLogin: async (classCode, name, pin) => {
        try {
          const studentId = await kidLogin(classCode, name, pin)
          const displayName = name.trim() || 'Friend'
          const session: ActiveStudentSession = { studentId, pin, displayName }
          setActiveStudent(session)
          setActiveStudentState(session)
          const trimmed = classCode.trim()
          if (trimmed) setLastClassCode(trimmed.toUpperCase())
          return null
        } catch (error) {
          return mapKidLoginError(error)
        }
      },
      kidSelfJoin: async (classCode, name, pin) => {
        try {
          const studentId = await kidSelfJoin(classCode, name, pin)
          const displayName = name.trim() || 'Friend'
          const session: ActiveStudentSession = { studentId, pin, displayName }
          setActiveStudent(session)
          setActiveStudentState(session)
          setLastClassCode(classCode)
          return null
        } catch (error) {
          return mapKidJoinError(error)
        }
      },
      kidLogout: () => {
        setActiveStudent(null)
        setActiveStudentState(null)
        setProgress(defaultProgress)
      },

      setPlacementLevel: (level) => {
        const unlocked = Math.max(1, levelToNumber(level))
        updateProgress((prev) => ({
          ...prev,
          placementLevel: level,
          unlockedLevels: Math.max(prev.unlockedLevels, unlocked),
        }))
      },
      awardStars: (gameId, stars) => {
        updateProgress((prev) => {
          const activity = bumpPlayActivity(prev)
          const previous = prev.stars[gameId] ?? 0
          const nextStars = { ...prev.stars, [gameId]: Math.max(previous, stars) }
          const gameLevel = Number(gameId.split('-')[0].replace('l', ''))
          return {
            ...prev,
            ...activity,
            stars: nextStars,
            unlockedLevels: Math.max(prev.unlockedLevels, Math.min(5, gameLevel + 1)),
          }
        })
      },
      addSticker: (sticker) => {
        updateProgress((prev) => {
          if (prev.stickers.includes(sticker)) return prev
          const activity = bumpPlayActivity(prev)
          return { ...prev, ...activity, stickers: [...prev.stickers, sticker] }
        })
      },
      setAvatarEmoji: (emoji) => {
        updateProgress((prev) => ({ ...prev, avatarEmoji: emoji }))
      },
    }),
    [teacher, activeStudent, progress, syncError, isSyncing, hydrateTeacher, updateProgress],
  )

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}
