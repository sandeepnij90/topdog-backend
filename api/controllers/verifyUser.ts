import { Request, Response } from "express";
import { getPool } from "../../utils/getPool";

export const verifyUser = async (req: Request, res: Response) => {
  const client = getPool();
  const { userId } = req.params;
  const { code } = req.query;

  try {
    const data = await client.query(
      `SELECT verified, verification_code FROM trainer where id = $1`,
      [userId]
    );

    if (!data.rows.length) {
      return res.status(404).json({
        message: "User does not exist!",
      });
    }

    const { verified, verification_code } = data.rows[0];

    if (verified) {
      return res.status(204).json({
        message: "User already verified",
      });
    }
    if (verification_code !== code) {
      return res.status(401).json({
        message: "Invalid verification code",
      });
    }

    try {
      await client.query(`UPDATE trainer SET verified = true WHERE id = $1`, [
        userId,
      ]);
      return res.status(201).json({
        message: "User verified",
      });
    } catch (error) {
      res.status(500).json({
        message: "Couldnt execute query",
        error,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Couldnt execute query",
      error,
    });
  }

  try {
  } catch (error) {
    res.status(500).json({
      message: "Couldnt execute query",
      error,
    });
  }
};
