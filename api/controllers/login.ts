import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getPool } from "../../utils/getPool";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const pool = getPool();

  if (!email || !password) {
    return res.status(400).json({
      message: "email and password are required",
    });
  }

  try {
    const data = await pool.query(
      "SELECT id, password FROM trainer where email = $1",
      [email]
    );

    if (!data.rows.length) {
      return res.status(404).json({
        message: "email does not exist",
      });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }

  try {
    const data = await pool.query(
      "SELECT id, password, verified FROM trainer where email = $1",
      [email]
    );

    const { id, password: encryptedPassword, verified } = data.rows[0];

    await bcrypt.compare(password, encryptedPassword, async (err, result) => {
      if (err) {
        return res.status(401).json({
          message: "Failed to login",
        });
      }

      if (!result) {
        return res.status(401).json({
          message: "Failed to login",
        });
      }

      const accessToken = jwt.sign(
        {
          userId: id,
        },
        process.env.JWT_SECRET_KEY || "",
        {
          expiresIn: "1d",
        }
      );

      const refreshToken = jwt.sign(
        {
          userId: id,
        },
        process.env.JWT_SECRET_KEY || "",
        {
          expiresIn: "7d",
        }
      );

      try {
        const data = await pool.query(
          "SELECT COUNT(*) FROM token WHERE trainer_id = $1",
          [id]
        );
        const hasUserToken = parseInt(data.rows[0].count);

        if (!hasUserToken) {
          try {
            await pool.query(
              "INSERT INTO token (trainer_id, access_token, refresh_token) VALUES ($1, $2, $3)",
              [id, accessToken, refreshToken]
            );
            return res.status(200).json({
              message: "Login successful",
              accessToken,
              refreshToken,
              id,
              verified,
            });
          } catch (error) {
            return res.status(500).json({ error });
          }
        }

        try {
          await pool.query(
            "UPDATE token SET access_token = $1, refresh_token = $2 WHERE trainer_id = $3",
            [accessToken, refreshToken, id]
          );
          return res.status(200).json({
            message: "Login successful",
            accessToken,
            refreshToken,
            id,
            verified,
          });
        } catch (error) {
          return res.status(500).json({ error });
        }
      } catch (error) {
        return res.status(500).json({ error });
      }
    });
  } catch (err) {
    return res.status(500).json({ err });
  }
};
