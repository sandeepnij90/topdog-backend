import { Request, Response } from "express";
import { getPool } from "../../utils/getPool";

export const getDogTags = async (req: Request, res: Response) => {
  const { dogId } = req.params;
  console.log({ dogId });
  const pool = getPool();

  if (!dogId) {
    return res.status(400).json({
      message: "Dog ID is required",
    });
  }

  try {
    const data = await pool.query(
      "SELECT *, tag_dog.id AS delete_id FROM tag_dog JOIN tag ON tag.id = tag_id WHERE dog_id = $1",
      [parseInt(dogId)]
    );
    return res.status(200).json({
      tags: data.rows,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ error });
  }
};
