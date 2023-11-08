import { Request, Response } from "express";
import { getPool } from "../../utils/getPool";

export const editNote = async (req: Request, res: Response) => {
  const { note, noteId } = req.body;

  const pool = getPool();

  if (!note || !note) {
    return res.status(400).json({
      message: "note and noteId are required",
    });
  }

  try {
    await pool.query(`UPDATE note SET note = $1 WHERE id = $2`, [note, noteId]);
    return res.status(201).json({
      message: "Note edited",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Couldnt edit note to database",
      error,
    });
  }
};
