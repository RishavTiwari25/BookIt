import dotenv from 'dotenv'
import { connectMongo } from '../src/db.js'
import { Experience } from '../src/models/Experience.js'
import { Slot } from '../src/models/Slot.js'
import { PromoCode } from '../src/models/PromoCode.js'
import { Booking } from '../src/models/Booking.js'
import { Counter } from '../src/models/Counter.js'

dotenv.config()

async function main() {
  await connectMongo()
  console.log('Seeding MongoDB...')

  // Clear existing data (dev only)
  await Booking.deleteMany({})
  await Slot.deleteMany({})
  await Experience.deleteMany({})
  await PromoCode.deleteMany({})
  await Counter.deleteMany({})

  const experiences = [
    {
      title: "Jaipur Heritage Walk",
      description: "Explore Pink City’s iconic Hawa Mahal, City Palace lanes, and hidden bazaars with a local guide.",
      location: "Jaipur, Rajasthan",
      pricePerPerson: 799,
      imageUrl: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1600&auto=format&fit=crop",
    },
    {
      title: "Varanasi Ghat Aarti & Boat Ride",
      description: "Witness the mesmerizing Ganga Aarti and glide along the ghats at sunrise in a wooden boat.",
      location: "Varanasi, Uttar Pradesh",
      pricePerPerson: 999,
      imageUrl: "https://images.unsplash.com/photo-1585515764311-81a6509e0b7c?q=80&w=1600&auto=format&fit=crop",
    },
    {
      title: "Mumbai Street Food Trail",
      description: "Taste legendary vada pav, pav bhaji, and kulfi while strolling through iconic neighbourhoods.",
      location: "Mumbai, Maharashtra",
      pricePerPerson: 699,
      imageUrl: "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?q=80&w=1600&auto=format&fit=crop",
    },
    {
      title: "Goa Kayaking in Backwaters",
      description: "Paddle through serene mangroves and spot vibrant birdlife in Goa’s calm backwaters.",
      location: "Baga, Goa",
      pricePerPerson: 1499,
      imageUrl: "https://images.unsplash.com/photo-1593697821310-d8f2e5b1b7e1?q=80&w=1600&auto=format&fit=crop",
    },
    {
      title: "Rishikesh River Rafting",
      description: "Ride the rapids on the Ganges with certified instructors; perfect blend of thrill and views.",
      location: "Rishikesh, Uttarakhand",
      pricePerPerson: 1299,
      imageUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1600&auto=format&fit=crop",
    },
    {
      title: "Kerala Houseboat Day Cruise",
      description: "Glide through Alleppey’s palm-lined canals on a traditional kettuvallam with local lunch.",
      location: "Alleppey, Kerala",
      pricePerPerson: 1999,
      imageUrl: "https://images.unsplash.com/photo-1568809349938-c11c1e2f5c3b?q=80&w=1600&auto=format&fit=crop",
    },
    {
      title: "Delhi India Gate Evening Walk",
      description: "Stroll around India Gate lawns and Rajpath with stories of New Delhi’s grand design.",
      location: "New Delhi, Delhi",
      pricePerPerson: 599,
      imageUrl: "https://source.unsplash.com/featured/1600x900/?india-gate,delhi",
    },
    {
      title: "Agra Taj Sunrise Viewpoint",
      description: "Catch the Taj Mahal glowing at dawn from a quiet riverside spot with chai.",
      location: "Agra, Uttar Pradesh",
      pricePerPerson: 899,
      imageUrl: "https://source.unsplash.com/featured/1600x900/?taj-mahal",
    },
    {
      title: "Udaipur Lake Pichola Sunset Boat",
      description: "Golden-hour cruise past city palace façades and island palaces.",
      location: "Udaipur, Rajasthan",
      pricePerPerson: 1099,
      imageUrl: "https://source.unsplash.com/featured/1600x900/?udaipur,city-palace,lake-pichola",
    },
    {
      title: "Amritsar Golden Temple & Langar",
      description: "Experience shabad kirtan and volunteer at the world’s largest community kitchen.",
      location: "Amritsar, Punjab",
      pricePerPerson: 799,
      imageUrl: "https://source.unsplash.com/featured/1600x900/?golden-temple,amritsar",
    },
  ]

  // Insert experiences with numeric ids starting at 1
  let expId = 1
  const created = [] as { id: number }[]
  for (const exp of experiences) {
    await Experience.create({ id: expId, ...exp })
    created.push({ id: expId })
    expId++
  }

  const now = new Date()
  const addDays = (d: number) => new Date(now.getTime() + d * 24 * 60 * 60 * 1000)
  function slotWindow(dayOffset: number, startHour: number, durationHrs: number) {
    const start = addDays(dayOffset)
    start.setHours(startHour, 0, 0, 0)
    const end = new Date(start.getTime() + durationHrs * 60 * 60 * 1000)
    return { start, end }
  }

  // Insert slots with numeric ids
  let slotId = 1
  for (const e of created) {
    const windows = [
      slotWindow(1, 9, 2),
      slotWindow(2, 14, 2),
      slotWindow(3, 10, 3),
      slotWindow(5, 16, 2),
    ]
    for (const [i, w] of windows.entries()) {
      const total = 8 - i
      await Slot.create({
        id: slotId,
        experienceId: e.id,
        startTime: w.start,
        endTime: w.end,
        totalSpots: total,
        availableSpots: Math.max(0, total - (i === 2 ? 7 : i)),
      })
      slotId++
    }
  }

  await PromoCode.insertMany([
    { id: 1, code: 'SAVE10', discountType: 'PERCENT', value: 10, active: true },
    { id: 2, code: 'FLAT100', discountType: 'FLAT', value: 100, active: true },
    { id: 3, code: 'OFF5', discountType: 'PERCENT', value: 5, active: true },
  ])

  console.log('Seed complete.')
}

main().then(() => process.exit(0)).catch((e) => {
  console.error(e)
  process.exit(1)
})
