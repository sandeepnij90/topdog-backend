import { Request, Response } from "express";
import { getPool } from "../../utils/getPool";

export const getVerified = async (req: Request, res: Response) => {
  const { trainerId } = req.body;

  if (!trainerId) {
    return res.status(400).json({
      message: "trainerId is required",
    });
  }

  const pool = getPool();
  try {
    const data = await pool.query(
      "SELECT verified FROM trainer WHERE id = $1",
      [trainerId]
    );

    if (!data.rows.length) {
      return res.status(404).json({
        message: "Could not find trainer with that id",
      });
    }

    return res.status(200).json({
      message: "Successfully got verified trainer",
      verified: data.rows[0].verified,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Could not get verified trainer",
      error,
    });
  }
};
