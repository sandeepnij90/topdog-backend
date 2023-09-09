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

  bcrypt.hash(password, 10, async (err, hash) => {
    if (err) {
      return res.status(500).json({ err });
    }

    try {
      const newUser = new User({
        _id: new mongoose.Types.ObjectId(),
        name,
        email,
        password: hash,
      });

      const result = await newUser.save();
      return res.status(201).json(result);
    } catch (err) {
      return res.status(500).json({ err });
    }
  });
};

export const registerCompany = async (req: Request, res: Response) => {
  const {
    companyName,
    primaryColor,
    primaryTextColor,
    buttonBackgroundColor,
    buttonTextColor,
  } = req.body;
  const { id } = req.params;

  if (
    !companyName ||
    !primaryColor ||
    !primaryTextColor ||
    !buttonBackgroundColor ||
    !buttonTextColor
  ) {
    return res.status(400).json({
      message:
        "companyName, primaryColor and primaryTextColor, buttonBackgroundColor, buttonTextColor are required",
    });
  }

  try {
    const existingUser = await User.find({ _id: id }).exec();

    if (existingUser.length < 1) {
      return res.status(400).json({
        message: "user does not exist",
      });
    }
  } catch (err) {
    return res.status(500).json({ err });
  }

  try {
    const updatedUser = await User.updateOne(
      { _id: id },
      {
        $set: {
          companyName,
          theme: {
            primaryColor,
            primaryTextColor,
            buttonBackgroundColor,
            buttonTextColor,
          },
        },
      }
    ).exec();

    return res.status(200).json(updatedUser);
  } catch (err) {
    return res.status(500).json({ err });
  }
};
