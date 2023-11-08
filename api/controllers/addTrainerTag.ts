import { Request, Response } from "express";
import { getPool } from "../../utils/getPool";

export const addTrainerTag = async (req: Request, res: Response) => {
  const { trainerId } = req.params;
  const { tag } = req.body;

  if (!trainerId || !tag) {
    return res.status(400).json({
      message: "Trainer ID and tag is required",
    });
  }

  const pool = getPool();
  const multipleTags = tag.split(",");

  try {
    await pool.query("BEGIN");

    for (const t of multipleTags) {
      try {
        await pool.query(
          "INSERT INTO tag (tag, trainer_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
          [t.trim().toLowerCase(), trainerId]
        );
      } catch (error) {
        await pool.query("ROLLBACK");
        return res.status(500).json({ error });
      }
    }
    await pool.query("COMMIT");
    return res.status(201).json({ message: "Tags added" });
  } catch (error) {
    await pool.query("ROLLBACK");
    return res.status(500).json({ error });
  }
};
