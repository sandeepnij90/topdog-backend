import { Request, Response } from "express";
import { getPool } from "../../utils/getPool";

export const addClient = async (req: Request, res: Response) => {
  const { name, email, phone, dogName, birthday, dogBreed, note, trainerId } =
    req.body;
  const pool = getPool();

  if (
    !name ||
    !email ||
    !phone ||
    !dogName ||
    !birthday ||
    !dogBreed ||
    !trainerId
  ) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    const data = await pool.query(
      `INSERT INTO client (name, email, phone, trainer_id) VALUES ($1, $2, $3, $4) RETURNING id`,
      [name, email, phone, trainerId]
    );
    const clientId = data.rows[0].id;

    try {
      const data = await pool.query(
        `INSERT into dog (name, birthday, breed, client_id) VALUES ($1, $2, $3, $4) RETURNING id`,
        [dogName, birthday, dogBreed, clientId]
      );
      const dogId = data.rows[0].id;

      if (note.length) {
        try {
          const time = new Date().toISOString();

          await pool.query(
            `INSERT into note (note, date, dog_id) VALUES ($1, $2, $3)`,
            [note, time, dogId]
          );
          return res.status(201).json({
            message: "Client added",
          });
        } catch (error) {
          console.log({ error });
          return res.status(500).json({
            message: "Couldnt add note to database",
            error,
          });
        }
      }
      return res.status(201).json({
        message: "Client added",
      });
    } catch (error) {
      console.log({ error });

      return res.status(500).json({
        message: "Couldnt add dog to database",
        error,
      });
    }
  } catch (error) {
    console.log({ error });

    return res.status(500).json({
      message: "Couldnt execute query",
      error,
    });
  }
};
