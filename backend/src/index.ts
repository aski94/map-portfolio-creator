import "reflect-metadata";
import express from "express";
import cors from "cors";
import { Container } from "typedi";
import crypto from "crypto";
import { EmailService } from "./services/email/EmailService";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());

app.post("/auth/signup", async (req, res) => {
  const { email, password, firstName, lastName } = req.body as {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
  };

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const token = crypto.randomBytes(32).toString("hex");

  const baseUrl = process.env.APP_BASE_URL || "http://localhost:5173";
  const confirmUrl = `${baseUrl}/confirm?token=${token}`;

  const emailService = Container.get(EmailService);

  await emailService.sendConfirmationEmail(
    email,
    `${firstName}`,
    confirmUrl,
  );

  return res.json({ ok: true });
});

app.listen(3000);
