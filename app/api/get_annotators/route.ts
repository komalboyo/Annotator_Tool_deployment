import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    const annotators = await User.find({ role: "annotator" }).select("-password");
    
    return NextResponse.json({ annotators }, { status: 200 });
  } catch (error) {
    console.error("Error fetching annotators:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}