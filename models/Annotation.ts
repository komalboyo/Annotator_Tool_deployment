import mongoose, { Schema, Document } from "mongoose";

export interface IAnnotation extends Document {
    textId: mongoose.Types.ObjectId;
    annotatorId: mongoose.Types.ObjectId;
    translatedText: string;
    language: string;
    createdAt: Date;
  }
  
  const AnnotationSchema = new Schema<IAnnotation>({
    textId: { type: Schema.Types.ObjectId, ref: "Text", required: true },
    annotatorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    translatedText: { type: String, required: true },
    language: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  });
  
  export default mongoose.models.Annotation || mongoose.model<IAnnotation>("Annotation", AnnotationSchema);
  