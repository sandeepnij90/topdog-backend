import { Request, Response } from "express";
import { getPool } from "../../utils/getPool";

export const addDogTag = async (req: Request, res: Response) => {
  const { tags } = req.body;
  const { dogId } = req.params;

  if (!tags) {
    return res.status(400).json({
      message: "Tags are required",
    });
  }

  const pool = getPool();

  try {
    await pool.query("BEGIN");
    for (const tag of tags) {
      try {
        await pool.query(
          "INSERT INTO tag_dog (tag_id, dog_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
          [tag, dogId]
        );
      } catch (error) {
        await pool.query("ROLLBACK");
        return res.status(500).json({ error });
      }
    }
    await pool.query("COMMIT");
    res.status(201).json({
      message: "Tags added",
    });
  } catch (error) {
    await pool.query("ROLLBACK");
    res.status(500).json({ error });
  }
};
