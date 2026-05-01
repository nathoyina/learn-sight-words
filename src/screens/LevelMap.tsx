import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { PageShell } from '../components/PageShell'
import { StarBar } from '../components/StarBar'
import { MascotHintRow } from '../components/MascotHintRow'
import { gameMeta } from '../lib/gameMeta'
import { getNextGameId, levelChapterTitle, levelCompletion, pathNodeState, STARS_FOR_MASTERY } from '../lib/journey'
import { useProgress } from '../lib/useProgress'

export function LevelMap() {
  const { progress } = useProgress()

  const totalStars = useMemo(
    () => Object.values(progress.stars).reduce((sum, s) => sum + (s ?? 0), 0),
    [progress.stars],
  )

  const nextGameId = useMemo(() => getNextGameId(progress), [progress])
  const streak = progress.streakCount ?? 0

  return (
    <PageShell
      title="Your level map"
      levelTint={2}
      headerStars={totalStars}
      headerStreak={streak}
      headerMascotHint="Follow the path from top to bottom — your next game glows!"
    >
      <MascotHintRow guide="owl" message="Each bubble is one game. Gold means you have three stars there!" />
      <p className="mb-5 text-slate-700">Your path is the same order every time so you always know what comes next.</p>
      <div className="space-y-6">
        {[1, 2, 3, 4, 5].map((level) => {
          const unlocked = level <= progress.unlockedLevels
          const games = gameMeta.filter((game) => game.level === level)
          const { earned, total } = levelCompletion(progress, level)

          return (
            <section key={level} className="rounded-2xl bg-blue-50 p-4">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="text-2xl font-semibold">World {level}</h2>
                  <p className="text-sm font-medium text-sky-800">{levelChapterTitle(level)}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`rounded-full px-3 py-1 text-sm ${unlocked ? 'bg-green-100 text-green-900' : 'bg-slate-200 text-slate-600'}`}>
                    {unlocked ? 'Unlocked' : 'Locked'}
                  </span>
                  {unlocked ? (
                    <span className="text-xs text-slate-600">
                      {earned}/{total} games with at least one star
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-col gap-0 pl-1">
                {games.map((game, idx) => {
                  const state = pathNodeState(game, progress, nextGameId)
                  const stars = progress.stars[game.id] ?? 0
                  const isLast = idx === games.length - 1

                  const ringClass =
                    state === 'locked'
                      ? 'border-slate-300 bg-slate-100 text-slate-500'
                      : state === 'done'
                        ? 'border-green-400 bg-green-50 text-green-800'
                        : state === 'current'
                          ? 'border-amber-500 bg-amber-50 text-amber-900 ring-2 ring-amber-300'
                          : 'border-sky-300 bg-white text-sky-900'

                  const nodeLabel =
                    state === 'done'
                      ? stars >= STARS_FOR_MASTERY
                        ? '★'
                        : '✓'
                      : state === 'locked'
                        ? '🔒'
                        : state === 'current'
                          ? '▶'
                          : String(idx + 1)
                  const feedbackLabel =
                    state === 'locked'
                      ? 'Locked'
                      : stars >= 2
                        ? 'Great job'
                        : stars >= 1
                          ? 'Keep practicing'
                          : 'Try this game'
                  const feedbackClass =
                    state === 'locked'
                      ? 'bg-slate-200 text-slate-600'
                      : stars >= 2
                        ? 'bg-green-100 text-green-800'
                        : stars >= 1
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-sky-100 text-sky-800'

                  return (
                    <div key={game.id} className="flex gap-3">
                      <div className="flex w-11 shrink-0 flex-col items-center">
                        <div
                          className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${ringClass}`}
                          aria-hidden
                        >
                          {nodeLabel}
                        </div>
                        {!isLast ? <div className="min-h-6 w-0.5 flex-1 bg-sky-300" aria-hidden /> : null}
                      </div>
                      <article className={`min-w-0 flex-1 ${isLast ? '' : 'pb-5'}`}>
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-slate-800">{game.title}</h3>
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${feedbackClass}`}>
                            {feedbackLabel}
                          </span>
                        </div>
                        <p className="mb-2 text-sm text-slate-600">{game.description}</p>
                        <div className="mb-2">
                          <StarBar stars={stars} />
                        </div>
                        {unlocked ? (
                          <Link className="font-medium text-blue-600 underline" to={game.path}>
                            {state === 'current' ? 'Play next' : 'Open'}
                          </Link>
                        ) : (
                          <p className="text-sm text-slate-500">Unlock this world by playing the one above.</p>
                        )}
                      </article>
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>
    </PageShell>
  )
}
