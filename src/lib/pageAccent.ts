/** Tailwind classes for kid-friendly level tint on shells (header strip). */
export function headerAccentClass(levelTint?: 1 | 2 | 3 | 4 | 5): string {
  switch (levelTint) {
    case 1:
      return 'border-sky-200/90 bg-sky-50/95'
    case 2:
      return 'border-emerald-200/90 bg-emerald-50/95'
    case 3:
      return 'border-violet-200/90 bg-violet-50/95'
    case 4:
      return 'border-amber-200/90 bg-amber-50/95'
    case 5:
      return 'border-rose-200/90 bg-rose-50/95'
    default:
      return 'border-white/80 bg-white/80'
  }
}

export function mainAccentClass(levelTint?: 1 | 2 | 3 | 4 | 5): string {
  switch (levelTint) {
    case 1:
      return 'ring-2 ring-sky-100/80'
    case 2:
      return 'ring-2 ring-emerald-100/80'
    case 3:
      return 'ring-2 ring-violet-100/80'
    case 4:
      return 'ring-2 ring-amber-100/80'
    case 5:
      return 'ring-2 ring-rose-100/80'
    default:
      return ''
  }
}
