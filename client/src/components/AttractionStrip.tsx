import { useEffect, useRef, useState } from 'react'
import { ATTRACTIONS, getCityKey } from '../lib/attractions'

export default function AttractionStrip({ location }: { location: string }) {
  const city = getCityKey(location)
  const items = ATTRACTIONS[city] ?? []
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    let raf = 0
    const el = scrollerRef.current
    if (!el) return
    const step = () => {
      if (!paused) {
        el.scrollLeft += 0.7 // gentle auto-scroll right
        // loop back when reaching end
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 2) {
          el.scrollLeft = 0
        }
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [paused, location])

  if (items.length === 0) return null

  return (
    <div className="mt-8">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold">Top sights in {city}</h3>
        <span className="text-xs text-muted">Auto-scroll · hover to pause</span>
      </div>
      <div
        ref={scrollerRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="relative overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none' }}
      >
        <div className="flex gap-3 min-w-max pr-2">
          {items.map((a, idx) => (
            <div
              key={idx}
              className="snap-start shrink-0 w-56 h-32 rounded-xl bg-gradient-to-br from-indigo-400 to-sky-500 relative overflow-hidden border border-slate-200 shadow-sm"
            >
              <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[radial-gradient(circle_at_30%_20%,white,transparent_40%),radial-gradient(circle_at_70%_80%,white,transparent_40%)]" />
              <div className="absolute bottom-2 left-2 right-2 text-white text-sm font-medium drop-shadow-sm">
                {a.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
