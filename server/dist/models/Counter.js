import mongoose from '../db.js';
const CounterSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    seq: { type: Number, required: true, default: 0 },
});
export const Counter = mongoose.models.Counter || mongoose.model('Counter', CounterSchema);
export async function nextSequence(key) {
    const updated = await Counter.findOneAndUpdate({ key }, { $inc: { seq: 1 } }, { new: true, upsert: true }).lean();
    return updated.seq;
}
//# sourceMappingURL=Counter.js.map