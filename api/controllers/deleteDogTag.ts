import { Request, Response } from "express";
import { getPool } from "../../utils/getPool";

export const deleteDogTag = async (req: Request, res: Response) => {
  const dogTagId = req.query.dogTagId;

  if (!dogTagId) {
    return res.status(400).json({
      message: "Tag ID is required",
    });
  }

  const pool = getPool();

  try {
    await pool.query("DELETE FROM tag_dog WHERE id = $1", [dogTagId]);
    return res.status(204).json({ message: "Tag deleted" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
