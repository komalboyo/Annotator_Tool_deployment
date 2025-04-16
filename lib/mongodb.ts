import mongoose from "mongoose";
const MONGO_URI = process.env.MONGO_URI!;

export async function connectDB() {
  if(mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(MONGO_URI, { dbName: "mydatabase" });
    console.log("MongoDB Connected");
  } catch(error) {
    console.error("MongoDB connection failed", error);
    process.exit(1);
  }
}