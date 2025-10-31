import { useLocation, Link } from 'react-router-dom'

type BookingResult = {
  success: boolean
  error?: string
  data?: { bookingId?: number; quantity?: number; contactPhone?: string | null; finalPrice?: string | number; passengers?: Array<{ name?: string }> }
}

export default function Result() {
  const location = useLocation()
  const state = (location.state ?? undefined) as BookingResult | undefined
  const success = Boolean(state?.success)

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      {success ? (
        <>
          {/* Green check */}
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-green-500">
            <svg viewBox="0 0 24 24" fill="none" className="h-10 w-10">
              <path d="M9 12.75l-2-2L5.25 12.5 9 16.25 18.75 6.5 17 4.75 9 12.75z" fill="white" />
            </svg>
          </div>
          <h1 className="text-3xl font-semibold">Booking Confirmed</h1>
          <p className="mt-2 text-gray-600">Ref ID: <span className="font-mono">{state?.data?.bookingId ?? '—'}</span></p>
          <Link
            to="/"
            className="mt-6 inline-block rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
          >
            Back to Home
          </Link>
        </>
      ) : (
        <>
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-red-500">
            <svg viewBox="0 0 24 24" fill="none" className="h-10 w-10">
              <path d="M7 7l10 10M17 7L7 17" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="text-3xl font-semibold text-red-700">Booking Failed</h1>
          <p className="mt-2 text-gray-600">{state?.error || 'Something went wrong.'}</p>
          <Link
            to="/"
            className="mt-6 inline-block rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
          >
            Back to Home
          </Link>
        </>
      )}
    </div>
  )
}
