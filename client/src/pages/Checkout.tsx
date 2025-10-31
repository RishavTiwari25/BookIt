import { useLocation, useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import { api, type Experience, type Slot } from '../lib/api'
import { formatINR } from '../lib/currency'

export default function Checkout() {
  const { state } = useLocation() as { state?: { experience: Experience; slotId: number; slot?: Slot | null; initialQuantity?: number } }
  const navigate = useNavigate()
  const exp = state?.experience
  const slotId = state?.slotId
  const slot = state?.slot || null

  const [name, setName] = useState('') // primary contact name
  const [email, setEmail] = useState('') // primary contact email
  // Contact phone optional; omitted in UI per reference layout
  const [promo, setPromo] = useState('')
  const [discount, setDiscount] = useState<number>(0)
  const [discountType, setDiscountType] = useState<'PERCENT' | 'FLAT' | null>(null)
  const initialQty = Math.max(1, Number(state?.initialQuantity || 1))
  const [loading, setLoading] = useState(false)
  const [agree, setAgree] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const totals = useMemo(() => {
    if (!exp) return { perPerson: 0, subtotal: 0, discountValue: 0, taxes: 0, total: 0 }
    const per = parseFloat(exp.pricePerPerson)
  const qty = initialQty
    const subtotal = per * qty
    let discountValue = 0
    if (discountType === 'PERCENT') discountValue = (subtotal * discount) / 100
    if (discountType === 'FLAT') discountValue = discount
    const taxableBase = Math.max(0, subtotal - discountValue)
    const taxes = Math.round(taxableBase * 0.06)
    const total = Math.max(0, taxableBase + taxes)
    return { perPerson: per, subtotal, discountValue, taxes, total }
  }, [exp, discount, discountType, initialQty])

  if (!exp || !slotId) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <p className="text-red-600">Missing selection. Please choose an experience again.</p>
        <Button className="mt-4" onClick={() => navigate('/')}>Go Home</Button>
      </div>
    )
  }

  const applyPromo = async () => {
    setError(null)
    try {
      const res = await api.post('/promo/validate', { code: promo })
      if (res.data.valid) {
        setDiscount(res.data.value)
        setDiscountType(res.data.discount_type)
      } else {
        setError('Invalid promo code')
        setDiscount(0)
        setDiscountType(null)
      }
    } catch {
      setError('Failed to validate promo code')
    }
  }

  const confirm = async () => {
    setLoading(true)
    setError(null)
    try {
      const resp = await api.post('/bookings', {
        slot_id: slotId,
        user_name: name,
        user_email: email,
        contact_phone: undefined,
        passengers: undefined,
        quantity: initialQty,
        promo_code: promo || undefined,
      })
      navigate('/booking-result', { state: { success: true, data: resp.data } })
    } catch (e: unknown) {
      const err = e as { response?: { data?: { error?: string } } }
      const message = err?.response?.data?.error || 'Failed to book'
      setError(message)
      navigate('/booking-result', { state: { success: false, error: message } })
    } finally {
      setLoading(false)
    }
  }

  const nameError = name.trim() ? '' : 'Name is required'
  const emailError = /[^@\s]+@[^@\s]+\.[^@\s]+/.test(email) ? '' : 'Valid email required'
  const formValid = !nameError && !emailError

  // Derived date/time strings for summary panel
  const slotDateObj = slot ? new Date(slot.startTime) : null
  const dateStr = slotDateObj ? slotDateObj.toISOString().slice(0, 10) : '—'
  const timeStr = slotDateObj ? slotDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-4">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-6 items-start">
        {/* Left: form card like reference */}
        <div className="rounded-xl bg-gray-100 p-4 md:p-5">
          <div className="grid sm:grid-cols-2 gap-3">
            <TextInput label="Full name" value={name} onChange={e => setName(e.target.value)} error={nameError} />
            <TextInput label="Email" value={email} onChange={e => setEmail(e.target.value)} error={emailError} />
          </div>
          <div className="mt-3 flex gap-2 items-end">
            <TextInput label="Promo code" value={promo} onChange={e => setPromo(e.target.value)} className="flex-1" />
            <button onClick={applyPromo} className="h-10 px-4 rounded-md bg-black text-white font-medium">Apply</button>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <input id="agree" type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
            <label htmlFor="agree">I agree to the terms and safety policy</label>
          </div>
          {error && <p className="text-red-600 mt-3">{error}</p>}
        </div>

        {/* Right: summary card with Pay and Confirm */}
        <aside className="rounded-xl border p-5 bg-white">
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between"><span className="text-gray-600">Experience</span><span className="font-medium">{exp.title}</span></div>
            <div className="flex items-center justify-between"><span className="text-gray-600">Date</span><span>{dateStr}</span></div>
            <div className="flex items-center justify-between"><span className="text-gray-600">Time</span><span>{timeStr}</span></div>
            <div className="flex items-center justify-between"><span className="text-gray-600">Qty</span><span>{initialQty}</span></div>
            <div className="flex items-center justify-between"><span className="text-gray-600">Subtotal</span><span>{formatINR(totals.subtotal)}</span></div>
            {discountType && (
              <div className="flex items-center justify-between text-green-700"><span>Discount</span><span>-{formatINR(totals.discountValue)}</span></div>
            )}
            <div className="flex items-center justify-between"><span className="text-gray-600">Taxes</span><span>{formatINR(totals.taxes)}</span></div>
            <hr className="my-2" />
            <div className="flex items-center justify-between text-lg"><span className="font-semibold">Total</span><span className="font-bold">{formatINR(totals.total, { maximumFractionDigits: 0 })}</span></div>
          </div>
          <button
            className={`mt-4 w-full rounded-lg py-2 font-semibold transition-colors ${(!formValid || loading || !agree) ? 'bg-gray-200 text-gray-700 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500 text-gray-900'}`}
            onClick={confirm}
            disabled={!formValid || loading || !agree}
          >
            {loading ? 'Processing…' : 'Pay and Confirm'}
          </button>
        </aside>
      </div>

      {/* Members section removed per request */}
    </div>
  )
}
