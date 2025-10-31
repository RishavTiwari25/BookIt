import mongoose from '../db.js';
const ExperienceSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    location: { type: String, required: true },
    pricePerPerson: { type: Number, required: true },
    imageUrl: { type: String, default: '' },
}, { timestamps: true });
export const Experience = mongoose.models.Experience || mongoose.model('Experience', ExperienceSchema);
//# sourceMappingURL=Experience.js.map