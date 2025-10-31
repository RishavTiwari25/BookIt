import mongoose from '../db.js'

const BookingSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true, index: true },
  slotId: { type: Number, required: true, index: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  contactPhone: { type: String, default: null },
  promoCodeUsed: { type: String, default: null },
  quantity: { type: Number, required: true },
  passengers: { type: Array, default: null },
  finalPrice: { type: Number, required: true },
  bookingTime: { type: Date, default: () => new Date() },
})

export type BookingDoc = mongoose.HydratedDocument<{
  id: number;
  slotId: number;
  userName: string;
  userEmail: string;
  contactPhone?: string | null;
  promoCodeUsed?: string | null;
  quantity: number;
  passengers?: any[] | null;
  finalPrice: number;
  bookingTime?: Date;
}>

export const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema)
