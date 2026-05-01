import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BigButton } from '../components/BigButton'
import { PageShell } from '../components/PageShell'
import { useProgress } from '../lib/useProgress'
import { getLastClassCode } from '../lib/storage'

export function Login() {
  const navigate = useNavigate()
  const { kidLogin, kidSelfJoin } = useProgress()
  const rememberedCode = getLastClassCode() ?? ''
  const [classCode, setClassCode] = useState(rememberedCode)
  const [name, setName] = useState('')
  const [pin, setPin] = useState('')
  const [mode, setMode] = useState<'login' | 'join'>(rememberedCode ? 'login' : 'join')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showClassCode, setShowClassCode] = useState(!rememberedCode)

  const submit = async () => {
    setLoading(true)
    setError('')
    const trimmedCode = classCode.trim().toUpperCase()
    const trimmedName = name.trim()

    const message =
      mode === 'login'
        ? await kidLogin(trimmedCode, trimmedName, pin)
        : await kidSelfJoin(trimmedCode, trimmedName, pin)

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
    if (next === 'join') {
      setShowClassCode(true)
    } else if (rememberedCode) {
      setShowClassCode(false)
      setClassCode(rememberedCode)
    }
  }

  const canSubmit = !loading && classCode.trim().length > 0 && name.trim().length > 0 && pin.length >= 4

  return (
    <PageShell title="Child Login">
      <p className="mb-4 text-lg text-slate-700">
        {mode === 'login' && rememberedCode && !showClassCode
          ? 'Enter your name and PIN to continue.'
          : 'Enter your name, PIN, and class code to continue on any device.'}
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
            autoFocus={mode === 'login' && Boolean(rememberedCode)}
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

        {showClassCode ? (
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Class Code</span>
            <input
              className="w-full rounded-xl border border-purple-200 p-3 text-lg uppercase"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
              placeholder="ABC123"
            />
            {rememberedCode && mode === 'login' ? (
              <button
                type="button"
                onClick={() => {
                  setClassCode(rememberedCode)
                  setShowClassCode(false)
                }}
                className="mt-2 text-sm text-purple-700 underline"
              >
                Use saved class ({rememberedCode})
              </button>
            ) : null}
          </label>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white/70 px-3 py-2 text-sm">
            <span className="text-slate-700">
              Class: <span className="font-mono font-bold">{classCode}</span>
            </span>
            <button
              type="button"
              onClick={() => setShowClassCode(true)}
              className="text-purple-700 underline"
            >
              Use a different class
            </button>
          </div>
        )}

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
