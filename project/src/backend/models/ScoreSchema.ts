import mongoose, { Schema, Document } from "mongoose";

export interface IScore extends Document {
  userId: string;
  email: string;
  score: Map<string, number>;
  timestamp: Date;
}

const ScoreSchema = new Schema<IScore>({
  userId: { type: String, required: true },
  email: { type: String, required: true },
  score: { type: Map, of: Number, default: {} },
  timestamp: { type: Date, default: Date.now },
});

export const Score = mongoose.model<IScore>("Score", ScoreSchema);
