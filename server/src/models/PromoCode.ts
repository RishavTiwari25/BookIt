import mongoose from '../db.js'

const PromoCodeSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true, index: true },
  code: { type: String, required: true, unique: true, index: true },
  discountType: { type: String, enum: ['PERCENT', 'FLAT'], required: true },
  value: { type: Number, required: true },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: () => new Date() },
})

export type PromoCodeDoc = mongoose.HydratedDocument<{
  id: number;
  code: string;
  discountType: 'PERCENT' | 'FLAT';
  value: number;
  active: boolean;
  createdAt?: Date;
}>

export const PromoCode = mongoose.models.PromoCode || mongoose.model('PromoCode', PromoCodeSchema)
