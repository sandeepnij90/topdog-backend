import { Request, Response } from "express";
import User from "../models/user";

export const verifyUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { code } = req.query;

  try {
    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return res.status(404).json({
        message: "User does not exist",
      });
    }

    if (existingUser.verificationCode !== code) {
      return res.status(401).json({
        message: "Invalid verification code",
      });
    }

    try {
      const isVerified = await User.findOne({
        _id: userId,
        verified: true,
      }).exec();
      if (isVerified) {
        return res.status(204).json({
          message: "User already verified",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Couldnt execute query",
      });
    }

    try {
      User.findOneAndUpdate(
        { _id: userId },
        { $set: { verified: true } }
      ).exec();

      return res.status(200).json({
        message: "User verified",
      });
    } catch (error) {
      res.status(500).json({
        message: "Couldnt execute query",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Couldnt execute query",
    });
  }
};
