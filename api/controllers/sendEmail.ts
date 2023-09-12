import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

import { Request, Response } from "express";

export const sendEmail = async (req: Request, res: Response) => {
  const { to } = req.body;
  const params = {
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: "<h1>Here is the email</h1>",
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
    res.status(200).json({
      message: "email sent",
    });
  } catch (err) {
    console.log({ err });
  }
};
