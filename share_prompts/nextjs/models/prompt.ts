import { Document, Schema, Types, model, models } from "mongoose";

export interface TPrompt extends Document {
  creator: Types.ObjectId;
  prompt: string;
  tag: string;
}

const PromptSchema = new Schema<TPrompt>({
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  prompt: {
    type: String,
    required: [true, "Prompt is required"],
  },
  tag: {
    type: String,
    required: [true, "Tag is required"],
  },
});

const Prompt = models.Prompt || model<TPrompt>("Prompt", PromptSchema);

export default Prompt;
