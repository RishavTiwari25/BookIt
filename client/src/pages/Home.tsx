import { useEffect, useMemo, useState } from 'react'
import { api, type Experience } from '../lib/api'
import LoadingSpinner from '../components/LoadingSpinner'
import ExperienceCard from '../components/ExperienceCard'
// Button removed with hero panel
import { useSearchParams } from 'react-router-dom'

export default function Home() {
  const [data, setData] = useState<Experience[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [params] = useSearchParams()
  const q = (params.get('q') || '').toLowerCase().trim()

  useEffect(() => {
    let mounted = true
    api.get<Experience[]>('/experiences')
      .then((r: { data: Experience[] }) => { if (mounted) setData(r.data) })
      .catch(() => { if (mounted) setError('Failed to load experiences') })
    return () => { mounted = false }
  }, [])

  const filtered = useMemo(() => {
    if (!data) return null as unknown as Experience[] | null
    if (!q) return data
    return data.filter(exp =>
      exp.title.toLowerCase().includes(q) ||
      exp.location.toLowerCase().includes(q) ||
      (exp.description || '').toLowerCase().includes(q)
    )
  }, [data, q])

  if (error) return <div className="max-w-6xl mx-auto px-4 py-12 text-red-600">{error}</div>
  if (!data || !filtered) return <LoadingSpinner />

  return (
    <div>
      {/* Grid */}
      <div id="popular" className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold">
            {q ? `Search results for “${q}”` : 'Popular experiences'}
          </h2>
        </div>
        {filtered.length === 0 ? (
          <div className="text-muted text-sm">No experiences match your search.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-7">
            {filtered.slice(0, 10).map(exp => (
              <ExperienceCard key={exp.id} exp={exp} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
