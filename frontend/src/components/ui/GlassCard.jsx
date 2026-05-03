import clsx from 'clsx'

export default function GlassCard({ children, className = '', hover = true, onClick }) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'glass-card p-6',
        hover && 'cursor-default',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}
