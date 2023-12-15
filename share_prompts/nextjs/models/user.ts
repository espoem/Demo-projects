import { Document, Schema, model, models } from "mongoose";

export interface TUser extends Document {
  email: string;
  username: string;
  image: string;
}

const userSchema = new Schema<TUser>({
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    match: [
      /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
      "Username is invalid. It should be between 8 and 20 alphanumeric characters and should be unique.",
    ],
  },
  image: {
    type: String,
  },
});

const User = models.User || model<TUser>("User", userSchema);

export default User;
