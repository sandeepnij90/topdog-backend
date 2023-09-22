import { Request, Response } from "express";
import { getPool } from "../../utils/getPool";

export const addNote = async (req: Request, res: Response) => {
  const { note, dogId } = req.body;
  const pool = getPool();

  if (!note || !dogId) {
    return res.status(400).json({
      message: "note and dogId are required",
    });
  }

  try {
    const time = new Date().toISOString();

    await pool.query(
      `INSERT into note (note, date, dog_id) VALUES ($1, $2, $3)`,
      [note, time, dogId]
    );
    return res.status(201).json({
      message: "Note added",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Couldnt add note to database",
      error,
    });
  }
};
