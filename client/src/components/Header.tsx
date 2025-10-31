import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from './Button'

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const [term, setTerm] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const q = params.get('q') || ''
    setTerm(q)
  }, [location.search])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = term.trim()
    if (!q) {
      navigate('/')
    } else {
      navigate(`/?q=${encodeURIComponent(q)}`)
    }
  }

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
        <a href="/" className="font-extrabold text-xl tracking-tight text-primary">BookIt</a>
        <form onSubmit={onSubmit} className="sm:ml-auto flex w-full sm:max-w-xl items-stretch">
          <label htmlFor="site-search" className="sr-only">Search experiences</label>
          <input
            id="site-search"
            type="search"
            value={term}
            onChange={e => setTerm(e.target.value)}
            placeholder="Search experiences"
            className="flex-1 rounded-l-full border px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus:border-primary"
          />
          <Button type="submit" variant="secondary" className="rounded-l-none rounded-r-full bg-secondary text-black hover:brightness-95">
            Search
          </Button>
        </form>
      </div>
    </header>
  )
}
