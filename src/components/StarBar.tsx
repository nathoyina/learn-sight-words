export function StarBar({ stars }: { stars: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${stars} stars`}>
      {Array.from({ length: 3 }, (_, i) => (
        <span key={i} className="text-2xl">
          {i < stars ? '⭐' : '☆'}
        </span>
      ))}
    </div>
  )
}
