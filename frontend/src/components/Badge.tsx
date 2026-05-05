interface BadgeProps {
  children: React.ReactNode
  variant?: 'gray' | 'blue' | 'green'
}

export function Badge({ children, variant = 'gray' }: BadgeProps) {
  const variants = {
    gray: 'bg-gray-100 text-gray-600',
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
  }
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  )
}
