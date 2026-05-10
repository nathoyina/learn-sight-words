import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { PageShell } from '../components/PageShell'
import { BigButton } from '../components/BigButton'
import { MascotHintRow } from '../components/MascotHintRow'
import { getNextGame } from '../lib/journey'
import { useProgress } from '../lib/useProgress'

const AVATAR_CHOICES = ['🦊', '🦉', '🐻', '🐰', '🐼', '🦁', '🐸', '🦄']

export function Home() {
  const { progress, activeDisplayName, kidLogout, syncError, isSyncing, setAvatarEmoji } = useProgress()

  const totalStars = useMemo(
    () => Object.values(progress.stars).reduce((sum, s) => sum + (s ?? 0), 0),
    [progress.stars],
  )

  const nextGame = useMemo(() => getNextGame(progress), [progress])
  const streak = progress.streakCount ?? 0
  const avatar = progress.avatarEmoji ?? '📚'

  return (
    <PageShell
      title="Your word path"
      levelTint={1}
      headerStars={totalStars}
      headerStreak={streak}
      headerMascotHint={`${activeDisplayName}, pick up where you left off!`}
    >
      <MascotHintRow guide="fox" message="Your map shows every stop on your journey. Tap Continue for the next game!" />

      <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-purple-50 p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <span className="text-5xl" aria-hidden>
            {avatar}
          </span>
          <div>
            <p className="text-2xl font-bold text-slate-800">Hi, {activeDisplayName}!</p>
            <p className="text-sm text-slate-600">Tap a buddy to wear on your path (saved with your progress).</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {AVATAR_CHOICES.map((emo) => (
                <button
                  key={emo}
                  type="button"
                  onClick={() => setAvatarEmoji(emo)}
                  className={`rounded-xl border-2 p-2 text-2xl leading-none transition ${
                    progress.avatarEmoji === emo ? 'border-purple-600 bg-white shadow' : 'border-transparent bg-white/60 hover:bg-white'
                  }`}
                  aria-label={`Choose ${emo} avatar`}
                >
                  {emo}
                </button>
              ))}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={kidLogout}
          className="shrink-0 self-start rounded-xl bg-slate-700 px-3 py-2 text-sm font-medium text-white md:self-center"
        >
          Switch child
        </button>
      </div>

      <div className="mb-6">
        <Link to={nextGame?.path ?? '/map'} className="block">
          <BigButton
            label={nextGame ? `Continue — ${nextGame.title}` : 'Explore the map'}
            className="w-full bg-green-500 py-4 text-xl hover:bg-green-600"
          />
        </Link>
        <p className="mt-2 text-center text-sm text-slate-600">Next stop on your path, in order from your placement level.</p>
      </div>

      <div className="mb-6 grid gap-4 rounded-2xl bg-yellow-50 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-sm text-slate-500">Placement level</p>
          <p className="text-2xl font-bold">{progress.placementLevel?.toUpperCase() ?? 'Not set'}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Unlocked worlds</p>
          <p className="text-2xl font-bold">{progress.unlockedLevels}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Total stars</p>
          <p className="text-2xl font-bold">{totalStars}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Day streak</p>
          <p className="text-2xl font-bold">{streak > 0 ? `${streak} 🔥` : '—'}</p>
        </div>
      </div>

      {syncError ? <p className="mb-3 rounded-xl bg-red-100 p-3 text-sm text-red-700">{syncError}</p> : null}
      {isSyncing ? <p className="mb-3 text-sm text-slate-600">Syncing progress to cloud...</p> : null}

      <div className="mb-6 rounded-2xl border-2 border-orange-200 bg-orange-50 p-4">
        <h2 className="text-lg font-semibold text-orange-950">Flashcard practice</h2>
        <p className="mt-1 text-sm text-orange-900/80">
          Review all 100 sight words anytime — tap to hear each word and move forward or back.
        </p>
        <Link to="/flashcards" className="mt-3 block">
          <BigButton label="Open 100 sight word flashcards" className="w-full bg-orange-400 hover:bg-orange-500" />
        </Link>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Link to="/quiz">
          <BigButton label="Placement quiz" className="w-full bg-slate-400 hover:bg-slate-500" />
        </Link>
        <Link to="/map">
          <BigButton label="Full level map" className="w-full bg-pink-400 hover:bg-pink-500" />
        </Link>
      </div>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold">Sticker book</h2>
        {progress.stickers.length === 0 ? (
          <p className="mt-2 text-slate-600">Play games to unlock stickers!</p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2 text-3xl">
            {progress.stickers.map((sticker) => (
              <span key={sticker}>{sticker}</span>
            ))}
          </div>
        )}
      </section>
    </PageShell>
  )
}
