import { Client } from "pg";

export const getClient = () => {
  const client = new Client({
    host: "localhost",
    port: 5432,
    database: "topdog",
  });

  client.connect();

  return client;
};
