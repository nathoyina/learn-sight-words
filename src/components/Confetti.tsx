export function Confetti({ show }: { show: boolean }) {
  if (!show) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden>
      {Array.from({ length: 20 }, (_, i) => (
        <span
          key={i}
          className="absolute text-2xl"
          style={{
            left: `${5 + i * 5}%`,
            top: `${10 + (i % 3) * 8}%`,
            animation: `drop ${900 + i * 30}ms ease-in forwards`,
          }}
        >
          {['🎉', '✨', '🎊'][i % 3]}
        </span>
      ))}
      <style>{`@keyframes drop { from { transform: translateY(-20px); opacity: 1; } to { transform: translateY(70vh); opacity: 0; }}`}</style>
    </div>
  )
}
