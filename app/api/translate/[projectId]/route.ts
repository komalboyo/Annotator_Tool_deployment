import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { getUserFromCookies } from "@/lib/auth";
import Annotation from "@/models/Annotation";
import Text from "@/models/Text";

export async function GET(req: NextRequest, { params }: { params: { projectId: string } }) {
  await connectDB();

  const user = await getUserFromCookies();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const annotatorId = new mongoose.Types.ObjectId(user.id);
  const { projectId } = await params;
  const temp = Text.findOne();

  const annotations = await Annotation.find({
    annotatorId,
    translatedText: "NA", 
  })
    .populate({
      path: "textId",
      match: { projectId },
      select: "sentence language",
    })
    .lean();

  const validAnnotations = annotations.filter((a) => a.textId !== null);

  const formattedAnnotations = validAnnotations.map((annotation) => ({
    textId: {
      _id: annotation.textId._id,
      sentence: annotation.textId.sentence,
      language: annotation.textId.language,
    },
  }));

  return NextResponse.json({ annotations: formattedAnnotations });
}
