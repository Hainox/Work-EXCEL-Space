interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  children: React.ReactNode
}

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  const base = 'inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100',
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
