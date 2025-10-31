type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  full?: boolean
}

export default function Button({ variant = 'primary', size = 'md', full = false, className = '', ...props }: Props) {
  const base = 'inline-flex items-center justify-center rounded-full font-semibold transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30'
  const sizes = size === 'sm'
    ? 'text-xs px-3 py-1.5'
    : size === 'lg'
      ? 'text-base px-6 py-3'
      : 'text-sm px-4 py-2'
  const styles = variant === 'primary'
    ? 'bg-primary text-white hover:opacity-90'
    : variant === 'secondary'
      ? 'bg-secondary/15 text-secondary hover:bg-secondary/20'
      : 'bg-transparent text-primary hover:bg-primary/10'
  const width = full ? 'w-full' : ''
  return <button className={`${base} ${sizes} ${styles} ${width} ${className}`} {...props} />
}
