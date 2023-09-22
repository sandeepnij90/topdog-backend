import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cors from "cors";
import { router as authRoutes } from "./api/routes/auth";
import { router as dashboardRoutes } from "./api/routes/dashboard";
import { checkToken } from "./api/middleware/checkToken";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";

// DELETE
import { Client } from "pg";

//

dotenv.config();

mongoose.connect(process.env.MONGO_URI || "");

export const app = express();

app.use(morgan("dev"));
app.use(
  cors({
    origin: "*",
    methods: "GET,PUT,PATCH,POST,DELETE",
    optionsSuccessStatus: 200,
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/dashboard", checkToken, dashboardRoutes);

app.use("/test", (req, res) => {
  const client = new Client({
    host: "localhost",
    port: 5432,
    database: "topdog",
  });

  client.connect();
  client.query(`SELECT * FROM trainer`, (err, response) => {
    if (err) {
      return console.log({ err });
    }
    client.end();

    return res.status(200).json({
      data: response.rows,
    });
  });
});

interface ErrorStatus extends Error {
  status?: number;
}

app.use((req, res, next) => {
  const error: ErrorStatus = new Error("Page not found");
  error.status = 404;
  next(error);
});

app.use(
  (error: ErrorStatus, req: Request, res: Response, next: NextFunction) => {
    res.status(error.status || 500);
    res.json({
      message: error.message,
    });
  }
);
