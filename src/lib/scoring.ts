export function toStars(correct: number, total: number): number {
  const ratio = correct / Math.max(total, 1)
  if (ratio >= 0.9) return 3
  if (ratio >= 0.6) return 2
  if (ratio >= 0.3) return 1
  return 0
}
