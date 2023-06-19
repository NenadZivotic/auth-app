import { Request } from "express";

import mongoose, { Schema, Types } from "mongoose";
import bcrypt from "bcryptjs";

export type UserType = {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  matchPasswords: (password: string) => Promise<boolean>;
};

export type RequestWithUser = {
  user: UserType;
} & Request;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPasswords = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<UserType>("User", userSchema);

export default User;
