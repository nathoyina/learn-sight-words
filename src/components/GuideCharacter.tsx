export type GuideKind = 'owl' | 'fox'

const EMOJI: Record<GuideKind, string> = {
  owl: '🦉',
  fox: '🦊',
}

export function GuideCharacter({
  kind = 'owl',
  className = '',
  bounce = false,
}: {
  kind?: GuideKind
  className?: string
  /** Brief celebratory motion */
  bounce?: boolean
}) {
  return (
    <div
      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-amber-100 to-orange-100 text-3xl shadow-md md:h-16 md:w-16 md:text-4xl ${bounce ? 'animate-bounce' : ''} ${className}`}
      aria-hidden
    >
      {EMOJI[kind]}
    </div>
  )
}
