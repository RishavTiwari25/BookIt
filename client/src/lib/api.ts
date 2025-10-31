import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

export const api = axios.create({ baseURL })

export type Experience = {
  id: number
  title: string
  description: string
  location: string
  pricePerPerson: string
  imageUrl: string
}

export type Slot = {
  id: number
  experienceId: number
  startTime: string
  endTime: string
  totalSpots: number
  availableSpots: number
}
