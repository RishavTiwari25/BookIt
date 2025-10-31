import mongoose from 'mongoose';
const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bookit';
export async function connectMongo() {
    if (mongoose.connection.readyState === 1)
        return mongoose;
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri);
    return mongoose;
}
export default mongoose;
//# sourceMappingURL=db.js.map