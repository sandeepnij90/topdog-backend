import mongoose from "mongoose";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Token from "../models/token";

dotenv.config();

export const loginTrainer = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "email and password are required",
    });
  }

  try {
    const user = await User.findOne({ email }).exec();

    if (!user) {
      return res.status(400).json({
        message: "email does not exist",
      });
    }

    await bcrypt.compare(password, user.password, async (err, result) => {
      if (err) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }

      if (result) {
        const accessToken = jwt.sign(
          {
            userId: user._id,
          },
          process.env.JWT_SECRET_KEY || "",
          {
            expiresIn: "1m",
          }
        );

        const refreshToken = jwt.sign(
          {
            userId: user._id,
          },
          process.env.JWT_SECRET_KEY || "",
          {
            expiresIn: "7d",
          }
        );

        try {
          const hasUserToken = await Token.findOne({ userId: user._id }).exec();

          if (!hasUserToken) {
            try {
              const token = new Token({
                _id: new mongoose.Types.ObjectId(),
                userId: user._id,
                accessToken,
                refreshToken: refreshToken,
              });

              await token.save();
            } catch (err) {
              return res.status(500).json({
                message: "Failed adding token",
              });
            }
          }

          try {
            await Token.updateOne(
              { userId: user._id },
              { $set: { refreshToken, accessToken } }
            ).exec();
          } catch (err) {
            return res.status(500).json({
              message: "Failed updating token",
            });
          }
        } catch (err) {
          return res.status(500).json({
            message: "Failed searching token",
          });
        }

        return res
          .status(200)
          .json({ message: "Auth successful", accessToken });
      }

      return res.status(401).json({
        message: "Auth failed",
      });
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed searching user",
    });
  }
};
