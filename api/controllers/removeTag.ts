import { Response, Request } from "express";
import { getPool } from "../../utils/getPool";

export const removeTag = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: "Tag ID is required",
    });
  }

  const pool = getPool();

  try {
    await pool.query("DELETE FROM tag_dog WHERE tag_id = $1", [id]);
    return res.status(200).json({
      message: "Tag removed",
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
