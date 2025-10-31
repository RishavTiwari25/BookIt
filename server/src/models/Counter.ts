import mongoose from '../db.js'

const CounterSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  seq: { type: Number, required: true, default: 0 },
})

export type CounterDoc = mongoose.HydratedDocument<{ key: string; seq: number }>

export const Counter = mongoose.models.Counter || mongoose.model('Counter', CounterSchema)

export async function nextSequence(key: string): Promise<number> {
  const updated = await (Counter as any).findOneAndUpdate(
    { key },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  ).lean()
  return updated!.seq as number
}
