import express from "express";
import { registerUser } from "../controllers/register";
import { loginTrainer } from "../controllers/login";
import { checkToken } from "../middleware/checkToken";
import { refreshToken } from "../controllers/refreshToken";

export const router = express.Router();

router.post("/login", loginTrainer);

router.post("/test", (req, res) => {
  console.log("endpoint hit");
  res.status(200).json({
    message: "test endpoint hit",
  });
});

router.post("/register", registerUser);
router.get("/refresh-token", refreshToken);

router.get("/test", checkToken, (req, res) => {
  res.status(200).json({
    message: "test endpoint hit",
  });
});
