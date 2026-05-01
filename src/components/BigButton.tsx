import type { ComponentPropsWithoutRef } from 'react'

interface BigButtonProps extends ComponentPropsWithoutRef<'button'> {
  label: string
}

export function BigButton({ label, className = '', ...props }: BigButtonProps) {
  return (
    <button
      {...props}
      className={`w-full rounded-2xl bg-sky-400 px-5 py-4 text-xl font-semibold text-white shadow-md transition hover:scale-[1.01] hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-slate-300 ${className}`}
    >
      {label}
    </button>
  )
}
