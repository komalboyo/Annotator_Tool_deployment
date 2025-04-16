import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

export async function POST(req: Request) {
    try {
        await connectDB();
        const { username, email, password, role } = await req.json();
        const existingEmail = await User.findOne({ email });
        const existingUsername = await User.findOne({ username });
        if(existingUsername) {
            return NextResponse.json({ error: "This username is taken" }, { status: 400 });
        }
        if(existingEmail) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role,
        });

        await newUser.save();
        return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
    } catch(error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}