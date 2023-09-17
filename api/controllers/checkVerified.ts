import User from "../models/user";
import { Request, Response } from "express";

export const checkVerified = async (req: Request, res: Response) => {
  const { userId = "" } = req.params;

  if (!userId) {
    return res.status(400).json({
      message: "userId is required",
    });
  }

  try {
    const user = await User.findOne({ _id: userId }).exec();

    if (!user) {
      return res.status(404).json({
        message: "User does not exist",
      });
    }

    if (!user.verified) {
      return res.status(200).json({
        verified: false,
      });
    }

    return res.status(200).json({
      verified: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Couldnt execute query",
    });
  }
};
