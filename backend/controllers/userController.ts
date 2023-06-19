import { Request, Response } from "express";

import asyncHandler from "express-async-handler";

import User, { RequestWithUser, UserType } from "../models/user.model.js";
import { HttpStatus } from "../models/httpStatus.enum.js";
import generateToken from "../utils/generateToken.js";

// @desc Auth user/set token
// route POST /api/users/auth
// @access Public
const authUser = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPasswords(password))) {
      const { _id, name, email } = user;
      generateToken(res, _id);
      return res.status(HttpStatus.Created).json({
        _id,
        name,
        email,
      });
    } else {
      res.status(HttpStatus.Unauthorized);
      throw new Error("Invalid email or password");
    }
  }
);

// @desc Register a new user
// route POST /api/users
// @access Public
const registerUser = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { name, email, password }: UserType = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(HttpStatus.ClientError);
      throw new Error("User already exists");
    }

    const user = await User.create({ name, email, password });

    if (user) {
      const { _id, name, email } = user;
      generateToken(res, _id);
      return res.status(HttpStatus.Created).json({
        _id,
        name,
        email,
      });
    } else {
      res.status(HttpStatus.ClientError);
      throw new Error("Invalid user data");
    }
  }
);

// @desc Logout user
// route POST /api/users/logout
// @access Public
const logoutUser = asyncHandler(
  async (_req: Request, res: Response): Promise<any> => {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return res.status(HttpStatus.Success).json({ message: "User logged out" });
  }
);

// @desc Get user profile
// route GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(
  async (req: RequestWithUser, res: Response): Promise<any> => {
    const { _id, name, email } = req.user;
    const user = {
      _id,
      name,
      email,
    };

    return res.status(HttpStatus.Success).json(user);
  }
);

// @desc Update user profile
// route PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(
  async (req: RequestWithUser, res: Response): Promise<any> => {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      const { _id, name, email } = updatedUser;

      return res.status(HttpStatus.Success).json({
        _id,
        name,
        email,
      });
    } else {
      res.status(HttpStatus.NotFound);
      throw new Error("User not found");
    }
  }
);

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};
