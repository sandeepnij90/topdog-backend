import { Request, Response } from "express";
import { getPool } from "../../utils/getPool";

export const getClient = async (req: Request, res: Response) => {
  if (!req.params.clientId) {
    return res.status(400).json({
      message: "clientId is required",
    });
  }
  const pool = getPool();

  try {
    const data = await pool.query(
      `SELECT
        client.id AS client_id,
        client.name AS client_name,
        client.email AS client_email,
        client.phone AS client_phone,
        client.trainer_id AS client_trainer_id,
        JSON_AGG(json_build_object('id', dog.id, 'name', dog.name, 'breed', dog.breed)) AS dogs
        FROM client
        JOIN dog ON dog.client_id = client.id
        WHERE client.id = $1
        GROUP BY client.id`,
      [req.params.clientId]
    );

    res.status(200).json({
      message: "Client fetched",
      client: {
        id: data.rows[0].client_id,
        name: data.rows[0].client_name,
        email: data.rows[0].client_email,
        phone: data.rows[0].client_phone,
        dogs: data.rows[0].dogs,
      },
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      message: "couldnt get client",
      error,
    });
  }
};
