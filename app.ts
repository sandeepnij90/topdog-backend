import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cors from "cors";
import { router as authRoutes } from "./api/routes/auth";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";

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
