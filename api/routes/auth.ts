import express from "express";
import { registerTrainer } from "../controllers/registerTrainer";
import { login } from "../controllers/login";
import { checkToken } from "../middleware/checkToken";
import { refreshToken } from "../controllers/refreshToken";
import { sendEmail } from "../controllers/sendEmail";
import { verifyUser } from "../controllers/verifyUser";
import { getVerified } from "../controllers/getVerified";

export const router = express.Router();

router.post("/login", login);
router.post("/register", registerTrainer);
router.get("/refresh-token", refreshToken);
router.get("/verify-email/:userId", verifyUser);
router.post("/check-verified", getVerified);

router.get("/test", checkToken, (req, res) => {
  res.status(200).json({
    message: "test endpoint hit",
  });
});
router.post("/email", sendEmail);
