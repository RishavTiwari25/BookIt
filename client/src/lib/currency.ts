export const formatINR = (value: number | string, opts: Intl.NumberFormatOptions = {}) => {
  const num = typeof value === 'string' ? parseFloat(value) : value
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
    ...opts,
  })
  return formatter.format(Number.isFinite(num) ? num : 0)
}
