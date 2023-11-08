import { Pool } from "pg";

export const getPool = () => {
  const pool = new Pool({
    host: "localhost",
    port: 5432,
    database: "topdog",
  });
  pool.connect();
  return pool;
};
