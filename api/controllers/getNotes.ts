import { Request, Response } from "express";
import { getPool } from "../../utils/getPool";

export const getNotes = async (req: Request, res: Response) => {
  const { dogId } = req.params;

  if (!dogId) {
    return res.status(400).json({
      message: "dogId is required",
    });
  }

  const pool = getPool();

  try {
    const data = await pool.query(
      "SELECT * FROM note WHERE dog_id = $1 ORDER BY date DESC",
      [dogId]
    );
    return res.status(200).json({
      message: "Notes fetched",
      notes: data.rows,
    });
  } catch (error) {
    return res.status(500).json({
      message: "couldnt get notes",
      error,
    });
  }
};
