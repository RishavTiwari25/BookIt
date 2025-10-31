import { Link } from 'react-router-dom'
import type { Experience } from '../lib/api'
import { formatINR } from '../lib/currency'
import { getExperienceImage, fallbackImg } from '../lib/images'

export default function ExperienceCard({ exp }: { exp: Experience }) {
  const price = Number.parseFloat(exp.pricePerPerson)
  const hasImage = Boolean(exp.imageUrl && exp.imageUrl.trim().length > 0)
  return (
    <div className="group relative rounded-2xl overflow-hidden border border-gray-200 bg-white shadow hover:shadow-md transition-all">
      {/* Image */}
      <Link to={`/experiences/${exp.id}`} className="block">
        <div className={`relative aspect-[4/3] overflow-hidden`}>
          {hasImage ? (
            <img
              src={getExperienceImage(exp.id, exp.imageUrl)}
              alt={exp.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement
                // const local = getLocalImage(exp.id)
                // if (local && img.src !== local) { img.src = local; return }
                if (img.src !== fallbackImg) { img.onerror = null; img.src = fallbackImg }
              }}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-100" />
          )}
        </div>
      </Link>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-lg line-clamp-2 text-gray-900">{exp.title}</h3>
          <span className="shrink-0 rounded-full bg-gray-200 text-gray-800 px-3 py-1 text-xs font-medium">{exp.location}</span>
        </div>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {exp.description || 'Curated small-group experience. Certified guide. Safety first with gear included.'}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-600">
            From <span className="text-gray-900 font-bold">{formatINR(price)}</span>
          </span>
          <Link to={`/experiences/${exp.id}`} className="inline-block">
            <button className="h-9 px-4 rounded-lg bg-yellow-400 text-gray-900 font-medium hover:bg-yellow-500 transition-colors">View Details</button>
          </Link>
        </div>
      </div>
    </div>
  )
}
