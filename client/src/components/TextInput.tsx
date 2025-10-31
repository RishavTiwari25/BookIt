type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
}

export default function TextInput({ label, error, className = '', ...props }: Props) {
  return (
    <label className="block text-sm">
      {label && <span className="text-gray-700 mb-1 block">{label}</span>}
      <input
        className={`w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-600 mt-1 block">{error}</span>}
    </label>
  )
}
