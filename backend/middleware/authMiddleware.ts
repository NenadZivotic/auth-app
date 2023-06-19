import jwt, { JwtPayload } from "jsonwebtoken";
import asyncHandler from "express-async-handler";

import User, { RequestWithUser } from "../models/user.model.js";
import { HttpStatus } from "../models/httpStatus.enum.js";

const protect = asyncHandler(async (req: RequestWithUser, res, next) => {
  let token = "";

  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById((decoded as any).userId).select(
        "-password"
      );

      next();
    } catch (error) {
      res.status(HttpStatus.Unauthorized);
      throw new Error("Not authorized, invalid token");
    }
  } else {
    res.status(HttpStatus.Unauthorized);
    throw new Error("Not authorized, no token");
  }
});

export { protect };
