import mongoose from '../db.js';
const SlotSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true, index: true },
    experienceId: { type: Number, required: true, index: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    totalSpots: { type: Number, required: true },
    availableSpots: { type: Number, required: true },
    createdAt: { type: Date, default: () => new Date() },
});
export const Slot = mongoose.models.Slot || mongoose.model('Slot', SlotSchema);
//# sourceMappingURL=Slot.js.map