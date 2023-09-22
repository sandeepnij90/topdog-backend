import { Request, Response } from "express";
import { getPool } from "../../utils/getPool";

export const addDog = async (req: Request, res: Response) => {
  const { name, age, breed, note } = req.body;

  if (!name || !age || !breed) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const pool = getPool();

  try {
    const data = await pool.query(
      "INSERT INTO dog (name, age, breed) VALUES ($1, $2, $3) RETURNING id",
      [name, age, breed]
    );
    const dogId = data.rows[0].id;
    if (note.length) {
      try {
        await pool.query(
          "INSERT INTO note (note, date, dog_id) VALUES ($1, $2, $3)",
          [note, new Date().toISOString(), dogId]
        );
        res.status(201).json({
          message: "Dog added",
        });
      } catch (error) {
        return res.status(500).json({
          message: "Couldnt add note to database",
          error,
        });
      }
    }
    return res.status(201).json({
      message: "Dog added",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Couldnt add dog to database",
      error,
    });
  }
};
