import mongoose from "mongoose";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user";
import crypto from "crypto";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { registerUserEmailTemplate } from "../emails/register";

const sesClient = new SESClient({
  region: "us-east-1",
});

export const registerUser = async (req: Request, res: Response) => {
  const { email, confirmPassword, password, name, companyName } = req.body;

  if (!email || !password || !confirmPassword || !name || !companyName) {
    return res.status(400).json({
      message:
        "company name, name, email, password and confirm password are required",
    });
  }

  if (confirmPassword !== password) {
    return res.status(400).json({
      message: "passwords do not match",
    });
  }

  try {
    const existingUser = await User.find({ email }).exec();
    if (existingUser.length >= 1) {
      return res.status(409).json({
        message: "User already exists",
      });
    }
  } catch (err) {
    return res.status(500).json({ err });
  }

  await bcrypt.hash(password, 10, async (err, hash) => {
    if (err) {
      return res.status(500).json({ err });
    }

    try {
      const newUser = new User({
        _id: new mongoose.Types.ObjectId(),
        name,
        email,
        password: hash,
        companyName,
        verificationCode: crypto.randomUUID(),
      });

      const result = await newUser.save();

      const params = {
        Destination: {
          ToAddresses: [email],
        },
        Message: {
          Body: {
            Html: {
              Charset: "UTF-8",
              Data: registerUserEmailTemplate({
                userId: result._id.toString(),
                verificationCode: result.verificationCode,
              }),
            },
            Text: {
              Charset: "UTF-8",
              Data: "TEXT_FORMAT_BODY",
            },
          },
          Subject: {
            Charset: "UTF-8",
            Data: "EMAIL_SUBJECT",
          },
        },
        Source: "s.nij@outlook.com",
        ReplyToAddresses: ["s.nij@outlook.com"],
      };

      try {
        await sesClient.send(new SendEmailCommand(params));
        res.status(201).json({
          message: "user created",
        });
      } catch (err) {
        res.status(500).json({ err });
      }

      // return res.status(201).json(result);
    } catch (err) {
      return res.status(500).json({ err });
    }
  });
};
