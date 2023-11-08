import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { getPool } from "../../utils/getPool";
import crypto from "crypto";

export const registerTrainer = (req: Request, res: Response) => {
  const pool = getPool();

  const { name, email, companyName, password, confirmPassword, phone } =
    req.body;

  if (
    !name ||
    !email ||
    !companyName ||
    !password ||
    !confirmPassword ||
    !phone
  ) {
    return res.status(400).json({
      message:
        "name, email, companyName, password, confirmPassword and phone are required",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      message: "Passwords do not match",
    });
  }

  bcrypt.hash(password, 10, async (err, hash) => {
    if (err) {
      return res.status(500).json({
        message: "Couldnt hash password",
        err,
      });
    }
    try {
      await pool.query(
        "INSERT INTO trainer (name, email, company_name, password, phone, verified, verification_code) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [name, email, companyName, hash, phone, false, crypto.randomUUID()]
      );
      res.status(201).json({
        message: "Trainer added",
      });
    } catch (error) {
      console.log({ error });
      return res.status(500).json({
        message: "Couldnt execute query to add trainer",
        error,
      });
    }
  });
};
