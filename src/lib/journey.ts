import { gameMeta } from './gameMeta'
import type { GameId, GameMeta, Progress } from './types'

export const STARS_FOR_MASTERY = 3

const LEVEL_CHAPTER: Record<number, string> = {
  1: 'Sound safari',
  2: 'Word builders',
  3: 'Rhyme and families',
  4: 'Pictures and themes',
  5: 'Reading adventures',
}

export function levelChapterTitle(level: number): string {
  return LEVEL_CHAPTER[level] ?? `Level ${level}`
}

export type PathNodeState = 'locked' | 'unlocked' | 'current' | 'done'

/** First unlocked game in path order that is not yet mastered (under 3 stars). */
export function getNextGame(progress: Progress): GameMeta | null {
  for (const game of gameMeta) {
    if (game.level > progress.unlockedLevels) continue
    const earned = progress.stars[game.id] ?? 0
    if (earned < STARS_FOR_MASTERY) return game
  }
  const fallback = gameMeta.find((g) => g.level <= progress.unlockedLevels)
  return fallback ?? null
}

export function getNextGameId(progress: Progress): GameId | null {
  return getNextGame(progress)?.id ?? null
}

export function pathNodeState(game: GameMeta, progress: Progress, nextGameId: GameId | null): PathNodeState {
  if (game.level > progress.unlockedLevels) return 'locked'
  const earned = progress.stars[game.id] ?? 0
  if (earned >= STARS_FOR_MASTERY) return 'done'
  if (nextGameId !== null && game.id === nextGameId) return 'current'
  return 'unlocked'
}

export function levelCompletion(progress: Progress, level: number): { earned: number; total: number } {
  const games = gameMeta.filter((g) => g.level === level)
  const earned = games.filter((g) => (progress.stars[g.id] ?? 0) >= 1).length
  return { earned, total: games.length }
}
