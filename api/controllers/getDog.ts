import { Request, Response } from "express";
import { getPool } from "../../utils/getPool";

export const getDog = async (req: Request, res: Response) => {
  const { dogId } = req.params;

  if (!dogId) {
    return res.status(400).json({
      message: "dogId is required",
    });
  }
  const pool = getPool();

  try {
    const data = await pool.query("SELECT * FROM dog WHERE id = $1", [dogId]);
    return res.status(200).json({
      message: "Dog fetched",
      dog: data.rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      message: "couldnt get dog",
      error,
    });
  }
};
