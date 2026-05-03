import { useMemo } from 'react'

const PETALS = ['🌸', '🌺', '🌼', '🌷', '🪷', '✿', '❀', '🌹']

export default function FloatingPetals({ count = 18 }) {
  const petals = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      emoji: PETALS[i % PETALS.length],
      left: `${(i * 5.5 + Math.random() * 8) % 100}%`,
      size: `${0.9 + (i % 4) * 0.3}rem`,
      duration: `${12 + (i % 8) * 3}s`,
      delay: `${(i * 1.3) % 14}s`,
      opacity: 0.35 + (i % 3) * 0.15,
    }))
  }, [count])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {petals.map((p) => (
        <div
          key={p.id}
          className="petal absolute bottom-[-60px] select-none"
          style={{
            left: p.left,
            fontSize: p.size,
            animationDuration: p.duration,
            animationDelay: p.delay,
            opacity: p.opacity,
          }}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  )
}
