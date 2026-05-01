import type { ReactNode } from 'react'

export type CharacterMood = 'idle' | 'thinking' | 'happy' | 'encourage'

/** Wraps mascot + bubble with a light mood-based motion (CSS only). */
export function CharacterReaction({ mood, children }: { mood: CharacterMood; children: ReactNode }) {
  const motion =
    mood === 'happy' ? 'motion-safe:animate-pulse' : mood === 'thinking' ? 'opacity-90' : ''
  return <div className={motion}>{children}</div>
}
