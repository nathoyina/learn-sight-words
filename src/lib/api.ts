import type { User } from '@supabase/supabase-js'
import { supabase } from './supabase'
import type { Klass, Progress, Student } from './types'

function toProgress(value: unknown): Progress {
  const data = (value as Partial<Progress> | null) ?? {}
  return {
    placementLevel: data.placementLevel ?? null,
    unlockedLevels: data.unlockedLevels ?? 1,
    stars: data.stars ?? {},
    stickers: data.stickers ?? [],
    avatarEmoji: data.avatarEmoji,
    lastPlayDate: data.lastPlayDate,
    streakCount: data.streakCount,
  }
}

export async function getTeacherUser(): Promise<User | null> {
  const { data } = await supabase.auth.getUser()
  return data.user ?? null
}

export async function teacherSignUp(email: string, password: string, name: string): Promise<string | null> {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error || !data.user) return error?.message ?? 'Unable to sign up'

  const { error: teacherError } = await supabase
    .from('teachers')
    .upsert({ id: data.user.id, name })

  return teacherError?.message ?? null
}

export async function teacherSignIn(email: string, password: string): Promise<string | null> {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  return error?.message ?? null
}

export async function teacherSignOut(): Promise<void> {
  await supabase.auth.signOut()
}

export async function listClasses(): Promise<Klass[]> {
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Klass[]
}

function randomCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}

export async function createClass(name: string): Promise<Klass> {
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    throw new Error('Teacher not authenticated')
  }

  const { data, error } = await supabase
    .from('classes')
    .insert({
      name,
      teacher_id: userData.user.id,
      code: randomCode(),
      allow_self_join: true,
    })
    .select('*')
    .single()

  if (error || !data) throw error ?? new Error('Failed to create class')
  return data as Klass
}

export async function updateClass(classId: string, updates: Partial<Pick<Klass, 'allow_self_join' | 'code' | 'name'>>): Promise<void> {
  const { error } = await supabase.from('classes').update(updates).eq('id', classId)
  if (error) throw error
}

export async function listStudents(classId: string): Promise<Student[]> {
  const { data, error } = await supabase
    .from('students')
    .select('id, class_id, name, progress, last_seen_at, created_at')
    .eq('class_id', classId)
    .order('name', { ascending: true })

  if (error) throw error

  return (data ?? []).map((item) => ({
    ...(item as Omit<Student, 'progress'>),
    progress: toProgress((item as { progress: unknown }).progress),
  }))
}

export async function kidLogin(classCode: string, name: string, pin: string): Promise<string> {
  const { data, error } = await supabase.rpc('kid_login', {
    class_code: classCode,
    student_name: name,
    pin,
  })
  if (error || !data) throw error ?? new Error('Login failed')
  return data as string
}

export async function kidSelfJoin(classCode: string, name: string, pin: string): Promise<string> {
  const { data, error } = await supabase.rpc('kid_self_join', {
    class_code: classCode,
    student_name: name,
    pin,
  })
  if (error || !data) throw error ?? new Error('Join failed')
  return data as string
}

export async function kidGetProgress(studentId: string, pin: string): Promise<Progress> {
  const { data, error } = await supabase.rpc('kid_get_progress', {
    student_id: studentId,
    pin,
  })
  if (error) throw error
  return toProgress(data)
}

export async function kidUpdateProgress(studentId: string, pin: string, progress: Progress): Promise<void> {
  const { error } = await supabase.rpc('kid_update_progress', {
    student_id: studentId,
    pin,
    new_progress: progress,
  })
  if (error) throw error
}
