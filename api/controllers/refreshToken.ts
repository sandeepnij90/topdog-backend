import { Request, Response } from "express";
import { getPool } from "../../utils/getPool";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const refreshToken = async (req: Request, res: Response) => {
  const pool = getPool();

  const { authorization = "" } = req.headers;
  const token = authorization.split(" ")[1];

  if (!authorization) {
    return res.status(401).json({
      message: "Auth failed",
    });
  }

  try {
    const data = await pool.query(
      `SELECT * FROM token WHERE access_token = $1`,
      [token]
    );

    const hasNoToken = data.rows.length === 0;

    if (hasNoToken) {
      return res.status(401).json({
        message: "Auth failed",
      });
    }

    const refreshToken = data.rows[0].refresh_token;
    try {
      jwt.verify(refreshToken, process.env.JWT_SECRET_KEY || "");
      const updatedAccessToken = jwt.sign(
        {
          userId: data.rows[0].trainer_id,
        },
        process.env.JWT_SECRET_KEY || "",
        {
          expiresIn: "1d",
        }
      );

      try {
        await pool.query(`UPDATE token SET access_token = $1 WHERE id = $2`, [
          updatedAccessToken,
          data.rows[0].trainer_id,
        ]);

        res.status(201).json({
          accessToken: updatedAccessToken,
        });
      } catch (error) {
        return res.status(500).json({
          message: "Failed updating the token",
          error,
        });
      }
    } catch (error) {
      return res.status(401).json({
        message: "Auth failed",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Could not execute searching existing token",
      error,
    });
  }
};
