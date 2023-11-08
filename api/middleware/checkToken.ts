import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const checkToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization = "" } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      message: "Auth failed",
    });
  }
  const token = authorization.split(" ")[1];

  try {
    jwt.verify(token, process.env.JWT_SECRET_KEY || "");
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Auth failed",
    });
  }
};
