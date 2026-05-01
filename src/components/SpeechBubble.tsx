import type { ReactNode } from 'react'

export function SpeechBubble({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative rounded-2xl border-2 border-amber-200 bg-amber-50 px-4 py-3 text-base leading-snug text-slate-800 shadow-sm md:text-lg ${className}`}
    >
      {children}
    </div>
  )
}
