import { Request, Response } from "express";
import { getPool } from "../../utils/getPool";

export const getClients = async (req: Request, res: Response) => {
  const { trainerId } = req.body;
  const pool = getPool();

  if (!trainerId) {
    return res.status(400).json({
      message: "trainerId is required",
    });
  }

  try {
    const data = await pool.query(
      "SELECT c.*, d.name AS dogName, d.* FROM client AS c JOIN dog as d on c.id = d.client_id WHERE trainer_id = $1",
      [trainerId]
    );
    return res.status(200).json({
      message: "Clients fetched",
      data: data.rows,
    });
  } catch (error) {
    return res.status(500).json({
      message: "couldnt get clients",
      error,
    });
  }
};
