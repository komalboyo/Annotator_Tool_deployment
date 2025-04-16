import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  try {
    await connectDB();

    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const actingUserId = decoded.id;
    const actingUser = await User.findById(actingUserId);

    if (!actingUser || actingUser.role !== "superadmin") {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    const { username, newRole } = await req.json();

    if (!["annotator", "admin"].includes(newRole)) {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    const updatedUser = await User.findOneAndUpdate(
      { username },
      { role: newRole },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: `Role updated to ${newRole}`,
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        role: updatedUser.role,
      },
    });
  } catch (err) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}