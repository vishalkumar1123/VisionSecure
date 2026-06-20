import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

declare global {
  var mongooseConnection:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

let cached = global.mongooseConnection;

if (!cached) {
  cached = global.mongooseConnection = {
    conn: null,
    promise: null,
  };
}

export async function connectDB() {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    cached!.promise = mongoose.connect(MONGODB_URI!, {
      dbName: "visionsecure",
    });
  }

  try {
    cached!.conn = await cached!.promise;

    console.log("✅ MongoDB Atlas Connected");

    return cached!.conn;
  } catch (error) {
    cached!.promise = null;

    console.error("❌ MongoDB Connection Error:", error);

    throw error;
  }
}