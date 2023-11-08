import { Request, Response } from "express";
import { getPool } from "../../utils/getPool";

export const deleteTrainerTag = async (req: Request, res: Response) => {
  const { trainerId } = req.params;
  const tagIds = req.query.tagIds;

  if (!tagIds) {
    return res.status(400).json({
      message: "Tags are required",
    });
  }

  const tags = tagIds.toString().split(",");

  const pool = getPool();

  try {
    await pool.query("BEGIN");

    for (const tag of tags) {
      try {
        await pool.query(`DELETE FROM tag WHERE id = $1 AND trainer_id = $2`, [
          tag,
          parseInt(trainerId),
        ]);
      } catch (error) {
        await pool.query("ROLLBACK");
        return res.status(500).json({
          message: "Couldnt delete tags from database",
          error,
        });
      }
    }
    await pool.query("COMMIT");
    res.status(204).json({
      message: "Tags deleted",
    });
  } catch (error) {
    await pool.query("ROLLBACK");
    return res.status(500).json({
      message: "Couldnt delete tags from database",
      error,
    });
  }
};
