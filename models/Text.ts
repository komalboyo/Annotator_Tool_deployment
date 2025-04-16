import mongoose, { Schema, Document } from "mongoose";

export interface IText extends Document {
    projectId: mongoose.Types.ObjectId;
    sentence: string;
    language: string;
    createdAt: Date;
  }
  
  const TextSchema = new Schema<IText>({
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    sentence: { type: String, required: true },
    language: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  });
  
  export default mongoose.models.Text || mongoose.model<IText>("Text", TextSchema);
  