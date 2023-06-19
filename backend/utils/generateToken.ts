import { Response } from "express";

import { Types } from "mongoose";
import jwt from "jsonwebtoken";

import { EnvironmentStatus } from "../models/envStatus.enum.js";
import { convertDaysToSeconds } from "./helpers.js";

const generateToken = (res: Response, userId: Types.ObjectId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== EnvironmentStatus.Development,
    sameSite: "strict",
    maxAge: convertDaysToSeconds(30),
  });
};

export default generateToken;
