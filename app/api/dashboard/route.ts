import { NextResponse } from "next/server";
import { getUserFromCookies } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET() {
  try {
    await connectDB();

    const user = await getUserFromCookies();

    const userId = user.id;
    const role = user.role;

    let projects;
    console.log("ROLE IN THE BACKEND :", role)
    if(role === "annotator") {
      projects = await Project.find({ annotators: userId }).sort({ createdAt: -1 });
       console.log(projects)
    } else if(role === "admin") {
      projects = await Project.find({ adminId: userId }).sort({ createdAt: -1 });
    } else {
      return NextResponse.json({ error: "Invalid role" }, { status: 403 });
    }

    return NextResponse.json({ projects }, { status: 200 });
  } catch(error) {
    console.error("Dashboard fetch error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
