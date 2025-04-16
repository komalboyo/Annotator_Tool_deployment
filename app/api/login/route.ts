import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

const JWT_SECRET = process.env.JWT_SECRET!; 

export async function POST(req: Request) {
    try {
        await connectDB();

        const { username, password } = await req.json();
        const user = await User.findOne({ username });

        if(!user) {
            return NextResponse.json({ error: "Invalid username" }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return NextResponse.json({ error: "Invalid password" }, { status: 401 });
        }

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username,
                role: user.role,
            },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        const response = NextResponse.json({
            message: "Login successful!",
             user: {
                id: user._id,
                username: user.username,
                role: user.role,
            }
        });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, 
            path: "/"
        });

        return response;

    } catch(error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
