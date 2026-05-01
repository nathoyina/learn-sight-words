import { Link, NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'
import { GuideCharacter } from './GuideCharacter'
import { SpeechBubble } from './SpeechBubble'
import { headerAccentClass, mainAccentClass } from '../lib/pageAccent'

export function PageShell({
  title,
  children,
  levelTint,
  headerStars,
  headerStreak,
  headerMascotHint,
}: {
  title: string
  children: ReactNode
  /** Optional level-colored header strip (1–5). */
  levelTint?: 1 | 2 | 3 | 4 | 5
  /** Show total stars chip in header when defined. */
  headerStars?: number
  /** Show gentle play streak when greater than zero. */
  headerStreak?: number
  /** Short encouraging line next to the guide in the header. */
  headerMascotHint?: string
}) {
  const headerTint = headerAccentClass(levelTint)
  const mainTint = mainAccentClass(levelTint)

  return (
    <div className="mx-auto min-h-screen w-full max-w-5xl p-4 pb-10 md:p-8">
      <header
        className={`mb-4 rounded-3xl border-2 p-4 shadow md:flex md:flex-wrap md:items-center md:justify-between ${headerTint}`}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Link to="/" className="text-2xl font-bold text-pink-500">
            Sight Word Adventure
          </Link>
          {headerMascotHint ? (
            <div className="hidden items-center gap-2 md:flex">
              <GuideCharacter kind="owl" className="h-10 w-10 text-2xl md:h-12 md:w-12 md:text-3xl" />
              <SpeechBubble className="max-w-xs py-2 text-sm">{headerMascotHint}</SpeechBubble>
            </div>
          ) : null}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3 md:mt-0">
          {headerStars !== undefined ? (
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-amber-900">
              ⭐ {headerStars}
            </span>
          ) : null}
          {headerStreak !== undefined && headerStreak > 0 ? (
            <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-900">
              🔥 {headerStreak} day{headerStreak === 1 ? '' : 's'}
            </span>
          ) : null}
          <nav className="flex flex-wrap gap-2">
            <NavLink to="/quiz" className="rounded-xl bg-purple-100 px-3 py-2 text-sm font-medium">
              Placement Quiz
            </NavLink>
            <NavLink to="/map" className="rounded-xl bg-purple-100 px-3 py-2 text-sm font-medium">
              Level Map
            </NavLink>
            <NavLink to="/teacher" className="rounded-xl bg-blue-100 px-3 py-2 text-sm font-medium">
              Teacher
            </NavLink>
          </nav>
        </div>
      </header>
      <main className={`card ${mainTint}`}>
        <h1 className="mb-4 text-3xl font-bold text-slate-800 md:text-4xl">{title}</h1>
        {children}
      </main>
    </div>
  )
}
