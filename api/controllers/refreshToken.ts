import Token from "../models/token";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const refreshToken = async (req: Request, res: Response) => {
  const { authorization = "" } = req.headers;
  const token = authorization.split(" ")[1];

  if (!authorization) {
    return res.status(401).json({
      message: "Auth failed",
    });
  }

  try {
    const existingToken = await Token.findOne({ accessToken: token }).exec();
    if (!existingToken) {
      return res.status(401).json({
        message: "Auth failed",
      });
    }

    const refreshToken = existingToken.refreshToken;
    try {
      jwt.verify(refreshToken, process.env.JWT_SECRET_KEY || "");
      const updatedAccessToken = jwt.sign(
        {
          userId: existingToken.userId,
        },
        process.env.JWT_SECRET_KEY || "",
        { expiresIn: "1m" }
      );

      try {
        await Token.findOneAndUpdate(
          { userId: existingToken.userId },
          { accessToken: updatedAccessToken }
        ).exec();

        res.status(201).json({
          accessToken: updatedAccessToken,
        });
      } catch (err) {
        return res.status(500).json({
          message: "Failed updating the token",
        });
      }
    } catch (err) {
      return res.status(401).json({
        message: "Auth failed",
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Could not execute searching existing token",
    });
  }
};
