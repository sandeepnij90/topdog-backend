import mongoose from "mongoose";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user";

export const registerUser = async (req: Request, res: Response) => {
  console.log("here");
  const { email, confirmPassword, password, name, companyName } = req.body;

  if (!email || !password || !confirmPassword || !name || !companyName) {
    return res.status(400).json({
      message:
        "company name, name, email, password and confirm password are required",
    });
  }

  if (confirmPassword !== password) {
    return res.status(400).json({
      message: "passwords do not match",
    });
  }

  try {
    const existingUser = await User.find({ email }).exec();
    if (existingUser.length >= 1) {
      return res.status(409).json({
        message: "User already exists",
      });
    }
  } catch (err) {
    return res.status(500).json({ err });
  }

  await bcrypt.hash(password, 10, async (err, hash) => {
    if (err) {
      return res.status(500).json({ err });
    }

    try {
      const newUser = new User({
        _id: new mongoose.Types.ObjectId(),
        name,
        email,
        password: hash,
        companyName,
      });

      const result = await newUser.save();
      return res.status(201).json(result);
    } catch (err) {
      return res.status(500).json({ err });
    }
  });
};
