import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
    adminId: mongoose.Types.ObjectId;
    annotators: mongoose.Types.ObjectId[];
    name: string;
    description?: string;
    filename: string;
    deadline: Date,
    createdAt: Date;
  }
  
  const ProjectSchema = new Schema<IProject>({
    adminId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    annotators: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    name: { type: String, required: true },
    description: { type: String },
    filename: {type: String , required: true},
    deadline: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    createdAt: { type: Date, default: Date.now },
  });
  
  export default mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
  