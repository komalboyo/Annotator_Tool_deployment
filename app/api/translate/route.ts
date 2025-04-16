import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { getUserFromCookies } from "@/lib/auth";
import Annotation from "@/models/Annotation";

export async function POST(req: NextRequest) {
  await connectDB();

  const user = await getUserFromCookies();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const annotatorId = new mongoose.Types.ObjectId(user.id);
  const { textId, translatedText } = await req.json();

  if (!textId || !translatedText) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const updated = await Annotation.findOneAndUpdate(
    {
      textId: new mongoose.Types.ObjectId(textId),
      annotatorId: annotatorId,
    },
    {
      translatedText,
      createdAt: new Date(),
    },
    {
      new: true, 
      upsert: true, 
      setDefaultsOnInsert: true, 
    }
  );

  if (!updated) {
    return NextResponse.json({ error: "Annotation not found" }, { status: 404 });
  }

  return NextResponse.json({
    message: "Translation submitted successfully",
    annotation: updated,
  });
}
