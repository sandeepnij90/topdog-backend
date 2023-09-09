import express from "express";
import { registerUser, registerCompany } from "../controllers/register";
export const router = express.Router();

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "email and password are required",
    });
  }

  res.status(200).json({
    message: "login endpoint",
  });
});

router.post("/test", (req, res) => {
  console.log("endpoint hit");
  res.status(200).json({
    message: "test endpoint hit",
  });
});

router.post("/register", registerUser);

router.patch("/register/:id/company", registerCompany);
