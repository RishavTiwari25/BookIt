import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import Home from './pages/Home.tsx'
import Details from './pages/Details.tsx'
import Checkout from './pages/Checkout.tsx'
import Result from './pages/Result.tsx'
import Header from './components/Header.tsx'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-white text-gray-900">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/experiences" element={<Home />} />
            <Route path="/experiences/:id" element={<Details />} />
            {/* Backward-compat: redirect old /details/:id to /experiences/:id */}
            <Route path="/details/:id" element={<LegacyDetailsRedirect />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/booking-result" element={<Result />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

function LegacyDetailsRedirect() {
  const { id } = useParams()
  return <Navigate to={`/experiences/${id ?? ''}`} replace />
}
