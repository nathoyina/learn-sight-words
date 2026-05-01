import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BigButton } from '../components/BigButton'
import { PageShell } from '../components/PageShell'
import { useProgress } from '../lib/useProgress'

export function TeacherAuth() {
  const navigate = useNavigate()
  const { teacherSignIn, teacherSignUp } = useProgress()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setLoading(true)
    setError(null)

    const message =
      mode === 'signin'
        ? await teacherSignIn(email.trim(), password)
        : await teacherSignUp(email.trim(), password, name.trim() || 'Teacher')

    setLoading(false)

    if (message) {
      setError(message)
      return
    }

    navigate('/teacher/dashboard')
  }

  return (
    <PageShell title="Teacher Login">
      <p className="mb-4 text-lg text-slate-700">Manage classes, join codes, and student progress.</p>

      <div className="mb-4 grid gap-2 md:grid-cols-2">
        <BigButton
          label="Sign In"
          onClick={() => setMode('signin')}
          className={mode === 'signin' ? '' : 'bg-slate-300 hover:bg-slate-400'}
        />
        <BigButton
          label="Create Teacher Account"
          onClick={() => setMode('signup')}
          className={mode === 'signup' ? 'bg-pink-400 hover:bg-pink-500' : 'bg-slate-300 hover:bg-slate-400'}
        />
      </div>

      <div className="space-y-3 rounded-2xl bg-blue-50 p-4">
        {mode === 'signup' ? (
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Name</span>
            <input className="w-full rounded-xl border border-blue-200 p-3" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
        ) : null}

        <label className="block">
          <span className="mb-1 block text-sm font-medium">Email</span>
          <input className="w-full rounded-xl border border-blue-200 p-3" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">Password</span>
          <input className="w-full rounded-xl border border-blue-200 p-3" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
        </label>

        {error ? <p className="text-sm text-red-700">{error}</p> : null}

        <BigButton
          label={loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          onClick={submit}
          disabled={loading || !email.trim() || !password}
        />
      </div>
    </PageShell>
  )
}
