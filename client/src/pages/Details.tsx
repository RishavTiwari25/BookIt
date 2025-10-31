import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api, type Experience, type Slot } from '../lib/api'
import LoadingSpinner from '../components/LoadingSpinner'
import { formatINR } from '../lib/currency'
import { getExperienceImage, fallbackImg } from '../lib/images'
// Removed extra informational sections and attraction strip to simplify per request

export default function Details() {
  const { id } = useParams()
  const [exp, setExp] = useState<(Experience & { slots: Slot[] }) | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const [qty, setQty] = useState<number>(1)
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) return
    let mounted = true
    api.get(`/experiences/${id}`)
      .then((res: { data: Experience & { slots: Slot[] } }) => { if (mounted) setExp(res.data) })
      .catch(() => { if (mounted) setError('Failed to load') })
    return () => { mounted = false }
  }, [id])

  const slots = useMemo(() => exp?.slots ?? [], [exp])
  // Group slots by date for date/time selection UI
  const dateKeys = useMemo(() => {
    const keys = Array.from(
      new Set(
        slots
          .map((s) => new Date(s.startTime))
          .map((d) => d.toISOString().slice(0, 10))
      )
    )
    // sort ascending by date key
    return keys.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
  }, [slots])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  useEffect(() => {
    if (!selectedDate && dateKeys.length > 0) setSelectedDate(dateKeys[0])
  }, [dateKeys, selectedDate])
  const timesForSelected = useMemo(() => {
    if (!selectedDate) return [] as Slot[]
    return slots
      .filter((s) => new Date(s.startTime).toISOString().slice(0, 10) === selectedDate)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
  }, [slots, selectedDate])

  if (error) return <div className="max-w-5xl mx-auto px-4 py-12 text-red-600">{error}</div>
  if (!exp) return <LoadingSpinner />

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="relative overflow-hidden rounded-2xl aspect-[4/3]">
          <img
            src={getExperienceImage(exp.id, exp.imageUrl)}
            alt={exp.title}
            className="h-full w-full object-cover animate-pan-x"
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement
              // const local = getLocalImage(exp.id)
              // if (local && img.src !== local) { img.src = local; return }
              if (img.src !== fallbackImg) { img.onerror = null; img.src = fallbackImg }
            }}
            loading="lazy"
            decoding="async"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
        </div>
        {/* Price summary panel */}
        <aside className="bg-white rounded-xl border p-4 h-max">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Starts at</span>
              <span className="font-semibold">{formatINR(exp.pricePerPerson)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Quantity</span>
              <div className="flex items-center gap-2">
                <button
                  aria-label="decrease"
                  className="h-7 w-7 grid place-items-center rounded border text-gray-700 disabled:opacity-40"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                >
                  −
                </button>
                <span className="min-w-[1.75rem] text-center text-sm">{qty}</span>
                <button
                  aria-label="increase"
                  className="h-7 w-7 grid place-items-center rounded border text-gray-700"
                  onClick={() => setQty((q) => {
                    const max = (selected ? (slots.find(s=>s.id===selected)?.availableSpots ?? 99) : 99)
                    return Math.min(max, q + 1)
                  })}
                >
                  +
                </button>
              </div>
            </div>
            <hr />
            {(() => {
              const per = Number(exp.pricePerPerson)
              const subtotal = per * qty
              const taxes = Math.round(subtotal * 0.06)
              const total = subtotal + taxes
              return (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatINR(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Taxes</span>
                    <span>{formatINR(taxes)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold">{formatINR(total)}</span>
                  </div>
                </div>
              )
            })()}
            <button
              className={`mt-3 w-full rounded-lg py-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${selected ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-900' : 'bg-gray-200 text-gray-700'}`}
              disabled={!selected}
              onClick={() => {
                const slot = slots.find(s => s.id === selected) || null
                navigate('/checkout', { state: { experience: exp, slotId: selected, slot, initialQuantity: qty } })
              }}
            >
              Confirm
            </button>
          </div>
        </aside>
      </div>


      {/* Date/Time selector styled like the reference */}
      <div className="mt-8 space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Choose date</h3>
          <div className="flex flex-wrap gap-2">
            {dateKeys.map((key) => {
              const d = new Date(key)
              const label = d.toLocaleDateString(undefined, { month: 'short', day: '2-digit' })
              const isSel = key === selectedDate
              return (
                <button
                  key={key}
                  onClick={() => { setSelectedDate(key); setSelected(null) }}
                  className={`rounded-md border px-3 py-2 text-sm transition ${isSel ? 'border-yellow-500 ring-2 ring-yellow-300 bg-yellow-100 font-semibold' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Choose time</h3>
          <div className="flex flex-wrap gap-2">
            {timesForSelected.map((s) => {
              const soldOut = s.availableSpots <= 0
              const isSelected = s.id === selected
              const timeLabel = new Date(s.startTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
              return (
                <button
                  key={s.id}
                  onClick={() => !soldOut && setSelected(s.id)}
                  disabled={soldOut}
                  className={`rounded-md border px-3 py-2 text-sm text-left transition ${isSelected ? 'border-yellow-500 ring-2 ring-yellow-300 bg-yellow-50' : 'border-gray-200 bg-white hover:border-gray-300'} ${soldOut ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
                >
                  <span>{timeLabel}</span>
                  {soldOut ? (
                    <span className="ml-2 text-[11px] text-gray-500">Sold out</span>
                  ) : (
                    <span className="ml-2 text-[11px] text-orange-600">{s.availableSpots} left</span>
                  )}
                </button>
              )
            })}
          </div>
          <p className="mt-2 text-xs text-muted">All times are in IST (GMT +5:30)</p>
        </div>
      </div>

      {/* About banner */}
      <div className="mt-8">
        <h3 className="font-semibold mb-2">About</h3>
        <div className="rounded-md bg-gray-100 text-gray-600 text-sm px-3 py-2">
          {exp.description || 'Scenic routes, trained guides, and safety briefing. Minimum age 10.'}
        </div>
      </div>

      {/* Bottom CTA removed per request; booking action lives in the right sidebar "Confirm" button */}
    </div>
  )
}
