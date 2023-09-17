import express from "express";
import { registerUser } from "../controllers/register";
import { loginTrainer } from "../controllers/login";
import { checkToken } from "../middleware/checkToken";
import { refreshToken } from "../controllers/refreshToken";
import { sendEmail } from "../controllers/sendEmail";
import { verifyUser } from "../controllers/verifyUser";
import { checkVerified } from "../controllers/checkVerified";

export const router = express.Router();

router.post("/login", loginTrainer);

router.post("/register", registerUser);
router.get("/refresh-token", refreshToken);
router.get("/verify-email/:userId", verifyUser);
router.get("/check-verified/:userId", checkVerified);

router.get("/test", checkToken, (req, res) => {
  res.status(200).json({
    message: "test endpoint hit",
  });
});
router.post("/email", sendEmail);
