import mongoose from '../db.js'

const SlotSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true, index: true },
  experienceId: { type: Number, required: true, index: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  totalSpots: { type: Number, required: true },
  availableSpots: { type: Number, required: true },
  createdAt: { type: Date, default: () => new Date() },
})

export type SlotDoc = mongoose.HydratedDocument<{
  id: number;
  experienceId: number;
  startTime: Date;
  endTime: Date;
  totalSpots: number;
  availableSpots: number;
  createdAt?: Date;
}>

export const Slot = mongoose.models.Slot || mongoose.model('Slot', SlotSchema)
