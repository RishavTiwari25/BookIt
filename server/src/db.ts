import mongoose from 'mongoose'

function resolveMongoUri(): string {
  const raw = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bookit'
  try {
    const u = new URL(raw)
    // Ensure a database name is present; many SRV strings omit it which stores data in "test"
    if (!u.pathname || u.pathname === '/') {
      u.pathname = '/bookit'
    }
    return u.toString()
  } catch {
    // Fallback to raw on malformed URL; mongoose can still attempt to parse
    return raw
  }
}

export async function connectMongo() {
  if (mongoose.connection.readyState === 1) return mongoose
  mongoose.set('strictQuery', true)
  const uri = resolveMongoUri()
  await mongoose.connect(uri)
  return mongoose
}

export default mongoose
