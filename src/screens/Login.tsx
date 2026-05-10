import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BigButton } from '../components/BigButton'
import { PageShell } from '../components/PageShell'
import { useProgress } from '../lib/useProgress'

export function Login() {
  const navigate = useNavigate()
  const { kidLogin, kidSelfJoin } = useProgress()
  const [classCode, setClassCode] = useState('')
  const [name, setName] = useState('')
  const [pin, setPin] = useState('')
  const [mode, setMode] = useState<'login' | 'join'>('login')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setLoading(true)
    setError('')
    const trimmedName = name.trim()

    const message =
      mode === 'login'
        ? await kidLogin('', trimmedName, pin)
        : await kidSelfJoin(classCode.trim().toUpperCase(), trimmedName, pin)

    setLoading(false)

    if (message) {
      setError(message)
      return
    }
    navigate('/')
  }

  const switchMode = (next: 'login' | 'join') => {
    setMode(next)
    setError('')
  }

  const canSubmit =
    !loading &&
    name.trim().length > 0 &&
    pin.length >= 4 &&
    (mode === 'login' || classCode.trim().length > 0)

  return (
    <PageShell title="Child Login">
      <p className="mb-4 text-lg text-slate-700">
        {mode === 'login'
          ? 'Enter your name and PIN to continue.'
          : 'Enter your name, PIN, and class code from your teacher to create your profile.'}
      </p>

      <div className="mb-4 grid gap-2 md:grid-cols-2">
        <BigButton
          label="Login"
          onClick={() => switchMode('login')}
          className={mode === 'login' ? '' : 'bg-slate-300 hover:bg-slate-400'}
        />
        <BigButton
          label="Create My Profile"
          onClick={() => switchMode('join')}
          className={mode === 'join' ? 'bg-pink-400 hover:bg-pink-500' : 'bg-slate-300 hover:bg-slate-400'}
        />
      </div>

      <div className="space-y-3 rounded-2xl bg-purple-50 p-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Child Name</span>
          <input
            className="w-full rounded-xl border border-purple-200 p-3 text-lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Anna"
            autoFocus
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">PIN (at least 4 digits)</span>
          <input
            className="w-full rounded-xl border border-purple-200 p-3 text-lg"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            inputMode="numeric"
            maxLength={8}
            type="password"
            placeholder="1234"
          />
        </label>

        {mode === 'join' ? (
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Class Code</span>
            <input
              className="w-full rounded-xl border border-purple-200 p-3 text-lg uppercase"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
              placeholder="ABC123"
            />
          </label>
        ) : null}

        {error ? <p className="text-red-600">{error}</p> : null}

        <BigButton
          label={loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create and Login'}
          onClick={submit}
          disabled={!canSubmit}
        />
      </div>
    </PageShell>
  )
}
