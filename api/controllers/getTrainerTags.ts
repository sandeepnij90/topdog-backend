import { Request, Response } from "express";
import { getPool } from "../../utils/getPool";

export const getTrainerTags = async (req: Request, res: Response) => {
  const { trainerId } = req.params;

  if (!trainerId) {
    return res.status(400).json({
      message: "Trainer ID is required",
    });
  }

  const pool = getPool();

  try {
    const data = await pool.query("SELECT * FROM tag WHERE trainer_id = $1", [
      trainerId,
    ]);
    return res.status(200).json({
      tags: data.rows,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
