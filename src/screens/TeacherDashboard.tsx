import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BigButton } from '../components/BigButton'
import { PageShell } from '../components/PageShell'
import { gameMeta } from '../lib/gameMeta'
import { useProgress } from '../lib/useProgress'
import type { Klass, Student } from '../lib/types'

function randomCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}

export function TeacherDashboard() {
  const { teacher, teacherSignOut, listClasses, createClassroom, updateClassroom, listStudents } = useProgress()
  const [classes, setClasses] = useState<Klass[]>([])
  const [selectedClassId, setSelectedClassId] = useState<string>('')
  const [students, setStudents] = useState<Student[]>([])
  const [newClassName, setNewClassName] = useState('')
  const [error, setError] = useState<string | null>(null)

  const selectedClass = useMemo(
    () => classes.find((item) => item.id === selectedClassId) ?? null,
    [classes, selectedClassId],
  )

  const refreshClasses = useCallback(async () => {
    try {
      const data = await listClasses()
      setClasses(data)
      if (!selectedClassId && data.length > 0) {
        setSelectedClassId(data[0].id)
      }
    } catch {
      setError('Failed to load classes.')
    }
  }, [listClasses, selectedClassId])

  const refreshStudents = useCallback(async (classId: string) => {
    try {
      const data = await listStudents(classId)
      setStudents(data)
    } catch {
      setError('Failed to load students.')
    }
  }, [listStudents])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refreshClasses()
  }, [refreshClasses])

  useEffect(() => {
    if (!selectedClassId) {
      return
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refreshStudents(selectedClassId)
  }, [selectedClassId, refreshStudents])

  const createClass = async () => {
    if (!newClassName.trim()) return
    setError(null)
    try {
      await createClassroom(newClassName.trim())
      setNewClassName('')
      await refreshClasses()
    } catch {
      setError('Failed to create class.')
    }
  }

  const toggleSelfJoin = async () => {
    if (!selectedClass) return
    try {
      await updateClassroom(selectedClass.id, { allow_self_join: !selectedClass.allow_self_join })
      await refreshClasses()
    } catch {
      setError('Failed to update class settings.')
    }
  }

  const regenerateCode = async () => {
    if (!selectedClass) return
    try {
      await updateClassroom(selectedClass.id, { code: randomCode() })
      await refreshClasses()
    } catch {
      setError('Failed to regenerate class code.')
    }
  }

  return (
    <PageShell title="Teacher Dashboard">
      <div className="mb-4 flex items-center justify-between rounded-2xl bg-blue-50 p-4">
        <p className="text-sm text-slate-600">Signed in as {teacher?.email}</p>
        <button className="rounded-xl bg-slate-700 px-3 py-2 text-white" onClick={() => void teacherSignOut()}>
          Sign out
        </button>
      </div>

      <div className="mb-6 rounded-2xl bg-white p-4 shadow">
        <h2 className="mb-2 text-2xl font-semibold">Create class</h2>
        <div className="grid gap-2 md:grid-cols-[1fr_auto]">
          <input
            className="rounded-xl border border-slate-200 p-3"
            placeholder="e.g. P2 Reading Group"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
          />
          <BigButton label="Create" onClick={() => void createClass()} disabled={!newClassName.trim()} />
        </div>
      </div>

      <div className="mb-6 rounded-2xl bg-white p-4 shadow">
        <h2 className="mb-2 text-2xl font-semibold">Your classes</h2>
        {classes.length === 0 ? (
          <p className="text-slate-600">No classes yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {classes.map((klass) => (
              <button
                key={klass.id}
                type="button"
                onClick={() => setSelectedClassId(klass.id)}
                className={`rounded-xl px-3 py-2 text-sm ${selectedClassId === klass.id ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
              >
                {klass.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedClass ? (
        <div className="rounded-2xl bg-white p-4 shadow">
          <h2 className="text-2xl font-semibold">{selectedClass.name}</h2>
          <p className="mt-1">Class code: <strong>{selectedClass.code}</strong></p>
          <p className="mb-3 text-sm text-slate-600">
            Self-join is {selectedClass.allow_self_join ? 'enabled' : 'disabled'}
          </p>
          <div className="mb-4 grid gap-2 md:grid-cols-2">
            <BigButton label={selectedClass.allow_self_join ? 'Disable Self-Join' : 'Enable Self-Join'} onClick={() => void toggleSelfJoin()} />
            <BigButton label="Regenerate Class Code" className="bg-pink-400 hover:bg-pink-500" onClick={() => void regenerateCode()} />
          </div>

          <h3 className="mb-2 text-xl font-semibold">Students</h3>
          {students.length === 0 ? (
            <p className="text-slate-600">No students yet.</p>
          ) : (
            <div className="space-y-2">
              {students.map((student) => {
                const totalStars = Object.values(student.progress.stars).reduce((sum, value) => sum + (value ?? 0), 0)
                const weakGames = gameMeta.filter((g) => (student.progress.stars[g.id] ?? 0) < 2)
                const focus =
                  weakGames.length > 0
                    ? `Practice next: ${weakGames
                        .slice(0, 3)
                        .map((g) => g.title)
                        .join(', ')}${weakGames.length > 3 ? '…' : ''}`
                    : 'Strong across games — encourage the next world!'
                return (
                  <article key={student.id} className="rounded-xl bg-slate-50 p-3">
                    <p className="font-semibold">{student.name}</p>
                    <p className="text-sm text-slate-600">
                      Worlds unlocked: {student.progress.unlockedLevels} · Stars: {totalStars}
                      {student.progress.placementLevel ? ` · Placement: ${student.progress.placementLevel.toUpperCase()}` : ''}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{focus}</p>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      ) : null}

      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}

      <div className="mt-6">
        <Link className="text-blue-600 underline" to="/login">
          Go to kid login
        </Link>
      </div>
    </PageShell>
  )
}
