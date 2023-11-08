import { Request, Response } from "express";
import { getPool } from "../../utils/getPool";

export const getClients = async (req: Request, res: Response) => {
  const { trainerId } = req.params;
  const pool = getPool();

  if (!trainerId) {
    return res.status(400).json({
      message: "trainerId is required",
    });
  }

  try {
    const data = await pool.query(
      "SELECT c.id, c.name, c.email, c.phone, COUNT(dog.id) AS number_of_dogs FROM client AS c JOIN dog ON dog.client_id = c.id WHERE c.trainer_id = $1 GROUP BY c.id",
      [parseInt(trainerId)]
    );
    return res.status(200).json({
      message: "Clients fetched",
      clients: data.rows,
    });
  } catch (error) {
    return res.status(500).json({
      message: "couldnt get clients",
      error,
    });
  }
};
